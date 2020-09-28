import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import EventTrackerContent from './EventTrackerContent';

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    bottom: '-260px',
    left: 0,
    height: '300px',
    borderTop: '1px solid silver',
    background: 'white',
    width: '100%',
    transition: 'all .2s ease',
    zIndex: 2,
    boxShadow: `0px -10px 20px 0px rgba(0, 0, 0,0)`,
  },
  open: {
    bottom: 0,
    boxShadow: `0px -10px 20px 0px rgba(0, 0, 0, 0.33)`,
  },
}));

const EventTracker = () => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  const rootClasses = classNames(classes.root, {
    [classes.open]: isOpen,
  });

  return (
    <>
      {/* <div className={overlayClasses} /> */}
      <Paper className={rootClasses}>
        <Button onClick={() => setIsOpen(!isOpen)}>Toggle Open</Button>
        <EventTrackerContent />
      </Paper>
    </>
  );
};

export default EventTracker;
