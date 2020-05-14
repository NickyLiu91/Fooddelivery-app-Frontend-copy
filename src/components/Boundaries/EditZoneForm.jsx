/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {
  Box,
  Grid,
  Button,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import { Loader } from 'components/common';

function EditZoneForm({
  onFormSubmit,
  onCancel,
  isSubmitting,
  zone,
}) {
  function handleFormSubmit(data) {
    onFormSubmit({
      ...data,
      additional_delivery_time: data.additional_delivery_time
        ? data.additional_delivery_time : null,
    });
  }

  return (
    <Box mt={1}>
      <Formik
        initialValues={{
          ...zone,
          additional_delivery_time: zone.additional_delivery_time
            ? zone.additional_delivery_time : '',
        }}
        onSubmit={handleFormSubmit}
        validationSchema={Yup.object().shape({
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
              <TextField
                name="name"
                error={errors.name && touched.name}
                value={values.name}
                onChange={handleChange}
                label="Zone name*"
                onBlur={handleBlur}
                helperText={(errors.name && touched.name) && errors.name}
                margin="dense"
                fullWidth
              />
              <TextField
                name="delivery_fee"
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
                InputProps={{
                  startAdornment: <InputAdornment position="start">Minutes:</InputAdornment>,
                }}
                label="Additional delivery time"
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
              <Box mt={1}>
                {
              !isSubmitting ?
                <Grid spacing={2} container justify="flex-end">
                  <Grid item>
                    <Button
                      color="primary"
                      size="small"
                      type="button"
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      type="submit"
                      variant="contained"
                      size="small"
                      color="primary"
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid> :
                <Loader />
                }
              </Box>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
}

EditZoneForm.propTypes = {
  zone: PropTypes.shape({
    name: PropTypes.string.isRequired,
    delivery_fee: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    additional_delivery_time: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }).isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

export default EditZoneForm;

