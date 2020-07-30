import _ from "lodash";
import { MessageBuilder } from "common-core/FunctionResult";
import { NodeVM } from "vm2";
import * as X12 from "./node-x12/index";
import { CustomSegmentHeaders } from "./node-x12-segmentHeaders/index";

function AddMessageError(results) {
  return (text, section) => {
    results.push(MessageBuilder.Error(text, section));
  };
}

function AddMessageRule(results) {
  return (text, field, section) => {
    results.push(MessageBuilder.Rule(text, field, section));
  };
}

export class EDIGenerateScriptRunner {
  constructor(script = "", data = {}, messageId = "") {
    this.script = script;
    this.data = data;
    this.messages = [];
    this.result = "";

    const matchHeaders = CustomSegmentHeaders[`H${messageId}`];
    this.segmentHeaders = matchHeaders || X12.StandardSegmentHeaders || [];
  }

  process() {
    this.messages = [];
    this.result = "";

    if (_.isString(this.script) === false) {
      AddMessageError(this.messages)("Script can not be empty");
      return false;
    }

    const messages = [];

    const interchange = new X12.X12Interchange();

    const vm = new NodeVM({
      sandbox: {
        AddMessageRule: AddMessageRule(messages),
        AddMessageError: AddMessageError(messages),
        data: this.data,
        edi: interchange,
      },
      require: {
        external: ["lodash", "node-x12", "moment"],
        mock: {
          "node-x12": X12,
        },
      },
    });

    try {
      const fullScript = `
            const _ = require('lodash')
            const { X12Interchange, X12FunctionalGroup, X12Transaction, X12Segment, X12Element } = require('node-x12')
            const moment = require('moment')
            ${this.script}`;
      vm.run(fullScript, __filename);
      this.messages = messages;
      // convert interchange to edi string
      const generator = new X12.X12Generator(interchange.toJSEDINotation(), {
        segmentHeaders: this.segmentHeaders,
      });
      this.result = generator.toString();
      return true;
    } catch (error) {
      AddMessageError(this.messages)(error.message);
      return false;
    }
  }
}
