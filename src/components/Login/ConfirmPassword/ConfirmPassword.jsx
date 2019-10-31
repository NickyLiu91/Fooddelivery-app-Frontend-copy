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
import { materialClassesType, routerHistoryType, routerMatchType } from 'types';
import { notifyService } from 'services';
import ROUTES from 'constants/routes';


class ConfirmPassword extends Component {
  handleSubmit = async (data, { setSubmitting }) => {
    const { password } = data;
    const { token } = this.props.match.params;
    try {
      await AuthService.confirmPassword({ token, password });
      notifyService.showSuccess('Password successfully changed');
      this.props.history.push(ROUTES.LOGIN);
    } catch (err) {
      setSubmitting(false);
      this.handleError(err);
    }
  }

  handleError = err => {
    console.log('err', err);
    const { response } = err;
    if (response && response.data && response.data.error) {
      notifyService.showError(response.data.error.message);
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
            Set New Password
          </Typography>

          <Formik
            initialValues={{
              password: '',
              confirmPassword: '',
            }}
            onSubmit={this.handleSubmit}

            validationSchema={Yup.object().shape({
              password: Yup.string()
                      .min(8, 'Password must contain at least 8 characters')
                      .max(20, 'Password must be no longer than 20 characters')
                      .matches(/[a-z]/, 'Password must include at least 1 letter')
                      .matches(/[0-9]/, 'Password must include at least 1 number')
                      .required('Password is required'),
              confirmPassword: Yup.string()
                      .oneOf([Yup.ref('password'), null], 'Passwords must match')
                      .required('Confirm Password is required'),
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
                    name="password"
                    label="Password"
                    error={errors.password && touched.password}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={(errors.password && touched.password) && errors.password}
                    type="password"
                    id="password"
                    autoFocus
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    error={errors.confirmPassword && touched.confirmPassword}
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={(errors.confirmPassword && touched.confirmPassword)
                      && errors.confirmPassword}
                    type="password"
                    id="confirmPassword"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    color="primary"
                    className={classes.submit}
                  >
                    { isSubmitting ? <CircularProgress size={24} /> : 'Set New Password' }
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

ConfirmPassword.propTypes = {
  classes: materialClassesType.isRequired,
  history: routerHistoryType.isRequired,
  match: routerMatchType.isRequired,
};

export default connect(null, null)(withStyles(styles)(ConfirmPassword));
