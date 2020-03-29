import { saveMSA } from '../../../../db/models/msa';

const createMSAInDB = async (params, options) => {
  console.log('CUSTOM FUNC CALLED', params, options);
  const msa = await saveMSA(params);
  const { _id } = msa;
  console.log('MSA', msa);
  console.log('NEW MSA MADE I THINNK', _id);
  return {
    msaId: _id,
  };
};

export default createMSAInDB;
