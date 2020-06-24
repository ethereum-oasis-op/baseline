import gql from 'graphql-tag';

export const NOTICE_ATTRIBUTES = gql`
  fragment NOTICE_ATTRIBUTES on Notice {
    _id
    resolved
    category
    subject
    from
    statusText
    lastModified
    status
    categoryId
  }
`;

export const CATEGORIES = gql`
  fragment CATEGORIES on NoticeCount {
    msa
    invoice
    purchaseorder
    rfp
  }
`;

export const NEW_NOTICE = gql`
  subscription newNotice {
    newNotice {
      ...NOTICE_ATTRIBUTES
    }
  }
  ${NOTICE_ATTRIBUTES}
`;

export const GET_ALL_NOTICES = gql`
  query getAllNotices {
    notices {
      ...NOTICE_ATTRIBUTES
    }
  }
  ${NOTICE_ATTRIBUTES}
`;

export const GET_NOTICE_COUNT = gql`
  query getNoticeCount {
    getNoticeCount {
      ...CATEGORIES
    }
  }
  ${CATEGORIES}
`;
