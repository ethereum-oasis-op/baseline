import { IPersistenceService } from "..";

// taken from https://stackoverflow.com/questions/10776600/testing-for-equality-of-regular-expressions
// however, regexp can be nested?
const regexpEqual = (x, y) => {
  return (x instanceof RegExp) && (y instanceof RegExp) &&
         (x.source === y.source) && (x.global === y.global) &&
         (x.ignoreCase === y.ignoreCase) && (x.multiline === y.multiline);
}

export class RAM implements IPersistenceService {

  private config: any;
  // in-memory system of record
  private records: { [identifier: string]: any } = {};
  // track subscribed fields of in-memory record
  private subscribedIdentifiers: string[] = [];
  private subscribedExpressions: RegExp[] = [];
  // track CRUD operations, i.e. changes to record, until next alert call
  private alerts: string[] = [];

  constructor(config: any) {
    this.config = config;
  }

  // only alert when subscribed to identifier and existend in alerts
  // check for commitments?
  alert(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // check which records got altered since last alert call?
      let recordsToBeBaselined: any[] = []
      const expression = new RegExp(this.subscribedExpressions.join('|'), 'i');

      this.alerts.forEach((identifier, index) => {
        if (this.subscribedIdentifiers.includes(identifier) || expression.test(identifier)) {
          // only alert for subscribed fields
          const record = this.records[identifier];
          console.log(`Record with identifier ${identifier} needs to be baselined: ${JSON.stringify(record)}.`);
          recordsToBeBaselined.push(record);
          this.alerts.splice(index, 1);
        }
      })
      resolve(recordsToBeBaselined);
    });
  }

  // subscribe to specific fields (identifiers)
  subscribe(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // params.fields refers to the set or subset of core/types/persistence Model.fields with type string | string[] | RegExp
      // maybe pass Model per params?
      if (params.fields instanceof RegExp) {
        let skip = false;
        for(let i = 0; i < this.subscribedExpressions.length; i++) {
          skip = regexpEqual(this.subscribedExpressions[i], params.fields);
          if (skip) {
            break;
          }
        }
        if (!skip) {
          this.subscribedExpressions.push(params.fields);
        }
      } else if (typeof params.fields == 'string' || params.fields instanceof String) {
        if (!this.subscribedIdentifiers.includes(params.fields)) {
          this.subscribedIdentifiers.push(params.fields);
        }
      } else if (Array.isArray(params.fields) && params.fields.every(e => (typeof e == 'string' || e instanceof String)) && params.fields.length > 0) {
        params.fields.forEach(field => {
          if (!this.subscribedIdentifiers.includes(field)) {
            this.subscribedIdentifiers.push(field);
          }
        });
      } else {
        reject('params.fields is not of type string | string[] | RegExp')
      }
      // Return all subscribed fields?
      resolve({
        identifiers: this.subscribedIdentifiers,
        expressions: this.subscribedExpressions
      });
    });
  }

  // unsubscribe to specific fields
  unsubscribe(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // params.fields refers to the set or subset of core/types/persistence Model.fields with type string | string[] | RegExp
      // maybe pass Model.fields per params?
      if (params.fields instanceof RegExp) {
        for(let i = 0; i < this.subscribedExpressions.length; i++) {
          if (regexpEqual(this.subscribedExpressions[i], params.fields)) {
            this.subscribedExpressions.splice(i, 1);
          }
        }
      } else if (typeof params.fields == 'string' || params.fields instanceof String) {
        const index = this.subscribedIdentifiers.indexOf(params.fields);
        if (index !== -1) {
          this.subscribedIdentifiers.splice(index, 1);
        }
      } else if (Array.isArray(params.fields) && params.fields.every(e => (typeof e == 'string' || e instanceof String)) && params.fields.length > 0) {
        params.fields.forEach(field => {
          const index = this.subscribedIdentifiers.indexOf(field);
          if (index !== -1) {
            this.subscribedIdentifiers.splice(index, 1);
          }
        });
      } else {
        reject('params.fields is not of type string | string[] | RegExp')
      }
      // Return all subscribed fields?
      resolve({
        identifiers: this.subscribedIdentifiers,
        expressions: this.subscribedExpressions
      });
    });
  }

  // records to be published to ram
  // check for hashes and track alerts?
  publish(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // assume params.records is an array of records to be persisted
      // a record of params.records includes at least an identifier and the record hash -> refer to bri-1?
      let publishedRecords: any[] = [];
      params.records.forEach(record => {
        if (record.identifier && record.hash) {
          if (this.records[record.identifier] && record.hash !== this.records[record.identifier]) {
            // a record is identified as altered if its hash changed?
            this.alerts.push(record.identifier);
          }
          this.records[record.identifier] = record;
          publishedRecords.push(record);
        }
      });
      // return published records or all currently persisted records?
      resolve(publishedRecords);
    });
  }
}

export async function ramServiceFactory(config?: any): Promise<RAM> {
  return new RAM(config);
}
