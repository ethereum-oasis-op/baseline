import { onError } from "../common/common";
import { Object, BaselineResponse } from "@provide/types";
import { ProvideClient } from "src/client/provide-client";
import { indexedDatabase } from "../settings/settings";

// eslint-disable-next-line no-unused-vars
/* global Excel, Office, OfficeExtension */

export class OutBound {
  async send(context: Excel.RequestContext, changedData: Excel.TableChangedEventArgs, identClient: ProvideClient): Promise<void> {
    try {
       
        let tableName = await this.getTableName(context);
        let message = await this.createMessage(context, changedData);
        console.log(JSON.stringify(message));
        let baselineResponse: BaselineResponse;
  
        let recordExists = await indexedDatabase.keyExists(tableName, [message.payload.id, message.type], "Out");
       
        console.log(recordExists);
  
        if (!recordExists) {
          baselineResponse = await identClient.sendCreateProtocolMessage(message);
          console.log(baselineResponse);
          await indexedDatabase.set(tableName, [message.payload.id, message.type], baselineResponse.baselineId);
        } else {
          let baselineID = await indexedDatabase.get(tableName, [message.payload.id, message.type]);
          console.log("Baseline ID: " + baselineID);
          baselineResponse = await identClient.sendUpdateProtocolMessage(baselineID, message);
          console.log("Baseline message : " + baselineResponse);
        } 
      
    } catch {
      this.catchError;
    }
  }

  private async createMessage(context: Excel.RequestContext, changedData: Excel.TableChangedEventArgs): Promise<Object> {
    let tableName = await this.getTableName(context);
    let primaryKey = await indexedDatabase.getPrimaryKeyField(tableName); 
    let id = await this.getPrimaryKey(context, changedData, primaryKey);
    let dataColumnHeader = await this.getDataColumnHeader(context, changedData);
   

    let message: Object = {} as Object;
    message.type = "general_consistency";

    const data = {};
    data[dataColumnHeader] = changedData.details.valueAfter;

    let _payload = {
      id: id,
      data: data,
    };

    message.payload = _payload;

    
    return message;
  }

  private async getPrimaryKey(context: Excel.RequestContext, changedData: Excel.TableChangedEventArgs, primaryKeyColumn: String): Promise<string> {
    try {
      let primaryKeyCell = primaryKeyColumn + changedData.address.split(/\D+/)[1];
      let primaryKeyID = context.workbook.worksheets
        .getActiveWorksheet()
        .getRange(primaryKeyCell + ":" + primaryKeyCell);

      primaryKeyID.load("values");
      await context.sync();

      return primaryKeyID.values[0][0].toString();
    } catch {
      this.catchError;
    }
  }

 private getDataColumnHeader(context: Excel.RequestContext, changedData: Excel.TableChangedEventArgs): Promise<string> {
    try {
      let dataColumn = context.workbook.worksheets
        .getActiveWorksheet()
        .getRange(changedData.address.split(/\d+/)[0] + "1");
      dataColumn.load("values");
      return context.sync().then(() => {
        return dataColumn.values[0][0];
      });
    } catch {
      this.catchError;
    }
  }

  private async getTableName(context: Excel.RequestContext): Promise<string> {
    try {
      let table = context.workbook.worksheets.getActiveWorksheet().getUsedRange().getTables().getFirst();
      table.load("name");
      await context.sync();
      return table.name;
    } catch {
      this.catchError;
    }
  }

  private catchError(error: any): void {
    console.log("Error: " + error);
    if (error instanceof OfficeExtension.Error) {
      console.log("Debug info: " + JSON.stringify(error.debugInfo));
      onError(error.message);
    } else {
      onError(error);
    }
  }
}

export const outboundMessage = new OutBound();
