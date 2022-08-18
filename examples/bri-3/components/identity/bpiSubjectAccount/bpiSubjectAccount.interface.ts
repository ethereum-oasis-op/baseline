import { IBpiSubject } from "../bpiSubject/bpiSubject.interface";

export interface IBpiSubjectAccount {
    id: string; // TODO: Add uuid after #491
    creatorBpiSubject: IBpiSubject;
    ownerBpiSubject: IBpiSubject;
    bpiAccounts: string[]; // TODO: Add as part of #489
}