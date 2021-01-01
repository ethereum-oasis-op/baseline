import { IPersistenceService } from './..';

export class D365 implements IPersistenceService {

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
  }}

export async function d365ServiceFactory(
  config?: any,
): Promise<D365> {
  return new D365(config);
}
