import { Privacy } from 'src/bri/policy/models/privacy';
import { Security } from 'src/bri/policy/models/security';

export class CreateWorkstepDto {
  name: string;
  version: string;
  status: string;
  workgroupId: string;
  securityPolicy: Security;
  privacyPolicy: Privacy;
}
