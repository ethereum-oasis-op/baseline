import { saveRFP } from '../../../../db/models/modules/msa/rfps';
import { setDocTypeForBaselineTaskGroup } from '../../../../db/models/baseline/baselineTaskGroup';

const createRFPDoc = async params => {
  const { baselineId } = params;
  const rfp = await saveRFP(params);
  console.log('NEW RFP CREATED!', rfp);
  await setDocTypeForBaselineTaskGroup(baselineId, 'rfp', rfp._id);
  return {
    rfpId: rfp._id,
    createdDate: rfp.createdDate,
  };
};

export default createRFPDoc;
