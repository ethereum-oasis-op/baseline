import { assert } from 'chai';
import { shouldBehaveLikeAWorkgroupOrganization } from './shared';
import { authenticateUser, baselineAppFactory, configureRopstenFaucet, createUser, promisedTimeout } from './utils';
import { BaselineApp } from '../src';

const faucetAddress = process.env['FAUCET_ADDRESS'];
const faucetEncryptedPrivateKey = process.env['FAUCET_PRIVATE_KEY'];
const networkId = process.env['NCHAIN_NETWORK_ID'] || '66d44f30-9092-4182-a3c4-bc02736d6ae5'; // ropsten

const setupUser = async (identHost, firstname, lastname, email, password) => {
  const user = (await createUser(identHost, firstname, lastname, email, password)).responseBody;
  const auth = await authenticateUser(identHost, email, password);
  const bearerToken = auth.responseBody['token'].token;
  assert(bearerToken, `failed to authorize bearer token for user ${email}`);
  return [user, bearerToken];
};

describe('baseline', () => {
  let app: BaselineApp; // app instance used for initial setup of the on-chain org registry
  let bearerTokens; // user API credentials

  let alice;
  let aliceApp: BaselineApp;

  let bob;
  let bobApp: BaselineApp;

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

    bobApp = await baselineAppFactory(
      'Bob Corp',
      bearerTokens[bob['id']],
      'localhost:8085',
      'nats://localhost:4224',
      'localhost:8086',
      networkId,
      'localhost:8083',
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

        workgroup = await app.createWorkgroup('baseline workgroup'); // Bob Corp is the founding member of the workgroup...
        workgroupToken = app.getWorkgroupToken();
      });

      it('should create the workgroup in the local registry', async () => {
        assert(workgroup, 'workgroup should not be null');
        assert(workgroup.id, 'workgroup id should not be null');
      });

      it('should authorize a bearer token for the workgroup', async () => {
        assert(workgroupToken, 'workgroup token should not be null');
      });

      it('should deploy the ERC1820 org registry contract for the workgroup', async () => {
        await promisedTimeout(85000);
        const orgRegistryContract = app.getWorkgroupContract('organization-registry');
        assert(orgRegistryContract, 'workgroup organization registry contract should not be null');
      });
    });

    describe('organizations', async () => {
      beforeEach(async () => {
        // sanity check
        assert(alice && bob, 'a administrative user should have been created for each workgroup counterparty');
        assert(bearerTokens.length === 2, 'a bearer token should have been authorized for each administrative user');
        assert(aliceApp, 'an app instance should have been initialized for Alice Corp');
        assert(bobApp, 'an app instance should have been initialized for Bob Corp');
        assert(workgroup, 'workgroup should not be null');
        assert(workgroupToken, 'workgroup token should not be null');
      });

      await promisedTimeout(5000); // ¯\_(ツ)_/¯
      shouldBehaveLikeAWorkgroupOrganization(bobApp);

      describe('inviting alice to the workgroup', async () => {
        // aliceApp = baselineAppFactory(
        //   'Alice Corp',
        //   bearerTokens[alice['id']],
        //   'localhost:8081',
        //   'nats://localhost:4222',
        //   'localhost:8080',
        //   networkId,
        //   'localhost:8082',
        //   workgroup,
        //   null,
        //   workgroupToken,
        // );

        // shouldBehaveLikeAWorkgroupOrganization(aliceApp);
      });
    });
  });

  describe('workflow', () => {
    describe('workstep', () => {

    });
  });
});
