import { assert }      from 'chai';
import { VaultHelper } from './vault-helper';

export const shouldCreateVault = (
  vaultHelper: VaultHelper,
  name: string,
  description: string,
): void => {

  describe(`${name} Creation`, () => {

    it(`should create ${name}`, async() => {
      await vaultHelper.create(
        name,
        description,
      );

      assert(vaultHelper.creationResponse, `${name} should not be null`);
      assert(vaultHelper.creationResponse?.id !== '', `${name} id should not be empty`);
    });

    it(`should fetch ${name}`, async() => {
      await vaultHelper.fetch();

      assert(vaultHelper.fetchedResponse, `${name} should not be null`);
      assert(vaultHelper.fetchedResponse?.id !== '', `${name} id should not be empty`);
    });

  });

};
