/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from '@material-ui/core';

const propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

function EditBoundaryDialog({
  boundary,
  onClose,
  onConfirm,
  isOpen,
  isSubmitting,
}) {
  const handleFormSubmit = (data) => {
    onConfirm(data);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => isSubmitting ? onClose() : null}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Formik
        initialValues={boundary}
        onSubmit={handleFormSubmit}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .min(2, 'Your input length should be between 2 and 32 symbols.')
            .max(32, 'Your input length should be between 2 and 32 symbols.')
            .required('Required field cannot be empty'),
        })}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
          } = props;
          return (
            <form onSubmit={handleSubmit}>
              <DialogTitle id="alert-dialog-title">
                Edit boundary {boundary.name}
              </DialogTitle>
              <DialogContent>
                <TextField
                  name="name"
                  variant="outlined"
                  error={errors.name && touched.name}
                  value={values.name}
                  onChange={handleChange}
                  label="Boundary name*"
                  onBlur={handleBlur}
                  helperText={
                    (errors.name && touched.name) &&
                    errors.name
                  }
                  margin="dense"
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                {
                  <React.Fragment>
                    <Button
                      type="button"
                      onClick={onClose}
                      color="primary"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      { isSubmitting ? <CircularProgress size={24} /> : 'Continue'}
                    </Button>
                  </React.Fragment>
                }
              </DialogActions>
            </form>
          );
        }}
      </Formik>
    </Dialog>
  );
}

EditBoundaryDialog.propTypes = propTypes;

export default EditBoundaryDialog;
