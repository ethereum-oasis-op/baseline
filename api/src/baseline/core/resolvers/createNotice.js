import { saveNotice, getAllNotices } from '../../../db/models/baseline/notices';
import { getOrganizationServerSetting } from '../../../db/models/baseline/server/settings';

const createNotice = async (params, options) => {
  console.log('Creating a notice:', params, options);
  const { createdDate } = params;
  const { category, docIdFieldName, descriptionFieldName, status } = options;
  const orgName = await getOrganizationServerSetting('name');
  const messageText = params[descriptionFieldName] || '';
  const categoryId = params[docIdFieldName];
  const notice = await saveNotice({
    resolved: false,
    category: category,
    subject: `New ${category}: ${messageText}`,
    from: orgName,
    statusText: 'Pending',
    status,
    categoryId,
    lastModified: createdDate,
  });
  console.log(`Saving new ${category} (docId: ${categoryId}) (message: ${messageText})`);
  return {
    noticeId: notice._id,
  };
};

export default createNotice;
