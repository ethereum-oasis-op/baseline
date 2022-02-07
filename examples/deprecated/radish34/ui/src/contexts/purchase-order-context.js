import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_PURCHASE_ORDER } from '../graphql/purchase-order';

const PurchaseOrderContext = React.createContext([{}, () => {}]);

const PurchaseOrderProvider = ({ children }) => {
  const [postPurchaseOrder] = useMutation(CREATE_PURCHASE_ORDER);

  return (
    <PurchaseOrderContext.Provider value={{ postPurchaseOrder }}>{children}</PurchaseOrderContext.Provider>
  );
};

PurchaseOrderProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { PurchaseOrderContext, PurchaseOrderProvider };
