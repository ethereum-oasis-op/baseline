import { saveMSA } from '../../../../db/models/modules/msa/msa';

const createDoc = async (params, options) => {
  console.log('Creating the RFP Doc ...');
  const msa = await saveMSA(params);
  return {
    msaId: msa._id,
    createdDate: msa.createdDate,
  };
};

export default createDoc;
