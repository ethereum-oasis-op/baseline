import {
  FunctionResult,
  FunctionResultStatus,
  MessageBuilder,
} from "./FunctionResult";
import _ from "lodash";

export const AsyncRoute = (route) => (req, res, next = console.error) => {
  Promise.resolve(route(req, res)).catch(next);
};

export const TestSecurity = (requirements, auth, name) => {
  // test for sign in requirement
  if (requirements.accountRequired === true) {
    if (!auth.account) {
      return MessageBuilder.Error(
        `You must be signed in to call the ${name} method`
      );
    }
  }

  // test for agency login in requirement
  if (requirements.userRequired === true) {
    if (!auth.user) {
      return MessageBuilder.Error(
        `You must be logged into an agency to call the ${name} method`
      );
    }
  }

  if (requirements.accountPermissions) {
    if (_.isArray(requirements.accountPermissions)) {
      if (
        auth.account.HasPermissions(requirements.accountPermissions, false) ===
        false
      ) {
        return MessageBuilder.Authorization(
          `You do not have the required account permissions to call the ${name} method`
        );
      }
    } else if (_.isString(requirements.accountPermissions)) {
      if (
        auth.account.HasPermission(requirements.accountPermissions) === false
      ) {
        return MessageBuilder.Authorization(
          `You do not have the required account permissions to call the ${name} method.`
        );
      }
    } else {
      throw Error("auth.accountPermissions must be string, array, or null");
    }
  }

  if (requirements.userPermissions) {
    if (_.isArray(requirements.userPermissions)) {
      if (
        auth.user.HasPermissions(requirements.userPermissions, false) === false
      ) {
        return MessageBuilder.Authorization(
          `You do not have the required agency user permissions to call the ${name} method`
        );
      }
    } else if (_.isString(requirements.userPermissions)) {
      if (auth.user.HasPermission(requirements.userPermissions) === false) {
        return MessageBuilder.Authorization(
          `You do not have the required agency user permissions to call the ${name} method`
        );
      }
    } else {
      throw Error("auth.userPermissions must be string, array, or null");
    }
  }
};

export const GenericControllerMethod = (cfg) => {
  /* cfg will be
     {
       inputModel: schema to validate as input
       processor: method that will accept function result, the parsed body and return function result, is required
       name: 'name of the method, is required,
       accountPermissions: a list of required permissions or a single permission at the account level,
       accountRequired: is the user required for this method
       userPermissions: a list of required permissions or a single permission at the agency user level,
       userRequired: is the agency required for this method
     }
  */

  const config = _.merge(
    {
      accountRequired: false,
      accountPermissions: null,
    },
    cfg
  );

  return async (req, res) => {
    const ret = FunctionResult.new();
    try {
      const securityError = TestSecurity(
        _.pick(config, "accountRequired", "accountPermissions"),
        _.pick(req.ctx, "account"),
        config.name
      );

      if (securityError) {
        ret.AddMessages([securityError]);
        ret.Status = FunctionResultStatus.Failure;
        res.json(ret);
        return;
      }

      if (_.isObject(config.inputModel) === false) {
        ret.AddMessageError(
          `Invalid controller config for method ${config.name}, must have an input model`
        );
        ret.Status = FunctionResultStatus.Failure;
        res.json(ret);
        return;
      }
      // validate with inputModel passed in
      const inputValue = config.inputModel.new(req.body);

      // process the body
      if (_.isFunction(config.processor) === false) {
        ret.AddMessageError(
          `Invalid controller config for method ${config.name}, must have processor method`
        );
        ret.Status = FunctionResultStatus.Failure;
        res.json(ret);
        return;
      }

      await config.processor(inputValue, ret, req.ctx);
    } catch (err) {
      if (err.name === "ModelErrors") {
        ret.AddMessages(err.Messages);
      } else {
        ret.AddMessageError(err.Message || err.message);
      }
      ret.Status = FunctionResultStatus.Failure;
    }

    res.json(ret);
  };
};
