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
import { useStyles } from './StopTakingOrders.styled';

const validationSchema = () => (
  Yup.object()
    .shape({
      name: Yup.string()
        .min(2, 'The input length should be between 2 and 64 symbols')
        .max(64, 'The input length should be between 2 and 64 symbols')
        .required('Required'),
      reason: Yup.string()
        .min(3, 'The input length should be between 3 and 256 symbols')
        .max(256, 'The input length should be between 3 and 256 symbols')
        .required('Required'),
    })
);

function StopTakingOrdersDialog(props) {
  const {
    onConfirm,
    onClose,
    isOpen,
  } = props;
  const classes = useStyles();

  return (
    <Formik
      enableReinitialize
      initialValues={{ name: '', reason: '' }}
      onSubmit={onConfirm}
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
            open={isOpen}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="form-dialog-title"
          >
            <form onSubmit={handleSubmit}>
              <DialogTitle id="form-dialog-title">Stop taking orders</DialogTitle>
              <DialogContent>
                <TextField
                  label="Name*"
                  name="name"
                  error={errors.name && touched.name}
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={(errors.name && touched.name) && errors.name}
                  margin="normal"
                  fullWidth
                />
                <TextField
                  label="Reason*"
                  name="reason"
                  error={errors.reason && touched.reason}
                  value={values.reason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={(errors.reason && touched.reason) && errors.reason}
                  margin="normal"
                  fullWidth
                  multiline
                />
              </DialogContent>
              <DialogActions>
                <Button
                  type="button"
                  className={classes.formButton}
                  disabled={isSubmitting}
                  size="large"
                  onClick={onClose}
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
                    Submit
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        );
      }}
    </Formik>
  );
}

StopTakingOrdersDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default connect(null, null)(StopTakingOrdersDialog);
