import { GenericControllerMethod } from "common-core/Controller";
import { FunctionResultStatus } from "common-core/FunctionResult";
import { EDIGenerateRequestInfo } from "./Models/index";
import { EDIGenerateScriptRunner } from "common-core/ScriptRunners/EDIGenerateScriptRunner";

export const EDIGenerate = GenericControllerMethod({
  name: "EDIGenerate",
  inputModel: EDIGenerateRequestInfo,
  processor: async function (requestInfo, ret, config) {
    const runner = new EDIGenerateScriptRunner(
      requestInfo.Script,
      requestInfo.Data,
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

export default EDIGenerate;
