import { Opcode } from '@baseline-protocol/types';
import { assert } from 'chai';
import { shouldBehaveLikeAWorkgroupOrganization, shouldBehaveLikeAnInitialWorkgroupOrganization, shouldBehaveLikeAnInvitedWorkgroupOrganization, shouldBehaveLikeAWorkgroupCounterpartyOrganization } from './shared';
import { authenticateUser, baselineAppFactory, configureRopstenFaucet, createUser, promisedTimeout, scrapeInvitationToken } from './utils';
import { ParticipantStack } from '../src';

const faucetAddress = process.env['FAUCET_ADDRESS'];
const faucetEncryptedPrivateKey = process.env['FAUCET_PRIVATE_KEY'];
const networkId = process.env['NCHAIN_NETWORK_ID'] || '66d44f30-9092-4182-a3c4-bc02736d6ae5'; // ropsten

const setupUser = async (identHost, firstname, lastname, email, password) => {
  const user = (await createUser(identHost, firstname, lastname, email, password));
  const auth = await authenticateUser(identHost, email, password);
  const bearerToken = auth.token.token;
  assert(bearerToken, `failed to authorize bearer token for user ${email}`);
  return [user, bearerToken];
};

describe('baseline', () => {
  let app: ParticipantStack; // app instance used for initial setup of the on-chain org registry
  let bearerTokens; // user API credentials

  let alice;
  let aliceApp: ParticipantStack;

  let bob;
  let bobApp: ParticipantStack;

  let workgroup;
  let workgroupToken;

  before(async () => {
    const aliceUserToken = await setupUser(
      'localhost:8081',
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

    bearerTokens = {};
    bearerTokens[alice['id']] = aliceUserToken[1];
    bearerTokens[bob['id']] = bobUserToken[1];

    if (faucetAddress && faucetEncryptedPrivateKey) {
      await configureRopstenFaucet(
        5432,
        alice['id'],
        faucetAddress,
        faucetEncryptedPrivateKey,
      );

      await configureRopstenFaucet(
        5433,
        bob['id'],
        faucetAddress,
        faucetEncryptedPrivateKey,
      );
    }

    // FIXME -- vend unique keypair for each participant
    const natsPrivateKey = '-----BEGIN RSA PRIVATE KEY-----\nMIIJKQIBAAKCAgEAullT/WoZnxecxKwQFlwE9lpQrekSD+txCgtb9T3JvvX/YkZT\nYkerf0rssQtrwkBlDQtm2cB5mHlRt4lRDKQyEA2qNJGM1Yu379abVObQ9ZXI2q7j\nTBZzL/Yl9AgUKlDIAXYFVfJ8XWVTi0l32VsxtJSd97hiRXO+RqQu5UEr3jJ5tL73\niNLp5BitRBwa4KbDCbicWKfSH5hK5DM75EyMR/SzR3oCLPFNLs+fyc7zH98S1atg\nlbelkZsMk/mSIKJJl1fZFVCUxA+8CaPiKbpDQLpzydqyrk/y275aSU/tFHidoewv\ntWorNyFWRnefoWOsJFlfq1crgMu2YHTMBVtUSJ+4MS5D9fuk0queOqsVUgT7BVRS\nFHgDH7IpBZ8s9WRrpE6XOE+feTUyyWMjkVgngLm5RSbHpB8Wt/Wssy3VMPV3T5uo\njPvX+ITmf1utz0y41gU+iZ/YFKeNN8WysLxXAP3Bbgo+zNLfpcrH1Y27WGBWPtHt\nzqiafhdfX6LQ3/zXXlNuruagjUohXaMltH+SK8zK4j7n+BYl+7y1dzOQw4CadsDi\n5whgNcg2QUxuTlW+TQ5VBvdUl9wpTSygD88HxH2b0OBcVjYsgRnQ9OZpQ+kIPaFh\naWChnfEArCmhrOEgOnhfkr6YGDHFenfT3/RAPUl1cxrvY7BHh4obNa6Bf8ECAwEA\nAQKCAgB+iDEznVuQXyQflwXFaO4lqOWncN7G2IOE4nmqaC4Y8Ehcnov369pTMLjO\n7oZY/AihduB7cuod0iLekOrrvoIPzHeKAlqylZBr1jjayW+Rkgc0FhRYkdXc9zKG\nJQYsRXXJKC4vUduIP0kfBt/OQtHZYCBzGEwCBLlqlgkRudLjqTpitFi4Gx6dtvPP\nj5XgfNtqOmRO/oT61xnjIbbFKgUGxu0E15+qjJ5v7qL9EPyc44eSdi+6+Vv/JlzA\nDXJfnlKB5TCN/I1HI7f2g8UJuGP6C6Cbq1gwbDDnbLU5mn/Mqqm+TPWIJXL6mDRQ\n3OETYO5+MAF6AlKTvb80d5og+QacsLvkTiMUf9zT4lVl8JnDZleARJ45gPJjTrNx\n2FiIAFKsIo4qXytuyWKzY3F6R7iGnXXHWbpWRYabuUopmljoQkFuExWyGGJWxdvE\n1GpK8a2669enw8TJGM0umGMhg7LFCi0l2Peu9++1AliIs7+HJukDJOs3UJgGgHBq\nlBLXk4ylYuf1/47Ov3G7gW/TQYgDec0Yse9A9fObrsZcdP1xMGgyjo3xM4Nq8Rxf\n+QStSf8uQ6TsdulyUKow/Kt7gqtQTGhKwIzJV4h7nR3QV2qDkgtybviQmfFCwxFK\nl7ovlecwTtnTCsJmHbz/GFE4mtKnqJNyJ9AjjlKfAf0Czl2yUQKCAQEA4JrVbbbf\noWMhjQdstcvTjYPNFjJ0XkIVoHzf8avWgZi7HuHs730mSNmckcH3ZAZ4QWnQpkXR\nL0iKzKWmjqbkNpOtKyyv5IEkYmZu7jF9HHpOgKpDCApW93SNZFNsHjNx1knUCbdP\nZej9nOC8LSJ6s6WtptNbgDwmSMf1MJQ+AoF0CkjuwMSBFxqepdsotNlqArb2SLwO\n6a3bFHWTdFLFyA7e0ICdr/Y/oPUyo/ZvDsTULRMeQAdaKjXmDBUqa4GlpH/7NEdh\nLU51NkCOHLgNRKW0/oYnD06y5iQk3ApDQ8XRVDeUoUqnsBS0fJHtynnvJtY8lSHr\n4tpwGECsU6l3xwKCAQEA1GWPyrnCjT3rY4X7UybQ6lIz3q59bWxs8SotNCEjh4Xd\n25bA0TNu2qrKndqnUPaWQPdRQGk/e0V7g5ym1xVuwtZgzvI/6ZcgfCMs5DqJHc7x\nxlSbHddJIHhZiGmLCfHljlCY7m8BoJu77yRoEvqZ2K+uShvgDEaN+QfJCuiBcwFX\n79VGa9UEFh8ZFUu3NM7F3/sxe++mmGOABmw8mN8abaK/r8P4ebsJ/GlAbGHWT3xn\nlQyFuP5Z9rp8jqAoSwYRpCgO9x/I2en4nouPjoOQoseejUz7qKQNPDhhPJTohWfQ\nRA9/bysOP3I/Pj3SVqC2rgGR/yCuJA0I95hIWgkcNwKCAQEAv5kVbAxOZLvNySKG\nR+biRpwifUb5Idc537fmyaAO0mrZZRTRK9MUr5yDBYvzX+5s81Ay30Q7mBxH2x+M\nH7CaiTwcwvHR8hmAUjiTdLnewkZLZVLY76jyWxGf8+9+EZ1NBMHiEY/AOW0xu3uy\nysXY6hrxMZinO5MUDY4VySUMaNLJjGR+1w5KGM1qfI2iAfRdjIdLPOy/w/O9KYzL\nBrX9ZhXZWP/+hDaKPOIuGtSEFJMvdGwUqAYdklh8L952W1MzXEqYnhYt/ZoqPud+\n01zmZKL+7Qi/lT1LOyumDdbrXosHcNIhBh5LQdfHx2Qs90ZhDj4/W/Cd6tzwNqAk\n4RF1zQKCAQBzxgRyIX1d1fGX5zFOausXvsUNTZmK6r4bWr0XHDUsqxh6mJrzrZBw\nWwZkswnexPqz4NuGO5hhzkb8P4hl1wXv6EEOrNePsVQAtn/Cy/FvsRzy2a1Pv8jZ\njSBojfc+7X8OavphhVqivCDdwr+EENuJVIGxXa5roo3Cv66jZochNAtF7MAdCRjY\nIg1fIU102HzdkSOxBbmOeTYQyjDht0LFnh/UZALt/7j6wDhgm5fg7dPcV94QL3zE\nU3SPndc4xc8Z5sf5hnbJ6ZIegb43lZliUWMobF0E2J9qQuUly5lPFn5ciwIQi6yR\nguncOICNvb617J8zLRIfDofjxjsx8KNTAoIBAQCMu3QhM6nWgqc8xiQaKFPASeq+\nNTg5G86wX0iHgYViwXGJ7stAU19jRzB4jlZAmKE+3a4rrSfU+qnr7uv5gkkssfF1\nWkUCCN6k5jxPnSlKllLEasZqhKWhEiPma0Ko1B0MYiY3u5sGXqGByxrcB2A/0ath\nkt3m1uAUO19bGGSzlvKtZZ0gkj0j7n5D5O2jHBT3bHUJU5c/uzTTpGdfjeEhDjhv\nmOK0zVVwSsBZysngslc2X2lPYROs4hHygQiCtuFrt4BZb7OnLL4Xz9xUsJSmeYbZ\nRB2pCO6C2xWltowiV5YCTSlg+RYUGN8fKoyYkZPdwEGRJqbXmROYAQHFKN4C\n-----END RSA PRIVATE KEY-----';
    const natsPublicKey = '-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAullT/WoZnxecxKwQFlwE\n9lpQrekSD+txCgtb9T3JvvX/YkZTYkerf0rssQtrwkBlDQtm2cB5mHlRt4lRDKQy\nEA2qNJGM1Yu379abVObQ9ZXI2q7jTBZzL/Yl9AgUKlDIAXYFVfJ8XWVTi0l32Vsx\ntJSd97hiRXO+RqQu5UEr3jJ5tL73iNLp5BitRBwa4KbDCbicWKfSH5hK5DM75EyM\nR/SzR3oCLPFNLs+fyc7zH98S1atglbelkZsMk/mSIKJJl1fZFVCUxA+8CaPiKbpD\nQLpzydqyrk/y275aSU/tFHidoewvtWorNyFWRnefoWOsJFlfq1crgMu2YHTMBVtU\nSJ+4MS5D9fuk0queOqsVUgT7BVRSFHgDH7IpBZ8s9WRrpE6XOE+feTUyyWMjkVgn\ngLm5RSbHpB8Wt/Wssy3VMPV3T5uojPvX+ITmf1utz0y41gU+iZ/YFKeNN8WysLxX\nAP3Bbgo+zNLfpcrH1Y27WGBWPtHtzqiafhdfX6LQ3/zXXlNuruagjUohXaMltH+S\nK8zK4j7n+BYl+7y1dzOQw4CadsDi5whgNcg2QUxuTlW+TQ5VBvdUl9wpTSygD88H\nxH2b0OBcVjYsgRnQ9OZpQ+kIPaFhaWChnfEArCmhrOEgOnhfkr6YGDHFenfT3/RA\nPUl1cxrvY7BHh4obNa6Bf8ECAwEAAQ==\n-----END PUBLIC KEY-----';

    aliceApp = await baselineAppFactory(
      'Alice Corp',
      bearerTokens[alice['id']],
      false,
      'localhost:8081',
      'nats://localhost:4222',
      natsPrivateKey,
      natsPublicKey,
      'localhost:8080',
      networkId,
      'localhost:8082',
      'localhost:8522',
      'http',
      null,
      'baseline workgroup',
      null,
    );

    bobApp = await baselineAppFactory(
      'Bob Corp',
      bearerTokens[bob['id']],
      true,
      'localhost:8085',
      'nats://localhost:4224',
      natsPrivateKey,
      natsPublicKey,
      'localhost:8086',
      networkId,
      'localhost:8083',
      'localhost:8511',
      'http',
      null,
      'baseline workgroup',
      null,
    );

    app = bobApp;
  });

  describe('workgroup', () => {
    describe('creation', () => {
      before(async () => {
        await promisedTimeout(10000);

        workgroup = app.getWorkgroup();
        workgroupToken = app.getWorkgroupToken();
      });

      it('should create the workgroup in the local registry', async () => {
        assert(workgroup, 'workgroup should not be null');
        assert(workgroup.id, 'workgroup id should not be null');
      });

      it('should authorize a bearer token for the workgroup', async () => {
        assert(workgroupToken, 'workgroup token should not be null');
      });

      it('should deploy the ERC1820 registry contract for the workgroup', async () => {
        const erc1820RegistryContract = await app.requireWorkgroupContract('erc1820-registry');
        assert(erc1820RegistryContract, 'workgroup ERC1820 registry contract should not be null');
      });

      it('should deploy the ERC1820 organization registry contract for the workgroup', async () => {
        const orgRegistryContract = await app.requireWorkgroupContract('organization-registry');
        assert(orgRegistryContract, 'workgroup organization registry contract should not be null');
      });
    });

    describe('participants', async () => {
      beforeEach(async () => {
        // sanity check
        assert(alice && bob, 'a administrative user should have been created for each workgroup counterparty');
        assert(bearerTokens.length === 2, 'a bearer token should have been authorized for each administrative user');
        assert(aliceApp, 'an instance should have been initialized for Alice Corp');
        assert(bobApp, 'an instance should have been initialized for Bob Corp');
        assert(workgroup, 'workgroup should not be null');
        assert(workgroupToken, 'workgroup token should not be null');
      });

      await promisedTimeout(10000); // ¯\_(ツ)_/¯

      shouldBehaveLikeAnInitialWorkgroupOrganization(bobApp);
      shouldBehaveLikeAWorkgroupOrganization(bobApp);

      describe('inviting participants to the workgroup', async () => {
        let inviteToken;

        before(async () => {
          await bobApp.inviteWorkgroupParticipant(alice.email);
          inviteToken = await scrapeInvitationToken('bob-ident-consumer'); // if configured, ident would have sent an email to Alice
        });

        it('should have created an invite for alice', async () => {
          assert(inviteToken, 'invite token should not be null');
        });

        describe('alice', async () => {
          before(async () => {
            await app.requireWorkgroupContract('erc1820-registry');
            await app.requireWorkgroupContract('organization-registry');
            await aliceApp.acceptWorkgroupInvite(inviteToken, app.getWorkgroupContracts());
          });

          shouldBehaveLikeAnInvitedWorkgroupOrganization(aliceApp);
          shouldBehaveLikeAWorkgroupOrganization(aliceApp);

          shouldBehaveLikeAWorkgroupCounterpartyOrganization(bobApp);
          shouldBehaveLikeAWorkgroupCounterpartyOrganization(aliceApp);
        });
      });

      describe('workflow', () => {
        describe('workstep', () => {
          before(async () => {
            const recipient = await aliceApp.resolveOrganizationAddress();
            await bobApp.sendProtocolMessage(recipient, Opcode.Baseline, {
              id: 'uuidv4()',
              hello: 'world',
              rfp_id: null,
            });
          });

          it('should increment protocol message tx count for the sender', async () => {
            assert(bobApp.getProtocolMessagesTx() === 1, 'protocol messages tx should equal 1');
          });

          it('should increment protocol message rx count for the recipient', async () => {
            await promisedTimeout(50);
            assert(aliceApp.getProtocolMessagesRx() === 1, 'protocol messages rx should equal 1');
          });
        });
      });
    });
  });
});
