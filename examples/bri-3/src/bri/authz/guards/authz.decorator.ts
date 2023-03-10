import { SetMetadata } from '@nestjs/common';

export const CHECK_AUTHZ_METADATA_KEY = 'check_authz';

export interface IRequirement {
  action: string;
  type: string;
}

export const CheckAuthz = (...requirements: IRequirement[]) =>
  SetMetadata(CHECK_AUTHZ_METADATA_KEY, requirements);
