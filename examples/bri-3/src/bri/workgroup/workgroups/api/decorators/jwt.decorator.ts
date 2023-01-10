import { createParamDecorator } from '@nestjs/common';

export const JWT = createParamDecorator((req) => {
  return req.header.authentication;
});
