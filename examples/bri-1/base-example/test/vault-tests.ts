import { assert }      from 'chai';
import { VaultHelper } from './vault-helper';

export const shouldCreateVault = (
  vaultHelper: VaultHelper,
  name: string,
): void => {

  describe(`Vault ${name} Creation`, () => {

    it(`should fetch default vault created for ${name}`, async() => {
      await vaultHelper.fetch();

      assert(vaultHelper.fetchedResponse, `default vault for ${name} should not be null`);
    });

  });

};
