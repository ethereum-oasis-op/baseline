import { assert } from 'chai';
import { promisedTimeout } from './utils';

export const shouldBehaveLikeAWorkgroupOrganization = (app) => {
  describe(`workgroup organization: "${app.getBaselineConfig().orgName}"`, () => {
    let org;

    before(async () => {
      await promisedTimeout(3000);
      org = app.getOrganization();
      assert(org, 'org should not be null');
    });

    describe('default vault', () => {
      let keys;

      before(async () => {
        keys = await app.fetchKeys();
        assert(keys.length === 3, 'default keypairs not created');
      });

      it('should create a default vault for the organization', async () => {
        const vaults = await app.fetchVaults();
        assert(vaults.length === 1, 'default vault not created');
      });

      it('should have a babyJubJub keypair for the organization', async () => {
        assert(keys[1].spec === 'babyJubJub', 'default babyJubJub keypair not created');
      });

      it('should have a secp256k1 keypair for the organization', async () => {
        assert(keys[2].spec === 'secp256k1', 'default secp256k1 keypair not created');
        assert(keys[2].address, 'default secp256k1 keypair should return the address for the organization');
      });
    });

    describe('registration', () => {
      let address;

      before(async () => {
        const keys = await app.fetchKeys();
        assert(keys.length === 3, 'default keypairs not created');

        address = keys[2].address;
        assert(address, 'default secp256k1 keypair should return the address for the organization');
      });

      it('should register the organization in the local registry', async () => {
        assert(org.id, 'org id should not be null');
      });

      it('should register the organization in the on-chain registry using its default secp256k1 address', async () => {
        const org = await app.requireOrganization(address);
        assert(org, 'org should be present in on-chain registry');
      });

      it('should associate the organization with the local workgroup', async () => {
        const orgs = await app.fetchWorkgroupOrganizations();
        assert(orgs.length === 1, 'workgroup should have associated org');
      });
    });

    describe('messaging', () => {
      let natsService;

      afterEach(async () => {
        if (natsService && natsService.isConnected()) {
          natsService.disconnect();
        }
      });

      beforeEach(async () => {
        natsService = app.getMessagingService();
        natsService.connect();
        await promisedTimeout(1000);
      });

      it('should have an established NATS connection', async () => {
        assert(natsService, 'should not be null');
        assert(natsService.isConnected() === true, 'should have established a connection');
      });

      describe('serialization', () => {
        let msg;

        before(async () => {
          msg = app.serializeProtocolMessage(
            await app.protocolMessageFactory(
              '0x512aA2447D05fe172cF59C1200FBa0EF7D271231',
              '0x31B26EfC2B84ba8fE62b4f7A7F3D74606BAfD6D0',
              '123e4567-e89b-12d3-a456-426655440000',
              Buffer.from('{"hello": "world"}'),
            ),
          );
        });

        it('should serialize the msg', async () => {
          assert(msg, 'message should be serialized');
        });
      });
    });
  });
};

export const shouldBehaveLikeAnInitialWorkgroupOrganization = (app) => {
  describe(`initial workgroup organization: "${app.getBaselineConfig().orgName}"`, () => {
    describe('baseline config', () => {
      let cfg;

      before(async () => {
        cfg = app.getBaselineConfig();
      });

      it('should have a non-null config', async () => {
        assert(cfg, 'config should not be null');
      });

      it('should indicate that this instance is the workgroup initiator', async () => {
        assert(cfg.initiator === true, 'config should indicate this instance is the workgroup initiator');
      });
    });

    describe('workflow privacy', () => {
      let circuitArtifacts;
      let setupArtifacts;

      describe('zkSNARK circuits', () => {
        describe('compile', () => {
          before(async () => {
            circuitArtifacts = await app.compileBaselineCircuit();
            assert(circuitArtifacts, 'compiled artifacts should not be null');
          });

          it('should output the compiled circuit', async () => {
            assert(circuitArtifacts.program, 'artifacts should contain the compiled circuit');
          });

          it('should output the ABI of the compiled circuit', async () => {
            assert(circuitArtifacts.abi, 'artifacts should contain the abi');
          });
        });

        describe('trusted setup', () => {
          before(async () => {
            setupArtifacts = await app.deployBaselineCircuit();
            assert(setupArtifacts, 'setup artifacts should not be null');
          });

          it('should output a unique identifier for the circuit', async () => {
            assert(setupArtifacts.identifier, 'identifier should not be null');
          });

          it('should output a keypair for proving and verification', async () => {
            assert(setupArtifacts.keypair, 'keypair should not be null');
          });

          it('should output the raw verifier source code', async () => {
            assert(setupArtifacts.verifierSource, 'verifier source should not be null');
          });

          it('should store a reference to the workflow circuit identifier', async () => {
            assert(app.getWorkflowIdentifier() === setupArtifacts.identifier, 'workflow circuit identifier should have a reference');
          });

          describe('on-chain artifacts', () => {
            let shield;
            let verifier;

            before(async () => {
              shield = app.getWorkgroupContract('shield');
              verifier = app.getWorkgroupContract('verifier');
            });

            it('should deposit the workgroup shield contract on-chain', async () => {
              assert(shield, 'workgroup shield contract should not be null');
              assert(shield.address, 'workgroup shield contract should have been deployed');
            });

            it('should track the workgroup shield in an off-chain merkle tree database', async () => {
              const trackedShieldContracts = await app.baseline.getTracked();
              assert(trackedShieldContracts.length === 1, 'workgroup shield contract should have been tracked');
              assert(trackedShieldContracts.indexOf(shield.address) === 0, 'workgroup shield contract should have been tracked');
            });
  
            it('should deposit the circuit verifier on-chain', async () => {
              assert(verifier, 'workflow circuit verifier contract should not be null');
              assert(verifier.address, 'workflow circuit verifier contract should have been deployed');
            });
          });
        });
      });
    });
  });
};

export const shouldBehaveLikeAnInvitedWorkgroupOrganization = (app) => {
  describe(`invited workgroup organization: "${app.getBaselineConfig().orgName}"`, () => {
    describe('baseline config', () => {
      let cfg;

      before(async () => {
        cfg = app.getBaselineConfig();
      });

      it('should have a non-null config', async () => {
        assert(cfg, 'config should not be null');
      });

      it('should indicate that this instance is not the workgroup initiator', async () => {
        assert(cfg.initiator === false, 'config should indicate this instance is not the workgroup initiator');
      });
    });

    describe('workgroup', () => {
      let workgroup;
      let workgroupToken;

      before(async () => {
        workgroup = app.getWorkgroup();
        workgroupToken = app.getWorkgroupToken();
      });

      it('should persist the workgroup in the local registry', async () => {
        assert(workgroup, 'workgroup should not be null');
        assert(workgroup.id, 'workgroup id should not be null');
      });

      it('should authorize a bearer token for the workgroup', async () => {
        assert(workgroupToken, 'workgroup token should not be null');
      });
    });

    describe('contracts', () => {
      let erc1820Registry;
      let orgRegistry;
      let shield;
      let verifier;
      let workflowIdentifier;

      before(async () => {
        erc1820Registry = await app.requireWorkgroupContract('erc1820-registry');
        orgRegistry = await app.requireWorkgroupContract('organization-registry');
        shield = app.getWorkgroupContract('shield');
        verifier = app.getWorkgroupContract('verifier');
        workflowIdentifier = app.getWorkflowIdentifier();
      });

      it('should have a local reference to the on-chain organization registry contract', async () => {
        assert(orgRegistry, 'organization registry contract should not be null');
        assert(orgRegistry.address, 'organization registry contract should have a reference to its on-chain address');
      });

      it('should have a local reference to the on-chain workgroup shield contract', async () => {
        assert(shield, 'workgroup shield contract should not be null');
        assert(shield.address, 'workgroup shield contract should have a reference to its on-chain address');
      });

      it('should track the workgroup shield in an off-chain merkle tree database', async () => {
        const trackedShieldContracts = await app.baseline.getTracked();
        assert(trackedShieldContracts.length === 1, 'workgroup shield contract should have been tracked');
        assert(trackedShieldContracts.indexOf(shield.address) === 0, 'workgroup shield contract should have been tracked');
      });

      it('should have a local reference to the on-chain workflow circuit verifier contract', async () => {
        assert(verifier, 'workflow circuit verifier contract should not be null');
        assert(verifier.address, 'workflow circuit verifier contract should have a reference to its on-chain address');
      });

      it('should have a local reference to the workflow circuit identifier', async () => {
        assert(workflowIdentifier, 'workflow circuit identifier should not be null');
      });
    });
  });
};
