import React from 'react';
import PropTypes from 'prop-types';
import { Box, Checkbox, Divider, FormControlLabel, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { materialClassesType } from 'types';
import { fieldStyles } from './MenuSchedule.styled';
import { TimePicker } from '@material-ui/pickers';
import moment from 'moment';
import _ from 'lodash';
import { validateHoursField } from 'sdk/utils/schedules';

function SchedulesField(props) {
  const {
    hoursData,
    label,
    onChange,
    classes,
  } = props;

  function toggleStatus(status) {
    const newHoursData = _.clone(hoursData);
    newHoursData[status] = !newHoursData[status];
    onChange(newHoursData);
  }

  function handleTimeChange(point, time) {
    const newHoursData = _.cloneDeep(hoursData);
    newHoursData[point] = time;
    const errors = validateHoursField(newHoursData);
    newHoursData.errors = errors;
    onChange(newHoursData);
  }

  return (
    <React.Fragment>
      <Box mt={2} mb={2}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
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
          <Grid item xs={4} className={classes.pickerWrapper}>
            {hoursData.open &&
            <TimePicker
              className={classes.timePicker}
              minutesStep={5}
              value={hoursData.from}
              onChange={time => handleTimeChange('from', time)}
              disabled={!hoursData.open}
            />
            }
          </Grid>
          <Grid item xs={4} className={classes.pickerWrapper}>
            {hoursData.open &&
            <TimePicker
              className={classes.timePicker}
              minutesStep={5}
              value={hoursData.to}
              onChange={time => handleTimeChange('to', time)}
              disabled={!hoursData.open}
              error={!!hoursData.errors.error}
              helperText={hoursData.errors.error}
            />
            }
          </Grid>
        </Grid>
      </Box>
      <Divider />
    </React.Fragment>
  );
}

SchedulesField.propTypes = {
  hoursData: PropTypes.shape({
    open: PropTypes.bool,
    from: PropTypes.instanceOf(moment).isRequired,
    to: PropTypes.instanceOf(moment).isRequired,
    errors: PropTypes.oneOfType([
      PropTypes.object,
    ]),
  }).isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: materialClassesType.isRequired,
};

export default withStyles(fieldStyles)(SchedulesField);
