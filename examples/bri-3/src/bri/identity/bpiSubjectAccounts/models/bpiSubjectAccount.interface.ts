import { IBpiSubject } from "../../bpiSubjects/models/bpiSubject.interface";
import { IBpiAccount } from "../../bpiAccounts/models/bpiAccount.interface";

export interface IBpiSubjectAccount {
    id: string; // TODO: Add uuid after #491
    creatorBpiSubject: IBpiSubject;
    ownerBpiSubject: IBpiSubject;
    bpiAccounts: IBpiAccount[];
}