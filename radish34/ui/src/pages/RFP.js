import React from 'react';
import NoticeLayout from '../components/NoticeLayout';
import RFPDetail from './RFPDetail';

const RFP = () => {
  return (
    <NoticeLayout selected="rfp">
      <RFPDetail />
    </NoticeLayout>
  );
};

export default RFP;
