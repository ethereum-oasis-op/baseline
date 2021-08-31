// NOTE: Logic of working with Excel

import { Application} from "@provide/types";
import { onError } from "../common/common";
import { baseline } from "../baseline/index";
import { ProvideClient } from "src/client/provide-client";
import { MappingForm } from "./mappingForm";


// eslint-disable-next-line no-unused-vars
/* global Excel, OfficeExtension */

export class ExcelWorker {

  identClient: ProvideClient | null;

  async showWorkgroups(sheetName: string, applications: Application[]): Promise<void> {
    var completelist= document.getElementById("workgroups-list");
    completelist.innerHTML = "";
    
     
    applications.map((app) => {
      completelist.innerHTML += `<button type="button" class="list-group-item list-group-item-action" id="` + app.id + `">` + app.name + `</button>`;
    });
    
  }

  async createInitialSetup(mappingForm: MappingForm): Promise<unknown> {
    return baseline.createTableMappings(mappingForm);
  }

  startBaselineService(identClient: ProvideClient): Promise<void> {
    return baseline.startToSendAndReceiveProtocolMessage(identClient);
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

export const excelWorker = new ExcelWorker();

// function test() {
//   Excel.run((context) => {
//     const cursheet = context.workbook.worksheets.getActiveWorksheet();
//     const cellA1_A2 = cursheet.getRange("A1:A3");

//     // const value = new Date(); // identClient.test_ExpiresAt();
//     const value = identClient?.test_expiresAt;
//     cellA1_A2.values = [[ value ], [ new Date() ], [ identClient?.isExpired ]];
//     cellA1_A2.format.autofitColumns();

//     return context.sync();
//   })
//   .catch(function(error) {
//     console.log("Error: " + error);
//     if (error instanceof OfficeExtension.Error) {
//       console.log("Debug info: " + JSON.stringify(error.debugInfo));
//       onError(error.message);
//     } else {
//       onError(error);
//     }
//   })
// }
