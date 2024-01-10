import { Injectable } from '@nestjs/common';
import {
    BpiAccount as BpiAccountPrismaModel,
    BpiAccountStateTreeLeafValue as BpiAccountStateTreeLeafValuePrismaModel,
    Message as BpiMessagePrismaModel,
    BpiSubjectAccount as BpiSubjectAccountPrismaModel,
    BpiSubject as BpiSubjectPrismaModel,
    BpiSubjectRole as BpiSubjectRolePrismaModel,
    Transaction as TransactionPrismaModel,
    Workflow as WorkflowPrismaModel
} from '@prisma/client';
import { BpiMessage } from '../src/bri/communication/models/bpiMessage';
import { BpiSubjectAccount } from '../src/bri/identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { BpiSubject } from '../src/bri/identity/bpiSubjects/models/bpiSubject';
import { BpiSubjectRole } from '../src/bri/identity/bpiSubjects/models/bpiSubjectRole';
import { BpiAccount } from '../src/bri/state/bpiAccounts/models/bpiAccount';
import { StateTreeLeafValueContent } from '../src/bri/state/models/stateTreeLeafValueContent';
import { Transaction } from '../src/bri/transactions/models/transaction';
import { Workflow } from '../src/bri/workgroup/workflows/models/workflow';

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

    private activator<T>(type: IConstructor<T>): T {
        return new type();
    }
}