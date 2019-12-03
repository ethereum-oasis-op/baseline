import React from 'react';
import MessageLayout from '../components/MessageLayout';
import PurchaseOrderDetail from './PurchaseOrderDetail';

const PurchaseOrder = () => {
  return (
    <MessageLayout selected="purchaseorder">
      <PurchaseOrderDetail />
    </MessageLayout>
  );
};

export default PurchaseOrder;
