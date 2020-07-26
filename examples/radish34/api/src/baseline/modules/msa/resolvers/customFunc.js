import { logger } from 'radish34-logger';

const customFunc = async (params, options) => {
  logger.info('CUSTOM FUNC CALLED\n%o\n%o', params, options, { service: 'API' });
  return {
    customResponse: 'MSA Created',
  };
};

export default customFunc;
