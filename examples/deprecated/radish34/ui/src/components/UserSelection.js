import React, { useState, useEffect, useCallback, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { ServerSettingsContext } from '../contexts/server-settings-context';
import { Config } from '../config-radish.json';

const uriBuyer = `${Config.radishBuyerAPIURL}/graphql`;
const uriSupplier1 = `${Config.radishSupplier1APIURL}/graphql`;
const uriSupplier2 = `${Config.radishSupplier2APIURL}/graphql`;

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
  const apiURL = window.localStorage.getItem('api') || `http://${uriBuyer}`;
  const user = window.localStorage.getItem('username') || 'Org1';
  const { settings } = useContext(ServerSettingsContext);
  const { organizationAddress } = settings || {};
  console.log(`UI attached to ${data}`);

  const fetchHealthCheck = useCallback(async () => {
    const urlArray = apiURL.split('graphql');
    const healthURL = `http://${urlArray[0]}health`;
    const result = await fetch(healthURL);
    setData(result);
  }, [apiURL]);

  useEffect(() => {
    fetchHealthCheck();
  }, [fetchHealthCheck]);

  useEffect(() => {
    if (organizationAddress) localStorage.setItem('userAddress', organizationAddress);
  }, [organizationAddress]);

  const handleChange = event => {
    const users = {
      Org1: { url: uriBuyer, role: 1 },
      Supplier1: { url: uriSupplier1, role: 2 },
      Supplier2: { url: uriSupplier2, role: 2 },
    };
    window.location.reload(false);
    window.localStorage.setItem('api', users[event.target.value].url);
    window.localStorage.setItem('userRole', users[event.target.value].role);
    window.localStorage.setItem('username', event.target.value);
  };

  return (
    <div className={classes.root}>
      <Select className={classes.userSelection} value={user} onChange={handleChange}>
        <MenuItem value="Org1">Buyer</MenuItem>
        <MenuItem value="Supplier1">Supplier1</MenuItem>
        <MenuItem value="Supplier2">Supplier2</MenuItem>
      </Select>
    </div>
  );
};

export default UserSelection;
