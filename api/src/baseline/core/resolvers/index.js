import { setJobCompleted } from '../../../db/models/baseline/baselineTaskGroup';

const coreResolvers = {};
const customResolvers = {};

export const callCoreResolver = async (baselineId, taskId, resolverFunc, params, options) => {
  await resolverFunc(baselineId, taskId, params, options);
};
export const registerCoreResolver = (name, func) => {
  coreResolvers[name] = func;
};

export const callCustomResolver = async (baselineId, taskId, resolverFunc, params, options) => {
  const result = await resolverFunc(params, options);
  await setJobCompleted(baselineId, taskId, result);
};

export const registerCustomResolver = (name, func) => {
  customResolvers[name] = func;
};

export const isCustomResolver = name => {
  return !!customResolvers[name];
};

export const isCoreResolver = name => {
  return !!coreResolvers[name];
};

export const getResolvers = () => {
  return Object.assign(customResolvers, coreResolvers);
};

export const getResolver = name => {
  const resolvers = Object.assign(customResolvers, coreResolvers);
  return resolvers[name];
};

export default {
  registerCoreResolver,
  registerCustomResolver,
  getResolvers,
  getResolver,
};
