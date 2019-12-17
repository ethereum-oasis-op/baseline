import React from 'react';
import MessageLayout from '../components/MessageLayout';
import RFPDetail from './RFPDetail';

const RFP = () => {
  return (
    <MessageLayout selected="rfp">
      <RFPDetail />
    </MessageLayout>
  );
};

export default RFP;
