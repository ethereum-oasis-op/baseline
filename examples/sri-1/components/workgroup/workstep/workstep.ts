import { IWorkstep } from "./workstep.interface";
import { Agreement } from '../storage/agreement';
import { Security } from "../policy/security";
import { Privacy } from "../policy/privacy";
import { WorkgroupComponent } from "../workgroup/workgroupComponent.service";

export class Workstep implements IWorkstep {
    name: string;
    id: string; // TODO: Add uuid after #491
    workgroupId: string;
    version: string;
    status: string;
    securityPolicy: Security; // TODO Implement simple security policy #487
    privacyPolicy: Privacy; // TODO Implement simple privacy policy #487

    constructor(name: string, id: string, workgroupId: string) {
        this.name = name;
        this.id = id;
        this.workgroupId = workgroupId;
        const workgroup = new WorkgroupComponent().getWorkgroupById(id);
        this.securityPolicy = workgroup.securityPolicy;
        this.privacyPolicy = workgroup.privacyPolicy;
    }
}