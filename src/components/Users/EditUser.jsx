import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Typography,
  Container,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Paper,
  Box,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { routerMatchType, authType, materialClassesType, routerHistoryType } from 'types';
import { UsersService, RestaurantsService, notifyService } from 'services';
import { USER_ROLES } from 'constants/auth';
import { Select, ConfirmLeaving } from 'components/common';
import { editStyles } from './Users.styled';
import ROUTES from 'constants/routes';
import DefaultLayout from 'components/Layouts/DefaultLayout';
import { setUser as setUserAction } from 'actions/authActions';

const userSelectData = [
  { value: USER_ROLES.ADMIN, label: 'Admin' },
  { value: USER_ROLES.MANAGER, label: 'Manager' },
];

const validationSchema = (superAdmin, editProfile) => (
  Yup.object().shape({
    email: !editProfile ? Yup.string()
      .email()
      .max(64, 'Your input is too long. Maximum length of the email is 64 symbols')
      .required('Required') : null,
    firstName: Yup.string()
      .min(2, 'Your input is too short, Minimum length of the name is 2 symbols')
      .max(64, 'Your input is too long. Maximum length of the name is 64 symbols')
      .required('Required'),
    lastName: Yup.string()
      .min(2, 'Your input is too short, Minimum length of the last name is 2 symbols')
      .max(64, 'Your input is too long. Maximum length of the last name is 64 symbols')
      .required('Required'),
    restaurant: superAdmin ? Yup.string()
      .nullable()
      .required('Required') : null,
    role: superAdmin ? Yup.string()
      .required('Required') : null,
  })
);

class EditUser extends Component {
  state = {
    newUser: true,
    userLoading: true,
    superAdmin: false,
    editProfile: false,
    restaurantsLoading: false,
    restaurants: [],
    user: {
      id: '',
      firstName: '',
      lastName: '',
      role: '',
      email: '',
      restaurant: '',
    },
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const { user } = this.props.auth;
    const superAdmin = this.props.auth.user.role === USER_ROLES.ROOT;
    if (this.props.match.path === ROUTES.EDIT_PROFILE) {
      this.setState({
        userLoading: false,
        newUser: false,
        superAdmin: false,
        editProfile: true,
        user: {
          firstName: user.first_name,
          lastName: user.last_name,
        },
      });
    } else if (id || id === 0) {
      this.setState({
        newUser: false,
        superAdmin,
      });
      this.getUserData(id);
    } else {
      this.setState({
        userLoading: false,
        superAdmin,
      });
    }
    if (superAdmin) {
      this.getRestaurants();
    }
  }

  getUserData = async id => {
    try {
      const data = await UsersService.getSingleUser(id);
      this.setState({
        userLoading: false,
        user: {
          id: data.id,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          role: data.role,
          restaurant: data.restaurant.id,
        },
      });
    } catch (error) {
      this.setState({ userLoading: false });
      const { response } = error;
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  }

  getRestaurants = async () => {
    const { user } = this.props.auth;
    this.setState({
      restaurantsLoading: true,
    });
    try {
      const data = await RestaurantsService.getRestaurantsList();
      this.setState({
        restaurants: data.map(r => ({ value: r.id, label: r.name })),
        restaurantsLoading: false,
        user: {
          ...this.state.user,
          restaurant: user.restaurant.id,
        },
      });
    } catch (error) {
      this.setState({ restaurantsLoading: false });
      const { response } = error;
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  }

  handleSubmit = async (data, { setSubmitting }) => {
    const { user } = this.props.auth;
    const { superAdmin, newUser, editProfile } = this.state;
    let userData = {
      first_name: data.firstName,
      last_name: data.lastName,
    };
    if (!editProfile) {
      userData = {
        ...userData,
        email: data.email,
        role: superAdmin ? data.role : USER_ROLES.MANAGER,
        restaurant: superAdmin ? data.restaurant : user.restaurant.id,
      };
    }
    try {
      if (editProfile) {
        const newUserData = await UsersService.updateProfile(userData);
        this.props.setUser(newUserData);
      } else if (newUser) {
        await UsersService.addUser(userData);
      } else {
        await UsersService.updateUser(data.id, userData);
      }
      let successMsg = 'Profile is successfully updated.';
      if (!editProfile) successMsg = `User is successfully ${newUser ? 'saved' : 'updated'}.`;
      notifyService.showSuccess(successMsg);
      this.props.history.goBack();
    } catch (error) {
      console.log('[handleSubmit] error', error);
      const { response } = error;
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
      setSubmitting(false);
    }
  }

  render() {
    const {
      newUser,
      user,
      userLoading,
      restaurants,
      restaurantsLoading,
      superAdmin,
      editProfile,
    } = this.state;
    const { classes, history, auth } = this.props;
    let headerText = 'Edit Profile';
    if (!editProfile) headerText = `${newUser ? 'Add' : 'Edit'} User`;

    return (
      <DefaultLayout>
        <Container>
          <Grid container justify="space-between">
            <Typography variant="h4">
              {headerText}
            </Typography>
            {
              editProfile &&
              <Button
                variant="contained"
                color="primary"
                className={classes.changePasswordBtn}
                onClick={() => history.replace(ROUTES.CHANGE_PASSWORD)}
              >
                Change password
              </Button>
            }
          </Grid>
          { !userLoading ? (
            <Formik
              initialValues={{ ...user, restaurant: auth.user.restaurant.id }}
              onSubmit={this.handleSubmit}

              validationSchema={validationSchema(superAdmin, editProfile)}
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
                          <Grid item md={5}>
                            <TextField
                              label="First Name*"
                              name="firstName"
                              error={errors.firstName && touched.firstName}
                              value={values.firstName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={
                                (errors.firstName && touched.firstName)
                                && errors.firstName
                              }
                              margin="normal"
                              fullWidth
                            />
                          </Grid>
                          <Grid item md={5}>
                            <TextField
                              label="Last Name*"
                              name="lastName"
                              error={errors.lastName && touched.lastName}
                              value={values.lastName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={(errors.lastName && touched.lastName) && errors.lastName}
                              margin="normal"
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                        { !editProfile &&
                        <React.Fragment>
                          <Grid container justify="space-around">
                            <Grid item md={5}>
                              <TextField
                                error={errors.email && touched.email}
                                label="Email*"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.email && touched.email) && errors.email}
                                margin="normal"
                                fullWidth
                              />
                            </Grid>
                            <Grid item md={5}>
                              { superAdmin &&
                              <Select
                                isLoading={restaurantsLoading}
                                data={restaurants}
                                error={errors.restaurant && touched.restaurant}
                                helperText={
                                  (errors.restaurant && touched.restaurant) && errors.restaurant
                                }
                                label="Restaurant*"
                                name="restaurant"
                                value={values.restaurant}
                                onBlur={() => { handleBlur({ target: { name: 'restaurant' } }); }}
                                placeholder="Select Restaurant"
                                onChange={(val) => { handleChange({ target: { name: 'restaurant', value: val && val.value ? val.value : '' } }); }}
                              />}
                            </Grid>
                          </Grid>
                          <Grid container justify="space-around">
                            <Grid item md={5}>
                              { superAdmin &&
                              <Select
                                data={userSelectData}
                                error={errors.role && touched.role}
                                helperText={(errors.role && touched.role) && errors.role}
                                label="Role*"
                                name="role"
                                value={values.role}
                                onBlur={() => { handleBlur({ target: { name: 'role' } }); }}
                                placeholder="Select Role"
                                onChange={(val) => { handleChange({ target: { name: 'role', value: val && val.value ? val.value : '' } }); }}
                              />}
                            </Grid>
                            <Grid item md={5} />
                          </Grid>
                        </React.Fragment>
                        }
                        <Grid container>
                          <Button
                            type="button"
                            className={classes.formButton}
                            disabled={isSubmitting}
                            onClick={() => history.goBack()}
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
                            { isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
                          </Button>
                          <ConfirmLeaving active={dirty && !isSubmitting} />
                        </Grid>
                      </form>
                    </Paper>
                  </Box>
                );
              }}
            </Formik>
          ) : (
            <div className={classes.progressContainer}>
              <CircularProgress />
            </div>
          )}
        </Container>
      </DefaultLayout>
    );
  }
}

EditUser.propTypes = {
  match: routerMatchType.isRequired,
  auth: authType.isRequired,
  classes: materialClassesType.isRequired,
  history: routerHistoryType.isRequired,
  setUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  setUser: user => dispatch(setUserAction(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(editStyles)(EditUser));
