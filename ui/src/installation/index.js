import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import OnboardingStatus from './components/OnboardingStatus';
import AdminAccountSetupForm from './forms/AdminAccountSetupForm';
import ChooseNetworkForm from './forms/ChooseNetworkForm';
import ConnectToRegistryForm from './forms/ConnectToRegistryForm';
import RegisterForm from './forms/RegisterForm';
import SetupMetamaskForm from './forms/SetupMetamaskForm';
import AdminAccountSetupInstructions from './instructions/AdminAccountSetupInstructions';
import ChooseNetworkInstructions from './instructions/ChooseNetworkInstructions';
import ConnectToRegistryInstructions from './instructions/ConnectToRegistryInstructions';
import RegisterInstructions from './instructions/RegisterInstructions';
import SetupMetamaskInstructions from './instructions/SetupMetamaskInstructions';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '4rem',
    width: '100%',
    height: '100vh',
    background: 'linear-gradient(#878787, #9e9e9e)',
    backgroundImage: 'url("/images/onboarding/bg.svg"), linear-gradient(#878787, #9e9e9e)',
  },
  grow: {
    flexGrow: 1,
  },
  wrapper: {
    background: 'white',
    height: '100%',
    position: 'relative',
    paddingTop: '3rem',
    paddingLeft: '2rem',
    overflowX: 'scroll',
  },
  paper: {
    padding: theme.spacing(2),
  },
  buttonChangeActive: {
    padding: '.5rem',
    background: 'white',
    pointer: 'pointer',
  },
}));

const steps = [
  {
    label: 'Choose Network',
    content: <ChooseNetworkForm />,
    instructions: <ChooseNetworkInstructions />,
  },
  {
    label: 'Setup Metamask',
    content: <SetupMetamaskForm />,
    instructions: <SetupMetamaskInstructions />,
  },
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

const Installation = ({ state }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(getStateId(state));

  useEffect(() => {
    setActiveStep(getStateId(state));
  }, [state]);

  return (
    <div className={classes.root}>
      <Paper elevation={3} className={classes.wrapper} square>
        <OnboardingStatus />
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Paper className={classes.paper}>{steps[activeStep].instructions}</Paper>
          </Grid>
          <Grid item xs={8}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map(({ label, content }) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent className={classes.stepContent}>{content}</StepContent>
                </Step>
              ))}
            </Stepper>
          </Grid>
        </Grid>
      </Paper>
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
  );
};

Installation.propTypes = {
  state: PropTypes.string.isRequired,
};

export default Installation;
