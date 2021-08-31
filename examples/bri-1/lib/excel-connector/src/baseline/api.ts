import { onError } from "../common/common";
import { Mapping, MappingModel, MappingField} from "@provide/types";
import { baseline } from "./index";
import { showPrimaryKeyDialog } from "../dialogs/dialogs-helpers";
import { indexedDatabase } from "../settings/settings";
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

  //Add listener to table
  async addTableListener(context: Excel.RequestContext): Promise<void> {
    try {
      
      let sheet = context.workbook.worksheets.getActiveWorksheet();
      let range = sheet.getUsedRange();
      let table = range.getTables().getFirst();
      table.load("name");

      await context.sync();

      var tableExists = await indexedDatabase.openDB(table.name);

     if (tableExists) {
        table.onChanged.add(this.onChange);
        await context.sync();
     }
    } catch {
      this.catchError;
    }
  }

  async getPrimaryKeyColumn(tableID: string): Promise<string> {
    let primaryKeyColumn: string;

    await showPrimaryKeyDialog().then(
      (primaryKeyInput) => {
        primaryKeyColumn = primaryKeyInput.primaryKey;
      },
      () => {
        /* NOTE: On cancel - do nothing */
      }
    );

    await indexedDatabase.setPrimaryKey(tableID, primaryKeyColumn);
    return primaryKeyColumn;
  }


  async saveMappings(mappingForm: MappingForm): Promise<void> {
   
    var tableName = await this.trim(mappingForm.getFormTableName().toString());
    var primaryKey = await this.trim(mappingForm.getFormPrimaryKey().toString());
    var columnNames = mappingForm.getFormColumnNames();

    //Map table name with mapping ID
    var excelTable = $("#" + tableName).val();
   
    var tableExists = await indexedDatabase.tableExists(excelTable.toString());
    
    if(!tableExists){
      await indexedDatabase.closeDB();
      await indexedDatabase.createObjectStore(excelTable.toString());
    }

    await indexedDatabase.setTableName(tableName, excelTable.toString()); 
  
    var excelTablePrimaryKey = $("#" + primaryKey).val();
    await indexedDatabase.setPrimaryKey(excelTable.toString(), excelTablePrimaryKey.toString());

    columnNames.map(async (column) => {

      var columnID = await this.trim(column.toString());

      var excelColumn = $("#" + columnID).val();

      await indexedDatabase.setColumnMapping(tableName, column.toString(), excelColumn.toString());
      
    })

    }
  
  async createMappings(identClient: ProvideClient, mappingForm: MappingForm, excelTable: string): Promise<void>{
    
    //Create local tables to store the mappings
    await indexedDatabase.closeDB();
    await indexedDatabase.createObjectStore(excelTable);
    
    //TODO
    var mapping = <Mapping> {};
    var table = <MappingModel>{};
  
    var tableName = mappingForm.getFormTableName().toString();
    var columnNames = mappingForm.getFormColumnNames();
    var workgroupId = mappingForm.getFormWorkgroupID().toString();

    //Add all this to a mapping data type and call createMapping with it
    var mappingTable= ($("#mapping-form #table-name").val()).toString();
    await indexedDatabase.setTableName(mappingTable, tableName);
    table.type = mappingTable;
     
    var mappingPrimaryKey = ($("#mapping-form #primary-key").val()).toString();
    await indexedDatabase.setPrimaryKey(tableName, mappingPrimaryKey);
    table.primaryKey = mappingPrimaryKey;

    var fields = [];
    
    fields = columnNames.map(async (columnName) => {
      var tableColumn = <MappingField>{};
      var columnID = await this.trim(columnName.toString());
      var columnType = ($("#"+ columnID).val()).toString();
      await indexedDatabase.setColumnMapping(tableName, columnName.toString(), columnName.toString());
      tableColumn.name = columnName.toString();
      tableColumn.type = columnType;
      
      return tableColumn;
    });
    
    table.fields = await Promise.all(fields);

    var models = [];
    models.push(table);

    mapping.models = models; 
    
    await identClient.createWorkgroupMapping(workgroupId, "", mapping);
    //TODO: GET Mapping ID and do await indexedDatabase.setTableName(mappingTable, this.tableName) with mapping ID as mappingTable; 
    }
  
    async changeButtonColor(): Promise<void>{
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
