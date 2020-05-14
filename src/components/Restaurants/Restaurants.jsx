import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getQueryParam } from 'sdk/utils';
import { withStyles } from '@material-ui/styles';
import { notifyService as notifier, RestaurantsListService } from 'services';
import { materialClassesType, routerHistoryType } from 'types';
import ROUTES from 'constants/routes';
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { listStyles } from './Restaurants.styled';
import TableSort from 'components/common/TableSort/TableSort';
import Pagination from 'components/common/Pagination/Pagination';
import DefaultLayout from '../Layouts/DefaultLayout/index';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import RestaurantDeleteDialog from './RestaurantsDeleteDialog';
import moment from 'moment';
import PropTypes from 'prop-types';
import { setRestaurant } from 'actions/authActions';

const RESTAURANTS_MODEL = {
  name: 'name',
  created_by: 'created_by',
  created_at: 'created_at',
  updated_at: 'updatedAt',
  actions: 'actions',
};

const getPaginationParams = () => ({
  page: +getQueryParam('page') || 0,
  sortBy: getQueryParam('sortBy') || RESTAURANTS_MODEL.updated_at,
  sortOrder: getQueryParam('sortOrder') || 'desc',
});

const headCells = [
  { id: RESTAURANTS_MODEL.name, label: 'Restaurants' },
  { id: RESTAURANTS_MODEL.updated_at, label: 'Last updated' },
  { id: RESTAURANTS_MODEL.created_by, label: 'Updated by' },
  { id: RESTAURANTS_MODEL.actions, label: 'Actions' },
];

class Restaurants extends Component {
  state = {
    restaurantsList: [],
    sortBy: RESTAURANTS_MODEL.updated_at,
    page: 0,
    rowsPerPage: 5,
    totalRestaurants: 0,
    sortOrder: 'asc',
    tableLoading: false,
    isOpenDeleteDialog: false,
    restaurantToDelete: null,
    deleting: false,
  };

  componentDidMount() {
    const paginationParams = getPaginationParams();

    this.setState(
      {
        ...paginationParams,
      },
      () => this.getRestaurants(),
    );
  }

  getRestaurants = async () => {
    const {
      rowsPerPage,
      sortBy,
      page,
      sortOrder,
    } = this.state;
    this.setState({ tableLoading: true });
    const pageData = {
      limit: rowsPerPage,
      offset: rowsPerPage * page,
      sort_order: sortOrder,
      sort_by: sortBy,
    };
    try {
      const RestaurantsData = await RestaurantsListService.getRestaurantsList(pageData);
      this.setState({
        restaurantsList: RestaurantsData.result,
        tableLoading: false,
        totalRestaurants: Number(RestaurantsData.total),
      });
    } catch (error) {
      const { response } = error;
      this.setState({
        tableLoading: false,
      });
      notifier.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  handleSort = (sort) => {
    this.setState(
      { ...sort },
      () => this.getRestaurants(),
    );
  };

  handlePaginationChange = (pagination) => {
    this.setState(
      { ...pagination },
      () => this.getRestaurants(),
    );
  };

  handleEdit = (restaurant) => {
    this.props.changeRestaurant(restaurant);
    this.props.history.push(`${ROUTES.RESTAURANTS}/${restaurant.id}/edit`);
  };

  handleDelete = (restaurant) => {
    this.setState({ restaurantToDelete: restaurant, isOpenDeleteDialog: true });
  };

  handleDeleteConfirm = async () => {
    this.setState({ deleting: true });
    try {
      await RestaurantsListService.deleteRestaurant(this.state.restaurantToDelete.id);
      notifier.showInfo('Restaurant is successfully deleted');
      if (this.state.restaurantToDelete.id === this.props.selectedRestaurant.id) {
        this.props.changeRestaurant({ id: null, name: null });
      }
      this.setState({ deleting: false, restaurantToDelete: null, isOpenDeleteDialog: false });
      this.getRestaurants();
    } catch (error) {
      this.setState({ deleting: false });
      const { response } = error;
      notifier.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  handleDeleteClose = () => {
    if (!this.state.deleting) {
      this.setState({ isOpenDeleteDialog: false });
    }
  };

  handleCreateNewRestaurant = () => {
    this.props.history.push(`${ROUTES.RESTAURANTS}/add`);
  };

  render() {
    const {
      restaurantsList,
      rowsPerPage,
      sortBy,
      page,
      totalRestaurants,
      sortOrder,
      tableLoading,
      isOpenDeleteDialog,
      restaurantToDelete,
      deleting,
    } = this.state;
    const { classes } = this.props;

    return (
      <DefaultLayout>
        <Container>
          <Grid container direction="row" justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h4">
                Dashboard
              </Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={() => this.handleCreateNewRestaurant()}>
                Create new restaurant
              </Button>
            </Grid>
          </Grid>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableSort
                onSort={this.handleSort}
                order={sortOrder}
                orderBy={sortBy}
                cells={headCells}
                defaultSortProp={RESTAURANTS_MODEL.name}
                history={this.props.history}
                disabled={tableLoading}
              />
              <TableBody>
                {tableLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : restaurantsList.map(restaurant => (
                  <TableRow key={restaurant.id}>
                    <TableCell component="th" scope="row">
                      <Grid container direction="column" justify="center" alignItems="flex-start">
                        <Grid item className={classes.title}>
                          {restaurant.name}
                        </Grid>
                        <Grid item>
                          {`Address: ${restaurant.address ? restaurant.address.short_name : ''}`}
                        </Grid>
                      </Grid>
                    </TableCell>
                    <TableCell>{
                      (restaurant.updated_at) ?
                        moment(restaurant.updated_at).format('MMM D, YYYY') :
                        moment(restaurant.created_at).format('MMM D, YYYY')
                    }
                    </TableCell>
                    <TableCell>{(restaurant.created_by) && `${restaurant.created_by.first_name} ${restaurant.created_by.last_name}`}</TableCell>
                    <TableCell>
                      <Grid container>
                        <Grid item xs={6}>
                          <Tooltip title="Edit" onClick={() => this.handleEdit(restaurant)}>
                            <IconButton aria-label="edit">
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={6}>
                          <Tooltip title="Delete" onClick={() => this.handleDelete(restaurant)}>
                            <IconButton aria-label="delete">
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))
                }
              </TableBody>
            </Table>
            <RestaurantDeleteDialog
              isOpen={isOpenDeleteDialog}
              handleDeleteClose={this.handleDeleteClose}
              handleDeleteConfirm={this.handleDeleteConfirm}
              restaurantToDelete={restaurantToDelete}
              deleting={deleting}
            />
            <Pagination
              rowsPerPage={rowsPerPage}
              page={page}
              onChange={this.handlePaginationChange}
              totalRows={totalRestaurants}
              history={this.props.history}
            />
          </Paper>
        </Container>
      </DefaultLayout>
    );
  }
}

Restaurants.propTypes = {
  history: routerHistoryType.isRequired,
  classes: materialClassesType.isRequired,
  selectedRestaurant: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  changeRestaurant: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selectedRestaurant: state.auth.user.restaurant,
});

const mapDispatchToProps = dispatch => ({
  changeRestaurant: restaurant => dispatch(setRestaurant(restaurant)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(listStyles)(Restaurants));
