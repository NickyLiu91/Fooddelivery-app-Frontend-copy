import React, { Component, Fragment } from 'react';
import { getQueryParam, getErrorMessage } from 'sdk/utils';
import { withStyles } from '@material-ui/styles';
import { notifyService as notifier, ReportsService } from 'services';
import { materialClassesType, routerHistoryType } from 'types';
import {
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import { listStyles, useStyles } from './Reports.styled';
import TableSort from 'components/common/TableSort/TableSort';
import Pagination from 'components/common/Pagination/Pagination';
import PropTypes from 'prop-types';
import { DATE_PATTERN } from 'constants/moment';
import moment from 'moment';

const REPORTS_MODEL = {
  date: 'order_date',
  total_orders: 'number_of_orders',
  cancelled_orders: 'canceled_orders',
  before_taxes: 'amount_before_taxes',
  sales_taxes: 'tax_amount',
  discounts_paid: 'discount_amount',
  delivery_fees: 'delivery_fee_amount',
  refund_amount: 'refund_amount',
  grand_total: 'grand_total',
  amount_tips: 'tip_amount',
};

const totalValuesFirstColumn = [
  { title: 'Total Number of Orders', key: REPORTS_MODEL.total_orders },
  { title: 'Total Number of Cancelled Orders', key: REPORTS_MODEL.cancelled_orders },
  { title: 'Total Amount Before Taxes', key: REPORTS_MODEL.before_taxes },
  { title: 'Total Sales Tax Collected', key: REPORTS_MODEL.sales_taxes },
  { title: 'Total Refund Amount', key: REPORTS_MODEL.refund_amount },
];
const totalValuesSecondColumn = [
  { title: 'Total Discounts Paid', key: REPORTS_MODEL.discounts_paid },
  { title: 'Total Delivery Fees', key: REPORTS_MODEL.delivery_fees },
  { title: 'Grand Total', key: REPORTS_MODEL.grand_total },
  { title: 'Total amount of tips', key: REPORTS_MODEL.amount_tips },
];

const getPaginationParams = () => ({
  page: +getQueryParam('page') || 0,
});

const headCells = [
  { id: REPORTS_MODEL.date, label: 'Date' },
  { id: REPORTS_MODEL.total_orders, label: 'Number of Orders' },
  { id: REPORTS_MODEL.cancelled_orders, label: 'Cancelled Orders' },
  { id: REPORTS_MODEL.before_taxes, label: 'Amount before Taxes' },
  { id: REPORTS_MODEL.sales_taxes, label: 'Sales Tax Collected' },
  { id: REPORTS_MODEL.discounts_paid, label: 'Discount Paid' },
  { id: REPORTS_MODEL.delivery_fees, label: 'Delivery Fees' },
  { id: REPORTS_MODEL.grand_total, label: 'Grand Total' },
  { id: REPORTS_MODEL.refund_amount, label: 'Refund amount' },
  { id: REPORTS_MODEL.amount_tips, label: 'Amount of tips' },
];

const sortOrder = 'desc';
const sortBy = 'created_at';

function TotalNumber({ title, value }) {
  const classes = useStyles();
  return (
    <Grid container direction="row" justify="space-between">
      <Grid item>
        <Typography className={classes.titleTotalNumber}>
          {title}
        </Typography>
      </Grid>
      <Grid item>
        <Typography className={classes.totalNumber}>
          {value}
        </Typography>
      </Grid>
    </Grid>
  );
}

TotalNumber.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

TotalNumber.defaultProps = {
  value: 0,
};


class TotalValuesOrdersTab extends Component {
  state = {
    list: [],
    page: 0,
    rowsPerPage: 40,
    totalValues: 0,
    tableLoading: false,
    summarize: {},
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
      // sortBy,
      page,
      // sortOrder,
    } = this.state;
    const { period, selectedRestaurant } = this.props;
    this.setState({ tableLoading: true });
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
      const { summarize, data } = await ReportsService.getGlobalList(queryParams);
      this.setState({
        list: data.result,
        tableLoading: false,
        summarize,
        totalValues: Number(data.total),
      });
    } catch (error) {
      this.setState({
        tableLoading: false,
      });
      notifier.showError(getErrorMessage(error));
    }
  };

  handlePaginationChange = (pagination) => {
    this.setState(
      { ...pagination },
      () => this.getValues(),
    );
  };

  render() {
    const {
      list,
      rowsPerPage,
      page,
      totalValues,
      tableLoading,
      summarize,
    } = this.state;
    const { classes } = this.props;
    if (tableLoading) {
      return (
        <div className={classes.progressContainer}>
          <CircularProgress />
        </div>
      );
    }

    if (!list.length) {
      return (
        <Typography>You don&apos;t have orders for selected period</Typography>
      );
    }

    return (
      <Fragment>
        <Grid>
          <Grid item xs={12}>
            <Paper square className={classes.root}>
              <CardHeader
                className={classes.cardHeader}
                title="Total Values"
              />
              <CardContent>
                <Grid container direction="row" justify="space-between">
                  <Grid item xs={5}>
                    {totalValuesFirstColumn.map((item) => (
                      <TotalNumber
                        title={item.title}
                        key={item.title}
                        value={summarize[item.key]}
                      />
                    ))}
                  </Grid>
                  <Grid item xs={5}>
                    {totalValuesSecondColumn.map((item) => (
                      <TotalNumber
                        title={item.title}
                        key={item.title}
                        value={summarize[item.key]}
                      />
                    ))}
                  </Grid>
                </Grid>
              </CardContent>
            </Paper>
          </Grid>
          <Divider className={classes.divider} />
          <Paper square className={classes.root}>
            <Table className={classes.table}>
              <TableSort
                order={sortOrder}
                orderBy={sortBy}
                cells={headCells}
                defaultSortProp={REPORTS_MODEL.name}
                disabled={tableLoading}
              />
              <TableBody>
                {
                  list.map(item => (
                    <TableRow key={item[REPORTS_MODEL.date]}>
                      <TableCell className={classes.dateColumn}>
                        {item[REPORTS_MODEL.date]}
                      </TableCell>
                      <TableCell>{item[REPORTS_MODEL.total_orders]}</TableCell>
                      <TableCell>{item[REPORTS_MODEL.cancelled_orders]}</TableCell>
                      <TableCell>${item[REPORTS_MODEL.before_taxes]}</TableCell>
                      <TableCell>${item[REPORTS_MODEL.sales_taxes]}</TableCell>
                      <TableCell>${item[REPORTS_MODEL.discounts_paid]}</TableCell>
                      <TableCell>${item[REPORTS_MODEL.delivery_fees]}</TableCell>
                      <TableCell>${item[REPORTS_MODEL.grand_total]}</TableCell>
                      <TableCell>${item[REPORTS_MODEL.refund_amount]}</TableCell>
                      <TableCell>${item[REPORTS_MODEL.amount_tips]}</TableCell>
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
        </Grid>
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

export default withStyles(listStyles)(TotalValuesOrdersTab);
