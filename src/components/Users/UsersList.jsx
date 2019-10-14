import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';

import { UsersListService, RestaurantsService } from 'services';
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
import { routerHistoryType, materialClassesType } from 'types';
import Select from 'components/common/Select/Select';
import TableSort from 'components/common/TableSort/TableSort';
import Pagination from 'components/common/Pagination/Pagination';

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
  }

  componentDidMount() {
    const paginationParams = getPaginationParams();

    this.setState(
      {
        ...paginationParams,
      },
      () => this.getRestaurants(),
    );
  }

  getUsers = async () => {
    const {
      rowsPerPage,
      sortBy,
      sortOrder,
      page,
    } = this.state;
    this.setState({ tableLoading: true });
    try {
      const data = await UsersListService.getUsersList({
        limit: rowsPerPage,
        offset: rowsPerPage * page,
        sort: { order: sortOrder, sortBy },
      });
      this.setState({
        users: data,
        tableLoading: false,
        // TODO: change to total from response after sync
        totalUsers: data.length,
      });
    } catch (error) {
      console.log('error', error);
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
      console.log('error', error);
    }
  }

  handleRestaurantChange = (value) => {
    this.setState({ restaurant: value ? value.value : null });
    this.getUsers();
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
    } = this.state;
    const { classes } = this.props;

    return (
      <Container>
        <Typography variant="h4">
          Manage Users
        </Typography>
        <Grid container spacing={3}>
          <Grid item md={6}>
            <Select
              isLoading={restaurantsLoading}
              data={restaurants}
              label="Restaurant"
              placeholder="Select Restaurant"
              onChange={this.handleRestaurantChange}
            />
          </Grid>
          <Grid item md={6}>
            <Button variant="contained" color="primary">
              Create User
            </Button>
          </Grid>
        </Grid>
        { restaurant ? (
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
};

export default connect()(withStyles(listStyles)(UsersList));
