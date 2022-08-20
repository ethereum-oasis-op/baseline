import { Privacy } from '../../policy/privacy';
import { Security } from '../../policy/security';

export interface IWorkstep {
    name: string;
    id: string; // TODO: Add uuid after #491
    workgroupId: string;
    version: string;
    status: string;
    securityPolicy: Security;
    privacyPolicy: Privacy;
}
