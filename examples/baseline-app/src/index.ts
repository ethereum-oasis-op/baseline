import { IBaselineRPC, IBlockchainService, IRegistry, IVault, baselineServiceFactory, baselineProviderProvide } from '@baseline-protocol/api';
import { IMessagingService, messagingProviderNats, messagingServiceFactory } from '@baseline-protocol/messaging';
import { IZKSnarkCircuitProvider, zkSnarkCircuitProviderServiceFactory, zkSnarkCircuitProviderServiceZokrates } from '@baseline-protocol/privacy';
import { messageReservedBitsLength, Message as ProtocolMessage, Opcode, PayloadType } from '@baseline-protocol/types';
import { Capabilities, Ident, Vault, capabilitiesFactory, nchainClientFactory } from 'provide-js';
import { readFileSync } from 'fs';

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
  private baselineCircuitArtifacts?: any;
  private baselineConfig?: any;
  private nats?: IMessagingService;
  private natsConfig?: any;
  private protocolSubscriptions?: any[];
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

    this.capabilities = capabilitiesFactory();
    this.contracts = {};

    if (this.baselineConfig.workgroup && this.baselineConfig.workgroupToken) {
      await this.setWorkgroup(this.baselineConfig.workgroup, this.baselineConfig.workgroupToken);
    } else if (this.baselineConfig.workgroupName) {
      // await this.createWorkgroup(this.baselineConfig.workgroupName);
    } else {
      console.log(`WARNING... no workgroup configuration found in baseline config... ${this.baselineConfig}`)
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

  getProtocolSubscriptions(): any[] | undefined {
    return this.protocolSubscriptions;
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

  async createWorkgroup(name: string): Promise<any> {
    if (this.workgroup) {
      return Promise.reject(`workgroup not created; instance is associated with workgroup: ${this.workgroup.name}`);
    }

    const resp = (await this.baseline?.createWorkgroup({
      config: {
        baselined: true,
      },
      name: name,
      network_id: this.baselineConfig?.networkId,
    })).responseBody;

    this.workgroup = resp.application;
    this.workgroupToken = resp.token.token;

    await this.initWorkgroup();
    return this.workgroup;
  }

  async initWorkgroup(): Promise<any> {
    if (!this.workgroup) {
      return Promise.reject('failed to init workgroup');
    }

    const registryContracts = JSON.parse(JSON.stringify(this.capabilities?.getBaselineRegistryContracts()));
    const contractParams = registryContracts[2]; // "shuttle" launch contract
    // ^^ FIXME -- load from disk -- this is a wrapper to deploy the OrgRegistry contract

    await this.deployWorkgroupContract('Shuttle', 'registry', contractParams);
    await this.resolveWorkgroupContract('organization-registry');
  }

  async registerWorkgroupOrganization(): Promise<any> {
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

  async setWorkgroup(workgroup: any, workgroupToken: any): Promise<any> {
    if (!workgroup || !workgroupToken || !this.workgroup || this.workgroupToken) {
      return Promise.reject('failed to set workgroup');
    }

    this.workgroup = workgroup;
    this.workgroupToken = workgroupToken;

    return this.initWorkgroup();
  }

  async fetchWorkgroupOrganizations(): Promise<any> {
    if (!this.workgroup || !this.workgroupToken) {
      return Promise.reject('failed to fetch workgroup organizations');
    }

    return (await Ident.clientFactory(
      this.workgroupToken,
      this.baselineConfig?.identApiScheme,
      this.baselineConfig?.identApiHost,
    ).fetchApplicationOrganizations(this.workgroup.id, {})).responseBody;
  }

  async createOrgToken(): Promise<any> {
    return await Ident.clientFactory(
      this.baselineConfig?.token,
      this.baselineConfig?.identApiScheme,
      this.baselineConfig?.identApiHost,
    ).createToken({
      organization_id: this.org.id,
    });
  };

  async fetchVaults(): Promise<any> {
    const orgToken = (await this.createOrgToken()).responseBody['token'];
    return (await Vault.clientFactory(
      orgToken,
      this.baselineConfig?.vaultApiScheme,
      this.baselineConfig?.vaultApiHost,
    ).fetchVaults({})).responseBody;
  }

  async createVaultKey(vaultId: string, spec: string): Promise<any> {
    const orgToken = (await this.createOrgToken()).responseBody['token'];
    const vault = Vault.clientFactory(
      orgToken,
      this.baselineConfig?.vaultApiScheme,
      this.baselineConfig?.vaultApiHost,
    );
    return (await vault.createVaultKey(vaultId, {
      'type': 'asymmetric',
      'usage': 'sign/verify',
      'spec': spec,
      'name': `${this.org.name} ${spec} keypair`,
      'description': `${this.org.name} ${spec} keypair`,
    })).responseBody;
  }

  async signMessage(vaultId: string, keyId: string, message: string): Promise<any> {
    const orgToken = (await this.createOrgToken()).responseBody['token'];
    const vault = Vault.clientFactory(orgToken, this.baselineConfig?.vaultApiScheme, this.baselineConfig?.vaultApiHost);
    return (await vault.signMessage(vaultId, keyId, message)).responseBody;
  }

  async fetchKeys(): Promise<any> {
    const orgToken = (await this.createOrgToken()).responseBody['token'];
    const vault = Vault.clientFactory(orgToken, this.baselineConfig?.vaultApiScheme, this.baselineConfig?.vaultApiHost);
    const vaults = (await vault.fetchVaults({})).responseBody;
    return (await vault.fetchVaultKeys(vaults[0]['id'], {})).responseBody;
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
    const setupArtifacts = await this.zk?.setup(this.baselineCircuitArtifacts.program);

    // const registryContracts = JSON.parse(JSON.stringify(this.capabilities?.getBaselineRegistryContracts()));
    // console.log(JSON.stringify(registryContracts, null, 2));

    // const shieldContract = await this.resolveWorkgroupContract('shield');
    // const trackedShield = await this.baseline?.track(shieldContract['address']);
    // if (trackedShield) {
    //   console.log('tracked baseline shield contract');
    // } else {
    //   console.log('WARNING: failed to track baseline shield contract');
    // }

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
    })).responseBody;

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
    if (resp && resp.responseBody) {
      this.contracts[type] = resp.responseBody;
    }
    return resp.responseBody;
  }

  async ingestBaselineProtocolMessage(): Promise<any> {
    // TODO: dispatch the protocol message...
    throw new Error('not implemented');
  }

  // async publishBaselineProtocolMessage(): Promise<any> {
  //   this.nats?.publish(counterparty)
  // }

  async resolveWorkgroupContract(type: string): Promise<void> {
    // FIXME- use this.baseline interface...
    const nchain = nchainClientFactory(
      this.workgroupToken,
      this.baselineConfig?.nchainApiScheme,
      this.baselineConfig?.nchainApiHost,
    );

    let interval;
    interval = setInterval(async () => {
      const contracts = (await nchain.fetchContracts({
        type: type,
      })).responseBody;
      if (contracts && contracts.length === 1 && contracts[0]['address'] !== '0x') {
        this.contracts[type] = contracts[0];
        // this.orgRegistryContractAddr = contracts[0]['address'];
        clearInterval(interval);
        interval = null;
        return Promise.resolve();
      }
    }, 10000);

    return Promise.resolve();
  }

  async registerOrganization(name: string, messagingEndpoint: string): Promise<any> {
    this.org = (await this.baseline?.createOrganization({
      name: name,
      metadata: {
        messaging_endpoint: messagingEndpoint,
      },
    })).responseBody;

    if (this.org) {
      const vaults = await this.fetchVaults();
      await this.createVaultKey(vaults[0].id, 'babyJubJub');
      await this.createVaultKey(vaults[0].id, 'secp256k1');

      await this.registerWorkgroupOrganization();
    }

    return this.org;
  }

  async startProtocolSubscriptions(): Promise<any> {
    if (!this.nats?.isConnected()) {
      await this.nats?.connect();
    }

    this.protocolSubscriptions = await this.nats?.subscribe(baselineProtocolMessageSubject, (msg, err) => {
      console.log(`received ${msg.length}-byte baseline protocol message: \n\t${msg}`);
    });
    return this.protocolSubscriptions;
  }

  async protocolMessageFactory(
    recipient: string,
    shield: string,
    identifier: string,
    payload: Buffer,
  ): Promise<ProtocolMessage> {
    const vaults = await this.fetchVaults();
    const key = await this.createVaultKey(vaults[0].id, 'secp256k1');
    const signature = (await this.signMessage(vaults[0].id, key.id, payload.toString('utf8'))).signature;

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
