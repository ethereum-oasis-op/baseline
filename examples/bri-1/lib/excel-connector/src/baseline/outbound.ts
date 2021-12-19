import { onError } from "../common/common";
import { Object, BaselineResponse } from "@provide/types";
import { ProvideClient } from "src/client/provide-client";
import { excelHandler } from "./excel-handler";
import { store } from "../settings/store";

// eslint-disable-next-line no-unused-vars
/* global Excel, Office, OfficeExtension */

export class OutBound {
  async send(
    context: Excel.RequestContext,
    changedData: Excel.TableChangedEventArgs | Excel.WorksheetChangedEventArgs,
    identClient: ProvideClient
  ): Promise<void> {
    try {
      let tableName = await excelHandler.getSheetName(context);
      let message = await this.createMessage(context, tableName, changedData);

      let baselineResponse: BaselineResponse;

      let recordExists = await store.keyExists(tableName, [message.payload.id, message.type], "Out");

      console.log(recordExists);

      if (!recordExists) {
        baselineResponse = await identClient.sendCreateProtocolMessage(message);
        console.log(baselineResponse);
        await store.setInboundAndOutboundTables(
          tableName,
          [message.payload.id, message.type],
          baselineResponse.baselineId
        );
      } else {
        let baselineId = await store.getBaselineId(tableName, [message.payload.id, message.type]);
        console.log("Baseline ID: " + baselineId);
        baselineResponse = await identClient.sendUpdateProtocolMessage(baselineId, message);
        console.log("Baseline message : " + baselineResponse);
      }
    } catch {
      this.catchError;
    }
  }

  private async createMessage(
    context: Excel.RequestContext,
    tableName: string,
    changedData: Excel.TableChangedEventArgs | Excel.WorksheetChangedEventArgs
  ): Promise<Object> {
    let primaryKey = await store.getPrimaryKeyField(tableName);
    console.log(primaryKey);
    let id = await this.getPrimaryKeyID(context, changedData, primaryKey);
    let dataColumnHeader = await excelHandler.getDataColumnHeader(context, changedData);

    let message: Object = {} as Object;
    message.type = "general_consistency";
    message.id = id;

    const data = {};
    data[dataColumnHeader] = changedData.details.valueAfter;

    let _payload = {
      id: id,
      data: data,
    };

    message.payload = _payload;

    return message;
  }

  private async getPrimaryKeyID(
    context: Excel.RequestContext,
    changedData: Excel.TableChangedEventArgs | Excel.WorksheetChangedEventArgs,
    primaryKeyColumnName: String
  ): Promise<string> {
    try {
      let primaryKeyColumnAddress = await excelHandler.getSheetColumnAddress(context, primaryKeyColumnName);
      let primaryKeyCell = primaryKeyColumnAddress + changedData.address.split(/\D+/)[1];
      let primaryKeyID = context.workbook.worksheets
        .getActiveWorksheet()
        .getRange(primaryKeyCell + ":" + primaryKeyCell);

      primaryKeyID.load("values");
      await context.sync();

      console.log(primaryKeyID.values);
      return primaryKeyID.values[0][0].toString();
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
