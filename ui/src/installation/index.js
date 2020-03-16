import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import InstallationLayout from './components/InstallationLayout';
import NetworkSettings from './settings/NetworkSettings';
import RegistrySettings from './settings/RegistrySettings';
import RegisterSettings from './settings/RegisterSettings';
import WalletSettings from './settings/WalletSettings';
import NetworkForm from './forms/NetworkForm';
import RegistryForm from './forms/RegistryForm';
import RegisterForm from './forms/RegisterForm';
import WalletForm from './forms/WalletForm';
import RegisteryInstructions from './instructions/RegistryInstructions';
import RegisterInstructions from './instructions/RegisterInstructions';
import NetworkInstructions from './instructions/NetworkInstructions';
import WalletInstructions from './instructions/WalletInstructions';
import UserSelection from '../components/UserSelection';

const steps = [
  {
    label: 'Choose an Ethereum Network',
    content: <NetworkForm />,
    settings: <NetworkSettings />,
    instructions: <NetworkInstructions />,
  },
  {
    label: 'Set Up Corporate Wallet',
    content: <WalletForm />,
    settings: <WalletSettings />,
    instructions: <WalletInstructions />,
  },
  {
    label: 'Connect to a Registry',
    content: <RegistryForm />,
    settings: <RegistrySettings />,
    instructions: <RegisteryInstructions />,
  },
  {
    label: 'Register Your Company',
    content: <RegisterForm />,
    settings: <RegisterSettings />,
    instructions: <RegisterInstructions />,
  },
];

const getStateId = state => {
  console.log('STATE', state);
  switch (state) {
    case 'nonetwork':
    case 'notconnected':
      return 0;
    case 'nowallet':
    case 'nobalance':
      return 1;
    case 'noregistry':
    case 'isregistered':
      return 2;
    case 'nomessenger':
      return 0;
    default:
      return 0;
  }
};

const useStyles = makeStyles(theme => ({
  instructions: {
    background: '#F4F6F8',
    width: '468px',
    borderRight: '1px solid #909ea9',
    padding: theme.spacing(8),
  },
  settings: {
    height: 0,
    overflow: 'hidden',
    '&.active': {
      height: 'auto',
    },
  },
  settingsContent: {
    padding: theme.spacing(4),
  },
  content: {
    padding: theme.spacing(4),
    width: '100%',
    minWidth: '500px',
    background: 'white',

    // Root
    '& .MuiStep-root': {
      background: '#F4F6F8',
      padding: '1rem',
      borderBottom: '1px solid #c3cdd2',
    },

    // Content
    '& .MuiStepContent-root': {
      borderColor: 'transparent',
      padding: 0,
      marginLeft: '50px',
      paddingRight: '50px',
    },

    // Connector
    '& .MuiStepConnector-vertical': {
      display: 'none',
    },

    // Icon
    '& .MuiStepIcon-root': {
      color: '#444F59',
      transition: 'color .5s ease',
      width: '40px',
      '&.MuiStepIcon-completed': {
        color: '#28D295',
      },
    },

    // Label
    '& .MuiStepLabel-labelContainer': {
      marginLeft: theme.spacing(2),
    },
    '& .MuiStepLabel-completed': {
      fontSize: '1rem',
    },
    '& .MuiStepLabel-active': {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
  },
}));

const Installation = ({ state, settings }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(getStateId(state));

  useEffect(() => {
    setActiveStep(getStateId(state));
  }, [state]);

  return (
    <InstallationLayout>
      <div className={classes.instructions}>{steps[activeStep].instructions}</div>

      <div className={classes.content}>
        <h1>{ state }</h1>
        <Stepper activeStep={activeStep} orientation="vertical" connector={null} nonLinear>
          {steps.map(({ label, settings, content }, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <div className={activeStep > index ? `${classes.settings} active` : classes.settings}>
                <div className={classes.settingsContent}>
                  {settings}
                </div>
              </div>
              <StepContent className={classes.stepContent}>{content}</StepContent>
            </Step>
          ))}
        </Stepper>
        <UserSelection />

        {steps.map((step, index) => {
          const onClick = () => {
            setActiveStep(index);
          };
          return (
            <Button onClick={onClick} className={classes.buttonChangeActive}>
              {index + 1}
            </Button>
          );
        })}
      </div>
    </InstallationLayout>
  );
};

Installation.propTypes = {
  state: PropTypes.string.isRequired,
};

export default Installation;
