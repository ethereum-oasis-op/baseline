import { getServerSettings } from '../utils/serverSettings';

export default async () => {
  const config = await getServerSettings();
  const { OrgRegistry } = config.addresses;
  const { zkpPublicKey } = config.organization;

  if (OrgRegistry && zkpPublicKey) {
    return true;
  }
  return false;
};
