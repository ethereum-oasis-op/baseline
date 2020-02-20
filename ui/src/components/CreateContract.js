import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import SKUTable from './SKUTable';
import RateTable from './RateTable';
import DropDown from './DropDown';

const useStyles = makeStyles(theme => ({
  paper: {
    width: '50%',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '15%',
  },
  borderLessButton: {
    color: 'blue',
  },
  button: {
    color: '#fff',
    background: 'blue',
  },
}));

const CreateContract = ({ rfp, proposal, open, handleClose, createContract, index }) => {
  const [contractAddress, setContractAddress] = useState('');
  const classes = useStyles();

  return (
    <Modal open={open || false} onClose={handleClose}>
      <div style={{ margin: 'auto', position: 'relative' }} className={classes.paper}>
        <Typography variant="h2">{rfp.description}</Typography>
        <SKUTable rfp={rfp} />
        <RateTable rates={proposal.rates} erc20ContractAddress={proposal.erc20ContractAddress} />
        <Typography variant="body1">Add Conditions</Typography>
        <Button className={classes.borderLessButton}>+ Add Conditions</Button>
        <Typography variant="body1">
          By selecting "I Accept", I am agreeing to the Terms & Conditions stated here and ...
        </Typography>
        <Button className={classes.button} onClick={() => createContract(index, proposal, contractAddress)}>
          I Accept
        </Button>
      </div>
    </Modal>
  );
};

export default CreateContract;
