import { BpiSubject } from '../../bpiSubjects/models/bpiSubject';

export class BpiSubjectAccount {
    private id: string; // TODO: Add uuid after #491
    private creatorBpiSubject: BpiSubject;
    private ownerBpiSubject: BpiSubject;
    private bpiAccounts: string[]; // TODO: Add as part of #489

    constructor(init: BpiSubjectAccount) {
        Object.assign(this, init);
    }
}
