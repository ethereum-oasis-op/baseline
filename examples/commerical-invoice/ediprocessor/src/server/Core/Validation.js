import _ from "lodash";
import { MessageBuilder } from "./FunctionResult";
import * as queryString from "query-string";

export const JoiCore = require("@hapi/joi");
const JoiMoment = require("@meanie/joi-moment");

export const Joi = JoiCore.extend(JoiMoment);

export const ConvertValidationErrorDetails = (details, section = "") => {
  return _.map(details, (d) => {
    const msg = d.message;
    const pth = d.context.label;

    if (_.startsWith(msg, '"value" failed custom validation because ')) {
      const errorMessage = msg.substring(41);
      const errorMessageParts = _.split(errorMessage, "?PARAMS?");
      const messageParameters =
        errorMessageParts.length > 1
          ? queryString.parse(errorMessageParts[1])
          : {};
      const messageText = errorMessageParts[0];

      if (messageParameters.path) {
        const pathParts = _.split(pth, ".");
        pathParts.pop();
        pathParts.push(messageParameters.path);
        return MessageBuilder.Rule(
          messageText,
          _.join(pathParts, "."),
          section
        );
      } else if (pth) {
        return MessageBuilder.Rule(messageText, pth, section);
      } else {
        return MessageBuilder.Error(messageText, section);
      }
    } else {
      return MessageBuilder.Rule(d.message, pth, section);
    }
  });
};

export const ValidationNew = (
  SchemaConstructor,
  defaultValues,
  beforeCreate,
  extendWith
) => {
  return (
    fromData,
    options = {
      abortEarly: false,
      stripUnkown: true, // will remove any props that do not match the model
    }
  ) => {
    let data = _.clone(fromData);

    if (defaultValues) {
      data = _.merge({}, defaultValues, fromData);
    }

    if (_.isFunction(beforeCreate)) {
      beforeCreate(data);
    }

    const valResults = SchemaConstructor.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (valResults.error) {
      const modelError = new Error("Model Exception!");
      modelError.name = "ModelErrors";

      // const frame = modelError.stack.split('\n')[2]
      // const lineNumber = frame.split(':')[1]
      // const functionName = frame.split(' ')[5]

      modelError.Messages = ConvertValidationErrorDetails(
        valResults.error.details
      );
      modelError.message =
        "Model Exception! " +
        "/r/n" +
        _.join(
          _.map(
            modelError.Messages,
            (m) => `Type: ${m.Type}, Message: ${m.Message}, Field: ${m.Field}`
          ),
          "/r/n"
        );
      throw modelError;
    } else {
      if (extendWith) {
        _.extend(valResults.value, extendWith);
      }
      return valResults.value;
    }
  };
};
