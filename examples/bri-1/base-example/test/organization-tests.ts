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

  describe(`Organization ${name} Creation`, () => {

    it(`should create organization ${name}`, async() => {
      await organizationHelper.create(
        userHelper,
        name,
        description,
        domain,
        natsHost,
      );

      assert(organizationHelper.creationResponse, `organization ${name} should not be null`);
      assert(organizationHelper.creationResponse?.id !== '', `organization ${name} id should not be empty`);
    });

    it(`should create token for organization ${name}`, async() => {
      await organizationHelper.createToken(
        userHelper,
      );

      assert(organizationHelper.accessToken, `organization ${name} access token should not be null`);
      assert(organizationHelper.refreshToken, `organization ${name} refresh token should not be null`);
    });

    it(`should fetch organization ${name}`, async() => {
      await organizationHelper.fetch(
        userHelper,
      );

      assert(organizationHelper.fetchedResponse, `organization ${name} should not be null`);
      assert(organizationHelper.fetchedResponse?.id !== '', `organization ${name} id should not be empty`);
    });

  });

};
