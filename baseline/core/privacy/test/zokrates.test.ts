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
      let artifact;

      beforeEach(async () => {
        baselineDocumentCircuitSource = readFileSync(baselineDocumentCircuitPath);
        assert(baselineDocumentCircuitSource, 'baselineDocuemntCircuitSource');
        assert(baselineDocumentCircuitSource.length > 0, 'baselineDocumentCircuitSource not read from lib');
      });

      it('should return the compiled artifact', async () => {
        artifact = await zokrates.compile(baselineDocumentCircuitSource.toString(), 'main');
        assert(artifact, 'compiled artifact not returned');
        assert(artifact.program, 'compiled artifact did not contain circuit');
        assert(artifact.abi, 'compiled artifact did not include abi');
      });

      describe('setup', () => {
        it('should return the setup artifacts', async () => {
          const setupArtifacts = await zokrates.setup(artifact.program);
          assert(setupArtifacts, 'setup artifacts not returned');
          assert(setupArtifacts.keys, 'proving and verifier keys not returned');
          assert(setupArtifacts.verifierSource, 'verifier contract source not returned');
        });
      });
    });
  });
});
