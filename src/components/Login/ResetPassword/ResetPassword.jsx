import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { withStyles } from '@material-ui/styles';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Typography,
  Container,
  CircularProgress,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';


import AuthService from 'services/authService';
import { styles } from '../Login.styled';
import { materialClassesType, routerHistoryType } from 'types';
import { notifyService } from 'services';
import ROUTES from 'constants/routes';

class ResetPassword extends Component {
  handleSubmit = async (data, { setSubmitting }) => {
    try {
      await AuthService.resetPassword(data.email);
      notifyService.showSuccess('We successfully sent you the email with a link to reset password.');
      this.props.history.push(ROUTES.LOGIN);
    } catch (error) {
      setSubmitting(false);
      this.handleError(error);
    }
  }

  handleError = err => {
    console.log('err', err);
    const { response } = err;
    if (response && response.data && response.data.message) {
      notifyService.showError(response.data.message);
      this.props.history.push(ROUTES.LOGIN);
    } else {
      notifyService.showError('Unknown error');
    }
  }

  render() {
    const { classes } = this.props;

    return (

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>

          <Formik
            initialValues={{ email: '' }}
            onSubmit={this.handleSubmit}

            validationSchema={Yup.object().shape({
              email: Yup.string()
                  .email('Email is invalid')
                  .max(255, 'Email must be no longer than 255 symbols')
                  .required('Email is required'),
          })}
          >
            {(props) => {
              const {
                values,
                touched,
                errors,
                isSubmitting,
                handleChange,
                handleBlur,
                handleSubmit,
              } = props;
              return (

                <form className={classes.form} onSubmit={handleSubmit}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    error={errors.email && touched.email}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={(errors.email && touched.email) && errors.email}
                    autoFocus
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    color="primary"
                    className={classes.submit}
                  >
                    { isSubmitting ? <CircularProgress size={24} /> : 'Reset Password' }
                  </Button>
                </form>
              );
            }}
          </Formik>
        </div>
      </Container>

    );
  }
}

ResetPassword.propTypes = {
  classes: materialClassesType.isRequired,
  history: routerHistoryType.isRequired,
};

export default connect(null, null)(withStyles(styles)(ResetPassword));
