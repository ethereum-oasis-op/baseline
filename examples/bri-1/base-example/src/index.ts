import { IBaselineRPC, IBlockchainService, IRegistry, IVault, baselineServiceFactory, baselineProviderProvide } from '@baseline-protocol/api';
import { IMessagingService, messagingProviderNats, messagingServiceFactory } from '@baseline-protocol/messaging';
import { IZKSnarkCircuitProvider, IZKSnarkCompilationArtifacts, IZKSnarkTrustedSetupArtifacts, zkSnarkCircuitProviderServiceFactory, zkSnarkCircuitProviderServiceZokrates } from '@baseline-protocol/privacy';
import { Message as ProtocolMessage, Opcode, PayloadType, marshalProtocolMessage, unmarshalProtocolMessage } from '@baseline-protocol/types';
import { Application as Workgroup, Invite, Vault as ProvideVault, Organization, Token, Key as VaultKey } from '@provide/types';
import { Capabilities, Ident, NChain, Vault, capabilitiesFactory, nchainClientFactory } from 'provide-js';
import { readFileSync } from 'fs';
import { compile as solidityCompile } from 'solc';
import * as jwt from 'jsonwebtoken';
import * as log from 'loglevel';
// import { keccak256 } from 'js-sha3';
import { sha256 } from 'js-sha256';
import { AuthService } from 'ts-natsutil';

const baselineDocumentCircuitPath = '../../../lib/circuits/noopAgreement.zok';
const baselineProtocolMessageSubject = 'baseline.inbound';

const zokratesImportResolver = (location, path) => {
  let zokpath = `../../../lib/circuits/${path}`;
  if (!zokpath.match(/\.zok$/i)) {
    zokpath = `${zokpath}.zok`;
  }
  return {
    source: readFileSync(zokpath).toString(),
    location: path,
  };
};

export class ParticipantStack {

  private baseline?: IBaselineRPC & IBlockchainService & IRegistry & IVault;
  private baselineCircuitArtifacts?: IZKSnarkCompilationArtifacts;
  private baselineCircuitSetupArtifacts?: IZKSnarkTrustedSetupArtifacts;
  private baselineConfig?: any;
  private babyJubJub?: VaultKey;
  private hdwallet?: VaultKey;
  private nats?: IMessagingService;
  private natsBearerTokens: { [key: string]: any } = {}; // mapping of third-party participant messaging endpoint => bearer token
  private natsConfig?: any;
  private protocolMessagesRx = 0;
  private protocolMessagesTx = 0;
  private protocolSubscriptions: any[] = [];
  private capabilities?: Capabilities;
  private contracts: any;
  private zk?: IZKSnarkCircuitProvider;

  private org?: any;
  private workgroup?: any;
  private workgroupCounterparties: string[] = [];
  private workgroupToken?: any; // workgroup bearer token; used for automated setup
  private workflowIdentifier?: string; // workflow identifier; specific to the workgroup
  private workflowRecords: { [key: string]: any } = {}; // in-memory system of record

  constructor(baselineConfig: any, natsConfig: any) {
    this.baselineConfig = baselineConfig;
    this.natsConfig = natsConfig;

    this.init();
  }

  private async init() {
    this.baseline = await baselineServiceFactory(baselineProviderProvide, this.baselineConfig);
    this.nats = await messagingServiceFactory(messagingProviderNats, this.natsConfig);
    this.zk = await zkSnarkCircuitProviderServiceFactory(zkSnarkCircuitProviderServiceZokrates, {
      importResolver: zokratesImportResolver,
    });

    if (this.natsConfig?.natsBearerTokens) {
      this.natsBearerTokens = this.natsConfig.natsBearerTokens;
    }

    this.startProtocolSubscriptions();

    this.capabilities = capabilitiesFactory();
    this.contracts = {};

    if (this.baselineConfig.initiator) {
      if (this.baselineConfig.workgroup && this.baselineConfig.workgroupToken) {
        await this.setWorkgroup(this.baselineConfig.workgroup, this.baselineConfig.workgroupToken);
      } else if (this.baselineConfig.workgroupName) {
        await this.createWorkgroup(this.baselineConfig.workgroupName);
      }

      await this.registerOrganization(this.baselineConfig.orgName, this.natsConfig.natsServers[0]);
    }
  }

  getBaselineCircuitArtifacts(): any | undefined {
    return this.baselineCircuitArtifacts;
  }

  getBaselineConfig(): any | undefined {
    return this.baselineConfig;
  }

  getBaselineService(): IBaselineRPC & IBlockchainService & IRegistry & IVault | undefined {
    return this.baseline;
  }

  getMessagingConfig(): any | undefined {
    return this.natsConfig;
  }

  getMessagingService(): IMessagingService | undefined {
    return this.nats;
  }

  getNatsBearerTokens(): { [key: string]: any } {
    return this.natsBearerTokens;
  }

  getOrganization(): any | undefined {
    return this.org;
  }

  getProtocolMessagesRx(): number {
    return this.protocolMessagesRx;
  }

  getProtocolMessagesTx(): number {
    return this.protocolMessagesTx;
  }

  getProtocolSubscriptions(): any[] {
    return this.protocolSubscriptions;
  }

  getWorkflowIdentifier(): any {
    return this.workflowIdentifier;
  }

  getWorkgroup(): any {
    return this.workgroup;
  }

  getWorkgroupToken(): any {
    return this.workgroupToken;
  }

  getWorkgroupContract(type: string): any {
    return this.contracts[type];
  }

  getWorkgroupContracts(): any[] {
    return this.contracts;
  }

  getWorkgroupCounterparties(): string[] {
    return this.workgroupCounterparties;
  }

  private async dispatchProtocolMessage(msg: ProtocolMessage): Promise<any> {
    if (msg.opcode === Opcode.Baseline) {
      // TODO: acquire distributed lock; i.e. refer to redis + dislock from Provide
      // { "doc":  {}, "__hash": <sha256> } <-- our naive protocol checks for the presence of `__hash`; if it exists, we know to process verification part of the workstep.
      // { "rfp_id": "adsf" } <-- this is the doc; since no `__hash` exists, hash/sign/send
      // FIXME! the above example needs a proper schema... put it in the persistence package...

      const payload = JSON.parse(msg.payload.toString());
      if (!payload.__hash) {
        const vault = await this.fetchVaults();
        const hash = sha256(msg.payload.toString()); // make a hash of the record...
        const sig = (await this.signMessage(vault[0].id!, this.babyJubJub?.id!, hash)).signature; // use this in a real business case...

        this.sendProtocolMessage(msg.sender, Opcode.Baseline, {
          doc: JSON.parse(msg.payload.toString()),
          __hash: hash,
          signature: sig,
        });
      } else if (payload.doc && payload.__hash) {
        if (payload.root && payload.sibling_path) {
          const verified = this.baseline?.verify(this.contracts['shield'].address, payload.leaf, payload.root, payload.sibling_path);
          if (!verified) {
            await this.sendProtocolMessage(msg.sender, Opcode.Baseline, { err: 'verification failed' });
            return Promise.reject('failed to verify');
          }
  
          this.workflowRecords[payload.doc.id] = payload.doc;
          console.log('record is baselined...', payload.doc);
        } else {
          // baseline this record
          const proof = await this.generateProof(msg);

          // FIXME? call the verifier here w/ hash, proof, verification key
          const nchain = nchainClientFactory(
            this.workgroupToken,
            this.baselineConfig?.nchainApiScheme,
            this.baselineConfig?.nchainApiHost,
          );

          const signerResp = (await nchain.createAccount({
            network_id: this.baselineConfig?.networkId,
          }));

          const resp = await NChain.clientFactory(
            this.workgroupToken,
            this.baselineConfig?.nchainApiScheme,
            this.baselineConfig?.nchainApiHost,
          ).executeContract(this.contracts['verifier'].id, {
            method: 'verify',
            params: [[proof], ['2'], [this.baselineCircuitSetupArtifacts?.keypair!.vk]], // FIXME...
            value: 0,
            account_id: signerResp['id'],
          });

          console.log(resp);
          if (!resp) {
            return Promise.reject(`failed to verify proof: ${proof}`);
          }

          const leaf = await this.baseline?.insertLeaf(msg.sender, this.contracts['shield'].address, payload.hash);
          if (leaf) {
            console.log(`inserted leaf... ${leaf}`);
          } else {
            return Promise.reject('failed to insert leaf');
          }
        }
      } else if (payload.signature) {
        console.log(`NOOP!!! received signature in BLINE protocol message: ${payload.signature}`);
      }
    } else if (msg.opcode === Opcode.Join) {
      const payload = JSON.parse(msg.payload.toString());
      const messagingEndpoint = await this.resolveMessagingEndpoint(payload.address);
      if (!messagingEndpoint || !payload.address || !payload.authorized_bearer_token) {
        return Promise.reject('failed to handle baseline JOIN protocol message');
      }
      this.workgroupCounterparties.push(payload.address);
      this.natsBearerTokens[messagingEndpoint] = payload.authorized_bearer_token;
    }
  }

  // HACK!! workgroup/contracts should be synced via protocol
  async acceptWorkgroupInvite(inviteToken: string, contracts: any): Promise<void> {
    if (this.workgroup || this.workgroupToken || this.org || this.baselineConfig.initiator) {
      return Promise.reject('failed to accept workgroup invite');
    }

    const invite = jwt.decode(inviteToken) as { [key: string]: any };

    await this.createWorkgroup(this.baselineConfig.workgroupName);

    this.contracts = {
      'erc1820-registry': {
        address: invite.prvd.data.params.erc1820_registry_contract_address,
        name: 'ERC1820Registry',
        network_id: this.baselineConfig?.networkId,
        params: {
          compiled_artifact: contracts['erc1820-registry'].params?.compiled_artifact
        },
        type: 'erc1820-registry',
      },
      'organization-registry': {
        address: invite.prvd.data.params.organization_registry_contract_address,
        name: 'OrgRegistry',
        network_id: this.baselineConfig?.networkId,
        params: {
          compiled_artifact: contracts['organization-registry'].params?.compiled_artifact
        },
        type: 'organization-registry',
      },
      'shield': {
        address: invite.prvd.data.params.shield_contract_address,
        name: 'Shield',
        network_id: this.baselineConfig?.networkId,
        params: {
          compiled_artifact: contracts['shield'].params?.compiled_artifact
        },
        type: 'shield',
      },
      'verifier': {
        address: invite.prvd.data.params.verifier_contract_address,
        name: 'Verifier',
        network_id: this.baselineConfig?.networkId,
        params: {
          compiled_artifact: contracts['verifier'].params?.compiled_artifact
        },
        type: 'verifier',
      },
    };

    const nchain = nchainClientFactory(
      this.workgroupToken,
      this.baselineConfig?.nchainApiScheme,
      this.baselineConfig?.nchainApiHost,
    );

    this.contracts['erc1820-registry'] = await nchain.createContract(this.contracts['erc1820-registry']);
    this.contracts['organization-registry'] = await nchain.createContract(this.contracts['organization-registry']);
    this.contracts['shield'] = await nchain.createContract(this.contracts['shield']);
    this.contracts['verifier'] = await nchain.createContract(this.contracts['verifier']);

    const counterpartyAddr = invite.prvd.data.params.invitor_organization_address;
    this.workgroupCounterparties.push(counterpartyAddr);

    const messagingEndpoint = await this.resolveMessagingEndpoint(counterpartyAddr);
    this.natsBearerTokens[messagingEndpoint] = invite.prvd.data.params.authorized_bearer_token;
    this.workflowIdentifier = invite.prvd.data.params.workflow_identifier;

    await this.baseline?.track(invite.prvd.data.params.shield_contract_address);
    await this.registerOrganization(this.baselineConfig.orgName, this.natsConfig.natsServers[0]);
    await this.requireOrganization(await this.resolveOrganizationAddress());
    await this.sendProtocolMessage(counterpartyAddr, Opcode.Join, {
      address: await this.resolveOrganizationAddress(),
      authorized_bearer_token: await this.vendNatsAuthorization(),
      workflow_identifier: this.workflowIdentifier,
    })
  }

  async generateProof(msg: any): Promise<any> {
    // const raw = JSON.stringify(msg);
    const privateInput = '2'; //keccak256(raw);
    const computed = await this.zk?.computeWitness(this.baselineCircuitArtifacts!, [privateInput]);
    const proof = await this.zk?.generateProof(
      this.baselineCircuitArtifacts?.program,
      computed?.witness,
      this.baselineCircuitSetupArtifacts?.keypair?.pk,
    );
    return proof;
  }

  async resolveMessagingEndpoint(addr: string): Promise<string> {
    const org = await this.fetchOrganization(addr);
    if (!org) {
      return Promise.reject(`organization not resolved: ${addr}`);
    }

    const messagingEndpoint = org['config'].messaging_endpoint;
    if (!messagingEndpoint) {
      return Promise.reject(`organization messaging endpoint not resolved for recipient: ${addr}`);
    }

    return messagingEndpoint;
  }

  // bearer auth tokens authorized by third parties are keyed on the messaging endpoint to which access is authorized
  async resolveNatsBearerToken(addr: string): Promise<string> {
    const endpoint = await this.resolveMessagingEndpoint(addr);
    if (!endpoint) {
      return Promise.reject(`failed to resolve messaging endpoint for participant: ${addr}`);
    }
    return this.natsBearerTokens[endpoint];
  }

  // this will accept recipients (string[]) for multi-party use-cases
  async sendProtocolMessage(
    recipient: string,
    opcode: Opcode,
    msg: any,
  ): Promise<any> {
    const messagingEndpoint = await this.resolveMessagingEndpoint(recipient);
    if (!messagingEndpoint) {
      return Promise.reject(`protocol message not sent; organization messaging endpoint not resolved for recipient: ${recipient}`);
    }

    const bearerToken = this.natsBearerTokens[messagingEndpoint];
    if (!bearerToken) {
      return Promise.reject(`protocol message not sent; no bearer authorization cached for endpoint of recipient: ${recipient}`);
    }

    const recipientNatsConn = await messagingServiceFactory(messagingProviderNats, {
      bearerToken: bearerToken,
      natsServers: [messagingEndpoint],
    });
    await recipientNatsConn.connect();

    if (msg.id && !this.workflowRecords[msg.id]) {
      this.workflowRecords[msg.id] = msg;
    }
  
    // this will use protocol buffers or similar
    const wiremsg = marshalProtocolMessage(
      await this.protocolMessageFactory(
        opcode,
        recipient,
        this.contracts['shield'].address,
        this.workflowIdentifier!,
        Buffer.from(JSON.stringify(msg)),
      ),
    );

    const result = recipientNatsConn.publish(baselineProtocolMessageSubject, wiremsg);
    this.protocolMessagesTx++;
    recipientNatsConn.disconnect();
    return result;
  }

  async createWorkgroup(name: string): Promise<Workgroup> {
    if (this.workgroup) {
      return Promise.reject(`workgroup not created; instance is associated with workgroup: ${this.workgroup.name}`);
    }

    const resp = await this.baseline?.createWorkgroup({
      config: {
        baselined: true,
      },
      name: name,
      network_id: this.baselineConfig?.networkId,
    });

    this.workgroup = resp.application;
    this.workgroupToken = resp.token.token;

    if (this.baselineConfig.initiator) {
      await this.initWorkgroup();
    }

    return this.workgroup;
  }

  private async initWorkgroup(): Promise<void> {
    if (!this.workgroup) {
      return Promise.reject('failed to init workgroup');
    }

    if (!this.capabilities?.getBaselineRegistryContracts()) {
      // HACK
      const promisedTimeout = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
      };
      await promisedTimeout(10000);
    }

    const registryContracts = JSON.parse(JSON.stringify(this.capabilities?.getBaselineRegistryContracts()));
    const contractParams = registryContracts[2]; // "shuttle" launch contract
    // ^^ FIXME -- load from disk -- this is a wrapper to deploy the OrgRegistry contract

    await this.deployWorkgroupContract('Shuttle', 'registry', contractParams);
    await this.requireWorkgroupContract('organization-registry');
  }

  async registerWorkgroupOrganization(): Promise<Organization> {
    if (!this.workgroup || !this.workgroupToken || !this.org) {
      return Promise.reject('failed to register workgroup organization');
    }

    return (await Ident.clientFactory(
      this.workgroupToken,
      this.baselineConfig?.identApiScheme,
      this.baselineConfig?.identApiHost,
    )).createApplicationOrganization(this.workgroup.id, {
      organization_id: this.org.id,
    });
  }

  async setWorkgroup(workgroup: any, workgroupToken: any): Promise<void> {
    if (!workgroup || !workgroupToken || !this.workgroup || this.workgroupToken) {
      return Promise.reject('failed to set workgroup');
    }

    this.workgroup = workgroup;
    this.workgroupToken = workgroupToken;

    return this.initWorkgroup();
  }

  async fetchWorkgroupOrganizations(): Promise<Organization[]> {
    if (!this.workgroup || !this.workgroupToken) {
      return Promise.reject('failed to fetch workgroup organizations');
    }

    return (await Ident.clientFactory(
      this.workgroupToken,
      this.baselineConfig?.identApiScheme,
      this.baselineConfig?.identApiHost,
    ).fetchApplicationOrganizations(this.workgroup.id, {}));
  }

  async createOrgToken(): Promise<Token> {
    return await Ident.clientFactory(
      this.baselineConfig?.token,
      this.baselineConfig?.identApiScheme,
      this.baselineConfig?.identApiHost,
    ).createToken({
      organization_id: this.org.id,
    });
  };

  async resolveOrganizationAddress(): Promise<string> {
    const keys = await this.fetchKeys();
    if (keys && keys.length >= 3) {
      return keys[2].address; // HACK!
    }
    return Promise.reject('failed to resolve organization address');
  }

  async fetchOrganization(address: string): Promise<Organization> {
    const orgRegistryContract = await this.requireWorkgroupContract('organization-registry');

    const nchain = nchainClientFactory(
      this.workgroupToken,
      this.baselineConfig?.nchainApiScheme,
      this.baselineConfig?.nchainApiHost,
    );

    const signerResp = (await nchain.createAccount({
      network_id: this.baselineConfig?.networkId,
    }));

    const resp = await NChain.clientFactory(
      this.workgroupToken,
      this.baselineConfig?.nchainApiScheme,
      this.baselineConfig?.nchainApiHost,
    ).executeContract(orgRegistryContract.id, {
      method: 'getOrg',
      params: [address],
      value: 0,
      account_id: signerResp['id'],
    });

    if (resp && resp['response'] && resp['response'][0] !== '0x0000000000000000000000000000000000000000') {
      const org = {} as Organization;
      org.name = resp['response'][1].toString();
      org['address'] = resp['response'][0];
      org['config'] = JSON.parse(atob(resp['response'][5]));
      org['config']['messaging_endpoint'] = atob(resp['response'][2]);
      org['config']['zk_public_key'] = atob(resp['response'][4]);
      return Promise.resolve(org);
    }

    return Promise.reject(`failed to fetch organization ${address}`);
  }

  async fetchVaults(): Promise<ProvideVault[]> {
    const orgToken = (await this.createOrgToken()).token;
    return (await Vault.clientFactory(
      orgToken!,
      this.baselineConfig.vaultApiScheme!,
      this.baselineConfig.vaultApiHost!,
    ).fetchVaults({}));
  }

  async createVaultKey(vaultId: string, spec: string, type?: string, usage?: string): Promise<VaultKey> {
    const orgToken = (await this.createOrgToken()).token;
    const vault = Vault.clientFactory(
      orgToken!,
      this.baselineConfig?.vaultApiScheme,
      this.baselineConfig?.vaultApiHost,
    );
    return (await vault.createVaultKey(vaultId, {
      'type': type || 'asymmetric',
      'usage': usage || 'sign/verify',
      'spec': spec,
      'name': `${this.org.name} ${spec} keypair`,
      'description': `${this.org.name} ${spec} keypair`,
    }));
  }

  async signMessage(vaultId: string, keyId: string, message: string): Promise<any> {
    const orgToken = (await this.createOrgToken()).token;
    const vault = Vault.clientFactory(orgToken!, this.baselineConfig?.vaultApiScheme, this.baselineConfig?.vaultApiHost);
    return (await vault.signMessage(vaultId, keyId, message));
  }

  async fetchKeys(): Promise<any> {
    const orgToken = (await this.createOrgToken()).token;
    const vault = Vault.clientFactory(orgToken!, this.baselineConfig?.vaultApiScheme, this.baselineConfig?.vaultApiHost);
    const vaults = (await vault.fetchVaults({}));
    return (await vault.fetchVaultKeys(vaults[0].id!, {}));
  }

  async compileBaselineCircuit(): Promise<any> {
    const src = readFileSync(baselineDocumentCircuitPath).toString();
    this.baselineCircuitArtifacts = await this.zk?.compile(src, 'main');
    return this.baselineCircuitArtifacts;
  }

  async deployBaselineCircuit(): Promise<any> {
    // compile the circuit...
    await this.compileBaselineCircuit();

    // perform trusted setup and deploy verifier/shield contract
    const setupArtifacts = await this.zk?.setup(this.baselineCircuitArtifacts!.program);
    const compilerOutput = JSON.parse(solidityCompile(JSON.stringify({
      language: 'Solidity',
      sources: {
        'verifier.sol': {
          content: setupArtifacts?.verifierSource!,
        },
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['*'],
          },
        }
      },
    })));
    const contractParams = compilerOutput.contracts['verifier.sol']['Verifier'];
    await this.deployWorkgroupContract('Verifier', 'verifier', contractParams);
    const verifierContract = await this.requireWorkgroupContract('verifier');

    const shieldAddress = await this.deployWorkgroupShieldContract();
    const trackedShield = await this.baseline?.track(shieldAddress);
    if (trackedShield) {
      this.contracts['shield'] = {
        address: shieldAddress,
      }
    } else {
      console.log('WARNING: failed to track baseline shield contract');
    }

    this.baselineCircuitSetupArtifacts = setupArtifacts;
    this.workflowIdentifier = this.baselineCircuitSetupArtifacts?.identifier;

    return setupArtifacts;
  }

  async deployWorkgroupContract(name: string, type: string, params: any): Promise<any> {
    if (!this.workgroupToken) {
      return Promise.reject('failed to deploy workgroup contract');
    }

    const nchain = nchainClientFactory(
      this.workgroupToken,
      this.baselineConfig?.nchainApiScheme,
      this.baselineConfig?.nchainApiHost,
    );

    const signerResp = (await nchain.createAccount({
      network_id: this.baselineConfig?.networkId,
    }));

    const resp = await nchain.createContract({
      address: '0x',
      params: {
        account_id: signerResp['id'],
        compiled_artifact: params,
      },
      name: name,
      network_id: this.baselineConfig?.networkId,
      type: type,
    });
    if (resp && resp) {
      this.contracts[type] = resp;
      this.contracts[type].params = {
        compiled_artifact: params,
      }
    }
    return resp;
  }

  async deployWorkgroupShieldContract(): Promise<any> {
    const sender = '0x7e5f4552091a69125d5dfcb7b8c2659029395bdf'; // HACK

    // deploy EYBlockchain's MerkleTreeSHA contract (see https://github.com/EYBlockchain/timber)
    const txhash = await this.baseline?.rpcExec('baseline_deploy', [sender, 'MerkleTreeSHA']);
    const receipt = await this.baseline?.fetchTxReceipt(txhash);
    return receipt.contractAddress;
  }

  async inviteWorkgroupParticipant(email: string): Promise<Invite> {
    return await Ident.clientFactory(
      this.baselineConfig?.token,
      this.baselineConfig?.identApiScheme,
      this.baselineConfig?.identApiHost,
    ).createInvitation({
      application_id: this.workgroup.id,
      email: email,
      permissions: 0,
      params: {
        erc1820_registry_contract_address: this.contracts['erc1820-registry'].address,
        invitor_organization_address: await this.resolveOrganizationAddress(),
        authorized_bearer_token: await this.vendNatsAuthorization(),
        organization_registry_contract_address: this.contracts['organization-registry'].address,
        shield_contract_address: this.contracts['shield'].address,
        verifier_contract_address: this.contracts['verifier'].address,
        workflow_identifier: this.workflowIdentifier,
      },
    });
  }

  async requireOrganization(address: string): Promise<Organization> {
    let organization;
    let interval;

    const promises = [] as any;
    promises.push(new Promise((resolve, reject) => {
      interval = setInterval(async () => {
        this.fetchOrganization(address).then((org) => {
          if (org && org['address'].toLowerCase() === address.toLowerCase()) {
            organization = org;
            resolve();
          }
        }).catch((err) => {});
      }, 5000);
    }));

    await Promise.all(promises);
    clearInterval(interval);
    interval = null;

    return organization;
  }

  async requireWorkgroupContract(type: string): Promise<any> {
    let contract;
    let interval;

    const promises = [] as any;
    promises.push(new Promise((resolve, reject) => {
      interval = setInterval(async () => {
        this.resolveWorkgroupContract(type).then((cntrct) => {
          contract = cntrct;
          resolve();
        }).catch((err) => {});
      }, 5000);
    }));

    await Promise.all(promises);
    clearInterval(interval);
    interval = null;

    return contract;
  }

  async resolveWorkgroupContract(type: string): Promise<any> {
    const nchain = nchainClientFactory(
      this.workgroupToken,
      this.baselineConfig?.nchainApiScheme,
      this.baselineConfig?.nchainApiHost,
    );

    const contracts = await nchain.fetchContracts({
      type: type,
    });

    if (contracts && contracts.length === 1 && contracts[0]['address'] !== '0x') {
      const contract = await nchain.fetchContractDetails(contracts[0].id!);
      this.contracts[type] = contract;
      return Promise.resolve(contract);
    }
    return Promise.reject();
  }

  async registerOrganization(name: string, messagingEndpoint: string): Promise<any> {
    this.org = await this.baseline?.createOrganization({
      name: name,
      metadata: {
        messaging_endpoint: messagingEndpoint,
      },
    });

    if (this.org) {
      const vaults = await this.fetchVaults();
      this.babyJubJub = await this.createVaultKey(vaults[0].id!, 'babyJubJub');
      await this.createVaultKey(vaults[0].id!, 'secp256k1');
      this.hdwallet = await this.createVaultKey(vaults[0].id!, 'BIP39', 'hdwallet', 'EthHdWallet'); // FIXME-- this should take a hardened `hd_derivation_path` param...

      await this.registerWorkgroupOrganization();
    }

    return this.org;
  }

  async startProtocolSubscriptions(): Promise<any> {
    if (!this.nats?.isConnected()) {
      await this.nats?.connect();
    }

    const subscription = await this.nats?.subscribe(baselineProtocolMessageSubject, (msg, err) => {
      this.protocolMessagesRx++;
      this.dispatchProtocolMessage(unmarshalProtocolMessage(Buffer.from(msg.data)));
    });

    this.protocolSubscriptions.push(subscription);
    return this.protocolSubscriptions;
  }

  async protocolMessageFactory(
    opcode: Opcode,
    recipient: string,
    shield: string,
    identifier: string,
    payload: Buffer,
  ): Promise<ProtocolMessage> {
    const vaults = await this.fetchVaults();
    // const key = await this.createVaultKey(vaults[0].id!, 'secp256k1');
    const signature = (await this.signMessage(vaults[0].id!, this.hdwallet!.id!, payload.toString('utf8'))).signature;

    return {
      opcode: opcode,
      sender: await this.resolveOrganizationAddress(),
      recipient: recipient,
      shield: shield,
      identifier: identifier,
      signature: signature,
      type: PayloadType.Text,
      payload: payload,
    };
  }

  async vendNatsAuthorization(): Promise<string> {
    const authService = new AuthService(
      log,
      this.natsConfig?.audience || this.natsConfig.natsServers[0],
      this.natsConfig?.privateKey,
      this.natsConfig?.publicKey,
    );

    const permissions = {
      publish: {
        allow: ['baseline.>'],
      },
      subscribe: {
        allow: [`baseline.inbound`],
      },
    };

    return await authService.vendBearerJWT(
      baselineProtocolMessageSubject,
      5000,
      permissions,
    );
  }
}
