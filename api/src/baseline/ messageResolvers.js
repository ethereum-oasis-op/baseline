import { onReceiveRFP, onReceiveProposal } from './modules/msa';
import customFunc from './modules/msa/resolvers/customFunc';
import createRFPDoc from './modules/msa/resolvers/createRFPDoc';
import createRFPMessages from './modules/msa/resolvers/createRFPMessages';
import createRFPNotice from './modules/msa/resolvers/createRFPNotice';
import updateRFPDoc from './modules/msa/resolvers/updateRFPDoc';

export default {
  rfp_create: onReceiveRFP,
  proposal_create: onReceiveProposal,
  customFunc,
  createRFPDoc,
  createRFPMessages,
  createRFPNotice,
  updateRFPDoc,
};
