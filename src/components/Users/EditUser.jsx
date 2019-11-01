import React, { Component } from 'react';
import { connect } from 'react-redux';
import { routerMatchType, authType, materialClassesType, routerHistoryType } from 'types';
import {
  Typography,
  Container,
  Button,
  TextField,
  Grid,
  CircularProgress,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { UsersService, RestaurantsService, notifyService } from 'services';
import { USER_ROLES } from 'constants/auth';
import { Select } from 'components/common';
import { editStyles } from './Users.styled';
import ROUTES from 'constants/routes';

const userSelectData = [
  { value: USER_ROLES.ADMIN, label: 'Admin' },
  { value: USER_ROLES.MANAGER, label: 'Manager' },
];

const validationSchema = superAdmin => (
  Yup.object().shape({
    email: Yup.string()
      .email()
      .max(255, 'String must be no longer than 255 symbols')
      .required('Required'),
    firstName: Yup.string()
      .max(255, 'String must be no longer than 255 symbols')
      .required('Required'),
    lastName: Yup.string()
      .max(255, 'String must be no longer than 255 symbols')
      .required('Required'),
    restaurant: superAdmin ? Yup.string()
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
    const superAdmin = this.props.auth.user.permissions.role === USER_ROLES.ROOT;
    if (id || id === 0) {
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
      console.log('error', error);
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
          restaurant: user.restaurantId,
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
    console.log('user', user);
    const { superAdmin, newUser } = this.state;
    const userData = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      role: superAdmin ? data.role : USER_ROLES.MANAGER,
      restaurant: superAdmin ? data.restaurant : user.restaurantId,
    };
    try {
      if (newUser) {
        await UsersService.addUser(userData);
      } else {
        await UsersService.updateUser(data.id, userData);
      }
      notifyService.showSuccess('User successfully saved');
      this.props.history.push(ROUTES.USERS_LIST);
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
    } = this.state;
    const { classes, history, auth } = this.props;

    return (
      <Container className={classes.root}>
        <Typography variant="h4">
          { newUser ? 'Add' : 'Edit' } User
        </Typography>
        { !userLoading ? (
          <Formik
            initialValues={{ ...user, restaurant: auth.user.restaurantId }}
            onSubmit={this.handleSubmit}

            validationSchema={validationSchema(superAdmin)}
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
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={7}>
                    <Grid item md={6}>
                      <TextField
                        label="First Name"
                        name="firstName"
                        error={errors.firstName && touched.firstName}
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={(errors.firstName && touched.firstName) && errors.firstName}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                    <Grid item md={6}>
                      <TextField
                        label="Last Name"
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
                  <Grid container spacing={5}>
                    <Grid item md={6}>
                      <TextField
                        error={errors.email && touched.email}
                        label="Email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={(errors.email && touched.email) && errors.email}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                    <Grid item md={6}>
                      { superAdmin &&
                      <Select
                        isLoading={restaurantsLoading}
                        data={restaurants}
                        error={errors.restaurant && touched.restaurant}
                        helperText={(errors.restaurant && touched.restaurant) && errors.restaurant}
                        label="Restaurant"
                        name="restaurant"
                        value={values.restaurant}
                        onBlur={() => { handleBlur({ target: { name: 'restaurant' } }); }}
                        placeholder="Select Restaurant"
                        onChange={(val) => { handleChange({ target: { name: 'restaurant', value: val && val.value ? val.value : '' } }); }}
                      />}
                    </Grid>
                  </Grid>
                  <Grid container spacing={5}>
                    <Grid item md={6}>
                      { superAdmin &&
                      <Select
                        data={userSelectData}
                        error={errors.role && touched.role}
                        helperText={(errors.role && touched.role) && errors.role}
                        label="Role"
                        name="role"
                        value={values.role}
                        onBlur={() => { handleBlur({ target: { name: 'role' } }); }}
                        placeholder="Select Role"
                        onChange={(val) => { handleChange({ target: { name: 'role', value: val && val.value ? val.value : '' } }); }}
                      />}
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Button
                      type="button"
                      className={classes.formButton}
                      disabled={isSubmitting}
                      size="large"
                      onClick={() => history.push(ROUTES.USERS_LIST)}
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
                </form>
              );
            }}
          </Formik>
        ) : (
          <div className={classes.progressContainer}>
            <CircularProgress />
          </div>
        )}
      </Container>
    );
  }
}

EditUser.propTypes = {
  match: routerMatchType.isRequired,
  auth: authType.isRequired,
  classes: materialClassesType.isRequired,
  history: routerHistoryType.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(withStyles(editStyles)(EditUser));
