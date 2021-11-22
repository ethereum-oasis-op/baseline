import { BPI }  from '../bpi/bpi';
import { expect } from 'chai';
import { Agreement } from '../bpi/agreement';
import { Workstep } from '../bpi/workstep';


describe('Org and Workgroup setup', () => {
    it('Alice initiates a new BPI with organization details', () => {        
        const aliceBpi = new BPI("AL1", "Alice Organization");

        expect(aliceBpi.getOrganizationById("AL1").name).equal("Alice Organization");
    });

    it('Alice searches for a new organization that does not exist', () => {
        const aliceBpi = new BPI("BO1", "Bob Organization");

        expect(aliceBpi.getOrganizationById("EV1")).to.be.undefined;
    });

    it('Alice creates a simple workgroup and her organization is automatically added', () => {
        const aliceBpi = new BPI("AL1", "Alice Organization");
        const workgroup = aliceBpi.addWorkgroup('123','MyWorkgroup', null, null);
        
        expect(aliceBpi.getWorkgroupById(workgroup.id).name).is.equal(workgroup.name);

        expect(aliceBpi.getWorkgroupById(workgroup.id).participants[0]).is.equal(aliceBpi.owner);
    });

    it('Alice creates a simple workgroup with agreement and worksteps', () => {
        const aliceBpi = new BPI("AL1", "Alice Organization");
        
        const agreement = new Agreement();
        
        const workstep1 = new Workstep("WRKSTP1", "Order type check");
        workstep1.agreementFunction = agreement.isOrder;
        
        const workstep2 = new Workstep("WRKSTP2", "Order price check");
        workstep2.agreementFunction = agreement.orderPriceIsGreater;
        
        const workgroup = aliceBpi.addWorkgroup('123','MyWorkgroup', agreement, [workstep1, workstep2]);
        
        const createdWorkgroup = aliceBpi.getWorkgroupById(workgroup.id);
        
        expect(createdWorkgroup.name).is.equal(workgroup.name);
        expect(createdWorkgroup.agreement).is.equal(agreement);
        expect(createdWorkgroup.worksteps[0]).is.equal(workstep1);
        expect(createdWorkgroup.worksteps[1]).is.equal(workstep2);
    });

    it('Alice searches for a new workgroup that does not exist', () => {
        const aliceBpi = new BPI("AL1", "Alice Organization");
        const workgroup = aliceBpi.addWorkgroup('123','MyWorkgroup', null, null);

        expect(aliceBpi.getWorkgroupById("nonsense")).to.be.undefined;
    });

    it('Alice invites Bob to her workgroup, Bob accepts, and Alice can view Bob within her workgroup', () => {

        
    })
});