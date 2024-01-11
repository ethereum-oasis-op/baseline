import { Injectable } from '@nestjs/common';
import {
    BpiAccount as BpiAccountPrismaModel,
    BpiAccountStateTreeLeafValue as BpiAccountStateTreeLeafValuePrismaModel,
    BpiMerkleTree as BpiMerkleTreePrismaModel,
    Message as BpiMessagePrismaModel,
    BpiSubjectAccount as BpiSubjectAccountPrismaModel,
    BpiSubject as BpiSubjectPrismaModel,
    BpiSubjectRole as BpiSubjectRolePrismaModel,
    Transaction as TransactionPrismaModel,
    Workflow as WorkflowPrismaModel,
    Workgroup as WorkgroupPrismaModel,
    Workstep as WorkstepPrismaModel
} from '@prisma/client';
import { BpiMessage } from '../src/bri/communication/models/bpiMessage';
import { BpiSubjectAccount } from '../src/bri/identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { BpiSubject } from '../src/bri/identity/bpiSubjects/models/bpiSubject';
import { BpiSubjectRole } from '../src/bri/identity/bpiSubjects/models/bpiSubjectRole';
import { BpiMerkleTree } from '../src/bri/merkleTree/models/bpiMerkleTree';
import { BpiAccount } from '../src/bri/state/bpiAccounts/models/bpiAccount';
import { StateTreeLeafValueContent } from '../src/bri/state/models/stateTreeLeafValueContent';
import { Transaction } from '../src/bri/transactions/models/transaction';
import { Workflow } from '../src/bri/workgroup/workflows/models/workflow';
import { Workgroup } from '../src/bri/workgroup/workgroups/models/workgroup';
import { Workstep } from '../src/bri/workgroup/worksteps/models/workstep';
import { MerkleTreeService } from '../src/bri/merkleTree/services/merkleTree.service';
import MerkleTree from 'merkletreejs';

// We do mapping from prisma models to domain objects using simple Object.assign
// since automapper is not happy working with types, which is how Prisma generates database entities.
// For these mappings to work, the convention is that the domain objects have the same properties as the
// prisma models. In case there is a need to do something custom during mapping, it can be implemented 
// in the appropriate method below. 

interface IConstructor<T> {
    new (...args: any[]): T;
}

@Injectable()
export class PrismaMapper {

    constructor(private readonly merkleTreeService: MerkleTreeService) { }

    public mapBpiSubjectPrismaModelToDomainObject(source: BpiSubjectPrismaModel): BpiSubject {
        const target = this.activator(BpiSubject);

        Object.assign(target, source);

        return target;
    }

    public mapBpiSubjectRolePrismaModelToDomainObject(source: BpiSubjectRolePrismaModel): BpiSubjectRole {
        const target = this.activator(BpiSubjectRole);

        Object.assign(target, source);

        return target;
    }

    public mapBpiMessagePrismaModelToDomainObject(source: BpiMessagePrismaModel): BpiMessage {
        const target = this.activator(BpiMessage);

        Object.assign(target, source);

        return target;
    }

    public mapBpiAccountPrismaModelToDomainObject(source: BpiAccountPrismaModel): BpiAccount {
        const target = this.activator(BpiAccount);

        Object.assign(target, source);

        return target;
    }

    public mapBpiAccountStateTreeLeafValuePrismaModelToDomainObject(source: BpiAccountStateTreeLeafValuePrismaModel): StateTreeLeafValueContent {
        const target = this.activator(StateTreeLeafValueContent);

        Object.assign(target, source);

        return target;
    }

    public mapBpiSubjectAccountPrismaModelToDomainObject(source: BpiSubjectAccountPrismaModel): BpiSubjectAccount {
        const target = this.activator(BpiSubjectAccount);

        Object.assign(target, source);

        return target;
    }

    public mapTransactionPrismaModelToDomainObject(source: TransactionPrismaModel): Transaction {
        const target = this.activator(Transaction);

        Object.assign(target, source);

        return target;
    }

    public mapWorkflowPrismaModelToDomainObject(source: WorkflowPrismaModel): Workflow {
        const target = this.activator(Workflow);

        Object.assign(target, source);

        return target;
    }

    public mapWorkgroupPrismaModelToDomainObject(source: WorkgroupPrismaModel): Workgroup {
        const target = this.activator(Workgroup);

        Object.assign(target, source);

        return target;
    }

    public mapWorkstepPrismaModelToDomainObject(source: WorkstepPrismaModel): Workstep {
        const target = this.activator(Workstep);

        Object.assign(target, source);

        return target;
    }

    public mapBpiMerkleTreePrismaModelToDomainObject(source: BpiMerkleTreePrismaModel): BpiMerkleTree {
        const target = this.activator(BpiMerkleTree);

        Object.assign(target, source);

        target.tree = MerkleTree.unmarshalTree(
            source.tree,
            this.merkleTreeService.createHashFunction(source.hashAlgName)
        )

        return target;
    }

    private activator<T>(type: IConstructor<T>): T {
        return new type();
    }
}