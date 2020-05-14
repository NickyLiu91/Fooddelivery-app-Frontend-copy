import React from 'react';
import PropTypes from 'prop-types';

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
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { materialClassesType } from 'types';
import moment from 'moment';
import HoursField from './HoursField';

// eslint-disable-next-line no-use-before-define
EditWeeklyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: materialClassesType.isRequired,
  hoursData: PropTypes.arrayOf(PropTypes.shape({
    day: PropTypes.string.isRequired,
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
  })).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onHoursChange: PropTypes.func.isRequired,
  onSplitChange: PropTypes.func.isRequired,
  activeTab: PropTypes.oneOf(['delivery', 'pickup']).isRequired,
  activeTabIndex: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired,
  isSplit: PropTypes.shape({
    delivery: PropTypes.bool,
    pickup: PropTypes.bool,
  }).isRequired,
  submitting: PropTypes.bool.isRequired,
};


function EditWeeklyModal(props) {
  const {
    isOpen,
    onClose,
    classes,
    hoursData,
    onSubmit,
    onHoursChange,
    onSplitChange,
    activeTab,
    activeTabIndex,
    onTabChange,
    isSplit,
    submitting,
  } = props;

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={isOpen}
      onClose={onClose}
    >
      <DialogTitle>
        Edit Weekly Hours
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Tabs
          value={activeTabIndex}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          onChange={onTabChange}
        >
          <Tab label="Delivery" />
          <Tab label="Pickup" />
        </Tabs>
        <form onSubmit={onSubmit}>
          <Box>
            <FormControlLabel
              label="Split hours"
              control={
                <Checkbox
                  checked={isSplit[activeTab]}
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
            {hoursData.map((weekDay, index) => (
              <HoursField
                hoursData={weekDay[activeTab]}
                isSplit={isSplit[activeTab]}
                onChange={(data) => onHoursChange(index, data)}
                label={weekDay.day}
                key={weekDay.day}
              />
            ))}
          </Box>
          <Box mt={2} mb={5}>
            <Grid container justify="flex-end">
              { !submitting &&
                <Button
                  variant="contained"
                  className={classes.formButton}
                  type="button"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              }
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


export default EditWeeklyModal;
