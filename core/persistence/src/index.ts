import { d365ServiceFactory, excelServiceFactory, salesforceServiceFactory, sapServiceFactory, ramServiceFactory } from './providers';

export const persistenceProviderDynamics365 = 'd365';
export const persistenceProviderExcel = 'excel';
export const persistenceProviderSalesforce = 'salesforce';
export const persistenceProviderSAP = 'sap';
export const persistenceProviderRAM = 'ram';

export interface IPersistenceService {
  alert(params: any): Promise<any>;

  subscribe(params: any): Promise<any>;
  unsubscribe(params: any): Promise<any>;

  publish(params: any): Promise<any>;
}

export async function persistenceServiceFactory(
  provider: string,
  config?: any,
): Promise<IPersistenceService> {
  let service;

  switch (provider) {
    case persistenceProviderDynamics365:
      service = await d365ServiceFactory(config);
      break;
    case persistenceProviderExcel:
      service = await excelServiceFactory(config);
      break;
    case persistenceProviderSalesforce:
      service = await salesforceServiceFactory(config);
      break;
    case persistenceProviderSAP:
      service = await sapServiceFactory(config);
      break;
    case persistenceProviderRAM:
      service = await ramServiceFactory(config);
      break;
    default:
      throw new Error('persistence service provider required');
  }

  return service;
}
