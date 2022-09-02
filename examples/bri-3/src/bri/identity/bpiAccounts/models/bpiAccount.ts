import { IBpiAccount } from "./bpiAccount.interface";

export class BpiAccount implements IBpiAccount {
    id: string; // TODO: Add uuid after #491
    nonce: string;
    ownerBpiSubjectIds: string[];

    constructor(nonce: string, ownerBpiSubjectIds: string[]) {
        this.nonce = nonce;
        this.ownerBpiSubjectIds = ownerBpiSubjectIds;
    }
}