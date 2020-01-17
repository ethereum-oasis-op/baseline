import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    display: 'flex',
    borderRadius: '.2rem',
    color: 'black',
  },
  connected: {
    color: 'lime',
  },
  error: {
    color: 'red',
  },
  userSelection: {
    width: '200px',
    color: 'black',
    marginLeft: '1rem',
  },
}));

const UserSelection = () => {
  const classes = useStyles();
  const [data, setData] = useState({ status: 504 });
  const apiURL = window.localStorage.getItem('api') || 'http://radish-api-buyer.docker/graphql';

  console.log(`UI attached to ${data}`);

  const fetchHealthCheck = useCallback(async () => {
    const result = await fetch(`${apiURL}/healthcheck`);
    setData(result);
  }, [apiURL]);

  useEffect(() => {
    fetchHealthCheck();
  }, [fetchHealthCheck]);

  const handleChange = event => {
    const users = {
      Org1: { url: 'radish-api-buyer.docker/graphql', role: 1 },
      'Supplier 1': { url: 'radish-api-supplier1.docker/graphql', role: 2 },
      'Supplier 2': { url: 'radish-api-supplier2.docker/graphql', role: 2 },
    };
    window.location.reload(false);
    window.localStorage.setItem('api', users[event.target.value].url);
    window.localStorage.setItem('userRole', users[event.target.value].role);
    window.localStorage.setItem('username', event.target.value);
  };

  return (
    <div className={classes.root}>
      <Select className={classes.userSelection} value="Org1" onChange={handleChange}>
        <MenuItem value="Org1">Buyer</MenuItem>
        <MenuItem value="Supplier 1">Supplier1</MenuItem>
        <MenuItem value="Supplier 2">Supplier2</MenuItem>
      </Select>
    </div>
  );
};

export default UserSelection;
