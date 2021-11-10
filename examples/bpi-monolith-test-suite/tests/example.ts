import { BPI }  from '../bpi/bpi';
import { expect } from 'chai';


describe('Example tests', () => {
    it('Should run a simple example test and assert success', () => {
        const aliceBpi = new BPI();
        aliceBpi.TestProperty = 1;

        const bobBpi = new BPI();
        bobBpi.TestProperty = 2; 

        expect(aliceBpi.TestProperty).to.be.equal(1);
        expect(bobBpi.TestProperty).to.be.equal(2);
    });
});