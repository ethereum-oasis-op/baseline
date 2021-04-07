import { organizations } from "../db/models/Organization";
import { logger } from "../logger";

export const saveContact = async (entryInfo) => {
  const newOrg = new organizations({
    name: entryInfo.name, // entity name
    network: entryInfo.network, // did network
    domain: entryInfo.domain, // did domain
    dididentity: entryInfo.dididentity, // did identity
    status: entryInfo.status, // did verification status
    active: true
  });

  await newOrg.save((err) => {
    if (err) {
      logger.error(err);
      return false;
    }
    // saved!
    logger.info(`[ ${entryInfo.name} ] added to phonebook...`);
    return true;
  });
}
