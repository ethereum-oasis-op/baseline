import { v4 } from 'uuid';
import { workflows } from '../db/models/Workflow';
import { logger } from '../logger';
import { connectNATS } from '../nats';

export const createWorkflow = async (req, res) => {
  const newId = v4();
  const { description, clientType, identities, chainId } = req.body;

  const { type } = req.query;

  let newWorkflow;
  let updates;

  updates = {
    _id: newId,
    description,
    clientType,
    chainId,
    participants: [],
    status: 'created'
  };

  if (type === 'signature') {
    for (let index = 0; index < identities.length; index++) {
      updates.participants[index] = {
        publicKey: identities[index]
      };
    }
  }

  try {
    newWorkflow = await workflows.findOneAndUpdate(
      {
        _id: newId
      },
      updates,
      {
        upsert: true,
        new: true
      }
    );

    logger.info(`New workflow (id: ${newId}) created.`);
    const nc = await connectNATS();
    //TODO: Update to new-workflow-allocated event to finish off this step,
    //      these should not infer or reference the next activity since it should be
    //      unaware
    nc.publish('new-workflow-allocation', {
      workflowId: newId,
      circuitType: type,
      identities
    });
    res.status(201).send({ workflowId: newWorkflow._id });
    return;
  } catch (err) {
    logger.error(`Could not create new workflow (id: ${newId}): ${err}`);
    res.status(500).send({
      error: `${err.message}`
    });
    return;
  }
};

export const updateWorkflow = async (req, res) => {
  const { workflowId } = req.params;
  const { status, zkCircuitId, shieldAddress, verifierAddress } = req.body;
  logger.info('updateWorkflow req.body:' + JSON.stringify(req.body, null, 4));

  try {
    // If these fields are defined, add them to "updates" object.
    // Undefined properties are not added to "updates" object.
    let updates = {
      ...(status && { status }),
      ...(zkCircuitId && { zkCircuitId }),
      ...(shieldAddress && { shieldAddress }),
      ...(verifierAddress && { verifierAddress })
    };

    let updatedWorkflow = await workflows.findOneAndUpdate(
      {
        _id: workflowId
      },
      updates,
      {
        upsert: false,
        new: true
      }
    );
    logger.info(`Workflow updated: ${workflowId}`);
    res.status(201).send(updatedWorkflow || {});
    return;
  } catch (err) {
    logger.error(`Could not update workflow (id: ${workflowId}): ${err}`);
    res.status(500).send({
      error: `${err.message}`
    });
    return;
  }
};

export const deployContracts = async (req, res) => {
  res.status(404).send('Not implemented');
};

export const inviteParticipants = async (req, res) => {
  res.status(404).send('Not implemented');
};

export const acceptInvitation = async (req, res) => {
  const { workflowId } = req.params;
  const foundWorkflow = await workflows.findOne({
    _id: workflowId
  });
  if (foundWorkflow.status !== 'invited') {
    logger.error(
      `Workflow ${workflowId} current state is ${foundWorkflow.status}. Request to accept invitation is invalid`
    );
    res.status(400).send({
      error: `Workflow ${workflowId} current state is ${foundWorkflow.status}. Request to accept invitation is invalid`
    });
    return;
  }
  const newWorkflow = await workflows.findOneAndUpdate(
    {
      _id: workflowId
    },
    {
      status: 'accepted-invite'
    },
    {
      upsert: true
    }
  );
  res.status(200).send();
};

export const deleteWorkflow = async (req, res) => {
  await workflows.deleteOne(
    {
      _id: req.params.workflowId
    },
    (err, data) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.send(data || {});
      }
    }
  );
};

export const getWorkflow = async (req, res) => {
  await workflows.findOne(
    {
      _id: req.params.workflowId
    },
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data || []);
      }
    }
  );
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
