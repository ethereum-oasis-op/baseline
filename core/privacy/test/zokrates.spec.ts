import { shouldBehaveLikeZKSnarkCircuit } from './shared';
import { zkSnarkCircuitProviderServiceFactory, zkSnarkCircuitProviderServiceZokrates } from '../src/index';

const noopAgreementCircuitPath = '../../lib/circuits/noopAgreement.zok';
const createAgreementPath = '../../lib/circuits/createAgreement.zok';
const signAgreementPath = '../../lib/circuits/signAgreement.zok';

let provider;

describe('when the underlying zokrates provider is available', () => {
  beforeEach(async () => {
    provider = await zkSnarkCircuitProviderServiceFactory(zkSnarkCircuitProviderServiceZokrates);
  });

  it('runs the noopAgreement circuit lifecycle successfully', () => {
    shouldBehaveLikeZKSnarkCircuit(provider, noopAgreementCircuitPath, ['2']); // Todo: Update witness arguments
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

  it('runs the signAgreement circuit lifecycle successfully', () => {
    // shouldBehaveLikeZKSnarkCircuit(provider, signAgreementPath, ['2']); // Todo: Update witness arguments
  });
});
