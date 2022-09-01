import { IBpiAccount } from "./bpiAccount.interface";

export class BpiAccount implements IBpiAccount {
    id: string; // TODO: Add uuid after #491
    nonce: number;
    ownerBpiSubjectId: string;

    constructor(nonce: number, ownerBpiSubjectId: string) {
        this.nonce = nonce;
        this.ownerBpiSubjectId = ownerBpiSubjectId;
    }
}