import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

import { UsersService, RestaurantsService, notifyService as notifier } from 'services';
import { getQueryParam, updateQueryParams, getErrorMessage } from 'sdk/utils';

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Container,
  Typography,
  CircularProgress,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import { listStyles } from './Users.styled';
import { routerHistoryType, materialClassesType, authType } from 'types';
import { Select, Pagination, TableSort } from 'components/common/';
import { USER_ROLES } from 'constants/auth';
import ROUTES from 'constants/routes';
import { setRestaurant } from 'actions/authActions';
import DefaultLayout from 'components/Layouts/DefaultLayout';
import moment from 'moment';


const DATA_MODEL = {
  firstName: 'firstName',
  lastName: 'lastname',
  lastSeen: 'last_seen',
  role: 'user_role',
};

const getPaginationParams = () => ({
  page: +getQueryParam('page') || 0,
  sortBy: getQueryParam('sortBy') || DATA_MODEL.firstName,
  sortOrder: getQueryParam('sortOrder') || 'asc',
});

const rolesOutput = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.MANAGER]: 'Manager',
};

const headCells = [
  { id: 'firstName', label: 'First Name', sort: true },
  { id: 'lastName', label: 'Last Name', sort: true },
  { label: 'Restaurant' },
  { id: DATA_MODEL.role, label: 'User Role' },
  { id: 'lastLogin', label: 'Last logged in', sort: true },
  { label: 'Actions' },
];

class UsersList extends Component {
  state = {
    users: [],
    restaurants: [],
    restaurantsLoading: false,
    sortBy: DATA_MODEL.firstName,
    sortOrder: 'asc',
    page: 0,
    rowsPerPage: 5,
    tableLoading: false,
    totalUsers: 0,
    isSuperAdmin: false,
    deleteModalOpen: false,
    userToDelete: null,
    deleting: false,
  }

  componentDidMount() {
    const { user } = this.props.auth;
    const isSuperAdmin = user.role === USER_ROLES.ROOT;
    this.setState({ isSuperAdmin });
    const paginationParams = getPaginationParams();

    this.setState(
      {
        ...paginationParams,
      },
      () => {
        if (isSuperAdmin) {
          this.getRestaurants();
        } else {
          this.getUsers();
        }
      },
    );
  }

  getUsers = async (restaurant) => {
    const {
      rowsPerPage,
      sortBy,
      sortOrder,
      page,
      isSuperAdmin,
    } = this.state;
    const { user } = this.props.auth;
    const restaurantId = isSuperAdmin && restaurant ? restaurant : user.restaurant.id;
    if (!restaurantId) return;

    this.setState({ tableLoading: true });
    const pageData = {
      limit: rowsPerPage,
      offset: rowsPerPage * page,
      sort_order: sortOrder,
      sort_by: sortBy,
    };
    try {
      let data = null;
      if (isSuperAdmin) {
        data = await UsersService.getUsersForRestaurant(restaurantId, pageData);
      } else {
        data = await UsersService.getUsersList(pageData);
      }
      this.setState({
        users: data.result,
        tableLoading: false,
        totalUsers: data.total,
      });
    } catch (error) {
      console.log('[getUsers] error', error);
      this.setState({
        tableLoading: false,
      });
      notifier.showError(getErrorMessage(error));
    }
  }

  getRestaurants = async () => {
    const restaurantId = this.props.auth.user.restaurant.id;
    this.setState({
      restaurantsLoading: true,
    });
    try {
      const data = await RestaurantsService.getRestaurantsList();
      this.setState({
        restaurants: data,
        restaurantsLoading: false,
      });
      this.getUsers(restaurantId);
    } catch (error) {
      console.log('[getRestaurants] error', error);
      this.setState({ restaurantsLoading: false });
      notifier.showError(getErrorMessage(error));
    }
  }

  handleRestaurantChange = (restaurant) => {
    this.props.history.push(updateQueryParams({ page: 0 }));
    this.props.changeRestaurant(restaurant);
    this.setState(
      { page: 0 },
      () => { this.getUsers(restaurant.id); },
    );
  }

  handleSort = (sort) => {
    this.setState(
      { ...sort },
      () => this.getUsers(),
    );
  }

  handlePaginationChange = (pagination) => {
    this.setState(
      { ...pagination },
      () => this.getUsers(),
    );
  }

  handleEdit = (id = '') => {
    this.props.history.push(`${ROUTES.USER}/${id}/edit`);
  }

  handleAdd = () => {
    this.props.history.push(`${ROUTES.USER}/add`);
  }

  handleDelete = (user) => {
    this.setState({ userToDelete: user, deleteModalOpen: true });
  }

  handleDeleteConfirm = async () => {
    this.setState({ deleting: true });
    try {
      await UsersService.deleteUser(this.state.userToDelete.id);
      notifier.showInfo('User successfully deleted');
      this.setState({ deleting: false, userToDelete: null, deleteModalOpen: false });
      this.getUsers();
    } catch (error) {
      this.setState({ deleting: false });
      console.log('[handleDeleteConfirm] error', error);
      notifier.showError(getErrorMessage(error));
    }
  }

  handleDeleteModalClose = () => {
    if (!this.state.deleting) {
      this.setState({ deleteModalOpen: false });
    }
  }


  render() {
    const {
      users,
      sortBy,
      sortOrder,
      page,
      rowsPerPage,
      tableLoading,
      restaurantsLoading,
      restaurants,
      totalUsers,
      isSuperAdmin,
      deleteModalOpen,
      userToDelete,
      deleting,
    } = this.state;
    const { classes } = this.props;
    const { restaurant } = this.props.auth.user;

    return (
      <DefaultLayout>
        <Container>
          <Typography variant="h4">
            Manage Users
          </Typography>
          <Grid container spacing={3}>
            <Grid item md={6}>
              { isSuperAdmin && (
                <Select
                  isLoading={restaurantsLoading}
                  data={restaurants}
                  value={restaurant.id}
                  label="Restaurant"
                  placeholder="Select Restaurant"
                  onChange={this.handleRestaurantChange}
                  getOptionValue={r => r.id}
                  getOptionLabel={r => r.name}
                  optionValue="id"
                />
              )}
            </Grid>
            <Grid item md={6}>
              <Typography align="right">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => this.handleAdd()}
                >
                  Create User
                </Button>
              </Typography>
            </Grid>
          </Grid>
          { !isSuperAdmin || restaurant.id ? (
            <Paper className={classes.tableContainer}>
              <Table className={classes.table}>
                <TableSort
                  onSort={this.handleSort}
                  order={sortOrder}
                  orderBy={sortBy}
                  disabled={tableLoading}
                  cells={headCells}
                  defaultSortProp={DATA_MODEL.firstName}
                  history={this.props.history}
                />
                <TableBody>
                  { tableLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell component="th" scope="row">
                        {user.first_name}
                      </TableCell>
                      <TableCell>{user.last_name}</TableCell>
                      <TableCell>{user.restaurant.name}</TableCell>
                      <TableCell>{rolesOutput[user.role]}</TableCell>
                      <TableCell>{user.last_login && moment.utc(user.last_login).local().format('YYYY-MM-DD hh:mm a')}</TableCell>
                      <TableCell className={classes.actionsBlock}>
                        { (!isSuperAdmin && user.role === USER_ROLES.ADMIN) ? null :
                        <React.Fragment>
                          <IconButton
                            onClick={() => this.handleEdit(user.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => this.handleDelete(user)}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </React.Fragment>
                        }
                      </TableCell>
                    </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
              <Pagination
                rowsPerPage={rowsPerPage}
                page={page}
                onChange={this.handlePaginationChange}
                totalRows={totalUsers}
                history={this.props.history}
              />
            </Paper>
          ) : (
            <Typography variant="h5" className={classes.emptyRestaurantMessage}>
              Please select restaurant to get users list.
            </Typography>
          )}

          <Dialog
            open={deleteModalOpen}
            onClose={this.handleDeleteModalClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Delete user</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Do you really want to delete { `${userToDelete && userToDelete.first_name} ${userToDelete && userToDelete.last_name}` } ? This action can not be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleDeleteModalClose}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={this.handleDeleteConfirm}
                color="primary"
                autoFocus
                disabled={deleting}
              >
                { deleting ? <CircularProgress size={24} /> : 'Confirm'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </DefaultLayout>
    );
  }
}

UsersList.propTypes = {
  history: routerHistoryType.isRequired,
  classes: materialClassesType.isRequired,
  auth: authType.isRequired,
  changeRestaurant: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  changeRestaurant: id => dispatch(setRestaurant(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(listStyles)(UsersList));
