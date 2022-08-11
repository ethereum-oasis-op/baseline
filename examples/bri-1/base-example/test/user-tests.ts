import { assert }     from 'chai';
import { UserHelper } from './user-helper';

export const shouldCreateUser = (
  userHelper: UserHelper,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): void => {

  describe(`${firstName} Creation`, () => {

    it(`should create ${firstName}`, async() => {
      await userHelper.create(
        firstName,
        lastName,
        email,
        password,
      );

      assert(userHelper.creationResponse, `${firstName} should not be null`);
      assert(userHelper.creationResponse?.id !== '', `${firstName} id should not be empty`);
    });

    it(`should authenticate ${firstName}`, async() => {
      await userHelper.authenticate(password);

      assert(userHelper.accessToken, `${firstName} access token should not be null`);
      assert(userHelper.refreshToken, `${firstName} refresh token should not be null`);
    });

    it(`should fetch ${firstName}`, async() => {
      await userHelper.fetch();

      assert(userHelper.fetchedResponse, `${firstName} should not be null`);
      assert(userHelper.fetchedResponse?.id !== '', `${firstName} id should not be empty`);
    });

  });

};
