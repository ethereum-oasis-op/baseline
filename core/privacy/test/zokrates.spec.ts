import { shouldBehaveLikeZKSnarkCircuit } from './shared';
import { zkSnarkCircuitProviderServiceFactory, zkSnarkCircuitProviderServiceZokrates } from '../src/index';

const baselineDocumentCircuitPath = '../../lib/circuits/baselineDocument.zok';
const noopAgreementCircuitPath = '../../lib/circuits/noopAgreement.zok';

let provider;

describe('when the underlying zokrates provider is available', () => {
  beforeEach(async () => {
    provider = await zkSnarkCircuitProviderServiceFactory(zkSnarkCircuitProviderServiceZokrates);
  });

  it('runs the noopAgreement circuit lifecycle successfully', () => {
    shouldBehaveLikeZKSnarkCircuit(provider, noopAgreementCircuitPath); // this is here for sanity...
  });

  it('runs the baselineDocument circuit lifecycle successfully', () => {
    shouldBehaveLikeZKSnarkCircuit(provider, baselineDocumentCircuitPath); // this takes... a while... ;)
  });
});
