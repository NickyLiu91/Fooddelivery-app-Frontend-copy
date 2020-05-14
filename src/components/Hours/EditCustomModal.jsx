import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from '@material-ui/pickers';

import {
  Typography,
  Grid,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  FormControlLabel,
  Checkbox,
  TextField,
  IconButton,
  CircularProgress,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { materialClassesType } from 'types';
import moment from 'moment';
import HoursField from './HoursField';

// eslint-disable-next-line no-use-before-define
EditCustomModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isNew: PropTypes.bool.isRequired,
  classes: materialClassesType.isRequired,
  disabledDates: PropTypes.arrayOf(PropTypes.instanceOf(moment)).isRequired,
  hoursData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(moment),
    labelError: PropTypes.string,
    dateError: PropTypes.string,
    isSplit: PropTypes.bool.isRequired,
    delivery: PropTypes.shape({
      open: PropTypes.bool.isRequired,
      allDay: PropTypes.bool.isRequired,
      time: PropTypes.arrayOf(PropTypes.shape({
        from: PropTypes.instanceOf(moment),
        to: PropTypes.instanceOf(moment),
      })),
    }),
    pickup: PropTypes.shape({
      open: PropTypes.bool.isRequired,
      allDay: PropTypes.bool.isRequired,
      time: PropTypes.arrayOf(PropTypes.shape({
        from: PropTypes.instanceOf(moment),
        to: PropTypes.instanceOf(moment),
      })),
    }),
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onLabelChange: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onHoursChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSplitChange: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};


function EditCustomModal(props) {
  const {
    isOpen,
    onClose,
    isNew,
    classes,
    hoursData,
    onSubmit,
    onLabelChange,
    onDateChange,
    onHoursChange,
    onDelete,
    onSplitChange,
    submitting,
    disabledDates,
  } = props;

  const disableDates = date => {
    for (let i = 0; i < disabledDates.length; i += 1) {
      if (disabledDates[i].isSame(date, 'date')) return true;
    }
    return false;
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={isOpen}
      onClose={onClose}
    >
      <DialogTitle>
        {isNew ? 'Add' : 'Edit'} Custom Hours
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <TextField
            margin="normal"
            error={!!hoursData.labelError}
            helperText={hoursData.labelError}
            id="label"
            label="Label*"
            name="label"
            value={hoursData.name}
            onChange={onLabelChange}
          />
          <Box mt={1} mb={1} className={classes.datePickerWrapper}>
            <DatePicker
              label="Date"
              minDate={moment()}
              error={!!hoursData.dateError}
              helperText={hoursData.dateError}
              value={hoursData.date}
              onChange={onDateChange}
              shouldDisableDate={disableDates}
              format="MM/DD/YYYY"
            />
          </Box>
          <Box>
            <FormControlLabel
              label="Split hours"
              control={
                <Checkbox
                  checked={hoursData.isSplit}
                  color="primary"
                  onChange={() => onSplitChange()}
                />
              }
            />
          </Box>
          <Divider />
          <Box mt={3}>
            <Grid container spacing={3}>
              <Grid item sm={4} />
              <Grid item sm={4}>
                <Typography align="center" variant="body1">
                  Open
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography align="center" variant="body1">
                  Closed
                </Typography>
              </Grid>
            </Grid>
            <HoursField
              hoursData={hoursData.delivery}
              isSplit={hoursData.isSplit}
              onChange={(data) => onHoursChange('delivery', data)}
              label="Delievery"
            />
            <HoursField
              hoursData={hoursData.pickup}
              isSplit={hoursData.isSplit}
              onChange={(data) => onHoursChange('pickup', data)}
              label="Pickup"
            />
          </Box>
          <Box mt={2} mb={5}>
            <Grid container justify="flex-end">
              { !isNew ?
                <Button
                  variant="contained"
                  className={classes.formButton}
                  type="button"
                  color="secondary"
                  onClick={onDelete}
                  disabled={submitting}
                >
                  { submitting ? <CircularProgress size={24} /> : 'Delete' }
                </Button>
              : null }
              <Button
                color="primary"
                variant="contained"
                className={classes.formButton}
                type="submit"
                disabled={submitting}
              >
                { submitting ? <CircularProgress size={24} /> : 'Submit' }
              </Button>
            </Grid>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export default EditCustomModal;
