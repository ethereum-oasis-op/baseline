import React from 'react';
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
    marginLeft: '.5rem',
    overflow: 'hidden',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#50A75D',
    }
  },
  icon: {
    fill: '#50A75D',
    position: 'relative',
    top: '.1rem',
  },
}));

const DropDown = (props) => {
  const { items, onChange } = props;
  const classes = useStyles();
  const [value, setValue] = React.useState('');

  const handleChange = event => {
    setValue(event.target.value);
    if (onChange) onChange(event);
  };

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <Select
        displayEmpty
        defaultValue=""
        value={value}
        onChange={handleChange}
        IconComponent={KeyboardArrowDown}
        autoWidth={true}
        className={classes.select}
        inputProps={{
          classes: {
            icon: classes.icon,
          },
        }}
      >
        <MenuItem value="" disabled>
          Create New Item
        </MenuItem>
        {items.map(item => (
          <MenuItem key={uniqid()} value={item.value}>{item.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DropDown;
