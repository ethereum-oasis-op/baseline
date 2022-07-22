import { Opcode } from '@baseline-protocol/types';
import { assert, expect } from 'chai';
import { ParticipantStack } from '../src';
import {
  shouldBehaveLikeAWorkgroupOrganization,
  shouldBehaveLikeWorkgroupOperator,
  shouldBehaveLikeAnInvitedWorkgroupOrganization,
  shouldBehaveLikeAWorkgroupCounterpartyOrganization,
  shouldCreateBaselineStack,
} from './shared';

import {
  authenticateUser,
  bpiFactory,
  configureTestnet,
  createUser,
  promisedTimeout,
  scrapeInvitationToken,
  JSDomErrorHandler
} from './utils';
import { uuid } from 'uuidv4';

const aliceCorpName = 'Alice Corp';
const aliceDomain = 'alice.baseline.local';

const bobCorpName = 'Bob Corp';
const bobDomain = 'bob.baseline.local';

const ropstenNetworkId = '66d44f30-9092-4182-a3c4-bc02736d6ae5';
const kovanNetworkId = '8d31bf48-df6b-4a71-9d7c-3cb291111e27';
const goerliNetworkId = '1b16996e-3595-4985-816c-043345d22f8c';
const networkId = process.env['NCHAIN_NETWORK_ID'] || kovanNetworkId;

const setupUser = async (identHost, firstname, lastname, email, password) => {
  const user = (await createUser(identHost, firstname, lastname, email, password));
  const auth = await authenticateUser(identHost, email, password);
  const token = JSON.parse(JSON.stringify(auth.token));
  assert(token.access_token, `failed to authorize bearer token for user ${email}`);
  return [user, token.access_token, token.refresh_token];
};

describe('Baseline', () => {
  let bearerTokens; // user API credentials

  let alice;
  let aliceBPI: ParticipantStack;

  let bob;
  let bobBPI: ParticipantStack;

  let workgroup;
  // let workgroupToken;

  let errorHandler: JSDomErrorHandler = new JSDomErrorHandler();

  before(async () => {
    errorHandler.register();
    errorHandler.ignoreNetworkFailures();
    // await configureTestnet(5432, networkId);
    await configureTestnet(5433, networkId);

    const aliceUserToken = await setupUser(
      'localhost:8085',
      'Alice',
      'Baseline',
      `alice${new Date().getTime()}@baseline.local`,
      'alicep455',
    );
    alice = aliceUserToken[0];

    const bobUserToken = await setupUser(
      'localhost:8085',
      'Bob',
      'Baseline',
      `bob${new Date().getTime()}@baseline.local`,
      'bobp455',
    );
    bob = bobUserToken[0];
    console.log('bob', bob);

    bearerTokens = {};
    bearerTokens[alice['id']] = aliceUserToken[1];
    bearerTokens[bob['id']] = bobUserToken[1];

    // FIXME -- vend unique keypair for each participant
    const natsPrivateKey = '-----BEGIN RSA PRIVATE KEY-----\n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\n-----END RSA PRIVATE KEY-----';
    const natsPublicKey = '-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAullT/WoZnxecxKwQFlwE\n9lpQrekSD+txCgtb9T3JvvX/YkZTYkerf0rssQtrwkBlDQtm2cB5mHlRt4lRDKQy\nEA2qNJGM1Yu379abVObQ9ZXI2q7jTBZzL/Yl9AgUKlDIAXYFVfJ8XWVTi0l32Vsx\ntJSd97hiRXO+RqQu5UEr3jJ5tL73iNLp5BitRBwa4KbDCbicWKfSH5hK5DM75EyM\nR/SzR3oCLPFNLs+fyc7zH98S1atglbelkZsMk/mSIKJJl1fZFVCUxA+8CaPiKbpD\nQLpzydqyrk/y275aSU/tFHidoewvtWorNyFWRnefoWOsJFlfq1crgMu2YHTMBVtU\nSJ+4MS5D9fuk0queOqsVUgT7BVRSFHgDH7IpBZ8s9WRrpE6XOE+feTUyyWMjkVgn\ngLm5RSbHpB8Wt/Wssy3VMPV3T5uojPvX+ITmf1utz0y41gU+iZ/YFKeNN8WysLxX\nAP3Bbgo+zNLfpcrH1Y27WGBWPtHtzqiafhdfX6LQ3/zXXlNuruagjUohXaMltH+S\nK8zK4j7n+BYl+7y1dzOQw4CadsDi5whgNcg2QUxuTlW+TQ5VBvdUl9wpTSygD88H\nxH2b0OBcVjYsgRnQ9OZpQ+kIPaFhaWChnfEArCmhrOEgOnhfkr6YGDHFenfT3/RA\nPUl1cxrvY7BHh4obNa6Bf8ECAwEAAQ==\n-----END PUBLIC KEY-----';

    aliceBPI = await bpiFactory(
      aliceUserToken[1],
      aliceUserToken[2],
      aliceCorpName,
      aliceDomain,
      false,
      'localhost:8085',
      'nats://localhost:4224',
      natsPrivateKey,
      natsPublicKey,
      'localhost:8086',
      networkId,
      'localhost:8083',
      'localhost:8087',
      'localhost:8092',
      '4722',
      '4320',
      '4321',
      'kovan.poa.network:443',
      'https',
      'localhost',
      '6390',
      null,
      'baseline workgroup',
      null,
      'corn domain lonely owner media grape hard rough arena knock uncover goddess cinnamon wing actress spring dizzy skill alter pistol funny bind rapid soap',
    );

    bobBPI = await bpiFactory(
      bobUserToken[1],
      bobUserToken[2],
      bobCorpName,
      bobDomain,
      true,
      'localhost:8085',
      'nats://localhost:4224',
      natsPrivateKey,
      natsPublicKey,
      'localhost:8086',
      networkId,
      'localhost:8083',
      'localhost:8087',
      'localhost:8089',
      '4724',
      '4322',
      '4323',
      'kovan.poa.network:443',
      'https',
      'localhost',
      '6391',
      null,
      'baseline workgroup',
      null,
      'forest step weird object extend boat ball unit canoe pull render monkey drink monitor behind supply brush frown alone rural minute level host clock',
    );

    console.log('start init Bob');
    await bobBPI.init();
    console.log('end init Bob');
    console.log('start init Alice');
    await aliceBPI.init();
    console.log('end init Alice');
  });

  after('close connections',async () =>{
    await bobBPI.disconnect();
    await aliceBPI.disconnect();
  })

  describe('workgroup', () => {
    describe('creation', () => {
      before(async () => {
        await bobBPI.requireWorkgroup();

        workgroup = bobBPI.getWorkgroup();
        // workgroupToken = bobBPI.getWorkgroupToken();
      });

      it('should create the workgroup in the local registry', async () => {
        assert(workgroup, 'workgroup should not be null');
        assert(workgroup.id, 'workgroup id should not be null');
      });

/*
      it('should authorize a bearer token for the workgroup', async () => {
        assert(workgroupToken, 'workgroup token should not be null');
      });
*/

      it('should deploy the global ERC1820 registry contract', async () => {
        const erc1820RegistryContract = await bobBPI.requireRegistryContract('erc1820-registry');
        assert(erc1820RegistryContract, 'global ERC1820 registry contract should not be null');
      });

      it('should deploy the global ERC1820 organization registry contract', async () => {
        const orgRegistryContract = await bobBPI.requireRegistryContract('organization-registry');
        assert(orgRegistryContract, 'global organization registry contract should not be null');
      });
    });

    describe('participants', () => {
      before(async () => {
        // sanity check
        assert(alice && bob, 'an administrative user should have been created for each workgroup counterparty');
        assert(Object.keys(bearerTokens).length === 2, 'a bearer token should have been authorized for each administrative user');
        assert(aliceBPI, 'an instance should have been initialized for Alice Corp');
        assert(bobBPI, 'an instance should have been initialized for Bob Corp');
        assert(workgroup, 'workgroup should not be null');
        // assert(workgroupToken, 'workgroup token should not be null');
      });

      describe('workgroup operator', () => {
        describe(`baseline stack for "${bobCorpName}"`, shouldCreateBaselineStack(() => bobBPI))
        describe(`workgroup operator: "${bobCorpName}"`, shouldBehaveLikeWorkgroupOperator(() => bobBPI));
        describe(`workgroup organization: "${bobCorpName}"`, shouldBehaveLikeAWorkgroupOrganization(() => bobBPI));
      });

      describe('inviting participants to the workgroup', function () {
        let inviteToken;

        before(async () => {
          await bobBPI.inviteWorkgroupParticipant(alice.email);
          inviteToken = await scrapeInvitationToken('bob-ident-consumer'); // if configured, ident would have sent an email to Alice
        });

        it('should have created an invite for alice', async () => {
          assert(inviteToken, 'invite token should not be null');
        });

        describe('alice', function () {
          before(async () => {
            await bobBPI.requireRegistryContract('erc1820-registry');
            await bobBPI.requireRegistryContract('organization-registry');
            await aliceBPI.acceptWorkgroupInvite(inviteToken, bobBPI.getWorkgroupContracts());
          });

          describe(`baseline stack for "${aliceCorpName}"`, shouldCreateBaselineStack(() => aliceBPI))
          describe(`invited workgroup organization: "${aliceCorpName}"`, shouldBehaveLikeAnInvitedWorkgroupOrganization(() => aliceBPI));
          describe(`workgroup organization: "${aliceCorpName}"`, shouldBehaveLikeAWorkgroupOrganization(() => aliceBPI));
          describe(`workgroup counterparty: "${aliceCorpName}"`, shouldBehaveLikeAWorkgroupCounterpartyOrganization(() => aliceBPI));
        });

        describe('counterparties post-onboarding', function () {
          describe(bobCorpName, shouldBehaveLikeAWorkgroupCounterpartyOrganization(() => bobBPI));
        });
      });

      describe('workflow', () => {
        var workstepId

        describe('create a work step', () => {
          before(async () => {
            // TODO: Ensure ParticipantStack.org was assigned.

            await bobBPI.requireBaselineStack();

            workstepId = String(uuid())
            const recipient = await aliceBPI.resolveOrganizationAddress();

            await bobBPI.sendBaselineProtocolMessage({
              "id": workstepId,
              "payload": {
                "proof": "8d8f7498db7aee910428c737d8427ac4add98353f981ca70db07697a091d8c23972b55b0b20fc0eebc1ac6c2ae427d783291c7fcb2e3f7417d279fea78ce1eac2d2293e53579abbef4960a1e290bd023e2999d8ff423d01080d449ce5d14ca89c94e277e8e0bb14fb91a0b71129920ae4411e77685287611f4d2aaf66b8fc5dc",
                "type": "general_consistency",
                "witness":{}
              },
              "type":"general_consistency",
            });
        })

          it('should increment protocol message tx count for the sender', async () => {
            assert(bobBPI.getProtocolMessagesTx() === 1, 'protocol messages tx should equal 2');
          });

          it('should increment protocol message rx count for the recipient', async () => {
            await promisedTimeout(50);
            assert(aliceBPI.getProtocolMessagesRx() === 1, 'protocol messages rx should equal 2');
          });

          // it('should match the merkle root between sender and receiver', async() => {
          //   let bobRoot = bobApp.getMerkleRoot()
          //   let aliceRoot = aliceApp.getMerkleRoot()
          //   expect(bobRoot).to.equal(aliceRoot);
          // })
        });

        // describe('update a work step', () => {
        //   before(async () => {
        //     await aliceApp.sendBaselineProtocolMessage({
        //       id: workstepId,
        //       name: 'hello world',
        //       url: 'proto://deep/link/to/doc',
        //       rfp_id: uuid(),
        //     });
        //   });

        //   it('should increment protocol message tx count for the sender', async () => {
        //     assert(aliceApp.getProtocolMessagesTx() === 2, 'protocol messages tx should equal 2');
        //   });

        //   it('should increment protocol message rx count for the recipient', async () => {
        //     await promisedTimeout(50);
        //     assert(bobApp.getProtocolMessagesRx() === 2, 'protocol messages rx should equal 2');
        //   });

        //   it('should match the merkle root between sender and receiver', async() => {
        //     let bobRoot = bobApp.getMerkleRoot()
        //     let aliceRoot = aliceApp.getMerkleRoot()
        //     expect(bobRoot).to.equal(aliceRoot);
        //   })
        // });
      });
    });
  });
});
