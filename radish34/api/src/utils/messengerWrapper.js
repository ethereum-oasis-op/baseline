const axios = require('axios');

const messengerUrl = process.env.MESSENGER_URI ? `${process.env.MESSENGER_URI}/api/v1` : 'http://localhost:4001/api/v1';

const getMessages = async (since, partnerId) => {
  const params = { since, partnerId };
  try {
    return await axios.get(`${messengerUrl}/messages`, { params });
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getSingleMessage = async messageId => {
  try {
    return (await axios.get(`${messengerUrl}/messages/${messageId}`)).body;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const createMessage = async (myId, partnerId, payload) => {
  const data = { payload, recipientId: partnerId };
  const headers = { 'x-messenger-id': myId };
  try {
    return await axios.post(`${messengerUrl}/messages`, data, { headers });
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getIdentities = async () => {
  try {
    return await axios.get(`${messengerUrl}/identities`);
  } catch (error) {
    console.error(error);
    return error;
  }
};

const createIdentity = async myId => {
  const data = {};
  const headers = { 'x-messenger-id': myId };
  try {
    return await axios.post(`${messengerUrl}/identities`, data, { headers });
  } catch (error) {
    console.error(error);
    return error;
  }
};

const healthCheck = async () => {
  try {
    return await axios.get(`${messengerUrl}/health`);
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = {
  getMessages,
  getSingleMessage,
  createMessage,
  getIdentities,
  createIdentity,
  healthCheck,
};
