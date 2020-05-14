import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { useStyles } from './Reviews.styled';
import { materialClassesType } from 'types';

const RenderItem = (props) => {
  const { item, classes } = props;
  const modifiers = useMemo(() => {
    const keys = {};
    item.sub_order_items.forEach(modifierItem => {
      const { id, title } = modifierItem.menu_modifier;
      if (keys[id]) {
        keys[id].items.push(modifierItem.product);
      } else {
        keys[id] = {
          title,
          items: [modifierItem.product],
        };
      }
    });
    return keys;
  }, [item]);

  return (
    <Grid>
      <Divider />
      <Grid container>
        <Grid item xs={1} className={classes.titleCountItem}>
          {item.count}
        </Grid>
        <Grid item style={{ flex: 1, paddingRight: '36px' }}>
          <Grid container direction="column">
            <Grid item>
              <Grid item style={{ justifyContent: 'space-between', display: 'flex' }}>
                <span className={classes.title}>{item.product.name}</span>
                <span>{`$${(Number(item.product.price) * Number(item.count)).toFixed(2)}`}</span>
              </Grid>
              {Object.keys(modifiers).map(key => (
                <div key={key}>
                  {modifiers[key].title}:
                  <ul style={{ paddingLeft: '20px', margin: '5px 0 10px' }}>
                    {modifiers[key].items.map(subItem => (
                      <li key={subItem.id}>
                        <div style={{ justifyContent: 'space-between', display: 'flex' }}>
                          {subItem.title}
                          {
                            subItem.price ?
                              <span>${Number(subItem.price).toFixed(2)}</span>
                              : ''
                          }
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Grid>
            <Grid item>
              {
                item.instructions &&
                  <Grid>
                    <Box className={classes.title} mt={1}>Instructions:</Box>
                    <Box>{item.instructions}</Box>
                  </Grid>
              }
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

RenderItem.propTypes = {
  item: PropTypes.oneOfType([
    PropTypes.object,
  ]).isRequired,
  classes: materialClassesType.isRequired,
};

function ReviewDialog(props) {
  const {
    isOpen,
    handleClose,
    order,
    timezone,
  } = props;
  const classes = useStyles();
  const countItems = order &&
    order.order_items.reduce((count, current) => count + Number(current.count), 0);
  const numberPhone = order &&
    `${order.contact_phone_number.slice(0, 3)}-${order.contact_phone_number.slice(3, 6)}-${order.contact_phone_number.slice(6)}`;
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle className={classes.headerOrder}>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item>
            <Typography className={classes.headerTitle}>
              {`${order.type} order`}
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.title}>
              {`${order.type === 'delivery' ? 'Delivery' : 'Pick up'}
              by ${moment(order.planned_for).tz(timezone).format('ddd, MMM D, hh:mm a')}`}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Grid container direction="column">
          <Typography className={classes.orderNumber}>
            #{order.order_number}
          </Typography>
          <Typography className={classes.title}>
            {`${order.contact_person}`}
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
          <Typography>
            {numberPhone}
          </Typography>
        </Grid>
        <Divider />
        <Grid container direction="row" alignItems="center">
          <Typography className={classes.receivedTime}>
            Received time:
          </Typography>
          <div>
            <Grid container direction="row" alignItems="center">
              {` ${moment(order.created_at)
                .tz(timezone).format('dddd, MMMM D, hh:mm a')}`}
            </Grid>
          </div>
        </Grid>
        <Divider />
        <Grid container direction="column">
          <Typography className={classes.title}>
            Special Order Instructions:
          </Typography>
          <Typography>
            <span>{order.instructions ? order.instructions : 'No instructions'}</span>
          </Typography>
        </Grid>
        <Divider style={{ height: '2px' }} />
        <Grid item>
          <Typography className={classes.titleCountItem}>
            {`${countItems} ${countItems > 1 ? 'items' : 'item'}`}
          </Typography>
          <Grid className={classes.itemsContainer}>
            {
              order.order_items.map(item => <RenderItem item={item} classes={classes} />)
            }
          </Grid>
          {
            order.promotion &&
            <Grid className={classes.itemsContainer}>
              <Typography>
                <b>Promotion: </b>
                {order.promotion.name}
              </Typography>
            </Grid>
          }
          <Divider style={{ height: '2px' }} />
          <Grid container direction="row">
            <Grid item xs={1} className={classes.titleCountItem} />
            <Grid item xs={7} />
            <Grid item xs={3} className={classes.countPrice}>
              <Grid container diraction="row" justify="space-between" alignItems="center" className={classes.title}>
                <Grid item>Subtotal</Grid>
                <Grid item>${order.sub_total_amount.toFixed(2)}</Grid>
              </Grid>
              {
                !!order.discount &&
                <Grid container diraction="row" justify="space-between" alignItems="center">
                  <Grid item>Discount</Grid>
                  <Grid item>-${order.discount.toFixed(2)}</Grid>
                </Grid>
              }
              <Grid container diraction="row" justify="space-between" alignItems="center">
                <Grid item>Delivery Fee</Grid>
                <Grid item>${order.delivery_fee.toFixed(2)}</Grid>
              </Grid>
              <Grid container diraction="row" justify="space-between" alignItems="center">
                <Grid item>Tax</Grid>
                <Grid item>${order.tax_amount.toFixed(2)}</Grid>
              </Grid>
              <Grid container diraction="row" justify="space-between" alignItems="center">
                <Grid item>Tip</Grid>
                <Grid item>${order.tip_amount === null ? '0.00' : order.tip_amount.toFixed(2)}</Grid>
              </Grid>
              <Grid container diraction="row" justify="space-between" alignItems="center" className={classes.title}>
                <Grid item>Total</Grid>
                <Grid item>${order.total_amount.toFixed(2)}</Grid>
              </Grid>
            </Grid>
          </Grid>
          <Divider style={{ height: '2px' }} />
          {order.payment_status === 'refunded' ?
            <Grid>
              <Grid item xs={3} className={classes.titleCountItem}>
                Refund amount: ${order.refund && order.refund.amount}
              </Grid>
            </Grid> : ''
          }
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

ReviewDialog.defaultProps = {
  order: null,
};

ReviewDialog.propTypes = {
  order: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(null),
  ]),
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  timezone: PropTypes.string.isRequired,
};

const mapStateToProps = state =>
  ({
    timezone: state.auth.user.restaurant.address.timezone_id,
  });

export default connect(mapStateToProps, null)(ReviewDialog);
