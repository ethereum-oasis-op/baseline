import { assert }             from 'chai';
import { OrganizationHelper } from './organization-helper';
import { UserHelper }         from './user-helper';

export const shouldCreateOrganization = (
  organizationHelper: OrganizationHelper,
  userHelper: UserHelper,
  name: string,
  description: string,
  domain: string,
  natsHost: string,
): void => {

  describe(`${name} Creation`, () => {

    it(`should create ${name}`, async() => {
      await organizationHelper.create(
        name,
        description,
        domain,
        natsHost,
      );

      assert(organizationHelper.creationResponse, `${name} should not be null`);
      assert(organizationHelper.creationResponse?.id !== '', `${name} id should not be empty`);
    });

    it(`should create token for ${name}`, async() => {
      await organizationHelper.createToken();

      assert(organizationHelper.accessToken, `${name} access token should not be null`);
      assert(organizationHelper.refreshToken, `${name} refresh token should not be null`);
    });

    it(`should fetch ${name}`, async() => {
      await organizationHelper.fetch();

      assert(organizationHelper.fetchedResponse, `${name} should not be null`);
      assert(organizationHelper.fetchedResponse?.id !== '', `${name} id should not be empty`);
    });

  });

};
