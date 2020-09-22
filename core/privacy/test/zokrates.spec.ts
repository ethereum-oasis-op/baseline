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
    shouldBehaveLikeZKSnarkCircuit(provider, createAgreementPath, ['2']); // Todo: Update witness arguments
    shouldBehaveLikeZKSnarkCircuit(provider, signAgreementPath, ['2']); // Todo: Update witness arguments
  });
});
