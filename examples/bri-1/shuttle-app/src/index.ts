import { IBaselineRPC, IBlockchainService, IRegistry, IVault, baselineServiceFactory, baselineProviderProvide } from '@baseline-protocol/api';
import { IMessagingService, messagingProviderNats, messagingServiceFactory } from '@baseline-protocol/messaging';
import { IZKSnarkCircuitProvider, IZKSnarkCompilationArtifacts, IZKSnarkTrustedSetupArtifacts, zkSnarkCircuitProviderServiceFactory, zkSnarkCircuitProviderServiceZokrates } from '@baseline-protocol/privacy';
import { messageReservedBitsLength, Message as ProtocolMessage, Opcode, PayloadType } from '@baseline-protocol/types';
import { Application as Workgroup, Invite, Vault as ProvideVault, Organization, Token, Key as VaultKey } from '@provide/types';
import { Capabilities, Ident, NChain, Vault, capabilitiesFactory, nchainClientFactory } from 'provide-js';
import { readFileSync } from 'fs';
import { compile as solidityCompile } from 'solc';
import * as jwt from 'jsonwebtoken';
import { keccak256 } from 'js-sha3';

const baselineDocumentCircuitPath = '../../lib/circuits/noopAgreement.zok';
const baselineProtocolMessageSubject = 'baseline.inbound';

const zokratesImportResolver = (location, path) => {
  let zokpath = `../../lib/circuits/${path}`;
  if (!zokpath.match(/\.zok$/i)) {
    zokpath = `${zokpath}.zok`;
  }
  return {
    source: readFileSync(zokpath).toString(),
    location: path,
  };
};

export class BaselineApp {

  private baseline?: IBaselineRPC & IBlockchainService & IRegistry & IVault;
  private baselineCircuitArtifacts?: IZKSnarkCompilationArtifacts;
  private baselineCircuitSetupArtifacts?: IZKSnarkTrustedSetupArtifacts;
  private baselineConfig?: any;
  private nats?: IMessagingService;
  private natsConfig?: any;
  private protocolMessagesRx = 0;
  private protocolMessagesTx = 0;
  private protocolSubscriptions: any[] = [];
  private capabilities?: Capabilities;
  private contracts: any;
  private zk?: IZKSnarkCircuitProvider;

  private org?: any;
  private workgroup?: any;
  private workgroupToken?: any; // workgroup bearer token; used for automated setup
  private workflowIdentifier?: string; // workflow identifier; specific to the workgroup

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

  private async ingestProtocolMessage(msg: ProtocolMessage): Promise<any> {
    // TODO: dispatch the protocol message...
    throw new Error('not implemented');
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

    this.workflowIdentifier = invite.prvd.data.params.workflow_identifier;

    const nchain = nchainClientFactory(
      this.workgroupToken,
      this.baselineConfig?.nchainApiScheme,
      this.baselineConfig?.nchainApiHost,
    );

    this.contracts['erc1820-registry'] = await nchain.createContract(this.contracts['erc1820-registry']);
    this.contracts['organization-registry'] = await nchain.createContract(this.contracts['organization-registry']);
    this.contracts['shield'] = await nchain.createContract(this.contracts['shield']);
    this.contracts['verifier'] = await nchain.createContract(this.contracts['verifier']);

    await this.baseline?.track(invite.prvd.data.params.shield_contract_address);
    await this.registerOrganization(this.baselineConfig.orgName, this.natsConfig.natsServers[0]);
  }

  async generateProof(msg: any): Promise<any> {
    const raw = JSON.stringify(msg);
    const privateInput = keccak256(raw);
    const witness = this.zk?.computeWitness(this.baselineCircuitArtifacts!, [privateInput]);
    const proof = this.zk?.generateProof(this.baselineCircuitArtifacts?.program, witness, this.baselineCircuitSetupArtifacts?.keypair?.pk);
    return proof;
  }

  // this will accept recipients (string[]) for multi-party use-cases
  async sendProtocolMessage(recipient: string, msg: any): Promise<any> {
    const recipientOrg = await this.fetchOrganization(recipient);
    if (!recipientOrg) {
      return Promise.reject(`protocol message not sent; organization not resolved: ${recipient}`);
    }

    const messagingEndpoint = recipientOrg['config'].messaging_endpoint;
    if (!messagingEndpoint) {
      return Promise.reject(`protocol message not sent; organization messaging endpoint not resolved for recipient: ${recipient}`);
    }

    const recipientNatsConn = await messagingServiceFactory(messagingProviderNats, {
      bearerToken: this.workgroupToken, // FIXME
      natsServers: [messagingEndpoint],
    });
    await recipientNatsConn.connect();

    // const proof = await this.generateProof(msg);
    // console.log(proof);

    // this will use protocol buffers or similar
    const wiremsg = this.serializeProtocolMessage(
      await this.protocolMessageFactory(
        recipient,
        this.contracts['shield'].address,
        this.workflowIdentifier!,
        Buffer.from(JSON.stringify(msg)),
      ),
    );

    const result = recipientNatsConn.publish(baselineProtocolMessageSubject, wiremsg);
    this.protocolMessagesTx++;
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

  async createVaultKey(vaultId: string, spec: string): Promise<VaultKey> {
    const orgToken = (await this.createOrgToken()).token;
    const vault = Vault.clientFactory(
      orgToken!,
      this.baselineConfig?.vaultApiScheme,
      this.baselineConfig?.vaultApiHost,
    );
    return (await vault.createVaultKey(vaultId, {
      'type': 'asymmetric',
      'usage': 'sign/verify',
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
      await this.createVaultKey(vaults[0].id!, 'babyJubJub');
      await this.createVaultKey(vaults[0].id!, 'secp256k1');

      await this.registerWorkgroupOrganization();
    }

    return this.org;
  }

  async startProtocolSubscriptions(): Promise<any> {
    if (!this.nats?.isConnected()) {
      await this.nats?.connect();
    }

    const subscription = await this.nats?.subscribe(baselineProtocolMessageSubject, (msg, err) => {
      console.log(`received ${msg.length}-byte protocol message: \n\t${msg}`);
      this.protocolMessagesRx++;
      this.ingestProtocolMessage(msg);
    });

    this.protocolSubscriptions.push(subscription);
    return this.protocolSubscriptions;
  }

  async protocolMessageFactory(
    recipient: string,
    shield: string,
    identifier: string,
    payload: Buffer,
  ): Promise<ProtocolMessage> {
    const vaults = await this.fetchVaults();
    const key = await this.createVaultKey(vaults[0].id!, 'secp256k1');
    const signature = (await this.signMessage(vaults[0].id!, key.id!, payload.toString('utf8'))).signature;

    return {
      opcode: Opcode.Baseline,
      recipient: recipient,
      shield: shield,
      identifier: identifier,
      signature: signature,
      type: PayloadType.Text,
      payload: payload,
    };
  }

  serializeProtocolMessage(
    msg: ProtocolMessage,
  ): Buffer {
    const reservedBits = Buffer.alloc(messageReservedBitsLength / 8);
    const buffer = Buffer.alloc(5 + 42 + 42 + 36 + 64 + 1 + reservedBits.length + msg.payload.length);

    buffer.write(msg.opcode);
    buffer.write(msg.recipient, 5);
    buffer.write(msg.shield, 5 + 42);
    buffer.write(msg.identifier, 5 + 42 + 42);
    buffer.write(reservedBits.toString(), 5 + 42 + 42 + 36);
    buffer.write(msg.signature, 5 + 42 + 42 + 36 + reservedBits.length);
    buffer.write(msg.type.toString(), 5 + 42 + 42 + 36 + reservedBits.length + 64);

    const encoding = msg.type === PayloadType.Binary ? 'binary' : 'utf8';
    buffer.write(msg.payload.toString(encoding), 5 + 42 + 42 + 36 + reservedBits.length + 64 + 1);

    return buffer;
  }
}
