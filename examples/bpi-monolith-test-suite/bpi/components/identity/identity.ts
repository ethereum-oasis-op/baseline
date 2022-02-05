import { BpiSubject } from "./bpiSubject";
import { IIdentityComponent } from "./identity.interface";

export class IdentityComponent implements IIdentityComponent {
    bpiSubjects: BpiSubject[] = [];
    bpiOwner: BpiSubject;

    addBpiSubject(id: string, name: string): BpiSubject {
        const bpiSubject = new BpiSubject();
        bpiSubject.id = id;
        bpiSubject.name = name;

        this.bpiSubjects.push(bpiSubject);

        return bpiSubject;
    }

    getBpiSubjectById(id: string): BpiSubject {
        const bpiSubjects = this.bpiSubjects.filter(bs => bs.id === id);
        return bpiSubjects[0];
    }

    setOwnerBpiSubject(bpiSubject: BpiSubject): void {
        this.bpiOwner = bpiSubject;
    }

    getOwnerBpiSubject(): BpiSubject {
        return this.bpiOwner;
    }
}