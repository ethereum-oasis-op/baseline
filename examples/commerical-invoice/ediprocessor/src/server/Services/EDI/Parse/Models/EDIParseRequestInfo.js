import { Joi, ValidationNew } from "common-core/Validation";

export const EDIParseRequestInfo = Joi.object({
  EDI: Joi.string().required(),
  Script: Joi.string().required(),
  MessageId: Joi.string().required(),
});

EDIParseRequestInfo.new = ValidationNew(EDIParseRequestInfo);
