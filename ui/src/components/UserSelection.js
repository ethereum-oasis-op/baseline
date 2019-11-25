import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CheckIcon from '@material-ui/icons/Check';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    background: 'white',
    padding: '.5rem',
    display: 'flex',
    margin: '1rem',
    borderRadius: '.2rem',
    color: 'black',
    boxShadow: '-1px 10px 6px -11px rgba(0,0,0,0.39)',
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
  const apiURL = window.localStorage.getItem('api') || 'radish-api-buyer.docker';

  const fetchHealthCheck = useCallback(async () => {
    const result = await fetch(`${apiURL}/healthcheck`);
    setData(result);
  }, [apiURL]);

  useEffect(() => {
    fetchHealthCheck();
  }, [fetchHealthCheck]);

  const handleChange = event => {
    window.location.reload(false);
    window.localStorage.setItem('api', event.target.value);
  };

  return (
    <div className={classes.root}>
      {data.status === 200 ? (
        <CheckIcon className={classes.connected} />
      ) : (
        <ErrorOutlineIcon className={classes.error} />
      )}
      <Select className={classes.userSelection} value={apiURL} onChange={handleChange}>
        <MenuItem value="radish-api-buyer.docker">Buyer</MenuItem>
        <MenuItem value="radish-api-supplier1.docker">Supplier1</MenuItem>
        <MenuItem value="radish-api-supplier2.docker">Supplier2</MenuItem>
        <MenuItem value="radish-api-supplier3.docker">Supplier3</MenuItem>
      </Select>
    </div>
  );
};

export default UserSelection;
