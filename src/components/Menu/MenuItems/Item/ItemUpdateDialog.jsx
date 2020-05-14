import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

let availabilityStatus = null;
const validationSchema = () => (
  Yup.object()
    .shape({
      not_available_for_days: Yup.number()
        .typeError('Only digits are allowed.')
        .integer('Only digits are allowed.')
        .min(1, 'The value should be between 1 and 30.')
        .max(30, 'The value should be between 1 and 30.')
        .test('required', 'Required', (value) => {
          const test = availabilityStatus === 'SOLD_OUT_FOR_DAYS' && !value;
          return !test;
        }),
    })
);

class ItemUpdateDialog extends Component {
  state = {
    not_available_for_days: 1,
  };

  handleChangeTime = (updatedTime, state) => {
    this.setState({ [state]: updatedTime });
  };

  increaseTime = (state) => {
    if (Number(this.state[state]) < 30) {
      this.setState({ [state]: Number(this.state[state]) + 1 });
    }
  };

  decreaseTime = (state) => {
    if (Number(this.state[state]) > 1) {
      this.setState({ [state]: Number(this.state[state]) - 1 });
    }
  };

  submitAvailabilityStatus = (status, errors, days) => {
    if (errors.not_available_for_days === undefined) {
      if (status.availability_status === 'SOLD_OUT') {
        this.props.setFieldValue('availability_status', 'SOLD_OUT');
        this.props.setFieldValue('not_available_for_days', 0);
      } else if (status.availability_status === 'SOLD_OUT_FOR_DAYS') {
        this.props.setFieldValue('availability_status', 'SOLD_OUT');
        this.props.setFieldValue('not_available_for_days', days !== status.not_available_for_days ?
          days : status.not_available_for_days);
      } else {
        this.props.setFieldValue('availability_status', status.availability_status);
        this.props.setFieldValue('not_available_for_days', status.not_available_for_days);
      }
      this.props.closeHandler();
    }
  };

  handleChangeAvailabilityStatus = (event) => {
    availabilityStatus = event.target.value;
  };

  render() {
    const {
      closeHandler,
      isOpen,
    } = this.props;

    return (
      <Formik
        initialValues={{
          availability_status: 'AVAILABLE',
          not_available_for_days: 1,
        }}
        validationSchema={validationSchema()}
      >
        {(property) => {
          const {
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
          } = property;
          return (
            <div>
              <Dialog
                open={isOpen}
                onClose={closeHandler}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="sm"
              >
                <form>
                  <DialogTitle id="form-dialog-title">Update availability for items</DialogTitle>
                  <DialogContent>
                    <FormControl component="fieldset">
                      <RadioGroup
                        aria-label="gender"
                        name="availability_status"
                        id="radioGroup"
                        label="One of these please"
                        value={values.availability_status}
                        error={errors.availability_status}
                        touched={touched.availability_status}
                        onChange={(event) => {
                          handleChange(event);
                          this.handleChangeAvailabilityStatus(event);
                        }}
                      >
                        <FormControlLabel value="AVAILABLE" control={<Radio />} label="Available" />
                        <Divider />
                        <FormControlLabel
                          value="SOLD_OUT"
                          control={<Radio />}
                          label="Sold out for today"
                        />
                        <Divider />
                        <FormControlLabel
                          value="SOLD_OUT_FOR_DAYS"
                          control={<Radio />}
                          label={
                            <Grid
                              container
                              spacing={3}
                              style={{ width: 'calc(100% + 25px)' }}
                              direction="row"
                              justify="center"
                              alignItems="center"
                            >
                              <Grid item>Sold out for</Grid>
                              <Grid item>
                                <Fab
                                  size="small"
                                  color="primary"
                                  onClick={() => {
                                    this.decreaseTime('not_available_for_days');
                                    setFieldValue('not_available_for_days', this.state.not_available_for_days);
                                  }}
                                >
                                  -
                                </Fab>
                              </Grid>
                              <Grid item>
                                <TextField
                                  name="not_available_for_days"
                                  error={
                                    errors.not_available_for_days &&
                                    touched.not_available_for_days
                                  }
                                  value={this.state.not_available_for_days}
                                  onChange={(e) => {
                                    this.handleChangeTime(e.target.value, 'not_available_for_days');
                                    handleChange(e);
                                  }}
                                  onBlur={handleBlur}
                                  helperText={
                                    (
                                      errors.not_available_for_days &&
                                      touched.not_available_for_days
                                    ) && errors.not_available_for_days
                                  }
                                  style={{ width: '100px' }}
                                />
                              </Grid>
                              <Grid item>
                                <Fab
                                  size="small"
                                  color="primary"
                                  onClick={() => {
                                    this.increaseTime('not_available_for_days');
                                    setFieldValue('not_available_for_days', this.state.not_available_for_days);
                                  }}
                                >
                                  +
                                </Fab>
                              </Grid>
                              <Grid item>days</Grid>
                            </Grid>
                          }
                        />
                        <Divider />
                        <FormControlLabel
                          value="ARCHIVED"
                          control={<Radio />}
                          label="Archive this item until I make available"
                        />
                        <Divider />
                      </RadioGroup>
                    </FormControl>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      type="button"
                      size="large"
                      onClick={closeHandler}
                      variant="contained"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="large"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        this.submitAvailabilityStatus({
                          availability_status: values.availability_status,
                          not_available_for_days: values.not_available_for_days,
                        }, errors, this.state.not_available_for_days);
                      }}
                    >
                      Done
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>
            </div>
          );
        }}
      </Formik>
    );
  }
}

ItemUpdateDialog.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default connect(null, null)(ItemUpdateDialog);
