import { Privacy } from '../../../../../components/policy/privacy';
import { Security } from '../../../../../components/policy/security';

export interface IWorkstep {
    name: string;
    id: string; // TODO: Add uuid after #491
    workgroupId: string;
    version: string;
    status: string;
    securityPolicy: Security;
    privacyPolicy: Privacy;
}
