import { BpiSubject } from "./bpiSubject";
import { Workgroup } from "./workgroup";

export class BPI {
    organizations: BpiSubject[] = [];
    workgroups: Workgroup[] = [];

    // Used to register a new organization with the BPI and the external registry
    addOrganization(id: string, name: string): BpiSubject {
        const organization = new BpiSubject();
        organization.id = id;    
        organization.name = name;    

        this.organizations.push(organization);

        return organization;
    }

    // Retrieves the organization/BpiSubject's details 
    getOrganizationById(id: string): BpiSubject {
        const orgs = this.organizations.filter(org => org.id === id);

        return orgs[0];
    }

    addWorkgroup(id: string, name: string): Workgroup {

        const workgroup = new Workgroup() ;

        workgroup.id = id;
        workgroup. name = name;

        this.workgroups.push(workgroup);

        return workgroup;
    }

    getWorkgroupById(id: string): Workgroup {
        const workgroups = this.workgroups.filter(workgroup => workgroup.id === id);

        return workgroups[0];
    }

}
