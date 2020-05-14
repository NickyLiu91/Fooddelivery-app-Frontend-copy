import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { CircularProgress, Paper, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import { listStyles } from './Reports.styled';
import { getQueryParam, getErrorMessage } from 'sdk/utils';
import { notifyService as notifier, ReportsService } from 'services';
import { materialClassesType, routerHistoryType } from 'types';
import TableSort from 'components/common/TableSort/TableSort';
import Pagination from 'components/common/Pagination/Pagination';
import moment from 'moment';
import { DATE_PATTERN } from 'constants/moment';


const REPORTS_MODEL = {
  stoppage_time: 'stoppage_time',
  name: 'manager_name',
  reason: 'reason',
  resumed_time: 'resumed_time',
};

const sortOrder = 'asc';
const sortBy = 'updatedAt';

const getPaginationParams = () => ({
  page: +getQueryParam('page') || 0,
});

const headCells = [
  { id: REPORTS_MODEL.stoppage_time, label: 'Time of stoppage' },
  { id: REPORTS_MODEL.name, label: 'Manager name' },
  { id: REPORTS_MODEL.reason, label: 'Reason' },
  { id: REPORTS_MODEL.resumed_time, label: 'Time resumed' },
];


class TotalValuesOrdersTab extends Component {
  state = {
    valuesList: [],
    page: 0,
    rowsPerPage: 40,
    totalValues: 0,
    tableLoading: false,
  };

  componentDidMount() {
    const paginationParams = getPaginationParams();

    this.setState(
      {
        ...paginationParams,
      },
      () => this.getValues(),
    );
  }

  componentDidUpdate(prevProps) {
    const { period: prevPeriod } = prevProps;
    const { period } = this.props;
    if (
      prevPeriod.startDate !== period.startDate
      || prevPeriod.endDate !== period.endDate
      || prevProps.selectedRestaurant !== this.props.selectedRestaurant
    ) {
      this.getValues();
    }
  }

  getValues = async () => {
    const {
      rowsPerPage,
      page,
    } = this.state;
    this.setState({ tableLoading: true });
    const { period, selectedRestaurant } = this.props;
    const queryParams = {
      limit: rowsPerPage,
      offset: rowsPerPage * page,
      sort_order: sortOrder,
      sort_by: sortBy,
      start_date: period.startDate.format(DATE_PATTERN),
      end_date: period.endDate.format(DATE_PATTERN),
    };
    if (selectedRestaurant && selectedRestaurant.id !== 'all') {
      queryParams.restaurant = selectedRestaurant.id;
    }
    try {
      const data = await ReportsService.getStopsList(queryParams);
      this.setState({
        valuesList: data.result,
        tableLoading: false,
        totalValues: Number(data.total),
      });
    } catch (error) {
      this.setState({
        tableLoading: false,
      });
      notifier.showError(getErrorMessage(error));
    }
  };

  handleSort = (sort) => {
    this.setState(
      { ...sort },
      () => this.getValues(),
    );
  };

  handlePaginationChange = (pagination) => {
    this.setState(
      { ...pagination },
      () => this.getValues(),
    );
  };

  render() {
    const {
      valuesList,
      rowsPerPage,
      page,
      totalValues,
      tableLoading,
    } = this.state;
    const { classes } = this.props;

    return (
      <Fragment>
        {tableLoading ? (
          <div className={classes.progressContainer}>
            <CircularProgress />
          </div>
          ) :
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableSort
                onSort={this.handleSort}
                order={sortOrder}
                orderBy={sortBy}
                cells={headCells}
                defaultSortProp={REPORTS_MODEL.name}
                history={this.props.history}
                disabled={tableLoading}
              />
              <TableBody>
                {
                  valuesList.map(item => (
                    <TableRow key={item[REPORTS_MODEL.stoppage_time]}>
                      <TableCell className={classes.title}>
                        {item[REPORTS_MODEL.stoppage_time]}
                      </TableCell>
                      <TableCell>{item[REPORTS_MODEL.name]}</TableCell>
                      <TableCell>{item[REPORTS_MODEL.reason]}</TableCell>
                      <TableCell>{item[REPORTS_MODEL.resumed_time]}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
            <Pagination
              rowsPerPage={rowsPerPage}
              page={page}
              onChange={this.handlePaginationChange}
              totalRows={totalValues}
              history={this.props.history}
            />
          </Paper>
        }
      </Fragment>
    );
  }
}

TotalValuesOrdersTab.propTypes = {
  history: routerHistoryType.isRequired,
  classes: materialClassesType.isRequired,
  selectedRestaurant: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    name: PropTypes.string,
  }),
  period: PropTypes.shape({
    startDate: PropTypes.instanceOf(moment).isRequired,
    endDate: PropTypes.instanceOf(moment).isRequired,
  }).isRequired,
};

TotalValuesOrdersTab.defaultProps = {
  selectedRestaurant: null,
};

export default connect(null, null)(withStyles(listStyles)(TotalValuesOrdersTab));
