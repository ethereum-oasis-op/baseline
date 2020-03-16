import axios from 'axios';

delete process.env.http_proxy;
delete process.env.HTTP_PROXY;
delete process.env.https_proxy;
delete process.env.HTTPS_PROXY;

const getIdentity = url =>
  axios
    .get(url)
    .then(response => response.data[0].publicKey)
    .catch(err => {
      console.log('Could not get messenger identity');
      console.error(err);
    });

export default async () => {
  const messengerURI = process.env.MESSENGER_URI;

  try {
    const loc = `${messengerURI}/api/v1/identities`;
    const messengerKey = await getIdentity(loc);
    console.log('Whisper key:', messengerKey);
  } catch (error) {
    if (!error.response) {
      console.error('Error: Network Error');
    } else {
      console.error(error.response.data.message);
    }
  }

  return true;
};
