import {
  IBaselineRPC,
  IBlockchainService,
  IRegistry,
  IVault,
  MerkleTreeNode,
  baselineServiceFactory,
  baselineProviderProvide,
}                                     from '@baseline-protocol/api';
import {
  IMessagingService,
  messagingProviderNats,
  messagingServiceFactory,
}                                     from '@baseline-protocol/messaging';
import {
  zkSnarkProverProviderServiceFactory,
  zkSnarkProverProviderServiceProvide,
  Element,
  elementify,
  rndHex,
  concatenateThenHash,
}                                     from '@baseline-protocol/privacy';
import {
  IProverProver,
  IProverRegistry,
  IProverVerifier,
}                                     from '@baseline-protocol/privacy/dist/cjs/zkp';
import {
  Message as ProtocolMessage,
  Opcode,
  PayloadType,
  marshalProtocolMessage,
  unmarshalProtocolMessage,
}                                     from '@baseline-protocol/types';
import {
  Application as Workgroup,
  Prover,
  Invite,
  Vault as ProvideVault,
  Object as BaselineObject,
  Organization,
  Token,
  Key as VaultKey,
  SubjectAccount,
}                                     from '@provide/types';
import { ethers }                     from 'ethers';
import {
  encode as base64Encode,
  fromUint8Array,
}                                     from 'js-base64';
import {
  Baseline,
  Capabilities,
  Ident,
  NChain,
  Vault,
  baselineClientFactory,
  capabilitiesFactory,
  nchainClientFactory,
}                                     from 'provide-js';
import { compile as solidityCompile } from 'solc';
import * as jwt                       from 'jsonwebtoken';
import * as log                       from 'loglevel';
import { sha256 }                     from 'js-sha256';
import { AuthService }                from 'ts-natsutil';
import { spawn }                      from 'child_process';
import {
  sleep,
  tryTimes,
  unmarshalSnake,
}                                     from './utils';

import fs from 'fs';

const baselineProtocolMessageSubject = 'baseline.proxy';
const baselineProtocolDefaultDomain = 'baseline.local';

export class ParticipantStack {
  private baseline?: IBaselineRPC & IBlockchainService & IRegistry & IVault;
  private baselineProxy?: Baseline;
  private baselineProver?: Prover;
  private baselineMerkleTree?:any;
  private baselineConfig?: any;
  private babyJubJub?: VaultKey;
  private domain?: string;
  private hdwallet?: VaultKey;
  private initialized = false;
  private nats?: IMessagingService;
  private natsBearerTokens: { [key: string]: any } = {}; // mapping of third-party participant messaging endpoint => bearer token
  private natsConfig?: any;
  private protocolMessagesRx = 0;
  private protocolMessagesTx = 0;
  private protocolSubscriptions: any[] = [];
  private capabilities?: Capabilities;
  private contracts: any;
  private privacy?: IProverRegistry & IProverProver & IProverVerifier;

  private org?: any;
  private orgAccessToken?: string;
  private orgRefreshToken?: string;
  private subjectAccount?: SubjectAccount;
  private workgroup?: any;
  private workgroupCounterparties: string[] = [];
  // private workgroupToken?: any; // workgroup bearer token; used for automated setup
  private workflowIdentifier?: string; // workflow identifier; specific to the workgroup
  private workflowRecords: { [key: string]: any } = {}; // in-memory system of record

  constructor(baselineConfig: any, natsConfig: any) {
    this.baselineConfig = baselineConfig;
    this.natsConfig = natsConfig;
  }

  async init() {
    if (this.initialized) {
      throw new Error(`already initialized participant stack: ${this.org.name}`);
    }

    this.baseline = await baselineServiceFactory(baselineProviderProvide, this.baselineConfig);
    this.nats = await messagingServiceFactory(messagingProviderNats, this.natsConfig);
    this.privacy = await zkSnarkProverProviderServiceFactory(zkSnarkProverProviderServiceProvide, {
      token: this.baselineConfig?.token,
      privacyApiScheme: this.baselineConfig?.privacyApiScheme,
      privacyApiHost: this.baselineConfig?.privacyApiHost,
    }) as unknown as IProverRegistry & IProverProver & IProverVerifier; // HACK

    if (this.natsConfig?.natsBearerTokens) {
      this.natsBearerTokens = this.natsConfig.natsBearerTokens;
    }

    if (this.baselineConfig?.domain) {
      this.domain = this.baselineConfig?.domain;
    } else {
      this.domain = baselineProtocolDefaultDomain;
    }

    this.contracts = {};
    this.startProtocolSubscriptions();

    await this.registerOrganization(this.baselineConfig.orgName, this.natsConfig.natsServers[0]);

    await this.requireOrgTokens();

    if (this.baselineConfig.operator) {
      if (this.baselineConfig.workgroup && this.baselineConfig.workgroupToken) {
        await this.setWorkgroup(this.baselineConfig.workgroup);
      } else if (this.baselineConfig.workgroupName) {
        await this.createWorkgroup(this.baselineConfig.workgroupName);
      }

    }

/*
    await this.registerWorkgroupOrganization();
*/
    await this.requireIdent();
    await this.deployBaselineStack();
    await this.requireBaselineStack();

    if (this.baselineConfig.operator) {
      this.subjectAccount = await this.createSubjectAccount(await this.fetchOrganizationContract());
    }

    this.initialized = true;
  }

  getBaselineProver(): Prover | undefined {
    return this.baselineProver;
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

/*
  getWorkgroupToken(): any {
    return this.workgroupToken;
  }
*/

  getWorkgroupContract(type: string): any {
    return this.contracts[type];
  }

  getWorkgroupContracts(): any[] {
    return this.contracts;
  }

  getWorkgroupCounterparties(): string[] {
    return this.workgroupCounterparties;
  }

  async disconnect() {
    await this.nats?.flush();
    await this.nats?.disconnect();
  }

  private async dispatchProtocolMessage(msg: ProtocolMessage): Promise<any> {
    if (msg.opcode === Opcode.Join) {
      const payload = JSON.parse(msg.payload.toString());
      const messagingEndpoint = await this.resolveMessagingEndpoint(payload.address);
      if (!messagingEndpoint || !payload.address || !payload.authorized_bearer_token) {
        return Promise.reject('failed to handle baseline JOIN protocol message');
      }
      this.workgroupCounterparties.push(payload.address);
      this.natsBearerTokens[messagingEndpoint] = payload.authorized_bearer_token;

      const prover = JSON.parse(JSON.stringify(this.baselineProver));
      prover.proving_scheme = prover.provingScheme;
      prover.verifier_contract = prover.verifierContract;
      delete prover.verifierContract;
      delete prover.createdAt;
      delete prover.vaultId;
      delete prover.provingScheme;
      delete prover.provingKeyId;
      delete prover.verifyingKeyId;
      delete prover.status;

      // sync prover artifacts
      this.sendProtocolMessage(payload.address, Opcode.Sync, {
        type: 'prover',
        payload: prover,
      });
    } else if (msg.opcode === Opcode.Sync) {
      const payload = JSON.parse(msg.payload.toString());
      if (payload.type === 'prover') {
        this.baselineProver = await this.privacy?.deploy(payload.payload) as Prover;
      }
    }
  }

  async sendBaselineProtocolMessage(params: object): Promise<BaselineObject> {
    return (await this.baselineProxy?.sendProtocolMessage(params)) as BaselineObject;
  }

  async getMerkleRoot(): Promise<String> {
    return (await this.baselineMerkleTree?.Root());
  }

  // HACK!! workgroup/contracts should be synced via protocol
  async acceptWorkgroupInvite(inviteToken: string, contracts: any): Promise<void> {
    if (this.baselineConfig.operator) {
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

    await this.requireOrgTokens();

    const nchain = nchainClientFactory(
      this.orgAccessToken!,
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
    // TODO: Update workflow identifier resolution
    this.workflowIdentifier = invite.prvd.data.params.workflow_identifier;

    await this.baseline?.track(invite.prvd.data.params.shield_contract_address).catch((err) => { });
    await this.registerOrganization(this.baselineConfig.orgName, this.natsConfig.natsServers[0]);
    await this.registerWorkgroupOrganization();
    await this.requireIdent();
    await this.deployBaselineStack();
    await this.requireBaselineStack();
    this.subjectAccount = await this.createSubjectAccount(await this.fetchOrganizationContract());
    await this.requireOrganization(await this.resolveOrganizationAddress());
    await this.sendProtocolMessage(counterpartyAddr, Opcode.Join, {
      address: await this.resolveOrganizationAddress(),
      authorized_bearer_token: await this.vendNatsAuthorization(),
      workflow_identifier: this.workflowIdentifier,
    });
  }

  async resolveMessagingEndpoint(addr: string): Promise<string> {
    const orgRegistryContract = await this.fetchOrganizationContract();
    const org = await this.fetchOrganization(addr, orgRegistryContract);
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

    this.workgroup = await Ident.clientFactory(
      this.orgAccessToken!,
      this.baselineConfig?.identApiScheme,
      this.baselineConfig?.identApiHost,
    ).createApplication({
      name: name,
      network_id: this.baselineConfig?.networkId,
    });

    // const tokenResp = await this.createWorkgroupToken();
    // this.workgroupToken = tokenResp.accessToken || tokenResp.token;

    if (this.baselineConfig.operator) {
      await this.initWorkgroup();
    }

    return this.workgroup;
  }

  private async initWorkgroup(): Promise<void> {
    if (!this.workgroup) {
      return Promise.reject('failed to init workgroup');
    }

    this.capabilities = capabilitiesFactory();
    await this.requireCapabilities();

    const registryContracts = JSON.parse(JSON.stringify(this.capabilities?.getBaselineRegistryContracts()));
    const contractParams = registryContracts[2]; // "shuttle" launch contract
    // ^^ FIXME -- load from disk -- this is a wrapper to deploy the OrgRegistry contract

    await this.deployRegistryContract('Shuttle', 'registry', contractParams);
    await this.requireRegistryContract('organization-registry');
  }

  async registerWorkgroupOrganization(): Promise<Organization> {
    if (!this.workgroup || !this.org) {
      return Promise.reject('failed to register workgroup organization');
    }

    await this.requireOrgTokens();

    return (await Ident.clientFactory(
      this.orgAccessToken!,
      this.baselineConfig?.identApiScheme,
      this.baselineConfig?.identApiHost,
    )).createApplicationOrganization(this.workgroup.id, {
      organization_id: this.org.id,
    });
  }

  async setWorkgroup(workgroup: any): Promise<void> {
    if (!workgroup) {
      return Promise.reject('failed to set workgroup');
    }

    this.workgroup = workgroup;
    // this.workgroupToken = workgroupToken;

    return this.initWorkgroup();
  }

  async fetchWorkgroupOrganizations(): Promise<Organization[]> {
    if (!this.workgroup) {
      return Promise.reject('failed to fetch workgroup organizations');
    }

    await this.requireOrgTokens();

    return (await Ident.clientFactory(
      this.orgAccessToken!,
      this.baselineConfig?.identApiScheme,
      this.baselineConfig?.identApiHost,
    ).fetchApplicationOrganizations(this.workgroup.id, {})).results;
  }

  async createOrgToken(): Promise<Token> {
    return await Ident.clientFactory(
      this.baselineConfig?.token,
      this.baselineConfig?.identApiScheme,
      this.baselineConfig?.identApiHost,
    ).createToken({
      organization_id: this.org.id,
    });
  }

  async requireOrgTokens(): Promise<void> {
    if (!this.orgAccessToken || !this.orgRefreshToken) {
      const orgToken = await this.createOrgRefreshToken();
      this.orgAccessToken = orgToken.accessToken!;
      this.orgRefreshToken = orgToken.refreshToken!;
    }
  }

  async createOrgRefreshToken(): Promise<Token> {
    return await Ident.clientFactory(
      this.baselineConfig?.token,
      this.baselineConfig?.identApiScheme,
      this.baselineConfig?.identApiHost,
    ).createToken({
      organization_id: this.org.id,
      scope: 'offline_access',
    });
  }

/*
  async createWorkgroupToken(): Promise<Token> {
    return await Ident.clientFactory(
      this.baselineConfig?.token,
      this.baselineConfig?.identApiScheme,
      this.baselineConfig?.identApiHost,
    ).createToken({
      application_id: this.workgroup.id,
    });
  }
*/

  async resolveOrganizationAddress(): Promise<string> {
    const keys = await this.fetchKeys();
    var address;
    keys.forEach(key => {
      if (key.spec == 'secp256k1') {
        address = key.address; // HACK!
      }
    });

    if (address) {
      return Promise.resolve(address);
    }

    return Promise.reject('failed to resolve organization address');
  }

  async fetchOrganizationContract(): Promise<Organization> {
    return await tryTimes(async () => {
      const orgRegistryContract = await this.requireRegistryContract('organization-registry');
      if (orgRegistryContract) {
        return orgRegistryContract;
      }

      throw new Error();
    })
  }

  async createSubjectAccount(orgRegistryContract: any): Promise<SubjectAccount> {
    await this.requireOrgTokens();

    const address = await this.resolveOrganizationAddress();

    const subjectAccountParams = {
      metadata: {
        organization_id: this.org.id,
        organization_address: address,
        organization_domain: 'org.local',
        organization_messaging_endpoint: this.natsConfig.natsServers[0],
        organization_refresh_token: this.orgRefreshToken,
        workgroup_id: this.workgroup.id,
        registry_contract_address: orgRegistryContract.address,
        network_id: this.workgroup.networkId,
        // l2_network_id: this.config.networks.layer2.id,
      },
    };

    return await tryTimes(async () => {
      const subjectAccount = await Baseline.clientFactory(
        this.orgAccessToken!,
        this.baselineConfig?.baselineApiScheme,
        this.baselineConfig?.baselineApiHost,
        this.baselineConfig?.baselineApiPath,
      ).createSubjectAccount(this.org.id, subjectAccountParams);
      if (subjectAccount) {
        return subjectAccount;
      }

      throw new Error();
    })
  }

  async fetchOrganization(address: string, orgRegistryContract: any): Promise<Organization> {
    await this.requireOrgTokens();

    const nchain = nchainClientFactory(
      this.orgAccessToken!,
      this.baselineConfig?.nchainApiScheme,
      this.baselineConfig?.nchainApiHost,
    );

    const signerResp = (await nchain.createAccount({
      network_id: this.baselineConfig?.networkId,
    }));

    const resp = await NChain.clientFactory(
      this.orgAccessToken!,
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
      // FIXME-- merge into metadata...
      org['address'] = resp['response'][0];
      org['config'] = JSON.parse(atob(resp['response'][5]));
      org['config']['domain'] = atob(resp['response'][2]);
      org['config']['messaging_endpoint'] = atob(resp['response'][3]);
      org['config']['zk_public_key'] = atob(resp['response'][4]);
      return Promise.resolve(org);
    }

    return Promise.reject(`failed to fetch organization ${address}`);
  }

  async requireBaselineStack(token?: string): Promise<boolean> {
    if (!token) {
      const orgToken = await this.createOrgToken();
      token = orgToken.accessToken || orgToken.token;
    }
    return await tryTimes(async () => {
      const status = await Baseline.clientFactory(
        this.orgAccessToken!,
        this.baselineConfig.baselineApiScheme!,
        this.baselineConfig.baselineApiHost!,
      ).status();
      if (status === 204) {
        await sleep(10000);
        return true;
      }
      throw new Error();
    }, 100, 5000);
  }

  async requireIdent(): Promise<boolean> {
    return await tryTimes(async () => {
      const status = await Ident.fetchStatus(
        this.baselineConfig.identApiScheme!,
        this.baselineConfig.identApiHost!,
      );
      if (status != null) {
        return true;
      }
      throw new Error();
    }, 100, 5000);
  }

  async requireProver(proverId: string): Promise<Prover> {
    let prover: Prover | undefined = undefined;
    const orgToken = await this.createOrgToken();
    const tkn = orgToken.accessToken || orgToken.token;

    let interval;
    const promises = [] as any;
    promises.push(new Promise<void>((resolve, reject) => {
      interval = setInterval(async () => {
        prover = await this.privacy?.fetchProver(proverId) as Prover;
        if (prover && prover.verifierContract && prover.verifierContract['source']) {
          resolve();
        }
      }, 2500);
    }));

    await Promise.all(promises);
    clearInterval(interval);
    interval = null;

    return prover!;
  }

  async fetchVaults(): Promise<ProvideVault[]> {
    const orgToken = await this.createOrgToken();
    const token = orgToken.accessToken || orgToken.token;
    return (await Vault.clientFactory(
      token!,
      this.baselineConfig.vaultApiScheme!,
      this.baselineConfig.vaultApiHost!,
    ).fetchVaults({})).results;
  }

  async createVaultKey(vaultId: string, spec: string, type?: string, usage?: string): Promise<VaultKey> {
    const orgToken = await this.createOrgToken();
    const token = orgToken.accessToken || orgToken.token;
    const vault = Vault.clientFactory(
      token!,
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

  async requireVault(token?: string): Promise<ProvideVault> {
    let tkn = token;
    if (!tkn) {
      const orgToken = await this.createOrgToken();
      tkn = orgToken.accessToken || orgToken.token;
    }

    const vaultInstance = Vault.clientFactory(
      tkn!,
      this.baselineConfig.vaultApiScheme!,
      this.baselineConfig.vaultApiHost!,
    );

    return await tryTimes(async () => {
      await vaultInstance.createVault({
        name       : `${this.org.name} Vault`,
        description: `${this.org.name} vault instance`,
      });

      const vaults = await vaultInstance.fetchVaults({});
      if (vaults && vaults.results.length > 0) {
        return vaults.results[0];
      }
      throw new Error();
    });
  }

  async signMessage(vaultId: string, keyId: string, message: string): Promise<any> {
    const orgToken = await this.createOrgToken();
    const token = orgToken.accessToken || orgToken.token;
    const vault = Vault.clientFactory(token!, this.baselineConfig?.vaultApiScheme, this.baselineConfig?.vaultApiHost);
    return (await vault.signMessage(vaultId, keyId, message));
  }

  async fetchKeys(): Promise<VaultKey[]> {
    const orgToken = await this.createOrgToken();
    const token = orgToken.accessToken || orgToken.token;
    const vault = Vault.clientFactory(token!, this.baselineConfig?.vaultApiScheme, this.baselineConfig?.vaultApiHost);
    const vlt = await this.requireVault(token!);
    return (await vault.fetchVaultKeys(vlt.id!, {})).results;
  }

  async fetchSecret(vaultId: string, secretId: string): Promise<any> {
    const orgToken = await this.createOrgToken();
    const token = orgToken.accessToken || orgToken.token;
    const vault = Vault.clientFactory(token!, this.baselineConfig?.vaultApiScheme, this.baselineConfig?.vaultApiHost);
    return (await vault.fetchVaultSecret(vaultId, secretId));
  }

  async deployBaselineProver(): Promise<Prover> {
    // perform trusted setup and deploy verifier/shield contract
    const prover = await this.privacy?.deploy({
      identifier: 'purchase_order',
      proving_scheme: 'groth16',
      curve: 'BN254',
      provider: 'gnark',
      name: 'my 1337 prover',
    }) as Prover;

    this.baselineProver = await this.requireProver(prover.id!);
    this.workflowIdentifier = this.baselineProver?.id;
    const content = this.baselineProver?.verifierContract!['source'].replace(/\^0.5.0/g, '^0.7.3').replace(/view/g, '').replace(/gas,/g, 'gas(),').replace(/\\n/g, /\n/).replace(/uint256\[0\]/g, 'uint256[]')
    const input = {
      'language': 'Solidity',
      'settings': {
        'outputSelection': {
          '*': {
            '*': ['*']
          }
        }
      },
      'sources': {
        'verifier.sol': {
          'content': content
        }
      }
    };

    const compilerOutput = JSON.parse(solidityCompile(JSON.stringify(input)));
    if (!compilerOutput.contracts || !compilerOutput.contracts['verifier.sol']) {
      throw new Error('verifier contract compilation failed');
    }

    const contractParams = compilerOutput.contracts['verifier.sol']['Verifier'];
    await this.deployRegistryContract('Verifier', 'verifier', contractParams);
    await this.requireRegistryContract('verifier');
    await this.deployWorkgroupShieldContract();

    return this.baselineProver;
  }

  async deployRegistryContract(name: string, type: string, params: any, arvg?: any[]): Promise<any> {
    await this.requireOrgTokens();

    if (!params.bytecode && params.evm) { // HACK
      params.bytecode = `0x${params.evm.bytecode.object}`;
    }

    const nchain = nchainClientFactory(
      this.orgAccessToken!,
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
        argv: arvg || [],
      },
      name: name,
      network_id: this.baselineConfig?.networkId,
      type: type,
    });
    if (resp && resp) {
      this.contracts[type] = resp;
      this.contracts[type].params = {
        compiled_artifact: params,
      };
    }
    return resp;
  }

  async deployWorkgroupShieldContract(): Promise<any> {
    const verifierContract = await this.requireRegistryContract('verifier');
    const registryContracts = JSON.parse(JSON.stringify(this.capabilities?.getBaselineRegistryContracts()));
    const contractParams = registryContracts[3]; // "shuttle prover" factory contract

    const argv = ['MerkleTreeSHA Shield', verifierContract.address, 32];

    // deploy EYBlockchain's MerkleTreeSHA contract (see https://github.com/EYBlockchain/timber)
    await this.deployRegistryContract('ShuttleProver', 'prover', contractParams, argv);
    const shieldContract = await this.requireRegistryContract('shield');

    return shieldContract.address;
  }

  async inviteWorkgroupParticipant(email: string): Promise<Invite> {
    const vault = await this.requireVault(this.orgAccessToken);

    const jwtForInvite = await this.vendJwt(
      this.org.id,
      vault.id,
      email,
      {
        invitor_organization_address: await this.resolveOrganizationAddress(),
        registry_contract_address   : this.contracts['organization-registry'].address,
        workgroup_id                : this.workgroup.id,
        invitor_subject_account_id  : this.subjectAccount?.id,
      },
    );

    return await Ident.clientFactory(
      this.orgAccessToken!,
      this.baselineConfig?.identApiScheme,
      this.baselineConfig?.identApiHost,
    ).createInvitation(
      {
        first_name       : 'Alice',
        last_name        : 'Baseline',
        email,
        organization_name: this.baselineConfig?.orgName,
        application_id   : this.workgroup.id,
        params           : {
          authorized_bearer_token   : jwtForInvite,
          is_organization_invite    : true,
          metadata                  : {},
          operator_separation_degree: 1,
          workgroup                 : unmarshalSnake(this.workgroup),
        },
      });

    /*
    return await Ident.clientFactory(
      this.orgAccessToken!,
      this.baselineConfig?.identApiScheme,
      this.baselineConfig?.identApiHost,
    ).createInvitation({
      application_id: this.workgroup.id,
      email: email,
      permissions: 0,
      params: {
        // TODO: Update address resolutions.
        erc1820_registry_contract_address: this.contracts['erc1820-registry'].address,
        invitor_organization_address: await this.resolveOrganizationAddress(),
        authorized_bearer_token: await this.vendNatsAuthorization(),
        organization_registry_contract_address: this.contracts['organization-registry'].address,
        shield_contract_address: this.contracts['shield'].address,
        verifier_contract_address: this.contracts['verifier'].address,
        workflow_identifier: this.workflowIdentifier,
      },
    });
    */
  }

  private async requireCapabilities(): Promise<void> {
    return await tryTimes(async () => {
      if (this.capabilities?.getBaselineRegistryContracts()) {
        return;
      }
      throw new Error();
    })
  }

  async requireOrganization(address: string): Promise<Organization> {
    const orgRegistryContract = await this.fetchOrganizationContract();
    const org = await this.fetchOrganization(address, orgRegistryContract);
    if (org && org['address'].toLowerCase() === address.toLowerCase()) {
      return org;
    }

    throw new Error();
  }

  async requireSubjectAccount(): Promise<SubjectAccount> {
    return await tryTimes(async () => {
      if (this.subjectAccount) {
        return this.subjectAccount;
      }
      throw new Error();
    })
  }

  async requireWorkgroup(): Promise<void> {
    return await tryTimes(async () => {
      if (this.workgroup) {
        return this.workgroup;
      }
      throw new Error();
    })
  }

  async requireRegistryContract(type: string): Promise<any> {
    return await tryTimes(() => this.resolveWorkgroupContract(type))
  }

  async resolveWorkgroupContract(type: string): Promise<any> {
    await this.requireOrgTokens();

    const nchain = nchainClientFactory(
      this.orgAccessToken!,
      this.baselineConfig?.nchainApiScheme,
      this.baselineConfig?.nchainApiHost,
    );

    const contracts = await nchain.fetchContracts({
      type: type,
    });

    if (contracts && contracts.results.length === 1 && contracts.results[0]['address'] !== '0x') {
      const contract = await nchain.fetchContractDetails(contracts.results[0].id!);
      this.contracts[type] = contract;
      return Promise.resolve(contract);
    }
    return Promise.reject();
  }

  async registerOrganization(name: string, messagingEndpoint: string): Promise<any> {
    this.org = await this.baseline?.createOrganization({
      name: name,
      metadata: {
        domain: this.domain,
        messaging_endpoint: messagingEndpoint,
      },
    });

    if (this.org) {
      const vault = await this.requireVault();
      this.babyJubJub = await this.createVaultKey(vault.id!, 'babyJubJub');
      await this.createVaultKey(vault.id!, 'secp256k1');
      this.hdwallet = await this.createVaultKey(vault.id!, 'BIP39');
      await this.createVaultKey(vault.id!, 'RSA-4096');
    }

    return this.org;
  }

  async deployBaselineStack(): Promise<any> {
    const registryContract = this.baselineConfig.operator
      ? await this.requireRegistryContract('organization-registry')
      : null;

    await this.requireOrgTokens();

    this.baselineProxy = baselineClientFactory(
      this.orgAccessToken!,
      this.baselineConfig?.baselineApiScheme,
      this.baselineConfig?.baselineApiHost
    );
    const orgAddress = await this.resolveOrganizationAddress();

    // Generate config file
    const configurationFileContents = `access-token: ${this.baselineConfig?.userAccessToken}\nrefresh-token: ${this.baselineConfig?.userRefreshToken}\n${this.org.id}:\n  refresh-token: ${this.orgRefreshToken}\n`;
    const provideConfigFileName=`${process.cwd()}/.prvd-${this.baselineConfig?.orgName.replace(/\s+/g, '')}-cli.yaml`;
    fs.writeFileSync(provideConfigFileName, configurationFileContents);
    await this.requireIdent();
    var name = this.baselineConfig?.orgName.split(' ')
    const runenv = `LOG_LEVEL=TRACE IDENT_API_HOST=${this.baselineConfig?.identApiHost} IDENT_API_SCHEME=${this.baselineConfig?.identApiScheme} NCHAIN_API_HOST=${this.baselineConfig?.nchainApiHost} NCHAIN_API_SCHEME=${this.baselineConfig?.nchainApiScheme} VAULT_API_HOST=${this.baselineConfig?.vaultApiHost} VAULT_API_SCHEME=${this.baselineConfig?.vaultApiScheme} PROVIDE_ORGANIZATION_REFRESH_TOKEN=${this.orgRefreshToken}`
    var runcmd = ` prvd baseline stack start`
    runcmd += ` --api-endpoint="${this.baselineConfig?.baselineApiScheme}://${this.baselineConfig?.baselineApiHost}"`
    runcmd += ` --config="${provideConfigFileName}"`
    runcmd += ` --ident-host="${this.baselineConfig?.identApiHost}"`
		runcmd += ` --ident-scheme="${this.baselineConfig?.identApiScheme}"`
		runcmd += ` --jwt-signer-public-key="${this.natsConfig?.publicKey.replaceAll('\n', '\\n')}"`
    runcmd += ` --messaging-endpoint="nats://localhost:${this.baselineConfig?.baselineMessagingPort}"`
    runcmd += ` --name="${this.baselineConfig?.orgName.replace(/\s+/g, '')}"`
    runcmd += ` --nats-auth-token="${this.natsConfig?.bearerToken}"`
    runcmd += ` --nats-port=${this.baselineConfig?.baselineMessagingPort}`
    runcmd += ` --nats-ws-port=${this.baselineConfig?.baselineMessagingWebsocketPort}`
    runcmd += ` --nchain-host="${this.baselineConfig?.nchainApiHost}"`
		runcmd += ` --nchain-scheme="${this.baselineConfig?.nchainApiScheme}"`
		runcmd += ` --nchain-network-id="${this.baselineConfig?.networkId}"`
		runcmd += ` --organization="${this.org.id}"`
    runcmd += ` --organization-address="${orgAddress}"`
    runcmd += ` --organization-refresh-token="${this.orgRefreshToken}"`
    runcmd += ` --port="${this.baselineConfig?.baselineApiHost.split(':')[1]}"`
    runcmd += ` --privacy-host="${this.baselineConfig?.privacyApiHost}"`
		runcmd += ` --privacy-scheme="${this.baselineConfig?.privacyApiScheme}"`
		if (this.baselineConfig.operator) runcmd += ` --registry-contract-address="${registryContract.address}"`
    runcmd += ` --redis-hostname=${name[0]}-redis`
    runcmd += ` --redis-port=${this.baselineConfig?.redisPort}`
    runcmd += ` --postgres-hostname=${name[0]}-postgres`
    runcmd += ` --postgres-port="${this.baselineConfig?.postgresPort}"`
    runcmd += ` --sor="ephemeral"`
    runcmd += ` --vault-host="${this.baselineConfig?.vaultApiHost}"`
		runcmd += ` --vault-refresh-token="${this.orgRefreshToken}"`
		runcmd += ` --vault-scheme="${this.baselineConfig?.vaultApiScheme}"`
    if (this.baselineConfig.operator) runcmd += ` --workgroup="${this.workgroup?.id}"`
    if (!this.baselineConfig.operator) runcmd += ` --without-require-workgroup="true"`
    runcmd += ` --without-require-subject-account="true"`
    runcmd += ` --prune="true"`

    runcmd = runcmd.replace(/localhost/ig, 'host.docker.internal')

    var child = spawn(runenv+runcmd, [], { detached: true, stdio: 'pipe', shell: '/bin/bash' });
    console.log('shelled out to start baseline protocol instance (BPI) containers');
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
    const signature = (await this.signMessage(
      vaults[0].id!,
      this.hdwallet!.id!,
      sha256(payload.toString()),
    )).signature;

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
        allow: [`baseline.proxy`],
      },
    };

    return await authService.vendBearerJWT(
      baselineProtocolMessageSubject,
      5000,
      permissions,
    );
  }

  async vendJwt(organizationId, vaultId, subject, baseline): Promise<string> {
    try {

      const {results: [key]} = await new Vault(
        this.orgAccessToken!,
        this.baselineConfig?.vaultApiScheme,
        this.baselineConfig?.vaultApiHost,
      ).fetchVaultKeys(
        vaultId,
        {spec: 'RSA-4096'},
      );

      const claims = {
        aud: null,
        iat: Math.floor(new Date().getTime() / 1000),
        iss: organizationId,
        sub: subject,
        baseline,

        nats: {
          permissions: {
            publish  : {
              allow: ['baseline', 'baseline.>'],
            },
            subscribe: {
              allow: [
                'baseline',
                'baseline.>',
                'network.*.connector.*',
                'network.*.contracts.*',
                'network.*.status',
                'platform.>',
              ],
            },
          },
        },
      };

      const header = {
        typ: 'JWT',
        alg: 'RS256',
        // @ts-ignore
        kid: key.fingerprint,
      };

      const segments = [JSON.stringify(header), JSON.stringify(claims)].map(
        (item) =>
          base64Encode(item)
          .replace(/\+/g, '-') // Convert '+' to '-'
          .replace(/\//g, '_') // Convert '/' to '_'
          .replace(/=+$/, ''), // Remove ending '='
      );

      const jwtStr = segments.join('.');

      const jwtStrUTF8 = ethers.utils.toUtf8Bytes(jwtStr);

      const strToSign = ethers.utils.hexlify(jwtStrUTF8).slice(2);

      const {signature} = await new Vault(
        this.orgAccessToken!,
        this.baselineConfig?.vaultApiScheme,
        this.baselineConfig?.vaultApiHost,
      ).signMessage(
        vaultId,
        key.id!,
        strToSign,
        {algorithm: 'RS256'},
      );

      const sigBuffer = Uint8Array.from(Buffer.from(signature, 'hex'));

      const base64Sig = fromUint8Array(sigBuffer, true)
      .replace(/\+/g, '-') // Convert '+' to '-'
      .replace(/\//g, '_') // Convert '/' to '_'
      .replace(/=+$/, ''); // Remove ending '='

      const token = [...segments, base64Sig].join('.');
      return token;
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
