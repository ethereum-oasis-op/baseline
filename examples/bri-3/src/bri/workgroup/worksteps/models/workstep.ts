import { IWorkstep } from './workstep.interface';
import { Security } from '../../../policy/models/security';
import { Privacy } from '../../../policy/models/privacy';

export class Workstep implements IWorkstep {
  id: string; // TODO: Add uuid after #491
  name: string;
  workgroupId: string;
  version: string;
  status: string;
  securityPolicy: Security; // TODO Implement security policy inhereted from workgroup #487
  privacyPolicy: Privacy; // TODO Implement simple privacy policy inhereted from workgroup #487

  constructor(name: string, id: string, workgroupId: string) {
    this.name = name;
    this.id = id;
    this.workgroupId = workgroupId;
  }
}
