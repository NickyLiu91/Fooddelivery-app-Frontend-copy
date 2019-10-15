import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';

import { UsersListService, RestaurantsService, notifyService as notifier } from 'services';
import { getQueryParam } from 'sdk/utils';

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
} from '@material-ui/core';
import { listStyles } from './Users.styled';
import { routerHistoryType, materialClassesType, authType } from 'types';
import Select from 'components/common/Select/Select';
import TableSort from 'components/common/TableSort/TableSort';
import Pagination from 'components/common/Pagination/Pagination';
import { USER_ROLES } from 'constants/auth';

const DATA_MODEL = {
  firstName: 'first_name',
  lastName: 'last_name',
  lastSeen: 'last_seen',
  role: 'user_role',
  restaurant: 'restaurant',
};

const getPaginationParams = () => ({
  page: +getQueryParam('page') || 0,
  sortBy: getQueryParam('sortBy') || DATA_MODEL.firstName,
  sortOrder: getQueryParam('sortOrder') || 'asc',
});

const headCells = [
  { id: DATA_MODEL.firstName, label: 'First Name', sort: true },
  { id: DATA_MODEL.lastName, label: 'Last Name', sort: true },
  { id: DATA_MODEL.restaurant, label: 'Restaurant' },
  { id: DATA_MODEL.role, label: 'User Class' },
  { id: DATA_MODEL.lastSeen, label: 'Last logged in', sort: true },
];

class UsersList extends Component {
  state = {
    users: [],
    restaurants: [],
    restaurantsLoading: false,
    restaurant: null,
    sortBy: DATA_MODEL.firstName,
    sortOrder: 'asc',
    page: 0,
    rowsPerPage: 5,
    tableLoading: false,
    totalUsers: 0,
    isSuperAdmin: false,
  }

  componentDidMount() {
    const isSuperAdmin = this.props.auth.user.role === USER_ROLES.ROOT;
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

  getUsers = async () => {
    const {
      rowsPerPage,
      sortBy,
      sortOrder,
      page,
      isSuperAdmin,
      restaurant,
    } = this.state;
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
        data = await UsersListService.getUsersForRestaurant(restaurant, pageData);
      } else {
        data = await UsersListService.getUsersList(pageData);
      }
      this.setState({
        users: data,
        tableLoading: false,
        // TODO: change to total from response after sync
        totalUsers: data.length,
      });
    } catch (error) {
      const { response } = error;
      this.setState({
        tableLoading: false,
      });
      notifier.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  }

  getRestaurants = async () => {
    this.setState({
      restaurantsLoading: true,
    });
    try {
      const data = await RestaurantsService.getRestaurantsList();
      this.setState({
        restaurants: data,
        restaurantsLoading: false,
      });
    } catch (error) {
      this.setState({ restaurantsLoading: false });
      const { response } = error;
      notifier.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  }

  handleRestaurantChange = (value) => {
    const restaurantId = value ? value.value : null;
    this.setState(
      { restaurant: restaurantId },
      () => {
        if (restaurantId) this.getUsers();
      },
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
      restaurant,
      totalUsers,
      isSuperAdmin,
    } = this.state;
    const { classes } = this.props;

    return (
      <Container>
        <Typography variant="h4">
          Manage Users
        </Typography>
        <Grid container spacing={3}>
          { isSuperAdmin && (
            <Grid item md={6}>
              <Select
                isLoading={restaurantsLoading}
                data={restaurants}
                label="Restaurant"
                placeholder="Select Restaurant"
                onChange={this.handleRestaurantChange}
              />
            </Grid>
          )}
          <Grid item md={6}>
            <Button variant="contained" color="primary">
              Create User
            </Button>
          </Grid>
        </Grid>
        { !isSuperAdmin || restaurant ? (
          <Paper className={classes.root}>
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
                    <TableCell colSpan={5} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell component="th" scope="row">
                      {user.first_name}
                    </TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.restaurant}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.last_seen}</TableCell>
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
        ) : null }
      </Container>
    );
  }
}

UsersList.propTypes = {
  history: routerHistoryType.isRequired,
  classes: materialClassesType.isRequired,
  auth: authType.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(withStyles(listStyles)(UsersList));
