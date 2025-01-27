import { onError } from "../common/common";
import { baseline } from "./index";
import { store } from "../settings/store";
import { ProvideClient } from "src/client/provide-client";
import * as $ from "jquery";
import { MappingForm } from "src/taskpane/mappingForm";

// eslint-disable-next-line no-unused-vars
/* global Excel, OfficeExtension, Office */

export class ExcelAPI {
  tableToBaseline: string;

  async createTableListener(context: Excel.RequestContext): Promise<string> {
    try {
      let sheet = context.workbook.worksheets.getActiveWorksheet();
      let range = sheet.getUsedRange();
      let table = range.getTables().getFirst();
      table.load("name");

      table.onChanged.add(this.onChange);
      await context.sync();

      return table.name;
    } catch {
      this.catchError;
    }
  }

  async createSheetListener(context: Excel.RequestContext): Promise<string> {
    try {
      let sheet = context.workbook.worksheets.getActiveWorksheet();
      sheet.load("name");

      sheet.onChanged.add(this.onWorksheetChange);
      await context.sync();

      return sheet.name;
    } catch {
      this.catchError;
    }
  }

  //Read all the changed data.
  onChange(eventArgs: Excel.TableChangedEventArgs): Promise<unknown> {
    //Set global variables
    baseline.sendMessage(eventArgs);

    return new Promise((resolve, reject) => {
      if (eventArgs) {
        resolve(eventArgs);
      } else {
        return reject(Error);
      }
    });
  }

  //Read all the changed data.
  onWorksheetChange(eventArgs: Excel.WorksheetChangedEventArgs): Promise<unknown> {
    //Set global variables
    baseline.sendMessage(eventArgs);

    return new Promise((resolve, reject) => {
      if (eventArgs) {
        resolve(eventArgs);
      } else {
        return reject(Error);
      }
    });
  }

  //Add listener to table
  async addTableListener(context: Excel.RequestContext): Promise<void> {
    try {
      let sheet = context.workbook.worksheets.getActiveWorksheet();
      let range = sheet.getUsedRange();
      let table = range.getTables().getFirst();
      table.load("name");

      await context.sync();

      var tableExists = await store.tableExists("tablePrimaryKeys", table.name);

      if (tableExists) {
        table.onChanged.add(this.onChange);
        await context.sync();
      }
    } catch {
      this.catchError;
    }
  }

  //Add listener to table
  async addSheetListener(context: Excel.RequestContext): Promise<void> {
    try {
      let sheet = context.workbook.worksheets.getActiveWorksheet();
      sheet.load("name");

      await context.sync();

      var sheetExists = await store.tableExists("tablePrimaryKeys", sheet.name);

      if (sheetExists) {
        sheet.onChanged.add(this.onWorksheetChange);
        await context.sync();
      }
    } catch {
      this.catchError;
    }
  }

  async saveMappings(mappingForm: MappingForm): Promise<void> {
    var tableName = await this.trim(mappingForm.getFormSheetName().toString());
    var primaryKey = await this.trim(mappingForm.getFormPrimaryKey().toString());
    var columnNames = mappingForm.getFormSheetColumnNames();

    //Map table name with mapping ID
    var excelTable = $("#" + tableName).val();

    var tableExists = await store.tableExists("tableNames", excelTable.toString());

    if (!tableExists) {
      await store.close();
      await store.createInboundAndOutboundTables(excelTable.toString());
    }

    await store.setTableName(tableName, excelTable.toString());

    var excelTablePrimaryKey = $("#" + primaryKey).val();
    await store.setPrimaryKey(excelTable.toString(), excelTablePrimaryKey.toString());

    columnNames.map(async (column) => {
      var columnID = await this.trim(column.toString());

      var excelColumn = $("#" + columnID).val();

      await store.setColumnMapping(tableName, column.toString(), excelColumn.toString());
    });
  }

  async createMappings(identClient: ProvideClient, mappingForm: MappingForm, excelTable: string): Promise<void> {
    //Create local tables to store the mappings
    await store.close();
    await store.createInboundAndOutboundTables(excelTable);

    var tableName = mappingForm.getFormSheetName().toString();
    var columnNames = mappingForm.getFormSheetColumnNames();
    // eslint-disable-next-line no-unused-vars
    var workgroupId = mappingForm.getFormWorkgroupID().toString();

    var mappingTable = $("#mapping-form #table-name").val().toString().replace(/\//g, "//");
    await store.setTableName(mappingTable, tableName);

    var mappingPrimaryKey = $("#mapping-form #primary-key").val().toString().replace(/\//g, "//");
    await store.setPrimaryKey(tableName, mappingPrimaryKey);

    var fields = [];

    fields = columnNames.map(async (columnName) => {
      var columnID = await this.trim(columnName.toString());
      var columnType = $("#" + columnID)
        .val()
        .toString();
      await store.setColumnMapping(tableName, columnName.toString(), columnName.toString());
      var tableColumn = {
        name: columnName.toString().replace(/\//g, "//"),
        type: columnType,
      };

      return tableColumn;
    });

    var allFields = await Promise.all(fields);

    var table = {
      type: mappingTable,
      primary_key: mappingPrimaryKey,
      fields: allFields,
    };

    var models = [];
    models.push(table);

    var mapping = {
      name: mappingTable,
      description: null,
      type: "mapping_type",
      workgroup_id: workgroupId,
      models: models,
    };

    await identClient.createWorkgroupMapping(mapping);
  }

  async changeButtonColor(): Promise<void> {
    var submitButton = document.getElementById("mapping-form-btn");
    submitButton.innerHTML = "Baselined";
    submitButton.style.backgroundColor = "Green";
  }

  async trim(str: string): Promise<string> {
    return str.replace(/\s/g, "");
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

export const excelAPI = new ExcelAPI();
