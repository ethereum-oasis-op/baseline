import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(() => ({
  select: {
    width: '130px',
  },
}));

const NotRegistered = () => {
  const classes = useStyles();

  return (
    <div>
      <h1>Register</h1>
      <div>
        <TextField
          id="standard-name"
          label="Organization Name"
          value=""
          onChange={() => {}}
          margin="normal"
        />
      </div>
      <div>
        <Select
          value={null}
          className={classes.select}
          onChange={() => {}}
          inputProps={{
            name: 'age',
            id: 'age-simple',
          }}
        >
          <MenuItem value={10}>Buyer</MenuItem>
          <MenuItem value={20}>Seller</MenuItem>
          <MenuItem value={30}>Sender</MenuItem>
        </Select>
      </div>
    </div>
  );
};

export default NotRegistered;
