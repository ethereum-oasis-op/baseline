import React from 'react';
import NoticeLayout from '../components/NoticeLayout';
import InvoiceDetail from './InvoiceDetail';

const Invoice = () => {
  return (
    <NoticeLayout selected="invoice">
      <InvoiceDetail />
    </NoticeLayout>
  );
};

export default Invoice;
