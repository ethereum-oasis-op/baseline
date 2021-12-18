import { BpiSubject } from "./bpiSubject";

export interface IIdentityComponent {
    addOrganization(id: string, name: string): BpiSubject;
    getOrganizationById(id: string): BpiSubject;
    setOwnerOrganization(org: BpiSubject): void;
    getOwnerOrganization(): BpiSubject;
}