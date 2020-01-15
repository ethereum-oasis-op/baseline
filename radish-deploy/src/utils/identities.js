const axios = require('axios');

let whisperIdentities;

const {
  MESSENGER_BUYER_URI,
  MESSENGER_SUPPLIER1_URI,
  MESSENGER_SUPPLIER2_URI,
} = process.env;

const getIdentity = url => axios.get(url).then(response => response.data[0].publicKey);

const getIdentities = async () => {
  if (whisperIdentities) {
    return whisperIdentities;
  }

  try {
    const buyer = await getIdentity(`${MESSENGER_BUYER_URI}/identities`);
    const supplier1 = await getIdentity(`${MESSENGER_SUPPLIER1_URI}/identities`);
    const supplier2 = await getIdentity(`${MESSENGER_SUPPLIER2_URI}/identities`);
    console.log('✅  Retrieved all Whisper Identity for each user');
    whisperIdentities = {
      buyer,
      supplier1,
      supplier2,
    };
    return whisperIdentities;
  } catch (error) {
    console.log('Could not retrieve Whisper ID. Check health of MESSENGER services:', error);
    return process.exit(1);
  }
};

module.exports = {
  getIdentities,
};
