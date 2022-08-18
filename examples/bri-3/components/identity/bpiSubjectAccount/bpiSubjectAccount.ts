import { IBpiSubject } from "../bpiSubject/bpiSubject.interface";
import { IBpiSubjectAccount } from "./bpiSubjectAccount.interface";

export class BpiSubjectAccount implements IBpiSubjectAccount {
    id: string; // TODO: Add uuid after #491
    creatorBpiSubject: IBpiSubject;
    ownerBpiSubject: IBpiSubject;
    bpiAccounts: string[]; // TODO: Add as part of #489

    constructor(creatorBpiSubject: IBpiSubject, ownerBpiSubject: IBpiSubject) {
        this.creatorBpiSubject = creatorBpiSubject;
        this.ownerBpiSubject = ownerBpiSubject;
    }
}