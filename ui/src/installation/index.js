import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import AdminAccountSetupForm from './forms/AdminAccountSetupForm';
import ChooseNetworkForm from './forms/ChooseNetworkForm';
import ConnectToRegistryForm from './forms/ConnectToRegistryForm';
import RegisterForm from './forms/RegisterForm';
import AdminAccountSetupInstructions from './instructions/AdminAccountSetupInstructions';
import ChooseNetworkInstructions from './instructions/ChooseNetworkInstructions';
import ConnectToRegistryInstructions from './instructions/ConnectToRegistryInstructions';
import RegisterInstructions from './instructions/RegisterInstructions';
import InstallationLayout from './components/InstallationLayout';

const steps = [
  {
    label: 'Choose Network',
    content: <ChooseNetworkForm />,
    instructions: <ChooseNetworkInstructions />,
  },
  // {
  //   label: 'Setup Metamask',
  //   content: <SetupMetamaskForm />,
  //   instructions: <SetupMetamaskInstructions />,
  // },
  {
    label: 'Connect to Registry',
    content: <ConnectToRegistryForm />,
    instructions: <ConnectToRegistryInstructions />,
  },
  {
    label: 'Register',
    content: <RegisterForm />,
    instructions: <RegisterInstructions />,
  },
  {
    label: 'Admin Account Setup',
    content: <AdminAccountSetupForm />,
    instructions: <AdminAccountSetupInstructions />,
  },
];

const getStateId = state => {
  switch (state) {
    case 'nonetwork':
    case 'notconnected':
      return 0;
    case 'noregistry':
    case 'deploying':
      return 2;
    case 'isregistered':
    case 'isregistering':
      return 3;
    case 'noadmin':
      return 4;
    default:
      return 0;
  }
};

const useStyles = makeStyles(theme => ({
  instructions: {
    background: '#F4F6F8',
    width: '500px',
    borderRight: '2px solid #61737f',
    padding: theme.spacing(8),
  },
  content: {
    padding: theme.spacing(4),
    width: '100%',
    minWidth: '500px',
    background: 'white',
    '& .MuiStepContent-root': {
      borderColor: 'transparent',
    },
    '& .MuiStepConnector-line': {
      borderColor: 'transparent',
    },
    '& .MuiStepLabel-root.Mui-disabled': {
      '& .MuiStepIcon-root': {
        color: '#DFE3E8',
      },
    },
    '& .MuiStepIcon-root': {
      color: '#444F59',
      transition: 'color .5s ease',
      width: '48px',
      '&.MuiStepIcon-completed': {
        color: '#28D295',
      },
    },
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

const Installation = ({ state }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(getStateId(state));

  useEffect(() => {
    setActiveStep(getStateId(state));
  }, [state]);

  return (
    <InstallationLayout>
      <div className={classes.instructions}>{steps[activeStep].instructions}</div>

      <div className={classes.content}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map(({ label, content }) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent className={classes.stepContent}>{content}</StepContent>
            </Step>
          ))}
        </Stepper>

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
