import { Security } from '../../../policy/models/security';
import { Privacy } from '../../../policy/models/privacy';

export class Workstep {
  private id: string; // TODO: Add uuid after #491
  private name: string;
  private version: string;
  private status: string;
  private workgroupId: string;
  private securityPolicy: Security; // TODO Implement security policy inhereted from workgroup #487
  private privacyPolicy: Privacy; // TODO Implement simple privacy policy inhereted from workgroup #487

  constructor(
    id: string,
    name: string,
    version: string,
    status: string,
    workgroupId: string,
    securityPolicy: Security,
    privacyPolicy: Privacy,
  ) {
    this.id = id;
    this.name = name;
    this.version = version;
    this.status = status;
    this.workgroupId = workgroupId;
    this.securityPolicy = securityPolicy;
    this.privacyPolicy = privacyPolicy;
  }
}
