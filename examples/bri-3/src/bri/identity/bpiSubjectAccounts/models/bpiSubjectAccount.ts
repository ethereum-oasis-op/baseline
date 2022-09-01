import { BpiSubject } from '../../bpiSubjects/models/bpiSubject';

export class BpiSubjectAccount {
    id: string; // TODO: Add uuid after #491
    creatorBpiSubject: BpiSubject;
    ownerBpiSubject: BpiSubject;
    bpiAccounts: string[]; // TODO: Add as part of #489

    constructor(init: BpiSubjectAccount) {
        Object.assign(this, init);
    }
}
