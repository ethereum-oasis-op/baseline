import Queue from 'bull';
import { registerCoreResolver } from '../../../resolvers';
// import { createHasteMap } from 'jest-runtime';
// import BLTS, { createNewBaselineTask } from '../../../db/models/baselineTask';

const { setQueues } = require('bull-board');

const requestNamespace = `baseline:messenger:sendMessage:req`;
const ackNamespace = `baseline:messenger:sendMessage:ack`;
const responseNamespace = `baseline:messenger:sendMessage:res`;
const sendMessageNamespace = `baseline:messenger:sendMessage`;
const receiveMessageNamespace = `baseline:messenger:recieveMessage`;
export const requestQueue = new Queue(requestNamespace, process.env.REDIS_URL);
export const ackQueue = new Queue(ackNamespace, process.env.REDIS_URL);
export const responseQueue = new Queue(responseNamespace, process.env.REDIS_URL);
export const sendMessageQueue = new Queue(sendMessageNamespace, process.env.REDIS_URL);
export const recieveMessageQueue = new Queue(receiveMessageNamespace, process.env.REDIS_URL);
// TODO: handle receipt of whisper message that comes back from counterparty
// export const recieveMessageQueue = new Queue(sendMessageNamespace, process.env.REDIS_URL);

setQueues([requestQueue, ackQueue, responseQueue, sendMessageQueue]);

ackQueue.process(`${__dirname}/acknowledge.js`);
responseQueue.process(`${__dirname}/processResponse.js`);

ackQueue.on('completed', (job, data) => {
  // Update Baseline Object with the job id
  console.log('API: Request for sendMessage successfully receieved', data);
});

responseQueue.on('completed', (job, data) => {
  // Update Baseline Object
  console.log('API: Response for sendMessage successfully completed', data);
});

const createMessage = async (baselineId, taskId, inputs) => {
  await requestQueue.add({ baselineId, taskId, inputs: inputs.payload });
};

export const register = async () => {
  await registerCoreResolver('messenger', 'sendMessage', (baselineId, taskId, payload) =>
    createMessage(baselineId, taskId, payload),
  );
};

export default {
  queues: [],
  register,
  create: createMessage,
  onComplete: func => {
    responseQueue.on('completed', (job, data) => {
      console.log('API: Request for sendMessage successfully transmitted', data);
      func(job, data);
    });
  },
};
