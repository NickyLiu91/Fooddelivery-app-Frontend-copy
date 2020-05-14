import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from '@material-ui/core';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmBtnText: PropTypes.string,
  cancelBtnText: PropTypes.string,
  isSubmitting: PropTypes.bool,
  onlyConfirm: PropTypes.bool,
};

const defaultProps = {
  confirmBtnText: 'Confirm',
  cancelBtnText: 'Cancel',
  isSubmitting: false,
  onlyConfirm: false,
};

function AlertDialog({
  onClose,
  onConfirm,
  title,
  message,
  confirmBtnText,
  cancelBtnText,
  isOpen,
  isSubmitting,
  onlyConfirm,
}) {
  return (
    <Dialog
      open={isOpen}
      onClose={() => isSubmitting ? onClose() : null}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {
          !isSubmitting &&
          !onlyConfirm &&
          <Button onClick={onClose} color="primary">
            {cancelBtnText}
          </Button>
        }
        <Button disabled={isSubmitting} onClick={onConfirm} color="primary" autoFocus>
          { isSubmitting ? <CircularProgress size={24} /> : confirmBtnText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AlertDialog.propTypes = propTypes;

AlertDialog.defaultProps = defaultProps;

export default AlertDialog;

