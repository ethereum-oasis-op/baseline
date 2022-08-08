import { Vault as VaultObject } from '@provide/types/dist/cjs/vault/vault';
import { assert }               from 'chai';
import { Vault }                from 'provide-js';
import { Organization }         from '../src/organization';
import { User }                 from '../src/user';

describe('Baseline', () => {

  describe('User Creation', () => {

    const identScheme = 'http';
    const identHost   = 'localhost:8085';

    let userAlice: User;
    let userBob: User;

    before(async() => {
      userAlice = await User.create(
        identScheme,
        identHost,
        'Alice',
        'Baseline',
        `alice${new Date().getTime()}@baseline.local`,
        'alicep455',
      );

      userBob = await User.create(
        identScheme,
        identHost,
        'Bob',
        'Baseline',
        `bob${new Date().getTime()}@baseline.local`,
        'bobp455',
      );
    });

    it('should create user Alice', () => {
      assert(userAlice, 'user Alice should not be null');
      assert(userAlice.id !== '', 'user Alice id should not be empty');
    });

    it('should authenticate user Alice', () => {
      assert(userAlice.accessToken, 'user Alice access token should not be null');
      assert(userAlice.refreshToken, 'user Alice refresh token should not be null');
    });

    it('should create user Bob', () => {
      assert(userBob, 'user Bob should not be null');
      assert(userBob.id !== '', 'user Bob id should not be empty');
    });

    it('should authenticate user Bob', () => {
      assert(userBob.accessToken, 'user Bob access token should not be null');
      assert(userBob.refreshToken, 'user Bob refresh token should not be null');
    });

    describe('Organization Creation', () => {

      const natsHost = 'nats://localhost:4224';

      let orgAlice: Organization;
      let orgBob: Organization;

      before(async() => {
        orgAlice = await Organization.create(
          userAlice.accessToken,
          identScheme,
          identHost,
          natsHost,
          'Alice Corp',
          'a corporation owned by Alice',
          'alice.baseline.local',
        );

        orgBob = await Organization.create(
          userBob.accessToken,
          identScheme,
          identHost,
          natsHost,
          'Bob Corp',
          'a corporation owned by Bob',
          'bob.baseline.local',
        );
      });

      it('should create organization Alice Corp', () => {
        assert(orgAlice, 'organization Alice Corp should not be null');
        assert(orgAlice.id !== '', 'organization Alice Corp id should not be empty');
      });

      it('should create tokens for organization Alice Corp', () => {
        assert(orgAlice.accessToken !== '', 'organization Alice Corp access token should not be empty');
        assert(orgAlice.refreshToken !== '', 'organization Alice Corp refresh token should not be empty');
      });

      it('should create organization Bob Corp', () => {
        assert(orgBob, 'organization Bob Corp should not be null');
        assert(orgBob.id !== '', 'organization Bob Corp id should not be empty');
      });

      it('should create tokens for organization Bob Corp', () => {
        assert(orgBob.accessToken !== '', 'organization Bob Corp access token should not be empty');
        assert(orgBob.refreshToken !== '', 'organization Bob Corp refresh token should not be empty');
      });

      describe('Vault Creation', () => {

        const vaultScheme = 'http';
        const vaultHost   = 'localhost:8083';

        let vaultAlice: VaultObject;
        let vaultBob: VaultObject;

        before(async() => {
          const vaultAlicePage = await new Vault(
            orgAlice.accessToken,
            vaultScheme,
            vaultHost,
          ).fetchVaults(
            {rpp: 1},
          );
          console.log(vaultAlicePage);
          vaultAlice = vaultAlicePage.results[0];

          const vaultBobPage = await new Vault(
            orgBob.accessToken,
            vaultScheme,
            vaultHost,
          ).fetchVaults(
            {rpp: 1},
          );
          console.log(vaultBobPage);
          vaultBob = vaultBobPage.results[0];
        });

        it('should have created a default vault for organization Alice Corp', () => {
          assert(vaultAlice, 'organization vault for Alice Corp should not be null');
        });

        it('should have created a default vault for organization Bob Corp', () => {
          assert(vaultBob, 'organization vault for Bob Corp should not be null');
        });

      });

    });

  });

});
