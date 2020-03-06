import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { makeStyles } from '@material-ui/core/styles';
import uniqid from 'uniqid';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    marginBottom: '1rem',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  select: {
    maxHeight: '2.25rem',
    overflow: 'hidden',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#007BFF',
    },
  },
  icon: {
    fill: '#007BFF',
    position: 'relative',
    top: '.1rem',
    '&:hover': {
      cursor: 'pointer',
    }
  },
}));

const DropDown = props => {
  const { items, onChange, value, disabled, field } = props;
  const classes = useStyles();

  return (
    <FormControl variant="outlined" className={classes.formControl} disabled={disabled}>
      <Select
        name={field.name}
        displayEmpty
        defaultValue=""
        value={value}
        onChange={onChange}
        IconComponent={KeyboardArrowDown}
        autoWidth
        className={classes.select}
        inputProps={{
          classes: {
            icon: classes.icon,
          },
        }}
      >
        {items.map(item => (
          <MenuItem key={uniqid()} value={item.value} disabled={item.disabled}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

DropDown.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  field: PropTypes.shape({}),
}

DropDown.defaultProps = {
  disabled: false,
  field: {},
};

export default DropDown;
