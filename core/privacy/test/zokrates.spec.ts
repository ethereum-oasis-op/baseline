import { shouldBehaveLikeZKSnarkCircuit } from './shared';
import { zkSnarkCircuitProviderServiceFactory, zkSnarkCircuitProviderServiceZokrates } from '../src/index';

const noopAgreementCircuitPath = '../../lib/circuits/noopAgreement.zok';
const createAgreementPath = '../../lib/circuits/createAgreement.zok';
const signAgreementPath = '../../lib/circuits/signAgreement.zok';
const proofOfOwnershipPath = '../../lib/circuits/prove-ownership-of-sk.zok';

let provider;

describe('when the underlying zokrates provider is available', () => {
  beforeEach(async () => {
    provider = await zkSnarkCircuitProviderServiceFactory(zkSnarkCircuitProviderServiceZokrates);
  });

  it('runs the noopAgreement circuit lifecycle successfully', () => {
    shouldBehaveLikeZKSnarkCircuit(provider, noopAgreementCircuitPath, ['2']);
  });

  it('runs the createAgreement circuit lifecycle successfully', () => {
    const args = [
      '1', 
      {
        value: ['3', '1'],
        salt: ['3', '5'],
      },
      {
        senderPublicKey: ['6', '7'],
        agreementName: '8',
        agreementUrl: '9',
      }
    ];
    shouldBehaveLikeZKSnarkCircuit(provider, createAgreementPath, args);
  });

  it('runs the proof of ownership circuit lifecycle successfully', () => {
    const args = [['1', '2'], '3'];
    shouldBehaveLikeZKSnarkCircuit(provider, proofOfOwnershipPath, args);
  });

  // To be fixed: The below test when run fails with JS heap out of memory
  /* it('runs the signAgreement circuit lifecycle successfully', () => {
    const args = [
      {
        hash: ['1', '2', '3', '4', '5', '6', '7', '8'],
        senderPublicKey: ['9', '10'],
      },
      {
        R: ['11', '12'],
        S: '13',
      }
    ];
    shouldBehaveLikeZKSnarkCircuit(provider, signAgreementPath, args);
  }); */
});
