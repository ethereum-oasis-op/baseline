import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const SignatureItem = props => {
  const { status, details, role } = props;

  return (
    <Grid item style={{ padding: '1rem' }} xs={4}>
      <Typography>{role}: {status}</Typography>
      {status === 'Approved' ?
        <>
          <Typography>{details.name}</Typography>
          <Typography>{details.signatureDate}</Typography>
        </>
        :
        <Typography>Awaiting Signature</Typography>
      }
    </Grid>
  );
};

const Signatures = props => {
  const { buyerStatus, buyerDetails, supplierStatus, supplierDetails} = props;
  return (
    <>
      <h3>Signatures</h3>
      <Grid container direction="row">
        <SignatureItem role="Buyer" status={buyerStatus} details={buyerDetails} />
        <SignatureItem role="Supplier" status={supplierStatus} details={supplierDetails} />
      </Grid>
    </>
  );
};

Signatures.propTypes = {
  buyerStatus: PropTypes.string.isRequired,
  supplierStatus: PropTypes.string.isRequired,
  buyerDetails: PropTypes.shape({}).isRequired,
  supplierDetails: PropTypes.shape({}).isRequired,
}

SignatureItem.propTypes = {
  role: PropTypes.oneOf(['Buyer', 'Supplier']).isRequired,
  status: PropTypes.oneOf(['Approved', 'Pending']).isRequired,
  details: PropTypes.shape({}).isRequired,
};

export default Signatures;
