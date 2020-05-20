import { findIndex, filter } from 'lodash';
import { BaselineTask } from '../../db/models/baseline/baselineTask';
import {
  BaselineTaskGroup,
  getBaselineTaskResolverOptions,
  getBaselineTaskGroupById,
  createNewBaselineTaskGroup,
  setBaselineTaskGroupToCompletedById,
} from '../../db/models/baseline/baselineTaskGroup';
import {
  getResolver,
  getResolvers,
  callCustomResolver,
  callCoreResolver,
  isCoreResolver,
} from './resolvers';
import { logger } from 'radish34-logger';

export const getUncompleteBaselineGroups = async () => {
  const uncompleted = await BaselineTaskGroup.find({
    'baselineTasks.completed': false,
  });
  return uncompleted;
};

export const findNextTaskToResume = baselineTasks => {
  const id = findIndex(baselineTasks, ['completed', false]);
  return baselineTasks[id];
};

export const checkTaskRequirements = async (data, requirements) => {
  try {
    const results = requirements.map(key => {
      return { key, exists: !!data[key] };
    });
    const missing = filter(results, ['exists', false]);
    if (missing.length) {
      const listOfMissing = missing.map(requirement => requirement.key).join(', ');
      throw Error(`Baseline Task is missing required values: ${listOfMissing}`);
    }
  } catch (err) {
    logger.error('\n%o', err, { service: 'API' });
    return false;
  }
  return true;
};

export const checkTaskGroupResolvers = async baselineTasks => {
  try {
    const registeredResolvers = await getResolvers();
    const resolvers = baselineTasks.map(task => {
      return {
        key: task.resolver,
        exists: !!registeredResolvers[task.resolver],
      };
    });
    const missing = filter(resolvers, ['exists', false]);
    if (missing.length) {
      const listOfMissing = missing.map(requirement => requirement.key).join(', ');
      logger.error(`Baseline Task is missing required resolvers: ${listOfMissing}.`, { service: 'API' });
      throw Error(`Baseline Task is missing required resolvers: ${listOfMissing}.`);
    }
  } catch (err) {
    logger.error('\n%o', err, { service: 'API' });
    return false;
  }
  return true;
};

export const getRequiredValues = (requires, data) => {
  const values = {};
  requires.forEach(requirement => {
    values[`${requirement}`] = data[requirement];
  });
  return values;
};

export const resumeTask = async (baselineId, data, task) => {
  const { resolver: resolverName, requires } = task;
  const resolverFunc = getResolver(resolverName);
  const params = await getRequiredValues(requires, data);
  const options = await getBaselineTaskResolverOptions(task._id);
  if (isCoreResolver(resolverName)) {
    await callCoreResolver(baselineId, task._id, resolverFunc, params, options);
  } else {
    await callCustomResolver(baselineId, task._id, resolverFunc, params, options);
    await resumeTaskGroupById(baselineId);
  }
};

export const resumeTaskGroupById = async baselineId => {
  const baselineTaskGroup = await getBaselineTaskGroupById(baselineId);
  if (!baselineTaskGroup) {
    logger.error('Baseline task group cannot resume.', { service: 'API' });
    throw new Error('Baseline task group cannot resume.');
  }
  const { baselineTasks, data } = baselineTaskGroup;
  await checkTaskGroupResolvers(baselineTasks);
  const nextTask = findNextTaskToResume(baselineTasks);
  if (nextTask) {
    await resumeTask(baselineId, data, nextTask);
  } else {
    await setBaselineTaskGroupToCompletedById(baselineId);
  }
};

export const generateBaselineId = inputs => {
  // TODO: Hash the inputs to generate the id
  return `baselineid12345`;
};

// This is just for testing
export const clearExperiment = async () => {
  logger.info('Running the experiment ...', { service: 'API' });
  await BaselineTaskGroup.deleteMany({});
  await BaselineTask.deleteMany({});
};

export const defineBaselineType = (name, tasks, defaults) => {
  return async params => {
    const _id = generateBaselineId(params);
    const inputs = {
      ...defaults,
      ...params,
    };

    const baselineTaskGroup = await createNewBaselineTaskGroup({
      _id,
      data: inputs,
      type: name,
      baselineTasks: tasks,
    });
    await resumeTaskGroupById(baselineTaskGroup._id);
    return baselineTaskGroup;
  };
};

export default {
  defineBaselineType,
  resumeTask,
  resumeTaskGroupById,
  findNextTaskToResume,
  getUncompleteBaselineGroups,
  clearExperiment,
  generateBaselineId,
};
