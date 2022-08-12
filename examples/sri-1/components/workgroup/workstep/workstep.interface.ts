import { Privacy } from '../policy/privacy';
import { Security } from '../policy/security';
import { Agreement } from '../storage/agreement';

export interface IWorkstep {
    name: string;
    id: string; // TODO: Add uuid after #491
    workgroupId: string;
    version: string;
    status: string;
    businessLogicToExecute: any;
    securityPolicy: Security[];
    privacyPolicy: Privacy[];
    setBusinessLogicToExecute(businessLogicToExecute: any) 
    execute(currentState: Agreement, stateChangeObject: any): string 
}
