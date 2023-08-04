import { Witness } from '../../../models/witness';
import { SnarkjsCircuitService } from './snarkjs.service';

describe('Snarkjs circuit service', () => {
  describe('should generate witness (proof, public inputs, verification key) to check for equality of two values', () => {
    const snarkjsCircuitService = new SnarkjsCircuitService();
    let proverWitness: Witness;

    beforeEach(async () => {
      proverWitness = await snarkjsCircuitService.createWitness(
        {
          inputValueA: 2,
          inputValueB: 2,
        },
        'workstep',
      );

      //Required for running tests or else tests hang
      globalThis.curve_bn128.terminate();
    });

    it('should return false if verifier uses different public inputs from prover, even if the values are equal', async () => {
      let verifierWitness = new Witness();

      verifierWitness = proverWitness;

      verifierWitness.publicInputs = ['1', '3', '3'];

      const isVerified = await snarkjsCircuitService.verifyProofUsingWitness(
        verifierWitness,
      );

      //Required for running tests or else tests hang
      globalThis.curve_bn128.terminate();
      expect(isVerified).toEqual(false);
    });

    it('should return true if verifier uses the same public inputs as prover to verify proof', async () => {
      let verifierWitness = new Witness();

      verifierWitness = proverWitness;

      const isVerified = await snarkjsCircuitService.verifyProofUsingWitness(
        verifierWitness,
      );

      //Required for running tests or else tests hang
      globalThis.curve_bn128.terminate();
      expect(isVerified).toEqual(true);
    });

    it('should return true as result of circuit constraints when correct public inputs are used and both input values are equal', async () => {
      expect(Boolean(parseInt(proverWitness.publicInputs[0]))).toBe(true);
    });
  });

  describe('should generate witness (proof, public inputs, verification key) to check for inequality of two values', () => {
    const snarkjsCircuitService = new SnarkjsCircuitService();
    let proverWitness: Witness;

    beforeEach(async () => {
      proverWitness = await snarkjsCircuitService.createWitness(
        {
          inputValueA: 2,
          inputValueB: 3,
        },
        'workstep',
      );

      //Required for running tests or else tests hang
      globalThis.curve_bn128.terminate();
    });

    it('should return false if verifier uses different public inputs from prover', async () => {
      let verifierWitness = new Witness();

      verifierWitness = proverWitness;
      verifierWitness.publicInputs = ['1', '3', '3'];

      const isVerified = await snarkjsCircuitService.verifyProofUsingWitness(
        verifierWitness,
      );

      //Required for running tests or else tests hang
      globalThis.curve_bn128.terminate();
      expect(isVerified).toEqual(false);
    });

    it('should return true if verifier uses the same public inputs as prover to verify proof', async () => {
      let verifierWitness = new Witness();

      verifierWitness = proverWitness;

      const isVerified = await snarkjsCircuitService.verifyProofUsingWitness(
        verifierWitness,
      );

      //Required for running tests or else tests hang
      globalThis.curve_bn128.terminate();
      expect(isVerified).toEqual(true);
    });

    it('should return false as result of circuit constraints when correct public inputs are used and input values are not equal', async () => {
      expect(Boolean(parseInt(proverWitness.publicInputs[0]))).toBe(false);
    });
  });
});
