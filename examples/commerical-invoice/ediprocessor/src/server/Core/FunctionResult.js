import { Joi, ValidationNew } from "common-core/Validation";

export const FunctionResultMessageTypes = {
  Info: "Info",
  Warning: "Warning",
  Error: "Error",
  Authentication: "Authentication",
  Rule: "Rule",
  Authorization: "Authorization",
  ModelFieldTypeError: "ModelFieldTypeError",
};

export const FunctionResultStatus = {
  Success: "Success",
  Failure: "Failure",
};

export const FunctionResultMessage = Joi.object({
  Type: Joi.string().valid(
    FunctionResultMessageTypes.Info,
    FunctionResultMessageTypes.Warning,
    FunctionResultMessageTypes.Error,
    FunctionResultMessageTypes.Authentication,
    FunctionResultMessageTypes.Rule,
    FunctionResultMessageTypes.ModelFieldTypeError,
    FunctionResultMessageTypes.Authorization
  ),
  Message: Joi.string().required(),
  Field: Joi.string(),
  Section: Joi.string().allow("").allow(null),
}).custom((v, h) => {
  if (v.Type === FunctionResultMessageTypes.Rule) {
    if (!v.Field) {
      throw Error("If type is rule, you must set the Field property");
    }
  } else {
    if (v.Field) {
      throw Error("If type is not rule, you can not set the Field property");
    }
  }
  return v;
});

FunctionResultMessage.new = ValidationNew(FunctionResultMessage, {
  Type: FunctionResultMessageTypes.Error,
  Message: "???",
});

export const FunctionResult = Joi.object({
  Messages: Joi.array().items(FunctionResultMessage),
  Status: Joi.string().valid(
    ...[FunctionResultStatus.Success, FunctionResultStatus.Failure]
  ),
  ReturnValue: Joi.any(),
  ExtraData: Joi.any(),
  isFR: Joi.boolean().default(true),
}).custom((v, h) => {
  if (v.Status === FunctionResultStatus.Failure) {
    if (v.Messages.length === 0) {
      throw Error(
        "If status is Failure, you must add something to the Messages property"
      );
    }
  }
  return v;
});

FunctionResult.new = ValidationNew(
  FunctionResult,
  {
    Status: FunctionResultStatus.Success,
    Messages: [],
    ExtraData: {},
    isFR: true,
  },
  undefined,
  {
    AddMessageError: function (message, section) {
      this.Messages.push({
        Message: message,
        Type: FunctionResultMessageTypes.Error,
        Section: section,
      });
      this.Status = FunctionResultStatus.Failure;
    },

    AddMessages: function (messages) {
      for (var m of messages) {
        try {
          this.Messages.push(m);
        } catch (err) {
          console.log(err.message);
        }
      }
    },

    AddMessageWarning: function (message, section) {
      this.Messages.push({
        Message: message,
        Type: FunctionResultMessageTypes.Warning,
        Section: section,
      });
    },

    AddMessageInfo: function (message, section) {
      this.Messages.push({
        Message: message,
        Type: FunctionResultMessageTypes.Info,
        Section: section,
      });
    },

    AddMessageRule: function (message, field, section) {
      this.Messages.push({
        Message: message,
        Type: FunctionResultMessageTypes.Rule,
        Field: field,
        Section: section,
      });
      this.Status = FunctionResultStatus.Failure;
    },

    AddMessageAuthorization: function (message) {
      this.Messages.push({
        Message: message,
        Type: FunctionResultMessageTypes.Authorization,
      });
      this.Status = FunctionResultStatus.Failure;
    },

    AddMessageAuthentication: function (message) {
      this.Messages.push({
        Message: message,
        Type: FunctionResultMessageTypes.Authentication,
      });
      this.Status = FunctionResultStatus.Failure;
    },

    AddMessageModelFieldTypeError: function (message) {
      this.Messages.push({
        Message: message,
        Type: FunctionResultMessageTypes.ModelFieldTypeError,
      });
    },
  }
);

export const MessageBuilder = {
  Error: function (message, section) {
    return FunctionResultMessage.new({
      Message: message,
      Type: FunctionResultMessageTypes.Error,
      Section: section,
    });
  },

  Warning: function (message, section) {
    return FunctionResultMessage.new({
      Message: message,
      Type: FunctionResultMessageTypes.Warning,
      Section: section,
    });
  },

  Info: function (message, section) {
    return FunctionResultMessage.new({
      Message: message,
      Type: FunctionResultMessageTypes.Info,
      Section: section,
    });
  },

  Rule: function (message, field, section) {
    return FunctionResultMessage.new({
      Message: message,
      Type: FunctionResultMessageTypes.Rule,
      Field: field,
      Section: section,
    });
  },

  Authorization: function (message) {
    return FunctionResultMessage.new({
      Message: message,
      Type: FunctionResultMessageTypes.Authorization,
    });
  },

  Authentication: function (message) {
    return FunctionResultMessage.new({
      Message: message,
      Type: FunctionResultMessageTypes.Authentication,
    });
  },

  ModelFieldTypeError: function (message) {
    return FunctionResultMessage.new({
      Message: message,
      Type: FunctionResultMessageTypes.ModelFieldTypeError,
    });
  },
};
