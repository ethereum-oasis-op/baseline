import { shouldBehaveLikeZKSnarkCircuit } from './shared';
import { zkSnarkCircuitProviderServiceFactory, zkSnarkCircuitProviderServiceZokrates } from '../src/index';

const noopAgreementCircuitPath = '../../lib/circuits/noopAgreement.zok';
const createDocumentPath = '../../lib/circuits/createDocument.zok';
          
let provider;

describe('when the underlying zokrates provider is available', () => {
  beforeEach(async () => {
    provider = await zkSnarkCircuitProviderServiceFactory(zkSnarkCircuitProviderServiceZokrates);
  });

  it('runs the noopAgreement circuit lifecycle successfully', () => {
    shouldBehaveLikeZKSnarkCircuit(provider, noopAgreementCircuitPath, ['2']); // this is here for sanity...
    // shouldBehaveLikeZKSnarkCircuit(provider, createDocumentPath, ['2']); // this is here for sanity...
    // shouldBehaveLikeZKSnarkCircuit(provider, testCircuitPath, ['2']); // this is here for sanity...

  });
});
