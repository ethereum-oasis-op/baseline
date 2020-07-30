import { Joi, ValidationNew } from "common-core/Validation";

export const EDIGenerateRequestInfo = Joi.object({
  Data: Joi.any().required(),
  Script: Joi.string().required(),
  MessageId: Joi.string().required(),
});

EDIGenerateRequestInfo.new = ValidationNew(EDIGenerateRequestInfo);
