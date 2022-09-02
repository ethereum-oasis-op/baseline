import { Security } from '../../../policy/models/security';
import { Privacy } from '../../../policy/models/privacy';

export class Workstep {

  private id              : string; // TODO: Add uuid after #491
  private name            : string;
  private version         : string;
  private status          : string;
  private workgroupId     : string;
  private securityPolicy  : Security; // TODO Implement security policy inhereted from workgroup #487
  private privacyPolicy   : Privacy; // TODO Implement simple privacy policy inhereted from workgroup #487

  constructor(init:Workstep) {
    Object.assign(this, init);
  }
}
