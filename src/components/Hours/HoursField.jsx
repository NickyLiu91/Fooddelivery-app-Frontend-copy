import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import {
  Box,
  Grid,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { TimePicker } from '@material-ui/pickers';

import { materialClassesType } from 'types';
import { validateHoursField } from 'sdk/utils/hours';
import { fieldStyles } from './Hours.styled';

function HoursField(props) {
  const {
    hoursData,
    label,
    onChange,
    isSplit,
    classes,
  } = props;

  function toggleStatus(status) {
    const newhoursData = _.clone(hoursData);
    newhoursData[status] = !newhoursData[status];
    onChange(newhoursData);
  }

  function handleTimeChange(index, point, time) {
    const newhoursData = _.cloneDeep(hoursData);
    newhoursData.time[index][point] = time;
    const errors = validateHoursField(newhoursData, isSplit);
    newhoursData.errors = errors;
    onChange(newhoursData);
  }

  return (
    <React.Fragment>
      <Box mt={2} mb={isSplit ? 2 : 1}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <FormControlLabel
              label={label}
              control={
                <Checkbox
                  checked={hoursData.open}
                  color="primary"
                  onChange={() => toggleStatus('open')}
                />
              }
            />
          </Grid>
          <Grid item xs={2}>
            { hoursData.open &&
              <FormControlLabel
                label="24 Hours"
                control={
                  <Checkbox
                    checked={hoursData.allDay}
                    color="primary"
                    onChange={() => toggleStatus('allDay')}
                  />
                }
              />
            }
          </Grid>
          <Grid item xs={4} className={classes.pickerWrapper}>
            { hoursData.open &&
              !hoursData.allDay &&
              <TimePicker
                className={classes.timePicker}
                minutesStep={5}
                error={!!hoursData.errors[0].from}
                helperText={hoursData.errors[0].from}
                value={hoursData.time[0].from}
                onChange={time => handleTimeChange(0, 'from', time)}
                disabled={!hoursData.open
                          || hoursData.allDay}
              />
            }
          </Grid>
          <Grid item xs={4} className={classes.pickerWrapper}>
            { hoursData.open &&
              !hoursData.allDay &&
              <TimePicker
                className={classes.timePicker}
                minutesStep={5}
                error={!!hoursData.errors[0].to}
                helperText={hoursData.errors[0].to}
                value={hoursData.time[0].to}
                onChange={time => handleTimeChange(0, 'to', time)}
                disabled={!hoursData.open
                          || hoursData.allDay}
              />
            }
          </Grid>
        </Grid>
        { isSplit &&
          hoursData.open &&
          !hoursData.allDay &&
          <Grid container spacing={2}>
            <Grid item xs={4} />
            <Grid item xs={4} className={classes.pickerWrapper}>
              <TimePicker
                className={classes.timePicker}
                minutesStep={5}
                clearable
                error={!!hoursData.errors[1].from}
                helperText={hoursData.errors[1].from}
                value={hoursData.time[1].from}
                onChange={time => handleTimeChange(1, 'from', time)}
                disabled={!hoursData.open
                          || hoursData.allDay}
              />
            </Grid>
            <Grid item xs={4} className={classes.pickerWrapper}>
              <TimePicker
                className={classes.timePicker}
                minutesStep={5}
                clearable
                error={!!hoursData.errors[1].to}
                helperText={hoursData.errors[1].to}
                value={hoursData.time[1].to}
                onChange={time => handleTimeChange(1, 'to', time)}
                disabled={!hoursData.open
                          || hoursData.allDay}
              />
            </Grid>
          </Grid>
        }
      </Box>
      <Divider />
    </React.Fragment>
  );
}

HoursField.propTypes = {
  hoursData: PropTypes.shape({
    open: PropTypes.bool,
    allDay: PropTypes.bool,
    time: PropTypes.arrayOf(PropTypes.shape({
      from: PropTypes.instanceOf(moment).isRequiredOrNull,
      to: PropTypes.instanceOf(moment).isRequiredOrNull,
    })).isRequired,
    errors: PropTypes.arrayOf(PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    })),
  }),
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: materialClassesType.isRequired,
  isSplit: PropTypes.bool.isRequired,
};

HoursField.defaultProps = {
  hoursData: {
    errors: [{}, {}],
  },
};

export default withStyles(fieldStyles)(HoursField);
