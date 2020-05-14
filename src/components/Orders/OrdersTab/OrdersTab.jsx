import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  Select,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import { getErrorMessage } from 'sdk/utils';
import { notifyService as notifier, OrdersService } from 'services';
import { listStyles } from '../Orders.styled';
import { materialClassesType } from 'types';
import Pagination from 'components/common/Pagination/Pagination';
import OrdersDialog from '../OrdersDialog/OrdersDialog';
import { setCountOrders, setOrdersChangedFlag } from '../../../actions/ordersActions';
import OrdersCard from '../OrdersCard';
import CancelDialog from '../CancelDialog';
import RefundDialog from '../RefundDialog';
import RefundConfirmDialog from '../RefundConfirmDialog';
import MultipleDatesForm from './MultipleDatesForm';
import { DATE_PATTERN } from 'constants/moment';

const sortBy = 'plannedFor';

class OrdersTab extends Component {
  constructor(props) {
    super();
    this.isHistoryTab = props.tab === 'history';
    this.sortOrder = this.isHistoryTab ? 'desc' : 'asc';
  }

  state = {
    ordersList: [],
    page: 0,
    rowsPerPage: 40,
    totalOrders: 0,
    tableLoading: false,
    orderStatus: '',
    isOpenDialog: false,
    orderToEdit: null,
    edit: false,
    isOpenCancel: false,
    isOpenRefund: false,
    isOpenConfirmRefund: false,
    refundAmount: 0,
    isRefund: false,
    startDate: moment(),
    endDate: moment(),
  };

  componentDidMount() {
    this.getOrders();
  }

  componentDidUpdate() {
    if (this.props.orders.ordersChangedFlag) {
      this.getOrders();
      this.props.setOrdersChangedFlag(false);
    }
  }

  getOrders = async () => {
    this.setState({ tableLoading: true });
    const {
      rowsPerPage,
      page,
      orderStatus: type,
      startDate,
      endDate,
    } = this.state;
    const {
      selectedRestaurant,
      tab,
    } = this.props;
    const queryParams = {
      limit: rowsPerPage,
      offset: rowsPerPage * page,
      sort_order: this.sortOrder,
      sort_by: sortBy,
      tab,
      type,
    };
    if (this.isHistoryTab) {
      queryParams.startDate = startDate.format(DATE_PATTERN);
      queryParams.endDate = endDate.format(DATE_PATTERN);
    }
    try {
      const { result, total } = await OrdersService.getList(
        selectedRestaurant.id,
        queryParams,
      );

      this.setState({
        ordersList: result,
        tableLoading: false,
        totalOrders: Number(total[tab]),
      });
      this.props.setCountOrders(total);
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
      () => this.getOrders(),
    );
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleApplyDates = ({ datePickerFromField, datePickerToField }) => {
    this.setState(
      {
        startDate: datePickerFromField,
        endDate: datePickerToField,
        page: 0,
      },
      () => this.getOrders(),
    );
  }

  handleEdit = (event, order) => {
    this.setState({ orderToEdit: order, isOpenDialog: true });
  };

  handleClose = () => {
    if (!this.state.edit) {
      this.setState({ isOpenDialog: false });
    }
  };

  handelClickConfirm = async (orderId) => {
    try {
      this.setState({ tableLoading: true });
      await OrdersService.putOrderStatus(this.props.selectedRestaurant.id, orderId, { status: 'confirmed' });
      notifier.showSuccess('Order is successfully confirmed', orderId);
      this.handleClose();
      this.getOrders();
    } catch (error) {
      this.setState({ tableLoading: false });
      console.log('[handelClickConfirm] error', error);
      notifier.showError(getErrorMessage(error));
    }
  };

  handleClickReady = async (orderId) => {
    try {
      await OrdersService.putOrderStatus(this.props.selectedRestaurant.id, orderId, { status: 'completed' });
      notifier.showSuccess('Order is successfully updated', orderId);
      this.getOrders();
    } catch (error) {
      notifier.showError(getErrorMessage(error));
    }
  };

  handleOpenCancel = () => {
    this.setState({ isOpenCancel: true });
  };

  handleCloseCancel = () => {
    this.setState({ isOpenCancel: false });
  };

  handleCancel = async (orderData, { setSubmitting, resetForm }) => {
    try {
      await OrdersService.putOrderStatus(this.props.selectedRestaurant.id, this.state.orderToEdit.id, { status: 'cancelled', cancel_reason: orderData.reason });
      notifier.showSuccess('Order is successfully cancelled');
      this.handleCloseCancel();
      this.handleClose();
      this.getOrders();
      setSubmitting(false);
      resetForm({
        reason: '',
      });
    } catch (error) {
      notifier.showError(getErrorMessage(error));
      setSubmitting(false);
      resetForm({
        reason: '',
      });
    }
  };

  handleOpenRefund = () => {
    this.setState({ isOpenRefund: true });
  };

  handleCloseRefund = () => {
    this.setState({ isOpenRefund: false });
  };

  handleRefund = (orderData, { setSubmitting }) => {
    this.setState({
      refundAmount: Number(orderData.amount),
    });
    this.setState({ isOpenConfirmRefund: true });
    setSubmitting(false);
  };

  handleCloseConfirmRefund = () => {
    if (!this.state.isRefund) {
      this.setState({ isOpenConfirmRefund: false });
    }
  };

  handleConfirmRefund = async () => {
    this.setState({ isRefund: true });
    try {
      await OrdersService.postRefund(
        this.props.selectedRestaurant.id,
        this.state.orderToEdit.id,
        { amount: this.state.refundAmount, reason: 'reason' },
      );
      notifier.showSuccess('Order is successfully refunded');
      this.setState({ isRefund: false, isOpenConfirmRefund: false });
      this.handleCloseRefund();
      this.handleClose();
      this.getOrders();
    } catch (error) {
      console.log('[handleConfirmRefund] error', error);
      notifier.showError(getErrorMessage(error));
      this.setState({ isRefund: false });
    }
  };

  handleAdjustOrder = async (edited) => {
    this.setState({ tableLoading: true });
    this.handleClose();
    try {
      const { orderToEdit } = this.state;
      const data = {
        planned_for: edited.editedTime ?
          edited.editedTime.utc().format() :
          orderToEdit.planned_for,
        instructions: edited.editedInstructions !== null ?
          edited.editedInstructions : orderToEdit.instructions,
      };
      await OrdersService.adjustOrder(
        this.props.selectedRestaurant.id,
        this.state.orderToEdit.id,
        data,
      );
      notifier.showSuccess('Order is successfully updated');
      this.setState({ orderToEdit: null });
      this.getOrders();
    } catch (error) {
      console.log('[handleAdjustOrder] error', error);
      this.setState({ tableLoading: false });
      notifier.showError(getErrorMessage(error));
    }
  }

  render() {
    const {
      ordersList,
      rowsPerPage,
      page,
      totalOrders,
      tableLoading,
      orderStatus,
      isOpenDialog,
      orderToEdit,
      edit,
      isOpenCancel,
      isOpenRefund,
      isOpenConfirmRefund,
      refundAmount,
      isRefund,
      startDate,
      endDate,
    } = this.state;
    const { classes } = this.props;

    return (
      <Fragment>
        {
        this.isHistoryTab ?
          <MultipleDatesForm
            onSubmit={this.handleApplyDates}
            classes={classes}
            startDate={startDate}
            endDate={endDate}
          />
          :
          <Grid container direction="row" alignItems="center">
            <span className={classes.status}>
            Type
            </span>
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                native
                margin="dense"
                value={orderStatus}
                onChange={this.handleChange}
                inputProps={{
                  name: 'orderStatus',
                }}
              >
                <option value="">All</option>
                <option value="delivery">Delivery</option>
                <option value="pickup">Pick up</option>
              </Select>
            </FormControl>
            <Button
              color="primary"
              variant="contained"
              className={classes.applyItemButton}
              onClick={() => this.getOrders()}
            >
              Apply
            </Button>
          </Grid>
        }
        <Grid className={classes.root}>
          <Grid className={classes.table}>
            <Grid>
              {tableLoading ? (
                <div className={classes.progressContainer}>
                  <CircularProgress />
                </div>
              ) :
                ordersList.map(order => (
                  <Grid key={order.id}>
                    <OrdersCard
                      order={order}
                      handleEdit={this.handleEdit}
                      handleClickReady={this.handleClickReady}
                      handelClickConfirm={this.handelClickConfirm}
                    />
                  </Grid>
                  ))
              }
            </Grid>
          </Grid>
          <Grid className={classes.pagination}>
            <Pagination
              rowsPerPage={rowsPerPage}
              page={page}
              onChange={this.handlePaginationChange}
              totalRows={totalOrders}
            />
          </Grid>
          {
          orderToEdit &&
          <>
            <OrdersDialog
              isOpen={isOpenDialog}
              handleClose={this.handleClose}
              handelClickConfirm={this.handelClickConfirm}
              handleOpenCancel={this.handleOpenCancel}
              handleAdjustConfirm={this.handleAdjustOrder}
              handleOpenRefund={this.handleOpenRefund}
              orderToEdit={orderToEdit}
              edit={edit}
            />
            <RefundDialog
              isOpenRefund={isOpenRefund}
              handleCloseRefund={this.handleCloseRefund}
              handleRefund={this.handleRefund}
              orderToEdit={orderToEdit}
            />
            <RefundConfirmDialog
              isOpenConfirmRefund={isOpenConfirmRefund}
              handleCloseConfirmRefund={this.handleCloseConfirmRefund}
              handleConfirmRefund={this.handleConfirmRefund}
              orderToEdit={orderToEdit}
              refundAmount={refundAmount}
              isRefund={isRefund}
            />
          </>
          }
          <CancelDialog
            isOpenCancel={isOpenCancel}
            handleCloseCancel={this.handleCloseCancel}
            handleCancel={this.handleCancel}
          />
        </Grid>
      </Fragment>
    );
  }
}

OrdersTab.propTypes = {
  classes: materialClassesType.isRequired,
  selectedRestaurant: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  setCountOrders: PropTypes.func.isRequired,
  orders: PropTypes.shape({
    pending: PropTypes.number,
    confirmed: PropTypes.number,
    scheduled: PropTypes.number,
    history: PropTypes.number,
    newOrdersFlag: PropTypes.bool,
    ordersChangedFlag: PropTypes.bool,
  }).isRequired,
  setOrdersChangedFlag: PropTypes.func.isRequired,
  tab: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  selectedRestaurant: state.auth.user.restaurant,
  orders: state.orders,
});

const mapDispatchToProps = dispatch => ({
  setCountOrders: orders => dispatch(setCountOrders(orders)),
  setOrdersChangedFlag: value => dispatch(setOrdersChangedFlag(value)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(listStyles)(withRouter(OrdersTab)));
