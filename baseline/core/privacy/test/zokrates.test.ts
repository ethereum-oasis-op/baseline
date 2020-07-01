import { assert } from 'console';
import { readFileSync } from 'fs';
import { zkSnarkCircuitProviderServiceFactory, zkSnarkCircuitProviderServiceZokrates } from '../src/index';

const baselineDocumentCircuitPath = '../../lib/circuits/baselineDocument/baselineDocument.zok';

let baselineDocumentCircuitSource;
let zokrates;

beforeEach(async () => {
  zokrates = await zkSnarkCircuitProviderServiceFactory(zkSnarkCircuitProviderServiceZokrates);
});

describe('when the underlying zokrates provider is available', () => {
  describe('compile', () => {
    describe('when the given circuit is valid', () => {
      beforeEach(async () => {
        baselineDocumentCircuitSource = readFileSync(baselineDocumentCircuitPath);
        assert(baselineDocumentCircuitSource, 'baselineDocuemntCircuitSource');
        assert(baselineDocumentCircuitSource.length > 0, 'baselineDocumentCircuitSource not read from lib');
        console.log(baselineDocumentCircuitSource.toString());
      });

      it('should return the compiled artifact', async () => {
        const artifact = await zokrates.compile(baselineDocumentCircuitSource.toString(), 'main');
        assert(artifact, 'compiled artifact not returned');
        console.log(artifact);
      });
    });
  });
});
