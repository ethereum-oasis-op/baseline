// NOTE: Logic of working with Excel

import { Application, Workflow, Workstep } from "@provide/types";
import { onError } from "../common/common";
import { baseline } from "../baseline/index";
import { ProvideClient } from "src/client/provide-client";
import { MappingForm } from "./mappingForm";
import { encodeForHTML } from "../common/validate";

// eslint-disable-next-line no-unused-vars
/* global Excel, OfficeExtension */

export class ExcelWorker {
  identClient: ProvideClient | null;

  async showWorkgroups(sheetName: string, applications: Application[]): Promise<void> {
    var completelist = document.getElementById("workgroups-list");
    completelist.innerHTML = "";

    applications.map((app) => {
      completelist.innerHTML +=
        `<button type="button" class="list-group-item list-group-item-action" id="` +
        encodeForHTML(app.id) +
        `">` +
        encodeForHTML(app.name) +
        `</button>`;
    });
  }
  async showWorkflows(workflows: Workflow[]): Promise<void> {
    var completelist = document.getElementById("workflows-list");
    completelist.innerHTML = "";

    workflows.map((workflow) => {
      completelist.innerHTML +=
        `<button type="button" class="list-group-item list-group-item-action" id="` +
        encodeForHTML(workflow.id) +
        `">` +
        encodeForHTML(workflow.name) +
        `</button>`;
    });
  }

  async showMappingButton(): Promise<void> {
    var completelist = document.getElementById("workgroup-mapping");
    completelist.innerHTML = "";

    //TO SECURE --> innerHTML https://newbedev.com/xss-prevention-and-innerhtml
    completelist.innerHTML += `<button type="button" class="btn btn-primary btn-sm float-right" id="mapping-btn">Mappings</button>`;
  }

  async showWorksteps(worksteps: Workstep[]): Promise<void> {
    var completelist = document.getElementById("worksteps-list");
    completelist.innerHTML = "";
    worksteps.map((workstep) => {
      completelist.innerHTML +=
        `<button type="button" class="list-group-item list-group-item-action" id="` +
        encodeForHTML(workstep.id) +
        `">` +
        encodeForHTML(workstep.name) +
        `</button>`;
    });
  }

  async createInitialSetup(mappingForm: MappingForm): Promise<unknown> {
    //return baseline.createTableMappings(mappingForm);
    return baseline.createSheetMappings(mappingForm);
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
