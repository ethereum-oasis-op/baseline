import { Security } from '../../../policy/models/security';
import { Privacy } from '../../../policy/models/privacy';

export interface IWorkstep {
    name: string;
    id: string; // TODO: Add uuid after #491
    workgroupId: string;
    version: string;
    status: string;
    securityPolicy: Security;
    privacyPolicy: Privacy;
}
