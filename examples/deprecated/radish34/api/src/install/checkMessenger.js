import axios from 'axios';
import { logger } from 'radish34-logger';

delete process.env.http_proxy;
delete process.env.HTTP_PROXY;
delete process.env.https_proxy;
delete process.env.HTTPS_PROXY;

const getIdentity = url =>
  axios
    .get(url)
    .then(response => response.data[0].publicKey)
    .catch(err => {
      logger.error('Could not get messenger identity.\n%o', err, { service: 'API' });
    });

export default async () => {
  const messengerURI = process.env.MESSENGER_URI;

  try {
    const loc = `${messengerURI}/api/v1/identities`;
    const messengerKey = await getIdentity(loc);
    logger.info(`Whisper key: ${messengerKey}.`, { service: 'API' });
  } catch (error) {
    if (!error.response) {
      logger.error('Network error.\n%o', error, { service: 'API' });
    } else {
      logger.error('\n%o', error.response.data, { service: 'API' });
    }
  }

  return true;
};
