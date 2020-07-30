import { GenericControllerMethod } from "common-core/Controller";
import { FunctionResultStatus } from "common-core/FunctionResult";
import { EDIParseRequestInfo } from "./Models/index";
import { EDIParseScriptRunner } from "common-core/ScriptRunners/EDIParseScriptRunner";

export const EDIParse = GenericControllerMethod({
  name: "EDIParse",
  inputModel: EDIParseRequestInfo,
  processor: async function (requestInfo, ret, config) {
    const runner = new EDIParseScriptRunner(
      requestInfo.Script,
      requestInfo.EDI,
      requestInfo.MessageId
    );

    if (runner.process() === true) {
      ret.AddMessages(runner.messages);
      ret.ReturnValue = runner.result;
      ret.Status = FunctionResultStatus.Success;
    } else {
      ret.AddMessages(runner.messages);
      ret.Status = FunctionResultStatus.Failure;
    }
  },
});

export default EDIParse;
