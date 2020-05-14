import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import ReactToPrint from 'react-to-print';

import { Button, Card, CardContent, CardHeader, Chip, Grid, Typography } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';

import { useStyles } from './Orders.styled';
import OrderPrint from './OrderPrint';
import history from 'browserHistory';
import ROUTES from 'constants/routes';
import { USER_ROLES } from 'constants/auth';

function ChipStatus(props) {
  const { status } = props;
  switch (status) {
    case 'completed':
      return (<Chip
        icon={<DoneIcon />}
        label="Completed"
        color="primary"
      />);
    case 'cancelled':
      return (<Chip
        icon={<CancelIcon />}
        label="Cancelled"
        color="secondary"
      />);
    default:
      return (<Chip
        icon={<DirectionsCarIcon />}
        label="Ready"
      />);
  }
}

function Header(props) {
  const { order, timezone } = props;
  const classes = useStyles();
  switch (order.status) {
    case 'scheduled':
      return (
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item>
            <Typography className={classes.headerTitle}>
              {order.type === 'delivery' ? 'Delivery' : 'Pick up'}
            </Typography>
          </Grid>
          {
            order.payment_status === 'refunded' &&
            <Grid item>
              <Typography className={classes.headerTitle}>
                Refunded
              </Typography>
            </Grid>
          }
          <Grid item>
            <Typography className={classes.title}>
              {
              `${order.type === 'delivery'
                ? 'Delivery'
                : 'Pick up'}
                time: ${moment(order.planned_for).tz(timezone).format('MMM D, hh:mm a')}`
              }
            </Typography>
          </Grid>
        </Grid>
      );
    case 'cancelled':
      return (
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item>
            <Typography className={classes.headerTitle}>
              {order.type === 'delivery' ? 'Delivery' : 'Pick up'}
            </Typography>
          </Grid>
          {
            order.payment_status === 'refunded' &&
            <Grid item>
              <Typography className={classes.headerTitle}>
                Refunded
              </Typography>
            </Grid>
          }
          <Grid item>
            <Typography className={classes.title}>
              {`Cancelled at ${moment(order.updated_at)
                .tz(timezone).format('hh:mm a')}`}
            </Typography>
          </Grid>
        </Grid>
      );
    default:
      return (
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item>
            <Typography className={classes.headerTitle}>
              {order.type === 'delivery' ? 'Delivery' : 'Pick up'}
            </Typography>
          </Grid>
          {
            order.payment_status === 'refunded' &&
            <Grid item>
              <Typography className={classes.headerTitle}>
                Refunded
              </Typography>
            </Grid>
          }
          <Grid item>
            <Typography className={classes.title}>
              {`${order.type === 'delivery' ? 'Delivery' : 'Pick up'} time
              ${moment(order.planned_for).tz(timezone).format('hh:mm a')}`}
            </Typography>
          </Grid>
        </Grid>
      );
  }
}

Header.propTypes = {
  order: PropTypes.oneOfType([
    PropTypes.object,
  ]).isRequired,
  timezone: PropTypes.string.isRequired,
};


function OrdersCard(props) {
  const {
    order,
    handleEdit,
    handleClickReady,
    handelClickConfirm,
    timezone,
    isNotSuperAdmin,
  } = props;
  const printComponentRef = React.useRef();
  const classes = useStyles();
  const countItems = order.order_items.reduce((count, current) => count + Number(current.count), 0);
  return (
    <Card key={order.id} className={classes.contentOrder}>
      <CardHeader
        className={classes.headerOrder}
        title={
          <Header timezone={timezone} order={order} />
        }
      />
      <CardContent>
        <Grid container direction="row" justify="space-between" wrap="nowrap">
          <Grid container className={classes.orderInfo} direction="column">
            <Typography
              className={classes.orderNumberHover}
              onClick={(event) => handleEdit(event, order)}
            >
              #{order.order_number}
            </Typography>
            <Typography>
              <b>Contact person:</b> {order.contact_person}
            </Typography>
            {
              order.delivery_address &&
              <>
                <Typography>
                  <b>Address: </b>
                  <span>
                    {
                      ` ${order.delivery_address.building}
                      ${order.delivery_address.street}
                      ${order.delivery_address.zip || ''}
                      ${order.delivery_address.city}
                      `
                    }
                  </span>
                </Typography>
                {
                  order.delivery_address.apartment &&
                  <Typography>
                    Apt/Suite: {order.delivery_address.apartment}
                  </Typography>
                }
                {
                  order.delivery_address.floor &&
                  <Typography>
                    Floor: {order.delivery_address.floor}
                  </Typography>
                }
                {
                  order.delivery_address.cross_street &&
                  <Typography>
                    Cross street: {order.delivery_address.cross_street}
                  </Typography>
                }
                {
                order.delivery_address.more_info &&
                <Typography>
                  Delivery instructions: {order.delivery_address.more_info}
                </Typography>
                }
              </>
            }
            {
              order.status === 'cancelled' ?
                <Typography>
                  <span className={classes.title}>Cancel reason: </span>
                  <span>{order.cancel_reason}</span>
                </Typography> :
                ''
            }
          </Grid>
          <Grid item>
            <Grid container direction="column" alignItems="flex-end">
              {
                order.status === 'pending' || order.status === 'scheduled' ?
                  <Grid item className={classes.itemInfo}>
                    <Typography className={classes.title}>
                      {`${countItems} item${countItems > 1 ? 's' : ''}`}
                    </Typography>
                    <Typography>
                      ${order.total_amount.toFixed(2)}
                    </Typography>
                  </Grid> :
                  ''
              }
              <Grid item>
                {
                  order.created_by &&
                  isNotSuperAdmin &&
                  <Button
                    onClick={() => history.push(`${ROUTES.MESSAGES}/${order.created_by.id}`)}
                    variant="contained"
                    className={classes.orderButton}
                  >
                    Message Client
                  </Button>
                }
                {
                  order.status === 'pending' ?
                    <React.Fragment>
                      <ReactToPrint
                        trigger={() =>
                          (
                            <Button variant="contained" className={classes.orderButton}>
                            Print
                            </Button>)
                          }
                        content={() => printComponentRef.current}
                      />
                      <div style={{ display: 'none' }}>
                        <OrderPrint timezone={timezone} ref={printComponentRef} order={order} />
                      </div>
                    </React.Fragment>
                    : ''
                }
                {
                  order.status === 'pending' ?
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.orderButton}
                      onClick={() => handelClickConfirm(order.id)}
                    >
                      Confirm
                    </Button>
                    : ''
                }
                {
                  order.status === 'cancelled' ||
                  order.status === 'ready' ||
                  order.status === 'completed' ?
                    <ChipStatus
                      status={order.status}
                    /> : ''
                }
                {
                  order.status === 'confirmed' ?
                    <Button
                      variant="contained"
                      className={classes.orderButton}
                      color="primary"
                      onClick={() => {
                        handleClickReady(order.id);
                      }}
                    >
                      {`Ready for ${order.type === 'delivery' ? 'Delivery' : 'Pick up'}`}
                    </Button> : ''
                }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

OrdersCard.propTypes = {
  order: PropTypes.oneOfType([
    PropTypes.object,
  ]).isRequired,
  handelClickConfirm: PropTypes.func.isRequired,
  handleClickReady: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  isNotSuperAdmin: PropTypes.bool.isRequired,
};

ChipStatus.propTypes = {
  status: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  timezone: state.auth.user.restaurant.address.timezone_id,
  isNotSuperAdmin: state.auth.user.role !== USER_ROLES.ROOT,
});

export default connect(mapStateToProps, null)(withRouter(OrdersCard));
