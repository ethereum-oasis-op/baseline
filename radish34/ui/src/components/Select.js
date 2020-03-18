import React from 'react';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MUISelect from '@material-ui/core/Select';

const Select = ({
  required,
  label,
  labelIdentifier,
  valueIdentifier,
  form: { dirty, touched, errors },
  field: { name, onChange, value },
  options,
  fullWidth,
  margin,
  shrink,
  allowEmptyOption,
  ...other
}) => {
  const id = `sel_${name}`;
  const errorText = errors[name];
  const hasError = dirty && touched[name] && errorText !== undefined;
  return (
    <FormControl fullWidth={fullWidth} margin={margin} required={required} error={hasError}>
      <InputLabel shrink={shrink || value !== null} htmlFor={id}>
        {label}
      </InputLabel>
      <MUISelect onChange={onChange} value={value} required={required} name={name} {...other}>
        {allowEmptyOption && <MenuItem key="empty" value="" />}
        {options.map(item => (
          <MenuItem key={`${item[valueIdentifier]}-key`} value={item[valueIdentifier]}>
            {item[labelIdentifier]}
          </MenuItem>
        ))}
      </MUISelect>
      {hasError && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  field: PropTypes.shape({
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.shape({}),
      PropTypes.any,
    ]),
  }).isRequired,
  form: PropTypes.shape({
    dirty: PropTypes.bool,
    errors: PropTypes.object,
    touched: PropTypes.shape({}),
  }).isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  margin: PropTypes.oneOf(['none', 'dense', 'normal']),
  shrink: PropTypes.bool,
  labelIdentifier: PropTypes.string,
  valueIdentifier: PropTypes.string,
  allowEmptyOption: PropTypes.bool,
};

Select.defaultProps = {
  label: '',
  required: false,
  fullWidth: true,
  margin: 'normal',
  shrink: false,
  labelIdentifier: 'label',
  valueIdentifier: 'value',
  allowEmptyOption: false,
};

export default Select;
