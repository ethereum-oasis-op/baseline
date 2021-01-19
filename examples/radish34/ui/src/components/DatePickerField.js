import React from 'react';
import PropTypes from 'prop-types';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

const DatePickerField = ({ field, form, label }) => {
  const today = moment(Date.now());

  return (
    <MuiPickersUtilsProvider utils={MomentUtils} moment={moment}>
      <KeyboardDatePicker
        clearable
        label={label}
        value={field.value}
        onChange={date => form.setFieldValue(field.name, moment(date).unix() * 1000)}
        minDate={today}
        format="MM/DD/YYYY"
        minDateMessage="Date should not be before today's date"
      />
    </MuiPickersUtilsProvider>
  );
};

DatePickerField.propTypes = {
  field: PropTypes.shape({}).isRequired,
  form: PropTypes.shape({}).isRequired,
  label: PropTypes.string.isRequired,
};

export default DatePickerField;
