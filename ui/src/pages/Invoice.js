import React from 'react';
import MessageLayout from '../components/MessageLayout';
import InvoiceDetail from './InvoiceDetail';

const Invoice = () => {
  return (
    <MessageLayout selected="invoice">
      <InvoiceDetail />
    </MessageLayout>
  );
};

export default Invoice;
