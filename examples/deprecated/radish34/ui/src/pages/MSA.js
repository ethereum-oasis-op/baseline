import React from 'react';
import NoticeLayout from '../components/NoticeLayout';
import MSADetail from './MSADetail';

const MSA = () => {
  return (
    <NoticeLayout selected="msa">
      <MSADetail />
    </NoticeLayout>
  );
};

export default MSA;
