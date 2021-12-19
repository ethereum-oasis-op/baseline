import { excelAPI } from "./api";
import { outboundMessage } from "./outbound";
import { inboundMessage } from "./inbound";
import { onError } from "../common/common";
import { ProvideClient } from "src/client/provide-client";
import { NatsClientFacade as NatsClient } from "../client/nats-listener";
import { ProtocolMessage } from "../models/protocolMessage";
import { MappingForm } from "../taskpane/mappingForm";

// eslint-disable-next-line no-unused-vars
/* global Excel, Office, OfficeExtension */

export class Baseline {
  _identClient: ProvideClient;
  _natsClient: NatsClient;

  //Initialize baseline
  async createTableMappings(mappingForm: MappingForm): Promise<unknown> {
    return await Excel.run(async (context: Excel.RequestContext) => {
      await excelAPI.createTableListener(context).then(async (tableName) => {
        var button = document.getElementById("mapping-form-btn").innerHTML;

        if (button == "Create Mapping") {
          await excelAPI.createMappings(this._identClient, mappingForm, tableName);
        } else {
          await excelAPI.saveMappings(mappingForm);
        }
      });
      await context.sync();
      await excelAPI.changeButtonColor();
    }).catch(this.catchError);
  }

  async createSheetMappings(mappingForm: MappingForm): Promise<unknown> {
    return await Excel.run(async (context: Excel.RequestContext) => {
      await excelAPI.createSheetListener(context).then(async (sheetName) => {
        var button = document.getElementById("mapping-form-btn").innerHTML;

        if (button == "Create Mapping") {
          await excelAPI.createMappings(this._identClient, mappingForm, sheetName);
        } else {
          await excelAPI.saveMappings(mappingForm);
        }
      });
      await context.sync();
      await excelAPI.changeButtonColor();
    }).catch(this.catchError);
  }

  //Start the Baseline Service after login
  async startToSendAndReceiveProtocolMessage(identClient: ProvideClient): Promise<void> {
    try {
      //Activate listeners on table or sheet
      await this.activateListeners();

      //Set Provide client for sending messages
      this._identClient = identClient;

      //Connect to Nats for receiving messages
      if (!this._natsClient) {
        //PROBLEM
        console.log("Connecting to Nats");
        await this._identClient.connectNatsClient();
        console.log("Connected to Nats");
        this._natsClient = this._identClient.natsClient;
      }

      //Subscribe
      this.receiveMessage();

      return;
    } catch {
      this.catchError;
    }
  }

  sendMessage(changedData: Excel.TableChangedEventArgs | Excel.WorksheetChangedEventArgs): void {
    Excel.run((context: Excel.RequestContext) => {
      outboundMessage.send(context, changedData, this._identClient);
      return context.sync();
    }).catch(this.catchError);
  }

  receiveMessage(): void {
    try {
      this._natsClient.subscribe("baseline.>", (msg: ProtocolMessage) => {
        Excel.run((context: Excel.RequestContext) => {
          if (msg.constructor == Object) {
            inboundMessage.updateExcelTable(context, msg);
          }
          return context.sync();
        }).catch(this.catchError);
      });
    } catch {
      this.catchError;
    }
  }

  private async activateListeners(): Promise<unknown> {
    return Excel.run(async (context: Excel.RequestContext) => {
      //Activate either the table or sheet listener
      //CLOSED -> await excelAPI.addTableListener(context);
      await excelAPI.addSheetListener(context);
      return context.sync();
    }).catch(this.catchError);
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

export const baseline = new Baseline();
