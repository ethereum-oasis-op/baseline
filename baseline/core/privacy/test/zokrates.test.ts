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
      let artifacts;

      beforeEach(async () => {
        // console.log(path.resolve(__dirname, baselineDocumentCircuitPath));
        baselineDocumentCircuitSource = readFileSync(baselineDocumentCircuitPath);
        assert(baselineDocumentCircuitSource, 'baselineDocuemntCircuitSource');
        assert(baselineDocumentCircuitSource.length > 0, 'baselineDocumentCircuitSource not read from lib');
      });

      it('should return the compiled artifact', async () => {
        artifacts = await zokrates.compile(baselineDocumentCircuitSource.toString(), 'main');
        assert(artifacts, 'compiled artifact not returned');
        assert(artifacts.program, 'compiled artifact did not contain circuit');
        assert(artifacts.abi, 'compiled artifact did not include abi');
      });

      describe('setup', () => {
        let setupArtifacts;

        beforeEach(async () => {
          if (!setupArtifacts) {
            setupArtifacts = await zokrates.setup(artifacts.program);
          }
        });

        it('should return the setup artifacts', async () => {
          assert(setupArtifacts, 'setup artifacts not returned');
          assert(setupArtifacts.keypair, 'proving and verifier keys not returned');
          assert(setupArtifacts.verifierSource, 'verifier contract source not returned');
        });

        describe('witness', () => {
          let witness;

          beforeEach(async () => {
            if (!witness) {
              witness = await zokrates.computeWitness(artifacts, ['2']);
            }
          });

          it('should return the computed witness', async () => {
            assert(witness, 'computed witness not returned');
            assert(witness.witness, 'computed value did not contain witness');
            assert(witness.output, 'computed value did not contain retval');
          });

          describe('proof', () => {
            describe('when the given witness is incorrect', () => {
              // it('should fail to generate a proof', async () => {
                // FIXME -- the below expect() syntaxs isn't working as-is
                // expect(async () => await zokrates.generateProof(
                //   artifacts.program,
                //   '~out_0 3\n~one 1\n_0 3',
                //   setupArtifacts.keypair.pk,
                // )).to.throw();
              // });
            });

            describe('when the given proving key is incorrect', () => {
              // it('should fail to generate a proof', async () => {
                // FIXME -- the below expect() syntaxs isn't working as-is
                // expect(async () => await zokrates.generateProof(
                //   artifacts.program,
                //   witness.witness,
                //   setupArtifacts.keypair.pk.reverse(),
                // )).to.throw();
              // });
            });

            describe('when the given witness and proving key are valid', () => {
              let proof;

              beforeEach(async () => {
                if (!proof) {
                  proof = await zokrates.generateProof(artifacts.program, witness.witness, setupArtifacts.keypair.pk);
                }
              });

              it('should return the generated proof', async () => {
                assert(proof, 'failed to return generated proof');
                assert(proof.proof && Object.keys(proof.proof).length > 0, 'response did not contain proof');
                assert(proof.inputs, 'response did not contain inputs');
              });
            });
          });
        });
      });
    });
  });
});
