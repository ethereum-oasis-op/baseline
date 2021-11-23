import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ServerStatusProvider, ServerStatusContext } from '../contexts/server-status-context';

const useStyles = makeStyles(() => ({
  root: {
  },
}));

const RenderBalance = () => {
  const classes = useStyles();
  const { status, loading} = useContext(ServerStatusContext);

  if(loading) { return <div>Loading</div>}

  return (
    <span className={`balance ${classes.root}`}>
      {status.balance}
    </span>
  );
}

const Balance = () => {  
  return (
    <ServerStatusProvider>
      <RenderBalance />
    </ServerStatusProvider>
  );
};

export default Balance;
