import { shouldBehaveLikeZKSnarkCircuit, shouldOperateOnPresetZkSnarkCircuit } from './shared';
import { zkSnarkCircuitProviderServiceFactory, zkSnarkCircuitProviderServiceZokrates } from '../src/index';

// const baselineDocumentCircuitPath = '../../lib/circuits/baselineDocument.zok';
const noopAgreementCircuitPath = '../../lib/circuits/noopAgreement.zok';
          
let provider;

describe('when the underlying zokrates provider is available', () => {
  beforeEach(async () => {
    provider = await zkSnarkCircuitProviderServiceFactory(zkSnarkCircuitProviderServiceZokrates);
  });

  it('runs the noopAgreement circuit lifecycle successfully', () => {
    shouldBehaveLikeZKSnarkCircuit(provider, noopAgreementCircuitPath, ['2']); // this is here for sanity...
    // shouldBehaveLikeZKSnarkCircuit(provider, noopAgreementCircuitPath); // this takes a while...
  });

  it('runs the createAgreement circuit lifecycle successfully', () => {
    shouldOperateOnPresetZkSnarkCircuit(provider, 'createAgreement');
  });
});
