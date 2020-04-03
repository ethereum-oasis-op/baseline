import { saveMSA } from '../../../../db/models/msa';

const createMSAInDB = async (params, options) => {
  console.log('CUSTOM FUNC CALLED', params, options);
  const msa = await saveMSA(params);
  console.log('MSA', msa._id);
  console.log('NEW MSA MADE I THINNK', msa._id);
  return {
    msaId: msa._id,
  };
};

export default createMSAInDB;
