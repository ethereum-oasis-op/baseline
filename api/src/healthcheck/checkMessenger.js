import { setOrganizationServerSetting } from '../db/models/baseline/server/settings';
import { getIdentities } from '../utils/messengerWrapper';

delete process.env.http_proxy;
delete process.env.HTTP_PROXY;
delete process.env.https_proxy;
delete process.env.HTTPS_PROXY;

export default async () => {
  const messengerURI = process.env.MESSENGER_URI;

  try {
    const response = await getIdentities();
    const whisperKey = response.data[0].publicKey;
    await setOrganizationServerSetting('messengerKey', whisperKey);
  } catch (error) {
    if (!error.response) {
      console.error('Error: Network Error', error);
    } else {
      console.error(error.response.data.message);
    }
  }

  return true;
};
