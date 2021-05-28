import NATS from "nats";
import { logger } from "../logger";
import { workflows } from "../db/models/Workflow";
import axios from "axios";
import { compileContract } from "../solidity-compiler";
import { deployVerifier, deployShield, trackShield } from "../deploy-contracts";

let nc;

export const connectNATS = async () => {
  if (!nc) {
    try {
      nc = NATS.connect({url: process.env.NATS_URL, json: true});
      nc.subscribe('contracts-compile-verifier', natsCompileVerifier);
      nc.subscribe('contracts-deploy-verifier', natsDeployVerifier);
      nc.subscribe('contracts-deploy-shield', natsDeployShield);
      logger.info(`Subscribed to all NATS topics`)
    } catch (err) {
      logger.error(`Could not connect to NATS: ${error.message}`)
      return
    }
  }
  return nc;
}

//HOw to inject a stander storage provider, is this a good palce for an IoC Container
const natsCompileVerifier = async (msg, IStorageProvider) => {
  logger.info(`NATS contracts-compile-verifier: received request for workflowId ${msg.WorkflowId}`)
  logger.info('message payload:' + JSON.stringify(msg, null, 4))
  
  
  // Retrieve Verifier.sol source code from zkp-mgr
  //NOTE: shoudl we pass this in the NATS message (the URI) ??
  // 
  let res = await axios.get(`${process.env.ZKP_MGR_URL}/zkcircuits/${msg.ZkCircuitId}/verifier`);
  logger.info("GET /zkcircuits/{id}/verifier status code:" + res.status)

  // Compile Verifier.sol contract
  let verifierBytecode = await compileContract("Verifier", res.data)

  // TODO: Store compiled contract bytecode (through zkp-mgr?)
  // PUT zkcircuits/{id}
  // body: verifierBytecode

  // Update workflow status to "success-compile-verifier"
  await workflows.findOneAndUpdate(
    { _id: msg.WorkflowId },
    { status: "success-compile-verifier" },
    { upsert: false, new: true }
  );

  // Create new contracts-deploy-verifier job
  logger.info(`NATS contracts-compile-verifier: completed job for ${msg.WorkflowId}. Creating new contracts-deploy-verifier job`)
  //NOTE: do an inservice not event bridged call as it's in domain
  nc.publish('contracts-deploy-verifier', { workflowId: msg.WorkflowId, zkCircuitId: msg.ZkCircuitId, verifierBytecode });
}

const natsDeployVerifier = async (msg) => {
  logger.info('NATS contracts-deploy-verifier: received request for workflowId ' + msg.workflowId )
  
  const { result: verifierAddress, error: errorVerifier} = await deployVerifier(msg.verifierBytecode);
  if (errorVerifier) {
    logger.error(`Error: problem deploying Verifier contract: ${errorVerifier.message}`)
    await workflows.findOneAndUpdate(
      { _id: msg.workflowId },
      { status: "failed-deploy-verifier" },
      { upsert: false, new: true }
    );
    return;
  }

  // Update workflow status to "success-deploy-verifier"
  await workflows.findOneAndUpdate(
    { _id: msg.workflowId },
    { 
      status: "success-deploy-verifier",
      verifierAddress
    },
    { upsert: false, new: true }
  );
  
  // Create new contracts-deploy-verifier job
  logger.info(`NATS contracts-deploy-verifier: completed job for ${msg.workflowId}. Creating new contracts-deploy-shield job`)

  //NOTE: insrvice call
  nc.publish('contracts-deploy-shield', { workflowId: msg.workflowId, verifierAddress });
}


const natsDeployShield = async (msg) => {
  logger.info('NATS contracts-deploy-shield: received request for workflowId ' + msg.workflowId )
  
  const { result: shieldAddress, error: errorShield} = await deployShield(msg.verifierAddress);
  if (errorShield) {
    logger.error(`Error: problem deploying Shield contract: ${errorShield.message}`)
    await workflows.findOneAndUpdate(
      { _id: msg.workflowId },
      { status: "failed-deploy-shield" },
      { upsert: false, new: true }
    );
    return;
  }

  await workflows.findOneAndUpdate(
    { _id: msg.workflowId },
    {
      shieldAddress,
      status: "success-deploy-shield"
    },
    { upsert: false, new: true }
  );

  logger.info('Setting up tracking for Shield contract...')
  //NOTE: THIS IS COMMITTMENT MANGER this shoudl be an event call
  const { result: trackResult, error: errorTrack } = await trackShield(shieldAddress);
  if (errorTrack) {
    logger.error(`Error: problem tracking Shield contract address ${shieldAddress}`)
    await workflows.findOneAndUpdate(
      { _id: msg.workflowId },
      { status: "failed-track-shield" },
      { upsert: false, new: true }
    );
    return;
  }

  logger.info('Saving workflow status: ' + msg.workflowId)
  await workflows.findOneAndUpdate(
    { _id: msg.workflowId },
    {
      _id: msg.workflowId,
      shieldAddress,
      status: "success-track-shield"
    },
    { upsert: false, new: true }
  );
  
  logger.info('SUCCESS: Setup complete for workflow ' + msg.workflowId)
  return;
};
