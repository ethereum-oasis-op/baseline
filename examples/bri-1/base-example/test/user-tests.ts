import { assert }     from 'chai';
import { UserHelper } from './user-helper';

export const shouldCreateUser = (
  userHelper: UserHelper,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): void => {

  describe(`User ${firstName} Creation`, () => {

    it(`should create user ${firstName}`, async() => {
      await userHelper.create(
        firstName,
        lastName,
        email,
        password,
      );

      assert(userHelper.creationResponse, `user ${firstName} should not be null`);
      assert(userHelper.creationResponse?.id !== '', `user ${firstName} id should not be empty`);
    });

    it(`should authenticate user ${firstName}`, async() => {
      await userHelper.authenticate(
        email,
        password,
      );

      assert(userHelper.accessToken, `user ${firstName} access token should not be null`);
      assert(userHelper.refreshToken, `user ${firstName} refresh token should not be null`);
    });

    it(`should fetch user ${firstName}`, async() => {
      await userHelper.fetch();

      assert(userHelper.fetchedResponse, `user ${firstName} should not be null`);
      assert(userHelper.fetchedResponse?.id !== '', `user ${firstName} id should not be empty`);
    });

  });

};
