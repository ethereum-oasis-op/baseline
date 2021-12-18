import { Agreement } from "../../agreement";
import { Transaction } from "../../transaction";
import { IStorageComponent } from "../storage/storage.interface";
import { IWorkGroupComponent } from "../workgroup/workgroup.interface";
import { IVirtualStateMachineComponent } from "./vsm.interface";


export class VirtualStateMachine implements IVirtualStateMachineComponent {
    storageComponent: IStorageComponent;
    workgroupComponent: IWorkGroupComponent;

    constructor(storageComponent: IStorageComponent, workgroupComponent: IWorkGroupComponent) {
        this.storageComponent = storageComponent;
        this.workgroupComponent = workgroupComponent;
    }
    
    executeTransaction(transaction: Transaction): string {
        // TODO: Poor man's deep copy - change
        const latestAgrementState = this.storageComponent.getAgreementState();
        const originalAgreementState = JSON.parse(JSON.stringify(latestAgrementState));

        const workgroup = this.workgroupComponent.getWorkgroupById(transaction.workgroupId);
        const workstep = workgroup.getWorkstepById(transaction.workstepId);

        // If succesfull, this changes the agreement state
        const workstepResult = workstep.execute(latestAgrementState, transaction.stateObject);

        if (!workstepResult) {
            return "err: workstep execution failed to satisfy the agreement.";
        }

        // TODO: Should this be in the workstep execution?
        const workstepStateChangeProof = this.createProof(originalAgreementState, latestAgrementState, transaction.ownerSignature);
        // TODO: Do not change the agreement directly
        latestAgrementState.proofs.push(workstepStateChangeProof);

        return workstepStateChangeProof;
    }

    createProof(agreementPreviousState: Agreement, proposedChanges: Agreement, signature: string): string {
        return Math.random().toString(36).substr(2, 20);
    }
}