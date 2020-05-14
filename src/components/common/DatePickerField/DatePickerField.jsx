import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { DATE_PATTERN } from 'constants/moment';


const parsedCurrentDay = moment()
  .format(DATE_PATTERN);

const DatePickerField = ({ field, form, ...other }) => {
  const { name } = field;
  const currentError = form.errors[name];
  const isEndDate = name === 'endDate';
  const customProps = {
    invalidDateMessage: `Date range is invalid. Please check the ${isEndDate ? 'FROM' : 'TO'} date.`,
  };
  if (isEndDate) {
    customProps.minDate = form.values.startDate;
    customProps.minDateMessage = 'Date range is invalid. Please check the TO date.';
  } else {
    customProps.maxDate = form.values.endDate;
  }
  return (
    <KeyboardDatePicker
      clearable
      name={name}
      value={form.values[name]}
      format={DATE_PATTERN}
      inputVariant="outlined"
      margin="dense"
      helperText={currentError}
      error={Boolean(currentError)}
      placeholder={parsedCurrentDay}
      onError={error => {
        if (error !== currentError) {
          form.setFieldError(name, error);
        }
      }}
      onChange={date => form.setFieldValue(name, date)}
      {...other}
      {...customProps}
    />
  );
};

DatePickerField.propTypes = {
  form: PropTypes.oneOfType([
    PropTypes.object,
  ]).isRequired,
  field: PropTypes.oneOfType([
    PropTypes.object,
  ]).isRequired,
};

export default DatePickerField;
