const axios = require('axios');
const messengerUrl = process.env.MESSENGER_URL || 'http://localhost:4001/api/v1';

const getMessages = async (since, partnerId) => {
  let params = {
    since: since,
    partnerId: partnerId
  };
  try {
    return await axios.get(`${messengerUrl}/messages`, { params: params });
  } catch (error) {
    console.error(error)
  };
}

const getSingleMessage = async (messageId) => {
  try {
    return await axios.get(`${messengerUrl}/messages/${messageId}`);
  } catch (error) {
    console.error(error)
  };
}

const createMessage = async (myId, partnerId, payload) => {
  let data = {
    payload: payload,
    partnerId: partnerId
  };
  let headers = {
    'x-messenger-id': myId
  };
  try {
    return await axios.post(`${messengerUrl}/messages`, data, { headers: headers });
  } catch (error) {
    console.error(error)
  };
}

const getIdentities = async () => {
  try {
    return await axios.get(`${messengerUrl}/identities`);
  } catch (error) {
    console.error(error)
  };
}

const createIdentity = async (myId) => {
  let data = {};
  let headers = {
    'x-messenger-id': myId
  };
  try {
    return await axios.post(`${messengerUrl}/identities`, data, { headers: headers });
  } catch (error) {
    console.error(error)
  };
}

const healthCheck = async () => {
  try {
    return await axios.get(`${messengerUrl}/health-check`);
  } catch (error) {
    console.error(error)
  };
}

module.exports = {
  getMessages,
  getSingleMessage,
  createMessage,
  getIdentities,
  createIdentity,
  healthCheck
};
