import { IPersistenceService } from './..';

export class Salesforce implements IPersistenceService {

  private config: any;

  constructor(config: any) {
      this.config = config;
  }

  alert(params: any): Promise<any> {
    throw new Error('not implemented');
  }

  subscribe(params: any): Promise<any> {
    throw new Error('not implemented');
  }

  unsubscribe(params: any): Promise<any> {
    throw new Error('not implemented');
  }

  publish(params: any): Promise<any> {
    throw new Error("not implemented");
  }
}

export async function salesforceServiceFactory(
  config?: any,
): Promise<Salesforce> {
  return new Salesforce(config);
}
