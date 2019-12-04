import React from 'react';
import MessageLayout from '../components/MessageLayout';
import RFQDetail from './RFQDetail';

const RFQ = () => {
  return (
    <MessageLayout selected="rfq">
      <RFQDetail />
    </MessageLayout>
  );
};

export default RFQ;
