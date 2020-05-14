import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import PropTypes from 'prop-types';

function RefundConfirmDialog(props) {
  const {
    isOpenConfirmRefund,
    handleCloseConfirmRefund,
    orderToEdit,
    handleConfirmRefund,
    refundAmount,
    isRefund,
  } = props;

  return (
    <Dialog
      open={isOpenConfirmRefund}
      onClose={handleCloseConfirmRefund}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Refund order</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to refund order <strong>{`${orderToEdit && orderToEdit.order_number}`}</strong> made by <strong>{`${orderToEdit && orderToEdit.contact_person}`}</strong> for <strong>{`${refundAmount}$`}</strong>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseConfirmRefund}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirmRefund}
          color="primary"
          autoFocus
          disabled={isRefund}
        >
          {isRefund ? <CircularProgress size={24} /> : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

RefundConfirmDialog.defaultProps = {
  orderToEdit: null,
};

RefundConfirmDialog.propTypes = {
  orderToEdit: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(null),
  ]),
  handleCloseConfirmRefund: PropTypes.func.isRequired,
  handleConfirmRefund: PropTypes.func.isRequired,
  isOpenConfirmRefund: PropTypes.bool.isRequired,
  isRefund: PropTypes.bool.isRequired,
  refundAmount: PropTypes.number.isRequired,
};

export default connect(null, null)(RefundConfirmDialog);
