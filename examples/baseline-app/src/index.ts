import { IBaselineRPC, IBlockchainService, IRegistry, IVault, baselineServiceFactory, baselineProviderProvide } from '@baseline-protocol/api';
import { IMessagingService, messagingProviderNats, messagingServiceFactory } from '@baseline-protocol/messaging';
import { IZKSnarkCircuitProvider, zkSnarkCircuitProviderServiceFactory, zkSnarkCircuitProviderServiceZokrates } from '@baseline-protocol/privacy';
import { Capabilities, Ident, NChain, capabilitiesFactory } from 'provide-js';
import { readFileSync } from 'fs';

const baselineDocumentCircuitPath = '../../baseline/lib/circuits/baselineDocument/baselineDocument.zok';
const baselineProtocolMessageSubject = 'baseline.*';

const zokratesImportResolver = (location, path) => {
  let zokpath = `../../baseline/lib/circuits/baselineDocument/${path}`;
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
    const prvdToken = this.baselineConfig?.prvdToken;
    const resp = await NChain.clientFactory(prvdToken).createContract({
      address: '0x',
      params: {
        account_id: this.baselineConfig?.signerAccountId,
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

  async createWorkgroup(name: string): Promise<any> {
    const resp = (await this.baseline?.createWorkgroup({
      name: name,
    })).responseBody;

    this.workgroup = resp.application;

    if (this.workgroup && this.org) {
      const registryContracts = JSON.parse(JSON.stringify(this.capabilities?.getBaselineRegistryContracts()));
      const contractParams = registryContracts[2]; // "shuttle" launch contract
      // ^^ FIXME -- load from disk -- this is a wrapper to deploy the OrgRegistry contract
      const contract = await this.deployWorkgroupContract('Shuttle', 'registry', contractParams);
      await Ident.clientFactory(resp.token.token, 'http', 'localhost:8085').createApplicationOrganization(this.workgroup.id, {
        organization_id: this.org.id,
      });
    }
    return this.workgroup;
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
