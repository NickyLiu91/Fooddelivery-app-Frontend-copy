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
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import { useStyles } from '../RestaurantProfile.styled';
import { AddressSearch } from 'components/common';

const validationSchema = () => (
  Yup.object()
    .shape({
      name: Yup.string()
        .test('whitespace', 'Required', (value) => /\S/.test(value))
        .trim()
        .min(3, 'Your input is too short. Minimum length of the name is 3 symbols')
        .max(64, 'Your input is too long. Maximum length of the name is 64 symbols')
        .required('Required'),
      address: Yup.object().shape({
        long_name: Yup.string().required('Address is required'),
      }).nullable().required('Required'),
    })
);

function RestaurantDialog(props) {
  const {
    defaultData,
    submitHandler,
    openHandler,
    closeHandler,
    isOpen,
  } = props;
  const classes = useStyles();

  const handleAddressChange = (data, handleChange) => {
    if (data) {
      handleChange({ target: { name: 'address', value: data } });
    }
  };

  return (
    <Formik
      initialValues={{ ...defaultData }}
      onSubmit={submitHandler}
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
          <div>
            <Tooltip title="Edit" onClick={openHandler}>
              <IconButton aria-label="edit">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Dialog
              open={isOpen}
              onClose={closeHandler}
              fullWidth
              maxWidth="sm"
              aria-labelledby="form-dialog-title"
            >
              <form onSubmit={handleSubmit}>
                <DialogTitle id="form-dialog-title">Edit restaurant</DialogTitle>
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
                  {
                  values.address &&
                  <React.Fragment>
                    <Typography variant="subtitle2">
                      Address:
                    </Typography>
                    <Typography>
                      {
                        typeof values.address === 'string' ?
                        values.address :
                        values.address.long_name
                      }
                    </Typography>
                  </React.Fragment>
                  }
                  <AddressSearch
                    errorMsg={
                      (
                        errors.address &&
                        errors.address.long_name &&
                        touched.address
                      ) && errors.address.long_name}
                    noOptionsText="There are no search results"
                    onChange={val => handleAddressChange(val, handleChange)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    type="button"
                    className={classes.formButton}
                    disabled={isSubmitting}
                    onClick={closeHandler}
                    variant="contained"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
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
          </div>
        );
      }}
    </Formik>
  );
}

RestaurantDialog.propTypes = {
  defaultData: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]).isRequired,
  openHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default connect(null, null)(RestaurantDialog);
