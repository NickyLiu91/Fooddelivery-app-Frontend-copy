import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import MaskedInput from 'react-text-mask';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Input,
  Box,
  FormHelperText,
} from '@material-ui/core';

import { useStyles } from '../RestaurantProfile.styled';
import { phoneNumberMask } from 'constants/inputs';

function TextMaskPhone(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      keepCharPositions
      guide={false}
      mask={phoneNumberMask}
      placeholderChar={'\u2000'}
      showMask
    />
  );
}

TextMaskPhone.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

const validationSchema = Yup.object().shape({
  phone: Yup.string().default('').test('invalidNumber', 'Invalid number', (value) => {
    if (!value.replace(/[ \-()]/g, '').trim()) return true;
    return /^[(]{1}[0-9]{3}[)]{1}[ ]{1}[0-9]{3}[-]{1}[0-9]{4}$/.test(value);
  }),
  email: Yup.string()
    .email('Should be a valid email')
    .max(64, 'Your input is too long. Maximum length of the email is 64 symbols'),
  contact_person: Yup.string()
    .min(2, 'Your input is too short, Minimum length of the name is 2 symbols')
    .max(64, 'Your input is too long. Maximum length of the name is 64 symbols')
    .required('Required'),
});

function ContactUsDialog(props) {
  const {
    contactPerson,
    phone,
    email,
    submitHandler,
    closeHandler,
    isOpen,
  } = props;
  // eslint-disable-next-line camelcase
  const classes = useStyles();

  const onSubmit = (data, ...other) => {
    const { phone: number } = data;
    submitHandler({ ...data, phone: number.replace(/[ \-()]/g, '') }, ...other);
  };

  return (
    <Formik
      initialValues={{
        email: email || '',
        phone: phone ? `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}` : '',
        contact_person: contactPerson || '',
      }}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {(property) => {
        const {
          values,
          isSubmitting,
          handleBlur,
          handleSubmit,
          handleChange,
          errors,
          touched,
        } = property;
        return (
          <div>
            <Dialog
              open={isOpen}
              onClose={closeHandler}
              fullWidth
              maxWidth="sm"
              aria-labelledby="form-dialog-title"
            >
              <form onSubmit={handleSubmit}>
                <DialogTitle id="form-dialog-title">Edit contact us</DialogTitle>
                <DialogContent>
                  <FormControl>
                    <InputLabel htmlFor="phone-input">Phone number</InputLabel>
                    <Input
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      id="phone-input"
                      inputComponent={TextMaskPhone}
                      error={errors.phone && touched.phone}
                    />
                    {
                      (errors.phone && touched.phone) &&
                      <FormHelperText className={classes.helperText} id="phone-input">{errors.phone}</FormHelperText>
                    }
                  </FormControl>
                  <Box>
                    <TextField
                      label="Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.email && touched.email}
                      helperText={(errors.email && touched.email) && errors.email}
                      margin="normal"
                    />
                  </Box>
                  <Box>
                    <TextField
                      label="Contact person"
                      name="contact_person"
                      value={values.contact_person}
                      onChange={handleChange}
                      error={errors.contact_person && touched.contact_person}
                      helperText={
                        (errors.contact_person && touched.contact_person)
                        && errors.contact_person
                      }
                      onBlur={handleBlur}
                      margin="normal"
                    />
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button
                    type="button"
                    className={classes.formButton}
                    disabled={isSubmitting}
                    size="large"
                    onClick={closeHandler}
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
          </div>
        );
      }}
    </Formik>
  );
}

ContactUsDialog.defaultProps = {
  contactPerson: '',
  email: '',
  phone: '',
};

ContactUsDialog.propTypes = {
  contactPerson: PropTypes.string,
  email: PropTypes.string,
  phone: PropTypes.string,
  closeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default connect(null, null)(ContactUsDialog);
