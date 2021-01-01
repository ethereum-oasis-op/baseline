import { IPersistenceService } from './..';

export class SAP implements IPersistenceService {

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

export async function sapServiceFactory(
  config?: any,
): Promise<SAP> {
  return new SAP(config);
}
