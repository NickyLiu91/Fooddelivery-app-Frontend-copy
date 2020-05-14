import React from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useStyles } from './Orders.styled';

const validationSchema = () => (
  Yup.object()
    .shape({
      reason: Yup.string()
        .test('whitespace', 'Required', (value) => /\S/.test(value))
        .trim()
        .min(3, 'The input length should be between 3 and 256 symbols')
        .max(256, 'The input length should be between 3 and 256 symbols')
        .required('Required'),
    })
);

function CancelDialog(props) {
  const {
    handleCloseCancel,
    isOpenCancel,
    handleCancel,
  } = props;
  const classes = useStyles();

  return (
    <Formik
      initialValues={{ reason: '' }}
      onSubmit={handleCancel}
      validationSchema={validationSchema()}
    >
      {(property) => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = property;
        return (
          <Dialog
            open={isOpenCancel}
            onClose={handleCloseCancel}
            fullWidth
            maxWidth="sm"
            aria-labelledby="form-dialog-title"
          >
            <form onSubmit={handleSubmit}>
              <DialogTitle id="form-dialog-title">Cancel Order</DialogTitle>
              <DialogContent>
                <TextField
                  label="Cancel reason"
                  name="reason"
                  error={errors.reason && touched.reason}
                  value={values.reason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={(errors.reason && touched.reason) && errors.reason}
                  margin="normal"
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button
                  type="button"
                  className={classes.formButton}
                  disabled={isSubmitting}
                  size="large"
                  onClick={handleCloseCancel}
                  variant="contained"
                >
                    Cancel
                </Button>
                <Button
                  type="submit"
                  size="large"
                  className={classes.formButton}
                  disabled={isSubmitting}
                  variant="contained"
                  color="primary"
                >
                    Ok
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        );
      }}
    </Formik>
  );
}

CancelDialog.propTypes = {
  handleCloseCancel: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  isOpenCancel: PropTypes.bool.isRequired,
};

export default connect(null, null)(CancelDialog);
