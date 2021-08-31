import { onError } from "../common/common";
import { indexedDatabase } from "../settings/settings";

//TODO
import { ProtocolMessage } from "../models/protocolMessage";

// eslint-disable-next-line no-unused-vars
/* global Excel, Office, OfficeExtension */

export class InBound {

  async updateExcelTable(context: Excel.RequestContext, msg: ProtocolMessage): Promise<void> {
    //Disable event handler
    await this.disableTableListener(context);

    var tableName = await this.getTableName(context);
    var primaryKeyColumn = await indexedDatabase.getPrimaryKeyField(tableName);
    //dataColumn - Can be retrieved from the message received or from my own indexed database
    var dataColumn = Object.keys(msg.payload.data)[0];
    var address;
    var id;

    var idExists = await indexedDatabase.keyExists(tableName, msg.baselineID, "In");

    if (!idExists) {
      id = await this.generateNewPrimaryKeyID(context, primaryKeyColumn);

      //map it with baseline ID given in the message\
      //Set baselineID in table
      await indexedDatabase.setInboundTable(tableName, msg.baselineID, [id, dataColumn]);

      //Add record in table
      await this.addNewIDToTable(context, id, primaryKeyColumn);
      address = await this.getDataCellAddress(context, id, dataColumn, primaryKeyColumn);

    } else {
      id = (await indexedDatabase.getKey(tableName, msg.baselineID))[0];
      address = await this.getDataCellAddress(context, id, dataColumn, primaryKeyColumn);
    } 
    
    var range = context.workbook.worksheets.getActiveWorksheet().getRange(address);

    range.values = [[msg.payload.data[dataColumn]]];
    range.format.autofitColumns();
    range.format.fill.color = "yellow";
    range.format.font.bold = true;

    await context.sync();

    //Enable event handler
    await this.enableTableListener(context);
  }

  private async getDataCellAddress(context: Excel.RequestContext, primaryKeyValue: string, columnName: string, primaryKeyColumn: string): Promise<string> {
    //Get column Header Cell
    let table = context.workbook.worksheets.getActiveWorksheet().getUsedRange().getTables().getFirst();
    let headerRange = table.getHeaderRowRange();
    let headerCell = headerRange.findOrNullObject(columnName, { completeMatch: true });
    headerCell.load("address");

    //Get Primary Key Cell
    let columnAddress = await this.getColumnAddress(context, primaryKeyColumn);
    let primaryKeyRange = context.workbook.worksheets
      .getActiveWorksheet()
      .getRange(columnAddress + ":" + columnAddress);
    let primaryKeyCell = primaryKeyRange.findOrNullObject(primaryKeyValue, { completeMatch: true });
    primaryKeyCell.load("address");

    return context.sync().then(() => {
      var address = headerCell.address.split("!")[1];
      var column = address.split(/\d+/)[0];
      var row = primaryKeyCell.address.split(/\D+/)[1];
      return column + row;
    });
  }

  private async getColumnAddress(context: Excel.RequestContext, column: string): Promise<string> {
    //Get column Header Cell
    let table = context.workbook.worksheets.getActiveWorksheet().getUsedRange().getTables().getFirst();
    let headerRange = table.getHeaderRowRange();
    let headerCell = headerRange.findOrNullObject(column, { completeMatch: true });
    headerCell.load("address");
 
    await context.sync();
 
    var headerCellAddress = headerCell.address.split("!")[1];
    var columnAddress = headerCellAddress.split(/\d+/)[0];
    return columnAddress;
   }

  private async getTableName(context: Excel.RequestContext): Promise<string> {
    let sheet = context.workbook.worksheets.getActiveWorksheet();
    let range = sheet.getUsedRange();
    let table = range.getTables().getFirst();
    table.load("name");

    await context.sync();

    return table.name; 
  }

  private async generateNewPrimaryKeyID(context: Excel.RequestContext, primaryKeyColumn: string): Promise<string> {
    
    //Get value in last cell
    let primaryKeyRange = context.workbook.worksheets
      .getActiveWorksheet()
      .getRange(primaryKeyColumn + ":" + primaryKeyColumn).getUsedRange();
    let lastCell = primaryKeyRange.getLastCell();
    lastCell.load("values");

    await context.sync();

    //Increment that value
    var id = parseInt(lastCell.values[0][0]); 
    var newID = id+1;
    
    return newID.toString();
  }

  private async addNewIDToTable(context: Excel.RequestContext, newID: string, primaryKeyColumn: string): Promise<void>{

    let originalRange = context.workbook.worksheets
      .getActiveWorksheet()
      .getRange(primaryKeyColumn + ":" + primaryKeyColumn)
      .getUsedRange();
    let expandedRange = originalRange.getResizedRange(1, 0);
    expandedRange.copyFrom(originalRange, Excel.RangeCopyType.formats);
    let lastCell = expandedRange.getLastCell();
    lastCell.values = [[newID]];
    lastCell.format.autofitRows();
    await context.sync();
  }

  private async disableTableListener(context: Excel.RequestContext): Promise<void> {
    
   /* context.runtime.load("enableEvents");
    await context.sync();

    console.log("before disable" + context.runtime.enableEvents.toString());*/
    context.runtime.enableEvents = false;
    await context.sync();

   /* context.runtime.load("enableEvents");
    await context.sync();

    console.log("after disable" + context.runtime.enableEvents.toString());*/
  }

  private async enableTableListener(context: Excel.RequestContext): Promise<void> {
    /*context.runtime.load("enableEvents");
    await context.sync();

    console.log("before enable" + context.runtime.enableEvents.toString());*/
    context.runtime.enableEvents = true;
    await context.sync();

    /*context.runtime.load("enableEvents");
    await context.sync();

    console.log("after enable" + context.runtime.enableEvents);*/
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

export const inboundMessage = new InBound();
