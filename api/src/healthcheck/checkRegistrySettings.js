import { getServerSettings } from '../db/models/baseline/server/settings';

export default async () => {
  const config = await getServerSettings();
  console.log('SERRREVER SETTINGS!!', config);
  if (config.addresses.OrgRegistry && config.organization.zkpPublicKey) {
    return true;
  }
  return false;
};
