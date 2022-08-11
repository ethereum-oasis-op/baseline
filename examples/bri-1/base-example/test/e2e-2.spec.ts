import { OrganizationHelper }       from './organization-helper';
import { shouldCreateOrganization } from './organization-tests';
import { shouldConnectToIdent }     from './stack-tests';
import { shouldCreateUser }         from './user-tests';
import { UserHelper }               from './user-helper';
import { VaultHelper }              from './vault-helper';
import { shouldCreateVault }        from './vault-tests';

describe('Stack Status', () => {

  const identScheme = 'http';
  const identHost   = 'localhost:8085';

  shouldConnectToIdent(
    identScheme,
    identHost,
  );

  describe('User Creation', () => {

    const userAlice: UserHelper = new UserHelper(
      identScheme,
      identHost,
    );

    const userBob: UserHelper = new UserHelper(
      identScheme,
      identHost,
    );

    shouldCreateUser(
      userAlice,
      'Alice',
      'Baseline',
      `alice${new Date().getTime()}@baseline.local`,
      'alicep455',
    );

    shouldCreateUser(
      userBob,
      'Bob',
      'Baseline',
      `bob${new Date().getTime()}@baseline.local`,
      'bobp455',
    );

    describe('Organization Creation', () => {

      const natsHost = 'nats://localhost:4224';

      const organizationAlice: OrganizationHelper = new OrganizationHelper(
        identScheme,
        identHost,
        userAlice,
      );

      const organizationBob: OrganizationHelper = new OrganizationHelper(
        identScheme,
        identHost,
        userBob,
      );

      shouldCreateOrganization(
        organizationAlice,
        userAlice,
        'Alice Corp',
        'a corporation owned by Alice',
        `alice.baseline.local`,
        natsHost,
      );

      shouldCreateOrganization(
        organizationBob,
        userBob,
        'Bob Corp',
        'a corporation owned by Bob',
        `bob.baseline.local`,
        natsHost,
      );

      describe('Vault Creation', () => {

        const vaultScheme = 'http';
        const vaultHost   = 'localhost:8083';

        const vaultAlice: VaultHelper = new VaultHelper(
          vaultScheme,
          vaultHost,
          organizationAlice,
        );

        const vaultBob: VaultHelper = new VaultHelper(
          vaultScheme,
          vaultHost,
          organizationBob,
        );

        shouldCreateVault(
          vaultAlice,
          'Alice Corp Vault',
          'a vault for Alice Corp',
        );

        shouldCreateVault(
          vaultBob,
          'Bob Corp Vault',
          'a vault for Bob Corp',
        );

      });

    });

  });

});
