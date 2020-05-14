/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import { Container, Typography, Grid, TextField, CircularProgress, Button, Box, Paper } from '@material-ui/core';

import { authType, materialClassesType } from 'types';
import DefaultLayout from 'components/Layouts/DefaultLayout';
import { withStyles } from '@material-ui/styles';
import { editStyles } from './Users.styled';
import ROUTES from 'constants/routes';
import { notifyService, UsersService } from 'services';
import { ConfirmLeaving } from 'components/common';


function ChangePassword({ auth, classes }) {
  const history = useHistory();

  async function onSubmit(data, { setSubmitting }) {
    const userData = {
      first_name: auth.user.first_name,
      last_name: auth.user.last_name,
      old_password: data.password,
      password: data.newPassword,
    };
    try {
      await UsersService.updateProfile(userData);
      history.goBack();
      notifyService.showSuccess('Password successfully changed.');
    } catch (error) {
      setSubmitting(false);
      const { response } = error;
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  }

  return (
    <DefaultLayout>
      <Container>
        <Typography variant="h4">
          Change Password
        </Typography>
        <Formik
          initialValues={{ password: '', newPassword: '', confirmPassword: '' }}
          onSubmit={onSubmit}
          validationSchema={Yup.object().shape({
            password: Yup.string()
                    .max(20, 'Current password must be no longer than 20 characters')
                    .required('Current password is required'),
            newPassword: Yup.string()
                    .min(8, 'Password must contain at least 8 characters')
                    .max(20, 'Password must be no longer than 20 characters')
                    .matches(/[a-zA-Z]/, 'Password must include at least 1 letter')
                    .matches(/[0-9]/, 'Password must include at least 1 number')
                    .required('New Password is required'),
            confirmPassword: Yup.string()
                    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
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
              dirty,
            } = props;
            return (
              <Box mt={2}>
                <Paper>
                  <form onSubmit={handleSubmit}>
                    <Grid container justify="space-around">
                      <Grid item xs={5}>
                        <TextField
                          margin="normal"
                          fullWidth
                          name="password"
                          label="Current Password*"
                          error={errors.password && touched.password}
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={(errors.password && touched.password) && errors.password}
                          type="password"
                          id="password"
                        />
                      </Grid>
                      <Grid item xs={5} />
                    </Grid>
                    <Grid container justify="space-around">
                      <Grid item xs={5}>
                        <TextField
                          margin="normal"
                          fullWidth
                          name="newPassword"
                          label="New Password*"
                          error={errors.newPassword && touched.newPassword}
                          value={values.newPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={
                            (errors.newPassword && touched.newPassword)
                            && errors.newPassword
                          }
                          type="password"
                          id="newPassword"
                          autoComplete="current-password"
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <TextField
                          margin="normal"
                          fullWidth
                          name="confirmPassword"
                          label="Confirm Password*"
                          error={errors.confirmPassword && touched.confirmPassword}
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={(errors.confirmPassword && touched.confirmPassword)
                            && errors.confirmPassword}
                          type="password"
                          id="confirmPassword"
                        />
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Button
                        type="button"
                        className={classes.formButton}
                        disabled={isSubmitting}
                        size="large"
                        onClick={() => history.replace(ROUTES.EDIT_PROFILE)}
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
                        { isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
                      </Button>
                    </Grid>
                    <ConfirmLeaving active={dirty && !isSubmitting} />
                  </form>
                </Paper>
              </Box>
            );
            }}
        </Formik>
      </Container>
    </DefaultLayout>
  );
}

ChangePassword.propTypes = {
  auth: authType.isRequired,
  classes: materialClassesType.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(withStyles(editStyles)(ChangePassword));

