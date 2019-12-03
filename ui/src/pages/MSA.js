import React from 'react';
import MessageLayout from '../components/MessageLayout';
import MSADetail from './MSADetail';

const MSA = () => {
  return (
    <MessageLayout selected="msa">
      <MSADetail />
    </MessageLayout>
  );
};

export default MSA;
