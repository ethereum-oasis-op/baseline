import { Ident } from 'provide-js';
import { execSync } from 'child_process';
import { BaselineApp } from '../src/index';

export const promisedTimeout = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const authenticateUser = async (identHost, email, password) => {
  const auth = await Ident.authenticate({
    email: email,
    password: password,
  }, 'http', identHost);
  return auth;
};

export const baselineAppFactory = async (
  orgName,
  bearerToken,
  identHost,
  natsHost,
  nchainHost,
  networkId,
  vaultHost,
  workgroup,
  workgroupName,
  workgroupToken,
): Promise<BaselineApp> => {
  return new BaselineApp(
    {
      identApiScheme: 'http',
      identApiHost: identHost,
      nchainApiScheme: 'http',
      nchainApiHost: nchainHost,
      networkId: networkId, // FIXME-- boostrap network genesis if no public testnet faucet is configured...
      orgName: orgName,
      token: bearerToken,
      vaultApiScheme: 'http',
      vaultApiHost: vaultHost,
      workgroup: workgroup,
      workgroupName: workgroupName,
      workgroupToken: workgroupToken,
    },
    {
      bearerToken: bearerToken,
      natsServers: [natsHost],
    },
  );
};

// subsidize all transactions (value + gas) broadcast through the NChain gateway
// ask a maintainer for a valid address/private key to demystify this configuration...
export const configureRopstenFaucet = async (port, userId, address, encryptedPrivateKey) => {
  try {
    // HACK!!! :D  --KT
    execSync(`PGPASSWORD=ident psql -h 0.0.0.0 -p ${port} -U ident ident_dev -c "INSERT INTO applications (id, created_at, name, user_id, network_id, config, encrypted_config) values ('146ab73e-b2eb-4386-8c6f-93663792c741', now(), 'Ropsten Faucet', '${userId}', '66d44f30-9092-4182-a3c4-bc02736d6ae5', '{}', '\x2d2d2d2d2d424547494e20504750204d4553534147452d2d2d2d2d0a0a7763464d413247736a3455384551726f415241414d4f783434336c5264644753422f506e6248573069557244574e674a362f714a676c53434b6239394a4e774e0a50444f48326d516c3938766b70324f714672387557614e414a32324277377a58622b5138717370397452646f576c657a4b7664387578594f394473562b4778330a495959433870506d515a597a6d4a794c36533554637a4a4c61666a4235734b4437617935486737776a676e4a375a6a3042497930782f57694f712b316b7359670a695779555845436d484f6b4f4d532b486c6232364d7164586d5049473936384d4f555a306d654e4744574b3033553766495a476a4766725a442f622f7453346e0a6e6a4279436f3357767830417334357a5476517073517372417662367649456b6c6779336d54752f7769326868544557645230367a32634c547753556f6458450a435164687a5941346656782f4e434878483374422f746f324c513167796965597962362b4b7566395a31423472536239646c687a72744439774d5752704847310a5132776c6b5570424f6b524e344673785649734c536e58345564335846644a7543506d36656f6f7943542b71434c367635594e46322b4d7a6a6f58344f4d796a0a6c4c4436384e3565663744513077584a79756e2b3951472f78487434794c727864346f7134486e4f4b446c586d7858772f6670795537586d505a6a51454850510a536261376a4c30544652584d55372b78582b527a715442305a664468387853307030656c7643466558745a734a34356d7845416f33523163615966717258324b0a785177305055684133364e684b38474d354370506d76377a724169366e43554f6a6849314f6450795a757265637a644463652f67346c6c484333775a35666f4d0a506b6d576f594d446c48717162316b2b4359324347503642364f41796b3454747848767a47725779594f66546533444734657631504a496f57335a54594d50530a3441486a2f516d4f5754694667333768752b6667426543503459386c344748692f36655678654263355231355252776372742f707934617549714d4d316c4a6c0a474e476c716638527065416c7432744c39576b3334446a6b576f333839475a4b704d7969322b4a71324853744f4f41453468434d625458674965416b34432f6b0a2b4c585761436678737152452b694d793669424c5a754b552f76796a3466466b41413d3d0a3d5375327a0a2d2d2d2d2d454e4420504750204d4553534147452d2d2d2d2d');" 2&>/dev/null`);
    execSync(`PGPASSWORD=nchain psql -h 0.0.0.0 -p ${port} -U nchain nchain_dev -c "INSERT INTO accounts (id, created_at, application_id, network_id, address, private_key) values ('1be0f75c-c05d-42d7-85fd-0c406466a95c', now(), '146ab73e-b2eb-4386-8c6f-93663792c741', '66d44f30-9092-4182-a3c4-bc02736d6ae5', '${address}', '${encryptedPrivateKey}');" 2&>/dev/null`);
  } finally {
    execSync(`PGPASSWORD=nchain psql -h 0.0.0.0 -p ${port} -U nchain nchain_dev -c "UPDATE networks SET enabled = true WHERE id = '66d44f30-9092-4182-a3c4-bc02736d6ae5'" 2&>/dev/null`);
    return true;
  }
};

export const createUser = async (identHost, firstName, lastName, email, password) => {
  const user = await Ident.createUser({
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password,
  }, 'http', identHost);
  return user;
};
