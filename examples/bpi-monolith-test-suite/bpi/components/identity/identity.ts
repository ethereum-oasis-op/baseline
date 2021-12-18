import { BpiSubject } from "../../bpiSubject";
import { IIdentityComponent } from "./identity.interface";

export class IdentityComponent implements IIdentityComponent {
    organizations: BpiSubject[] = [];

    addOrganization(id: string, name: string): BpiSubject {
        const organization = new BpiSubject();
        organization.id = id;
        organization.name = name;

        this.organizations.push(organization);

        return organization;
    }

    getOrganizationById(id: string): BpiSubject {
        const orgs = this.organizations.filter(org => org.id === id);
        return orgs[0];
    }
}