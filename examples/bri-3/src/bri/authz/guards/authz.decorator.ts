import { SetMetadata } from '@nestjs/common';

export const CHECK_AUTHZ = 'check_authz';

export interface IRequirement {
  action: any;
  subject?: any;
}

export const CheckAuthz = (...requirements: IRequirement[]) =>
  SetMetadata(CHECK_AUTHZ, requirements);
