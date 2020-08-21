import React from 'react';
import NoticeLayout from '../components/NoticeLayout';
import PurchaseOrderDetail from './PurchaseOrderDetail';

const PurchaseOrder = () => {
  return (
    <NoticeLayout selected="purchaseorder">
      <PurchaseOrderDetail />
    </NoticeLayout>
  );
};

export default PurchaseOrder;
