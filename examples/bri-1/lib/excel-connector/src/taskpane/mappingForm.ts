// NOTE: Logic of working with Excel

import { Mapping} from "@provide/types";
import { indexedDatabase } from "../settings/settings";
import { onError } from "../common/common";

// eslint-disable-next-line no-unused-vars
/* global Excel, OfficeExtension */

export class MappingForm {
	tableName;
	primaryKey;
	columnNames: String[];
	tableExists: boolean;
	workgroupId: string;
  
  async showWorkgroupMappings(mappings: Mapping[]): Promise<void> {
	
	var excelTableName;
	var excelColumnNames;

	await Excel.run(async (context: Excel.RequestContext) => {
		excelTableName = await this.getTableName(context);
		excelColumnNames = await this.getColumnNames(context);
	}).catch(this.catchError);

		
	var mappingForm = document.getElementById("mapping-form-options");
	mappings.map((mapping) => {
		mapping.models.map(async (model) => {
			this.tableName = model.type;
			this.primaryKey = model.primaryKey;
			this.tableExists = await indexedDatabase.tableExists(this.tableName);

			var tableID = await this.trim(model.type);
			var primaryKeyID = await this.trim(model.primaryKey);

			document.getElementById("mapping-form-header").innerHTML = "Confirm Mappings";
			var pkOptions = await this.addOptions(excelColumnNames, model.primaryKey) ; 
			mappingForm.innerHTML = `<div class="form-group">
						<label class="font-weight-normal h6" for="` + tableID + `">Table Name: ` + model.type + `</label>
						<input id="` + tableID + `" type="text" value="` + excelTableName + `" class="form-control bg-transparent text-light shadow-none"\\>
						</div>
						<div class="form-group">	
						<label class="font-weight-normal h6" for="` + primaryKeyID + `">Primary Key Column: ` + model.primaryKey + `</label>
						<select id="` + primaryKeyID + `" class="form-control bg-transparent text-light shadow-none">`
						+ pkOptions +	
						`</select>
						</div>`;
			
			this.columnNames = [];
						
			model.fields.map(async (field) => {
			//field.name
			//field.type
			
			var columnID = await this.trim(field.name);
			this.columnNames.push(field.name);	
			var options = await this.addOptions(excelColumnNames, field.name); 
			mappingForm.innerHTML += `<div class="form-group container">
						<div class="row">
						<label class="col font-weight-normal h6" for="` + columnID + `">` + field.name + `<div class="text-muted font-weight-light">(` + field.type + `)</div></label>
						<select id="` + columnID + `" class="col form-control bg-transparent text-light shadow-none">`
						+ options +	
						`</select>
						</div>
						</div>`;
			
			})

			var submitButton = document.getElementById("mapping-form-btn"); 
			if(this.tableExists){
				submitButton.innerHTML = "Baselined";
				submitButton.style.backgroundColor = "Green"; 
			} else {
				submitButton.innerHTML = "Start Baselining";
				submitButton.style.backgroundColor = "Red"; 	
			}

		})
	})
  }

  async showUnmappedColumns(appId: string): Promise<void> {

	this.workgroupId = appId;
 
	await Excel.run(async (context: Excel.RequestContext) => {
		this.tableName = await this.getTableName(context);
		this.columnNames = await this.getColumnNames(context);
	}).catch(this.catchError);

		
	var mappingForm = document.getElementById("mapping-form-options");
	document.getElementById("mapping-form-header").innerHTML = "Create New Mapping"

	var pkOptions = await this.addOptions(this.columnNames); 
	mappingForm.innerHTML = `<div class="form-group container">
				<div class="row">
				<label class="col" for="table-name"> Table Name: </label>
				<input id="table-name" type="text" value ="` + this.tableName + `" class="col form-control bg-transparent text-light shadow-none" \\>
				</div>
				</div>
				<div class="form-group container">
				<div class="row">
				<label class="col" for="primary-key"> Primary Key Column: </label>
				<select id="primary-key" class="col form-control bg-transparent text-light shadow-none">`
				+ pkOptions  +	
				`</select>
				</div>
				</div>`;

	this.columnNames.map(async (column) => {
		var columnID = await this.trim(column.toString());
		var options = await this.addOptions(["String", "Number", "Boolean", "Date"]);
		mappingForm.innerHTML += `<div class="form-group container float-right">
					<div class="row">
					<label class="col d-flex justify-content-end" for="` + columnID + `">` + column + `</label>
					<select id="` + columnID + `" class="col form-control bg-transparent text-light shadow-none">`
					+ options +	
					`</select>
					<!--<input id="` + column + `" type="checkbox" class="col form-control bg-transparent text-light shadow-none" style="margin-left:10px" \\>-->
					</div>
					</div>`;

	})

	var submitButton = document.getElementById("mapping-form-btn"); 
	submitButton.innerHTML = "Create Mapping";
	
  }


  private async getTableName(context: Excel.RequestContext): Promise<String> {
	var table = context.workbook.worksheets.getActiveWorksheet().getUsedRange().getTables().getFirst();
	table.load("name");
	await context.sync();
	return table.name;
      }

  private async getColumnNames(context: Excel.RequestContext): Promise<String[]> {
	var table = context.workbook.worksheets.getActiveWorksheet().getUsedRange().getTables().getFirst();
	var columns = table.getHeaderRowRange();
	columns.load("values");
	await context.sync();
	return columns.values[0]; 
  }

  private async addOptions(options: String[], currentColumn?: string) : Promise<String> {
	var str;
	if(this.tableExists){
		options.map(async (column) => {	
			//GET SAVED COLUMN NAMES
			var excelColumn = await indexedDatabase.getColumnMapping(this.tableName, currentColumn);
			//Add selected
			if(excelColumn == column){
				str += `<option selected>` + column + '</option>';
			}
			str += `<option selected>` + column + '</option>';
		})
	}
	options.map(async (option) => {
		str += `<option selected>` + option + '</option>';
	})	
	return str;
  }

  getFormTableName(): String {
	return this.tableName;
  }

  getFormPrimaryKey(): String {
	return this.primaryKey;
  }

  getFormColumnNames(): String[] {
	return this.columnNames;
  }

  getFormWorkgroupID(): String {
	return this.workgroupId;
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

export const mappingForm = new MappingForm();


