import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

import { UsersListService } from 'services';
import { getQueryParam } from 'sdk/utils';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Container,
  TableSortLabel,
  Typography,
  TablePagination,
} from '@material-ui/core';
import { listStyles } from './Users.styled';
import { routerHistoryType } from 'types';

const USER_MODEL = {
  firstName: 'first_name',
  lastName: 'last_name',
  lastSeen: 'last_seen',
  role: 'user_role',
  restaurant: 'restaurant',
};

const getPaginationParams = () => ({
  currentPage: +getQueryParam('page') || 0,
  sortBy: getQueryParam('sortBy') || USER_MODEL.firstName,
  sortOrder: getQueryParam('sortOrder') || 'asc',
});

const headCells = [
  { id: USER_MODEL.firstName, label: 'First Name', sort: true },
  { id: USER_MODEL.lastName, label: 'Last Name', sort: true },
  { id: USER_MODEL.restaurant, label: 'Restaurant' },
  { id: USER_MODEL.role, label: 'User Class' },
  { id: USER_MODEL.lastSeen, label: 'Last logged in', sort: true },
];

function EnhancedTableHead(props) {
  const {
    order,
    orderBy,
    onSort,
  } = props;
  const createSortHandler = property => event => {
    onSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.label}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            { headCell.sort ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={order}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};


class UsersList extends Component {
  state = {
    usersList: [],
    sortBy: USER_MODEL.firstName,
    sortOrder: 'asc',
    currentPage: 0,
    // pagesTotal: 1,
    rowsPerPage: 5,
  }

  componentDidMount() {
    const paginationParams = getPaginationParams();

    this.setState(
      {
        ...paginationParams,
      },
      () => this.getUsers(),
    );
  }

  async getUsers() {
    const {
      rowsPerPage,
      sortBy,
      sortOrder,
      currentPage,
    } = this.state;
    try {
      const data = await UsersListService.getUsersList({
        limit: rowsPerPage,
        offset: rowsPerPage * currentPage,
        sort: { order: sortOrder, sortBy },
      });
      this.setState({ usersList: data });
    } catch (error) {
      console.log('error', error);
    }
  }

  handleSort = (event, prop) => {
    const { sortOrder, sortBy } = this.state;
    const order = sortBy === prop && sortOrder === 'asc' ? 'desc' : 'asc';
    this.setState({
      sortBy: prop,
      sortOrder: order,
    });

    this.props.history.push({
      search: `?sortBy=${prop}&sortOrder=${order}`,
    });
  }

  handleChangePage = (event, newPage) => {
    this.setState(
      { currentPage: newPage },
      () => this.getUsers(),
    );
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      { rowsPerPage: event.target.value },
      () => this.getUsers(),
    );
  };


  render() {
    const {
      usersList,
      sortBy,
      sortOrder,
      currentPage,
      rowsPerPage,
    } = this.state;

    return (
      <Container>
        <Typography variant="h3">
          Manage Users
        </Typography>
        <Paper className={listStyles.root}>
          <Table className={listStyles.table}>
            <EnhancedTableHead
              onSort={this.handleSort}
              order={sortOrder}
              orderBy={sortBy}
            />
            <TableBody>
              {usersList.map(user => (
                <TableRow key={user.id}>
                  <TableCell component="th" scope="row">
                    {user.first_name}
                  </TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>{user.restaurant}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.last_seen}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={usersList.length}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            backIconButtonProps={{
              'aria-label': 'previous page',
            }}
            nextIconButtonProps={{
              'aria-label': 'next page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
    );
  }
}

UsersList.propTypes = {
  history: routerHistoryType.isRequired,
};

export default connect()(withStyles(listStyles)(UsersList));
