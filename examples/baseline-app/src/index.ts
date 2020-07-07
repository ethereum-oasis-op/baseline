import { IBaselineRPC, IBlockchainService, IRegistry, IVault, baselineServiceFactory, baselineProviderProvide } from '@baseline-protocol/api';
import { IMessagingService, messagingProviderNats, messagingServiceFactory } from '@baseline-protocol/messaging';
import { IZKSnarkCircuitProvider, zkSnarkCircuitProviderServiceFactory, zkSnarkCircuitProviderServiceZokrates } from '@baseline-protocol/privacy';
import { Capabilities, Ident, capabilitiesFactory, nchainClientFactory } from 'provide-js';
import { readFileSync } from 'fs';

const baselineDocumentCircuitPath = '../../lib/circuits/baselineDocument/baselineDocument.zok';
const baselineProtocolMessageSubject = 'baseline.*';

const zokratesImportResolver = (location, path) => {
  let zokpath = `../../lib/circuits/baselineDocument/${path}`;
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
  }

  getBaselineCircuitArtifacts(): any | undefined {
    return this.baselineCircuitArtifacts;
  }

  getBaselineService(): IBaselineRPC & IBlockchainService & IRegistry & IVault | undefined {
    return this.baseline;
  }

  getMessagingService(): IMessagingService | undefined {
    return this.nats;
  }

  getProtocolSubscriptions(): any[] | undefined {
    return this.protocolSubscriptions;
  }

  getWorkgroupContract(type: string): any {
    return this.contracts[type];
  }

  async createWorkgroup(name: string): Promise<any> {
    const resp = (await this.baseline?.createWorkgroup({
      config: {
        baselined: true,
      },
      name: name,
      network_id: this.baselineConfig?.networkId,
    })).responseBody;

    this.workgroup = resp.application;
    this.workgroupToken = resp.token.token;

    if (this.workgroup && this.org) {
      const registryContracts = JSON.parse(JSON.stringify(this.capabilities?.getBaselineRegistryContracts()));
      const contractParams = registryContracts[2]; // "shuttle" launch contract
      // ^^ FIXME -- load from disk -- this is a wrapper to deploy the OrgRegistry contract

      await this.deployWorkgroupContract('Shuttle', 'registry', contractParams);
      await this.resolveWorkgroupContract('organization-registry');
      (await Ident.clientFactory(
        this.workgroupToken,
        this.baselineConfig?.identApiScheme,
        this.baselineConfig?.identApiHost,
      )).createApplicationOrganization(this.workgroup.id, {
        organization_id: this.org.id,
      });
    }
    return this.workgroup;
  }

  async compileBaselineCircuit(): Promise<any> {
    const src = readFileSync(baselineDocumentCircuitPath).toString();
    this.baselineCircuitArtifacts = await this.zk?.compile(src, 'main');
    return this.baselineCircuitArtifacts;
  }

  async deployBaselineCircuit(): Promise<any> {
    // perform trusted setup and deploy verifier/shield contract
    const setupArtifacts = await this.zk?.setup(this.baselineCircuitArtifacts.program);
    // TODO: deploy verifier & shield
    return setupArtifacts;
  }

  async deployWorkgroupContract(name: string, type: string, params: any): Promise<any> {
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
      if (contracts && contracts.length === 1 && contracts[0]['address']) {
        this.contracts[type] = contracts[0];
        // this.orgRegistryContractAddr = contracts[0]['address'];
        clearInterval(interval);
        interval = null;
        return;
      }
    }, 5000);

    return Promise.resolve();
  }

  async registerOrganization(name: string, messagingEndpoint: string): Promise<any> {
    this.org = (await this.baseline?.createOrganization({
      name: name,
      metadata: {
        messaging_endpoint: messagingEndpoint,
      },
    })).responseBody;
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
}
