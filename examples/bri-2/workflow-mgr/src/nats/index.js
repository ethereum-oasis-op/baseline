import NATS from "nats";
import { logger } from "../logger";
import { workflows } from "../db/models/Workflow";
import { deployVerifier, deployShield, trackShield } from "../workflow-test";

let nc;

export const connectNATS = async () => {
  if (!nc) {
    try {
      nc = NATS.connect({url: process.env.NATS_URL, json: true});
      nc.subscribe('deploy-contracts', deployContracts);
      logger.info(`Subscribed to all NATS topics`)
    } catch (err) {
      logger.error(`Could not connect to NATS: ${error.message}`)
      return
    }
  }
  return nc;
}

// set up a subscription to process a request
const deployContracts = async (msg) => {
  logger.info('NATS received request to deploy-contracts')
  if (msg.reply) {
      nc.publish(msg.reply, new Date().toLocaleTimeString());
  }
    
  logger.info('Deploying Verifier contract...')
  const { result: verifierAddress, error: errorVerifier} = await deployVerifier();
  if (errorVerifier) {
    logger.error(`Error: problem deploying Verifier contract: ${errorVerifier.message}`)
    await workflows.findOneAndUpdate(
      { _id: msg.workflowId },
      { status: "failed-deploy-verifier" },
      { upsert: true, new: true }
    );
    return;
  }

  logger.info('Deploying Shield contract...')
  const { result: shieldAddress, error: errorShield} = await deployShield(verifierAddress);
  if (errorShield) {
    logger.error(`Error: problem deploying Shield contract: ${errorShield.message}`)
    await workflows.findOneAndUpdate(
      { _id: msg.workflowId },
      { status: "failed-deploy-shield" },
      { upsert: true, new: true }
    );
    return;
  }

  logger.info('Setting up tracking for Shield contract...')
  const { result: trackResult, error: errorTrack } = await trackShield(shieldAddress);
  if (errorTrack) {
    logger.error(`Error: problem tracking Shield contract address ${shieldAddress}`)
    await workflows.findOneAndUpdate(
      { _id: msg.workflowId },
      { status: "failed-track-shield" },
      { upsert: true, new: true }
    );
    return;
  }

  logger.info('Saving workflow...')
  await workflows.findOneAndUpdate(
    { _id: msg.workflowId },
    {
      _id: msg.workflowId,
      merkleId: shieldAddress,
      status: "active"
    },
    { upsert: true, new: true }
  );

  return;
};
