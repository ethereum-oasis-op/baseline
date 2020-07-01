import { readFileSync, readFile } from 'fs';
import { zokratesServiceFactory } from '../src/index';
import { assert } from 'console';

const baselineDocumentCircuitPath = '../../lib/circuits/baselineDocument/baselineDocument.zok';

let baselineDocumentCircuitSource;
let zokrates;

beforeEach(async () => {
  zokrates = await zokratesServiceFactory();
});

describe('when the underlying zokrates provider is unavailable', () => {
  beforeEach(async () => {
    // TODO: stub zokratesServiceFactory();
  });
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
        console.log(artifact);
      });
    });
  });
});
