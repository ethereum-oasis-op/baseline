import { Security } from '../../../policy/models/security';
import { Privacy } from '../../../policy/models/privacy';

export class Workstep {

  id              : string; // TODO: Add uuid after #491
  name            : string;
  version         : string;
  status          : string;
  workgroupId     : string;
  securityPolicy  : Security; // TODO Implement security policy inhereted from workgroup #487
  privacyPolicy   : Privacy; // TODO Implement simple privacy policy inhereted from workgroup #487

  constructor(init:Workstep) {
    Object.assign(this, init);
  }
}
