import React, { useState, useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import ReactToPrint from 'react-to-print';


import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';

import OrderPrint from '../OrderPrint';
import { useStyles } from '../Orders.styled';
import EditTimeDIalog from './EditTimeDIalog';
import EditInstructionsDIalog from './EditInstructionsDialog';
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

function OrdersDialog(props) {
  const [isOpenEditTimeDialog, setIsOpenEditTimeDialog] = useState(false);
  const [isOpenEditInstructionsDialog, setIsOpenEditInstructionsDialog] = useState(false);
  const [editedTime, setEditedTime] = useState(null);
  const [editedInstructions, setEditedInstructions] = useState(null);

  const {
    isOpen,
    handleClose,
    orderToEdit,
    handelClickConfirm,
    handleAdjustConfirm,
    edit,
    handleOpenCancel,
    handleOpenRefund,
    timezone,
  } = props;

  const printComponentRef = React.useRef();
  const classes = useStyles();

  const countItems = orderToEdit &&
    orderToEdit.order_items.reduce((count, current) => count + Number(current.count), 0);
  const numberPhone = orderToEdit &&
    `${orderToEdit.contact_phone_number.slice(0, 3)}-${orderToEdit.contact_phone_number.slice(3, 6)}-${orderToEdit.contact_phone_number.slice(6)}`;
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
              {`${orderToEdit.type} order`}
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.title}>
              {`${orderToEdit.type === 'delivery' ? 'Delivery' : 'Pick up'} by `}
              {editedTime ?
                editedTime.format('ddd, MMM D, hh:mm a') :
                moment(orderToEdit.planned_for).tz(timezone).format('ddd, MMM D, hh:mm a')
              }
              <Tooltip title="Edit" className={classes.editIcon}>
                <IconButton onClick={() => setIsOpenEditTimeDialog(true)} aria-label="edit">
                  <EditIcon />
                </IconButton>
              </Tooltip>
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
        <Grid container diraction="row" justify="space-between" alignItems="center">
          <Grid item>
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
                <OrderPrint timezone={timezone} ref={printComponentRef} order={orderToEdit} />
              </div>
            </React.Fragment>
            <Button
              variant="contained"
              className={classes.orderButton}
              onClick={handleOpenRefund}
              disabled={orderToEdit.payment_status === 'refunded'}
            >
              Refund
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              className={classes.orderButton}
              disabled={orderToEdit.status === 'cancelled'}
              onClick={handleOpenCancel}
            >
              Cancel order
            </Button>
          </Grid>
        </Grid>
        <Divider />
        <Grid container direction="column">
          <Typography className={classes.orderNumber}>
            #{orderToEdit.order_number}
          </Typography>
          <Typography className={classes.title}>
            {`${orderToEdit.contact_person}`}
          </Typography>
          {
              orderToEdit.delivery_address &&
              <>
                <Typography>
                  <b>Address: </b>
                  <span>
                    {
                      ` ${orderToEdit.delivery_address.building}
                      ${orderToEdit.delivery_address.street}
                      ${orderToEdit.delivery_address.zip || ''}
                      ${orderToEdit.delivery_address.city}
                      `
                    }
                  </span>
                </Typography>
                {
                  orderToEdit.delivery_address.apartment &&
                  <Typography>
                    Apt/Suite: {orderToEdit.delivery_address.apartment}
                  </Typography>
                }
                {
                  orderToEdit.delivery_address.floor &&
                  <Typography>
                    Floor: {orderToEdit.delivery_address.floor}
                  </Typography>
                }
                {
                  orderToEdit.delivery_address.cross_street &&
                  <Typography>
                    Cross street: {orderToEdit.delivery_address.cross_street}
                  </Typography>
                }
                {
                orderToEdit.delivery_address.more_info &&
                <Typography>
                  Delivery instructions: {orderToEdit.delivery_address.more_info}
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
              {` ${moment(orderToEdit.created_at).tz(timezone).format('ddd, MMM D, hh:mm a')}`}
            </Grid>
          </div>
        </Grid>
        <Divider />
        <Grid container direction="column">
          <Typography className={classes.title}>
            Special Order Instructions:
          </Typography>
          <Typography>
            <span>
              {editedInstructions !== null ?
                editedInstructions :
                `${orderToEdit.instructions ? orderToEdit.instructions : 'No instructions'}`
              }
            </span>
            <Tooltip title="Edit" className={classes.editIcon}>
              <IconButton onClick={() => setIsOpenEditInstructionsDialog(true)} aria-label="edit">
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Typography>
        </Grid>
        <Divider style={{ height: '2px' }} />
        <Grid item>
          <Typography className={classes.titleCountItem}>
            {`${countItems} ${countItems > 1 ? 'items' : 'item'}`}
          </Typography>
          <Grid className={classes.itemsContainer}>
            {
              orderToEdit.order_items.map(item =>
                <RenderItem item={item} key={item.id} classes={classes} />)
            }
          </Grid>
          {
            orderToEdit.promotion &&
            <Grid className={classes.itemsContainer}>
              <Typography>
                <b>Promotion: </b>
                {orderToEdit.promotion.name}
              </Typography>
            </Grid>
          }
          <Divider style={{ height: '2px' }} />
          <Grid container direction="row">
            <Grid item xs={1} className={classes.titleCountItem} />
            <Grid item xs={7} />
            <Grid item xs={3} className={classes.countPrice}>
              <Grid
                container
                diraction="row"
                justify="space-between"
                alignItems="center"
                className={classes.title}
              >
                <Grid item>Subtotal</Grid>
                <Grid item>${orderToEdit.sub_total_amount.toFixed(2)}</Grid>
              </Grid>
              {
                !!orderToEdit.discount &&
                <Grid
                  container
                  diraction="row"
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item>Discount</Grid>
                  <Grid item>-${orderToEdit.discount.toFixed(2)}</Grid>
                </Grid>
              }
              <Grid
                container
                diraction="row"
                justify="space-between"
                alignItems="center"
              >
                <Grid item>Delivery Fee</Grid>
                <Grid item>${orderToEdit.delivery_fee.toFixed(2)}</Grid>
              </Grid>
              <Grid
                container
                diraction="row"
                justify="space-between"
                alignItems="center"
              >
                <Grid item>Tax</Grid>
                <Grid item>${orderToEdit.tax_amount.toFixed(2)}</Grid>
              </Grid>
              <Grid
                container
                diraction="row"
                justify="space-between"
                alignItems="center"
              >
                <Grid item>Tip</Grid>
                <Grid item>${orderToEdit.tip_amount === null ? '0.00' : orderToEdit.tip_amount.toFixed(2)}</Grid>
              </Grid>
              <Grid
                container
                diraction="row"
                justify="space-between"
                alignItems="center"
                className={classes.title}
              >
                <Grid item>Total</Grid>
                <Grid item>${orderToEdit.total_amount.toFixed(2)}</Grid>
              </Grid>
            </Grid>
          </Grid>
          <Divider style={{ height: '2px' }} />
          {orderToEdit.payment_status === 'refunded' ?
            <Grid>
              <Grid item xs={3} className={classes.titleCountItem}>
                Refund amount: ${orderToEdit.refund && orderToEdit.refund.amount}
              </Grid>
            </Grid> : ''
          }
          <Grid />
        </Grid>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        {
          orderToEdit.status === 'confirmed' && !editedTime && editedInstructions === null ?
            <Button
              onClick={handleClose}
              color="primary"
              variant="outlined"
              autoFocus
              disabled={edit}
            >
              {edit ? <CircularProgress size={24} /> : `Confirm at ${orderToEdit &&
                moment(orderToEdit.updated_at).tz(timezone).format('ddd, MMM D, hh:mm a')}`}
            </Button> :
            ''
        }
        {
          orderToEdit.status === 'pending' && !editedTime && editedInstructions === null ?
            <Button
              onClick={() => { handelClickConfirm(orderToEdit.id); }}
              variant="contained"
              color="primary"
              autoFocus
              disabled={edit}
            >
              {edit ? <CircularProgress size={24} /> : 'Confirm'}
            </Button> :
            ''
        }
        {
          (editedTime || editedInstructions !== null) ?
            <Button
              onClick={() => handleAdjustConfirm({ editedTime, editedInstructions })}
              variant="contained"
              color="primary"
              disabled={edit}
            >
              Save changes
            </Button>
            : null
        }
      </DialogActions>
      <EditTimeDIalog
        isOpen={isOpenEditTimeDialog}
        orderType={`${orderToEdit.type === 'delivery' ? 'Delivery' : 'Pick up'}`}
        initialData={moment(orderToEdit.planned_for).tz(timezone)}
        onClose={() => setIsOpenEditTimeDialog(false)}
        onConfirm={(data) => {
          setEditedTime(data);
          setIsOpenEditTimeDialog(false);
        }}
      />
      <EditInstructionsDIalog
        isOpen={isOpenEditInstructionsDialog}
        initialData={orderToEdit.instructions}
        onClose={() => setIsOpenEditInstructionsDialog(false)}
        onConfirm={(data) => {
          setEditedInstructions(data);
          setIsOpenEditInstructionsDialog(false);
        }}
      />
    </Dialog>
  );
}

OrdersDialog.defaultProps = {
  orderToEdit: null,
};

OrdersDialog.propTypes = {
  orderToEdit: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(null),
  ]),
  handleClose: PropTypes.func.isRequired,
  handleOpenCancel: PropTypes.func.isRequired,
  handelClickConfirm: PropTypes.func.isRequired,
  handleAdjustConfirm: PropTypes.func.isRequired,
  handleOpenRefund: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  edit: PropTypes.bool.isRequired,
  timezone: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  timezone: state.auth.user.restaurant.address.timezone_id,
});

export default connect(mapStateToProps, null)(OrdersDialog);
