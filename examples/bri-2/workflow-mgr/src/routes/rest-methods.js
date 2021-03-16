import { v4 } from 'uuid';
import { workflows } from "../db/models/Workflow";
import { saveContact } from "../organizations"
import { resolveDid } from "../organizations/veramo"
import { organizations } from "../db/models/Organization";
import { logger } from "../logger";
import { connectNATS } from "../nats";
import { deployVerifier, deployShield, trackShield } from "../workflow-test";

export const getStatus = async (req, res) => {
  const result =  {
    dbUrl: `${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`,
    dbHost: process.env.DATABASE_HOST
  }
  res.status(200).send(result)
};

export const createOrganization = async (req, res) => {
  logger.info('POST /organizations req.body:', req.body)
  const newId = v4();
  const { domain, name, messengerUrl, signingKey } = req.body;

  if (!req.query.did) {
    const newContact = await organizations.findOneAndUpdate(
      { _id: newId },
      {
        _id: newId,
        name,
        signingKey,
        messengerUrl
      },
      { upsert: true, new: true }
    );
    logger.info(`New organization added: %o`, newContact);
    res.status(201).send(newContact || {});
    return;
  }

  if (!domain) {
    logger.error("No domain included in request body");
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
    const newWorkflow = await workflows.findOneAndUpdate(
      { _id: newId },
      {
        _id: newId,
        description: "automated internal test",
        clientType: "dashboard-test",
        participants: [],
        status: "created"
      },
      { upsert: true, new: true }
    );
    
    logger.info(`New workflow (id: ${newId}) created.`)
    const nc = await connectNATS();
    nc.publish('deploy-contracts', { workflowId: newId });
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

export const acceptInvitation = async (req, res) => {
  const { workflowId } = req.params;
  const foundWorkflow = await workflows.findOne({ _id: workflowId });
  if (foundWorkflow.status !== "invited") {
      logger.error(`Workflow ${workflowId} current state is ${foundWorkflow.status}. Request to accept invitation is invalid`);
      res.status(400).send({ error: `Workflow ${workflowId} current state is ${foundWorkflow.status}. Request to accept invitation is invalid`});
      return;
  }
  const newWorkflow = await workflows.findOneAndUpdate(
    { _id: workflowId },
    { status: "accepted-invite" },
    { upsert: true }
  );
  res.status(200).send()
};

export const deleteWorkflow = async (req, res) => {
  await workflows.deleteOne({_id: req.params.workflowId}, (err, data) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(data || {});
    }
  });
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