import { BpiSubject } from '../../bpiSubjects/models/bpiSubject';

export class BpiSubjectAccount {
    private id: string; // TODO: Add uuid after #491
    private creatorBpiSubject: BpiSubject;
    private ownerBpiSubject: BpiSubject;
    private bpiAccounts: string[]; // TODO: Add as part of #489

    constructor(
        id: string, 
        creatorBpiSubject: BpiSubject, 
        ownerBpiSubject: BpiSubject) {
            this.id = id
            this.creatorBpiSubject = creatorBpiSubject
            this.ownerBpiSubject = ownerBpiSubject
    }
}
