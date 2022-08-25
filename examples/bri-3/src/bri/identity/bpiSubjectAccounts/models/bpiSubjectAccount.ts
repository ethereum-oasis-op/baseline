import { IBpiSubject } from "../../bpiSubjects/models/bpiSubject.interface";
import { IBpiSubjectAccount } from "./bpiSubjectAccount.interface";
import { IBpiAccount } from "../bpiAccount/bpiAccount.interface";

export class BpiSubjectAccount implements IBpiSubjectAccount {
    id: string; // TODO: Add uuid after #491
    creatorBpiSubject: IBpiSubject;
    ownerBpiSubject: IBpiSubject;
    bpiAccounts: IBpiAccount[];

    constructor(creatorBpiSubject: IBpiSubject, ownerBpiSubject: IBpiSubject) {
        this.creatorBpiSubject = creatorBpiSubject;
        this.ownerBpiSubject = ownerBpiSubject;
    }
}