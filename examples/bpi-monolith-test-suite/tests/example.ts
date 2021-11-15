import { BPI }  from '../bpi/bpi';
import { expect } from 'chai';


describe('Org and Workgroup setup', () => {
    it('Alice creates a new organization', () => {
        const aliceBpi = new BPI();
        aliceBpi.addOrganization("AL1", "Alice Organization")

        expect(aliceBpi.getOrganizationById("AL1").name).equal("Alice Organization");
    });

    it('Alice searches for a new organization that does not exist', () => {
        const aliceBpi = new BPI();
        aliceBpi.addOrganization("BO1", "Bob Organization");

        expect(aliceBpi.getOrganizationById("EV1")).to.be.undefined;
    })


    it('Alice creates a simple workgroup', () => {
        const aliceBpi = new BPI();

        const workgroup = aliceBpi.addWorkgroup('123','MyWorkgroup');





        
        // TODO: We assume there exists a external source of organization id's and addresses for contact
        // aliceBpi.InviteOrganization(bobId)
        // aliceBpi.TestProperty = 1;

        // const bobBpi = new BPI();
        // bobBpi.TestProperty = 2; 

        // expect(aliceBpi.TestProperty).to.be.equal(1);
        // expect(bobBpi.TestProperty).to.be.equal(2);
    });
});