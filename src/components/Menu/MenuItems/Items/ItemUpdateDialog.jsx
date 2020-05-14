import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

const validationSchema = () => (
  Yup.object()
    .shape({
      not_available_for_days: Yup.number()
        .typeError('Only digits are allowed.')
        .integer('Only digits are allowed.')
        .min(1, 'The value should be between 1 and 30.')
        .max(30, 'The value should be between 1 and 30.'),
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

  render() {
    const {
      closeHandler,
      isOpen,
      submitHandler,
    } = this.props;

    return (
      <Formik
        initialValues={{
          availability_status: 'AVAILABLE',
          not_available_for_days: 1,
        }}
        onSubmit={submitHandler}
        validationSchema={validationSchema()}
      >
        {(property) => {
          const {
            values,
            handleSubmit,
            errors,
            touched,
            handleChange,
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
                <form onSubmit={handleSubmit}>
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
                        onChange={handleChange}
                      >
                        <FormControlLabel value="AVAILABLE" control={<Radio />} label="Available" />
                        <Divider />
                        <FormControlLabel value="SOLD_OUT" control={<Radio />} label="Sold out for today" />
                        <Divider />
                        <FormControlLabel value="ARCHIVED" control={<Radio />} label="Archived" />
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
                      type="submit"
                      size="large"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setFieldValue('not_available_for_days', this.state.not_available_for_days);
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
  submitHandler: PropTypes.func.isRequired,
};

export default connect(null, null)(ItemUpdateDialog);
