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
  Grid,
  TextField,
  InputAdornment,
  // IconButton,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@material-ui/core';
// import AddCircleIcon from '@material-ui/icons/AddCircle';
// import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

const validationSchema = addBoundary => Yup.object().shape({
  boundaryName: addBoundary ? Yup.string()
    .min(2, 'Your input length should be between 2 and 32 symbols.')
    .max(32, 'Your input length should be between 2 and 32 symbols.')
    .required('Required field cannot be empty') : null,
  name: Yup.string()
    .min(2, 'Your input length should be between 2 and 32 symbols.')
    .max(32, 'Your input length should be between 2 and 32 symbols.')
    .required('Required field cannot be empty'),
  delivery_fee: Yup.number()
    .typeError('Should be a number')
    .min(0, 'Value should be between 0 and 100$.')
    .max(100, 'Value should be between 0 and 100$.'),
  additional_delivery_time: Yup.number()
    .typeError('Should be a number')
    .min(5, 'Value should be between 5 and 120 minutes.')
    .max(120, 'Value should be between 5 and 120 minutes.'),
  distance: Yup.number()
    .typeError('Should be a number')
    .min(1, 'Value should be between 1 and 10 miles.')
    .max(10, 'Value should be between 1 and 10 miles.')
    .required('Required'),
});

function AddZoneDialog({
  onClose,
  onConfirm,
  isOpen,
  addBoundary,
}) {
  const handleFormSubmit = (data) => {
    onConfirm(data);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Formik
        initialValues={{
          boundaryName: '',
          name: '',
          delivery_fee: '0',
          distance: '2',
          additional_delivery_time: '',
          figure: 'square',
        }}
        onSubmit={handleFormSubmit}
        validationSchema={validationSchema(addBoundary)}
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
                {`Create ${addBoundary ? 'boundary' : 'delivery zone'}`}
              </DialogTitle>
              <DialogContent>
                {
                  addBoundary &&
                  <React.Fragment>
                    <TextField
                      name="boundaryName"
                      variant="outlined"
                      error={errors.boundaryName && touched.boundaryName}
                      value={values.boundaryName}
                      onChange={handleChange}
                      label="Boundary name*"
                      onBlur={handleBlur}
                      helperText={
                        (errors.boundaryName && touched.boundaryName) &&
                        errors.boundaryName
                      }
                      margin="dense"
                      fullWidth
                    />
                  </React.Fragment>
                }
                <Grid
                  container
                  justify="center"
                  spacing={2}
                >
                  <Grid item xs={9}>
                    <TextField
                      name="name"
                      variant="outlined"
                      error={errors.name && touched.name}
                      value={values.name}
                      onChange={handleChange}
                      label="Zone name*"
                      onBlur={handleBlur}
                      helperText={(errors.name && touched.name) && errors.name}
                      margin="dense"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      name="delivery_fee"
                      variant="outlined"
                      label="Delivery fee"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      error={errors.delivery_fee && touched.delivery_fee}
                      value={values.delivery_fee}
                      onChange={handleChange}
                      helperText={
                        (errors.delivery_fee && touched.delivery_fee) && errors.delivery_fee
                      }
                      onBlur={handleBlur}
                      margin="dense"
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  justify="center"
                  spacing={2}
                >
                  <Grid item xs={6}>
                    <TextField
                      name="additional_delivery_time"
                      value={values.additional_delivery_time}
                      error={errors.additional_delivery_time && touched.additional_delivery_time}
                      helperText={
                        (errors.additional_delivery_time && touched.additional_delivery_time)
                        && errors.additional_delivery_time
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">Minutes:</InputAdornment>,
                      }}
                      label="Additional delivery time"
                      margin="dense"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name="distance"
                      value={values.distance}
                      error={errors.distance && touched.distance}
                      helperText={(errors.distance && touched.distance) && errors.distance}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">Miles:</InputAdornment>,
                      }}
                      label="Distance from restaurant*"
                      margin="dense"
                      fullWidth
                    />
                    {/* <IconButton
                      color="primary"
                      style={{ marginTop: '4px' }}
                    >
                      <RemoveCircleIcon />
                    </IconButton>
                    <TextField
                      name="distance"
                      value={values.distance}
                      variant="outlined"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">Miles:</InputAdornment>,
                        type: 'number',
                      }}
                      label="Distance"
                      margin="dense"
                      style={{ width: '110px' }}
                    />
                    <IconButton
                      color="primary"
                      style={{ marginTop: '4px' }}
                    >
                      <AddCircleIcon />
                    </IconButton> */}
                  </Grid>
                </Grid>
                <RadioGroup aria-label="figure" name="figure" value={values.figure} onChange={handleChange} row>
                  <FormControlLabel value="square" control={<Radio color="primary" />} label="Square" />
                  <FormControlLabel value="circle" control={<Radio color="primary" />} label="Circle" />
                </RadioGroup>

              </DialogContent>
              <DialogActions>
                <Button type="button" onClick={onClose} color="primary">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                >
                  Continue
                </Button>
              </DialogActions>
            </form>
          );
        }}
      </Formik>
    </Dialog>
  );
}

AddZoneDialog.propTypes = {
  addBoundary: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default AddZoneDialog;
