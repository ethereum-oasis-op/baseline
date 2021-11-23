import { registerCustomResolver } from '../../core/resolvers';
import { clearExperiment, defineBaselineType } from '../../core';
import createMSATasks from './tasks/createMSA';
import createProposalTasks from './tasks/createProposal';
import createRFPTasks from './tasks/createRFP';
import onReceiveMSATasks from './tasks/onReceiveMSA';
import onReceiveProposalTasks from './tasks/onReceiveProposal';
import onReceiveRFPTasks from './tasks/onReceiveRFP';
import createMSADoc from './resolvers/createMSADoc';
import signCommitment from './resolvers/signCommitment';
import customFunc from './resolvers/customFunc';
import { logger } from 'radish34-logger';

export const createMSA = defineBaselineType('createMSA', createMSATasks);
export const createProposal = defineBaselineType('createProposal', createProposalTasks);
export const createRFP = defineBaselineType('createRFP', createRFPTasks);
export const onReceiveMSA = defineBaselineType('onReceiveMSA', onReceiveMSATasks);
export const onReceiveProposal = defineBaselineType('onReceiveProposal', onReceiveProposalTasks);
export const onReceiveRFP = defineBaselineType('onReceiveRFP', onReceiveRFPTasks);

const loadModule = () => {
  logger.info('Loading MSA Module ...', { service: 'API' });
  registerCustomResolver('createMSAInDB', createMSADoc);
  registerCustomResolver('signCommitment', signCommitment);
  registerCustomResolver('customFunc', customFunc);
};

const testModule = async () => {
  await clearExperiment();
  setTimeout(() => {
    createMSA({
      payload: { msa: 2342, tier: 'something' },
      proposalId: '0x1234',
      buyerSignature: '0x3434242',
      supplierSignature: '394829482',
    });
  }, 4000);
};

export default {
  loadModule,
  testModule,
  createMSA,
  createProposal,
  createRFP,
  onReceiveMSA,
  onReceiveProposal,
  onReceiveRFP,
};
