import { assert }       from 'chai';
import { Organization } from '../src/organization';
import { User }         from '../src/user';

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

      it('should create organization Alice', () => {
        assert(orgAlice, 'organization Alice should not be null');
        assert(orgAlice.id !== '', 'organization Alice id should not be empty');
      });

      it('should create tokens for organization Alice', () => {
        assert(orgAlice.accessToken !== '', 'organization Alice access token should not be empty');
        assert(orgAlice.refreshToken !== '', 'organization Alice refresh token should not be empty');
      });

      it('should create organization Bob', () => {
        assert(orgBob, 'organization Bob should not be null');
        assert(orgBob.id !== '', 'organization Bob id should not be empty');
      });

      it('should create tokens for organization Bob', () => {
        assert(orgBob.accessToken !== '', 'organization Bob access token should not be empty');
        assert(orgBob.refreshToken !== '', 'organization Bob refresh token should not be empty');
      });

    });

  });

});
