import React from 'react';
import {
  Typography,
  Grid,
  Paper,
  Divider,
  Button,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { materialClassesType } from 'types';

export default function HoursPaper({
  classes,
  label,
  onEdit,
  // eslint-disable-next-line react/prop-types
  children,
  buttonLabel,
}) {
  return (
    <Paper className={classes.paper}>
      <Grid container>
        <Typography variant="h6" gutterBottom className={classes.paperHeader}>
          {label}
        </Typography>
        <Button
          size="small"
          variant="contained"
          color="primary"
          className={classes.editHoursButton}
          onClick={() => onEdit()}
        >
          {buttonLabel}
        </Button>
      </Grid>
      <Divider />
      {children}
    </Paper>
  );
}

HoursPaper.propTypes = {
  classes: materialClassesType.isRequired,
  label: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  buttonLabel: PropTypes.string.isRequired,
};
