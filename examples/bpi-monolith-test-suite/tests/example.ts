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
        const agreement = new Agreement();
        const worksteps = new Workstep();
        const workgroup = aliceBpi.addWorkgroup('123','MyWorkgroup');
        
        expect(aliceBpi.getWorkgroupById(workgroup.id).name).is.equal(workgroup.name);

        expect(aliceBpi.getWorkgroupById(workgroup.id).participants[0]).is.equal(aliceBpi.owner);
    });

    it('Alice searches for a new workgroup that does not exist', () => {
        const aliceBpi = new BPI("AL1", "Alice Organization");
        const workgroup = aliceBpi.addWorkgroup('123','MyWorkgroup');

        expect(aliceBpi.getWorkgroupById("nonsense")).to.be.undefined;
    });

    it('Alice invites Bob to her workgroup, Bob accepts, and Alice can view Bob within her workgroup', () => {

        
    })
});