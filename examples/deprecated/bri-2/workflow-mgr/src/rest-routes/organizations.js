import { v4 } from 'uuid';
import { saveContact } from "../organizations"
import { resolveDid } from "../organizations/veramo"
import { organizations } from "../db/models/Organization";
import { logger } from "../logger";

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
