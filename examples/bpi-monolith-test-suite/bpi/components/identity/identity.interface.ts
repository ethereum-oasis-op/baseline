import { BpiSubject } from "./bpiSubject";

export interface IIdentityComponent {
    addBpiSubject(id: string, name: string): BpiSubject;
    getBpiSubjectById(id: string): BpiSubject;
    setOwnerBpiSubject(bpiSubject: BpiSubject): void;
    getOwnerBpiSubject(): BpiSubject;
}
