import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

// Reference: https://steemit.com/ethereum/@bungalogic/how-to-set-up-metamask-in-google-chrome-and-get-proof-of-community-poc-token

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  imageWrapper: {
    height: '235px',
    display: 'flex',
    alignItems: 'center',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '300px',
    height: 'auto',
  }
});

const instructions = [
  {
    img: '/images/onboarding/metamask/step1.png',
    steps: [
      { number: 1, text: 'Make sure you are using an up to date version of Google Chrome, simply go to the metamask.io website' },
      { number: 2, text: 'Get the Chrome extension.' },
    ],
  },
  {
    img: '/images/onboarding/metamask/step2.png',
    steps: [
      { number: 3, text: 'a window will pop up and you will press the add to chrome button then in' },
      { number: 4, text: 'add the extension.' },
    ],
  },
  {
    img: '/images/onboarding/metamask/step3.png',
    steps: [
      { number: 5, text: 'Next to the address bar in the top right corner look for the Fox icon click on that' },
      { number: 6, text: 'Read the terms all the way through and click accept.' },
      { number: 7, text: 'If you have ethereum already you simply need to create an "Existing account" and connect your wallet. Make sure that you have your 12 words ready to set up your wallet.' },
    ],
  },
];

const StepList = ({ steps }) => {
  return (
    <List>
      {steps.map(({ number, text }) => (
        <ListItem divider key={number}>
          <ListItemText primary={`Step ${number}: ${text}`} />
        </ListItem>
      ))}
    </List>
  )
}

const SetupMetamaskInstructions = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <div className={classes.imageWrapper}>
        <img src={instructions[activeStep].img} className={classes.image} alt="Metamask Instructions" />
      </div>
      <MobileStepper
        variant="progress"
        steps={instructions.length}
        position="static"
        activeStep={activeStep}
        className={classes.root}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === instructions.length - 1}>
            Next
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Back
          </Button>
        }
      />
      <StepList steps={instructions[activeStep].steps} />
    </div>
  );
}

export default SetupMetamaskInstructions;
