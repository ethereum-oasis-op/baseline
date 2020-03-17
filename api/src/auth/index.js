import axios from 'axios';

export const getAuthorization = async () => {
  // Placeholder for any authentication hooks
  const { data } = await axios.get(`${process.env.MESSENGER_URI}/identities`);
  const identity = data && data[0] ? data[0].publicKey : null;
  return { identity };
};

export default {
  getAuthorization,
};
