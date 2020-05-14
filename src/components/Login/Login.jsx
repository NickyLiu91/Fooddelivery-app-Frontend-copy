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
  Grid,
  Typography,
  Container,
  CircularProgress,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { AuthService, notifyService } from 'services/';
import { styles } from './Login.styled';
import { materialClassesType, routerHistoryType, authType } from 'types';
import ROUTES from 'constants/routes';
import { getDefaultRoute } from 'routes';
import { getErrorMessage } from 'sdk/utils';

class Login extends Component {
  componentDidMount() {
    const { auth, history } = this.props;
    if (auth.authenticated) history.replace(getDefaultRoute(auth.user));
  }

  handleSubmit = async (data, { setSubmitting }) => {
    const { email, password } = data;
    try {
      const userData = await AuthService.login({ email, password });
      this.props.history.replace(getDefaultRoute(userData));
    } catch (error) {
      console.log('[Login] submit error', error);
      notifyService.showError(getErrorMessage(error));
      setSubmitting(false);
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
            Sign in
          </Typography>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            onSubmit={this.handleSubmit}

            validationSchema={Yup.object().shape({
              email: Yup.string()
                  .email('Email is invalid')
                  .max(255, 'Email must be no longer than 255 symbols')
                  .required('Email is required'),
              password: Yup.string()
                  .required('Password is required'),
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
                    fullWidth
                    id="email"
                    label="Email Address*"
                    name="email"
                    autoComplete="email"
                    error={errors.email && touched.email}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={(errors.email && touched.email) && errors.email}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="password"
                    label="Password*"
                    error={errors.password && touched.password}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={(errors.password && touched.password) && errors.password}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    color="primary"
                    className={classes.submit}
                  >
                    { isSubmitting ? <CircularProgress size={24} /> : 'Sign In' }
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Button
                        type="button"
                        onClick={() => this.props.history.push(ROUTES.RESET_PASSWORD)}
                      >
                        Forgot password?
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              );
            }}
          </Formik>
        </div>
      </Container>
    );
  }
}

Login.propTypes = {
  classes: materialClassesType.isRequired,
  history: routerHistoryType.isRequired,
  auth: authType.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});


export default connect(mapStateToProps, null)(withStyles(styles)(Login));
