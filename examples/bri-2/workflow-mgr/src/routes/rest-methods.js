import { v4 } from 'uuid';
import { workflows } from "../db/models/Workflow";
import { saveContact } from "../organizations"
import { resolveDid } from "../organizations/veramo"
import { organizations } from "../db/models/Organization";
import { logger } from "../logger";
import { deployVerifier, deployShield, trackShield } from "../workflow-test";
import { didIdentityManagerCreateIdentity,
         didGenerateDidConfiguration,
         didVerifyWellKnownDidConfiguration } from "../organizations/did";

export const getStatus = async (req, res) => {
  const result =  {
    dbUrl: `${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`,
    dbHost: process.env.DATABASE_HOST
  }
  res.status(200).send(result)
};

export const createOrganization = async (req, res) => {
  logger.info('POST /organizations req.body:', req.body)
  const { domain, name } = req.body;
  if (!domain) {
    logger.error("No domain to add...");
    res.status(400).send({ error: "No domain included in request body" });
    return;
  }

  try {
    const resultDid = await resolveDid(domain);
    logger.info(`resolved DID: %o`, resultDid);
    const contact = {
      name,
      domain,
      publicKey,
      network: resultDid.dids[0].split(':')[1] === 'key' ? '-key-' : resultDid.dids[0].split(':')[2], // did network
      dididentity: resultDid.dids[0], // did identity
      status: 'verified', // did verification status
      active: true
    }
    const result = await saveContact(contact);
    res.status(201).send(resultDid || {});
    return;
  } catch (error) {
    logger.error('DID failure:', error);
    res.status(500).send({ error: `DID resolver failed. ${error.message}` });
    return;
  }
};

export const deleteOrganization = async (req, res) => {
  await organizations.deleteOne({_id: req.params.orgId}, (err, data) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(data || {});
    }
  });
};

export const getOrganizations = async (req, res) => {
  await organizations.find({}, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data || []);
    }
  });
};

export const createWorkflow = async (req, res) => {
  const newId = v4();
  const { description, clientType, participants } = req.body;
  const { type } = req.query;
  if (type === "test") {
    logger.info('Received request to create test workflow. Creating now...')
    logger.info('Deploying VerifierNoop contract...')
    const { result: verifierAddress, error: errorVerifier} = await deployVerifier();
    if (errorVerifier) {
      logger.error('Error: problem deploying Verifier contract')
      res.status(500).send({ message: "Error: problem deploying Verifier contract"})
      return;
    }

    logger.info('Deploying Shield contract...')
    const { result: shieldAddress, error: errorShield} = await deployShield(verifierAddress);
    if (errorShield) {
      logger.error('Error: problem deploying Shield contract')
      res.status(500).send({ message: "Error: problem deploying Shield contract"})
      return;
    }

    logger.info('Setting up tracking for Shield contract...')
    const { result: trackResult, error: errorTrack } = await trackShield(shieldAddress);
    if (errorTrack) {
      logger.error('Error: problem tracking Shield contract')
      res.status(500).send({ message: "Error: problem tracking Shield contract"})
      return;
    }

    logger.info('Creating workflow...')
    const newWorkflow = await workflows.findOneAndUpdate(
      { _id: newId },
      {
        _id: newId,
        description: "automated internal test",
        clientType: "dashboard-test",
        merkleId: shieldAddress,
        participants: [],
        status: "active"
      },
      { upsert: true, new: true }
    );
    
    logger.info(`New workflow (id: ${newId}) created.`)
    res.status(201).send(newWorkflow || {});
    return
  }

  try {
    const newWorkflow = await workflows.findOneAndUpdate(
      { _id: newId },
      {
        _id: newId,
        description,
        clientType,
        participants,
        status: "active"
      },
      { upsert: true, new: true }
    );
    logger.info(`New workflow (id: ${newId}) created.`)
    res.status(201).send(newWorkflow || {});
  } catch (err) {
    logger.error(`Could not create new workflow (id: ${newId}): ${err}`)
    res.status(500).send({ error: `${err.message}`});
  }
};

export const getWorkflow = async (req, res) => {
  await workflows.findOne({ _id: req.params.workflowId}, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data || []);
    }
  });
};

export const getWorkflows = async (req, res) => {
  await workflows.find({}, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data || []);
    }
  });
};