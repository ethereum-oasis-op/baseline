import mongoose from 'mongoose';
import { BaselineTask } from './baselineTask';
import { logger } from 'radish34-logger';

const { Map } = mongoose.Schema.Types;
const { Schema } = mongoose;

const BaselineTaskGroupSchema = new Schema({
  _id: String,
  type: String,
  results: Map,
  completed: { type: Boolean, default: false },
  data: Map,
  baselineTasks: [BaselineTask.schema],
  resolvers: [String],
});

export const BaselineTaskGroup = mongoose.model('baselinetaskgroup', BaselineTaskGroupSchema);

export const convertMongooseMaptoJSON = _map => {
  return _map ? _map.toJSON() : {};
};

export const parseMongooseBaselineTask = baselineTask => {
  return Object.assign(baselineTask.toObject(), {
    resolverOptions: convertMongooseMaptoJSON(baselineTask.resolverOptions),
  });
};

export const parseMongooseBaselineTaskGroup = baselineTaskGroup => {
  return Object.assign(baselineTaskGroup.toObject(), {
    data: convertMongooseMaptoJSON(baselineTaskGroup.data),
    baselineTasks: baselineTaskGroup.baselineTasks.map(parseMongooseBaselineTask),
  });
};

export const createNewBaselineTaskGroup = async input => {
  const baselineTaskGroup = await BaselineTaskGroup.create(input);
  return parseMongooseBaselineTaskGroup(baselineTaskGroup);
};

export const getBaselineTaskGroupById = async id => {
  const baselineTaskGroup = await BaselineTaskGroup.findById(id);
  return parseMongooseBaselineTaskGroup(baselineTaskGroup);
};

export const getPendingBaselineTasks = async () => {
  const baselineTaskGroups = await BaselineTaskGroup.find({ 'baselineTasks.jobId': { $ne: null } });
  return baselineTaskGroups.map(parseMongooseBaselineTaskGroup);
};

export const getBaselineTaskByJobId = async taskId => {
  const baselineTask = await BaselineTaskGroup.findOne({ 'baselineTasks._id': taskId });
  baselineTask.data = convertMongooseMaptoJSON(baselineTask.data);
  baselineTask.resolverOptions = convertMongooseMaptoJSON(baselineTask.resolverOptions);
  return baselineTask;
};

export const getBaselineTaskResolverOptions = async taskId => {
  const baselineTaskGroup = await BaselineTaskGroup.findOne({ 'baselineTasks._id': taskId });
  const task = baselineTaskGroup.baselineTasks.id(taskId);
  const parsedTask = parseMongooseBaselineTask(task);
  return parsedTask.resolverOptions;
};

export const setJobStarted = async (baselineId, taskId, jobId) => {
  const baselineTaskGroup = await BaselineTaskGroup.findById(baselineId);
  baselineTaskGroup.baselineTasks.id(taskId).jobId = jobId;
  await baselineTaskGroup.save();
  return true;
};

export const setJobCompleted = async (baselineId, taskId, result) => {
  const baselineTaskGroup = await BaselineTaskGroup.findById(baselineId);
  baselineTaskGroup.baselineTasks.id(taskId).completed = true;
  Object.entries(result).forEach(([key, value]) => {
    baselineTaskGroup.data.set(key, value);
  });
  await baselineTaskGroup.save();
};

export const setBaselineTaskGroupToCompletedById = async baselineId => {
  const baselineTaskGroup = await BaselineTaskGroup.findById(baselineId);
  baselineTaskGroup.completed = true;
  await baselineTaskGroup.save();
  const updatedBaselineTaskGroup = await getBaselineTaskGroupById(baselineId);
  logger.info('Saved: %o', updatedBaselineTaskGroup, { service: 'API' });
};

export default {
  BaselineTaskGroup,
  createNewBaselineTaskGroup,
  getBaselineTaskResolverOptions,
  getBaselineTaskGroupById,
  getPendingBaselineTasks,
  getBaselineTaskByJobId,
};
