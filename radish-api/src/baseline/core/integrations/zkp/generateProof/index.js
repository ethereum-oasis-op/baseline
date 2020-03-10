import Queue from 'bull';
import { resumeTaskGroupById } from '../../../index';
import {
  setJobStarted,
  setJobCompleted,
  getBaselineTaskGroupById,
} from '../../../../../db/models/baseline/baselineTaskGroup';
import { registerCoreResolver } from '../../../resolvers';

const { setQueues } = require('bull-board');

const requestNamespace = `baseline:zkp:generateProof:req`;
const ackNamespace = `baseline:zkp:generateProof:ack`;
const responseNamespace = `baseline:zkp:generateProof:res`;
const generateProofNamespace = `baseline:zkp:generateProof`;
const requestQueue = new Queue(requestNamespace, process.env.REDIS_URL);
const ackQueue = new Queue(ackNamespace, process.env.REDIS_URL);
const responseQueue = new Queue(responseNamespace, process.env.REDIS_URL);
const generateProofQueue = new Queue(generateProofNamespace, process.env.REDIS_URL);

setQueues([requestQueue, ackQueue, responseQueue, generateProofQueue]);

ackQueue.process(`${__dirname}/acknowledge.js`);
ackQueue.on('completed', async (job, data) => {
  await setJobStarted(data.baselineId, data.taskId, data.jobId);
});

responseQueue.process(`${__dirname}/processResponse.js`);
responseQueue.on('completed', async (job, data) => {
  await setJobCompleted(data.baselineId, data.taskId, data.result);
  const baselineTaskGroup = await getBaselineTaskGroupById(data.baselineId);
  resumeTaskGroupById(data.baselineId);
});

const generateProof = async (baselineId, taskId, params, options) => {
  await requestQueue.add({ baselineId, taskId, params, options });
};

export const register = () => {
  // registerCoreResolver('zkp', 'generateProof', generateProof);
  registerCoreResolver('generateProof', generateProof);
};

export default {
  queues: [],
  register,
  create: generateProof,
  onComplete: func => {
    // responseQueue.on('completed', (job, data) => {
    //   // console.log('Response queue is being called as a sep onComplete func');
    //   // console.log('API: PART 4: Request for generate Proof successfully transmitted', data);
    //   // func(job, data);
    // });
  },
};
