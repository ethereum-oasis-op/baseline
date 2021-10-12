import { saveMSA } from '../../../../db/models/msa';
import { logger } from 'radish34-logger';

const createMSAInDB = async (params, options) => {
  logger.info('CUSTOM FUNC CALLED:\n%o\n%o', params, options, { service: 'API' });
  const msa = await saveMSA(params);
  logger.info(`MSA with id ${msa._id}:\n%o`, msa, { service: 'API' });
  return {
    msaId: msa._id,
  };
};

export default createMSAInDB;
