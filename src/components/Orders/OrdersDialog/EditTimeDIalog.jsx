import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { DateTimePicker } from '@material-ui/pickers';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';
import moment from 'moment';

const propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  orderType: PropTypes.string.isRequired,
  initialData: PropTypes.instanceOf(moment).isRequired,
};

function EditTimeDIalog({
  onClose,
  onConfirm,
  isOpen,
  initialData,
  orderType,
}) {
  const [dateTime, setDateTime] = useState(initialData);
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Edit Order {orderType} Time</DialogTitle>
      <DialogContent>
        <DateTimePicker
          value={dateTime}
          onChange={setDateTime}
          label={`${orderType} Time`}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onConfirm(dateTime)} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EditTimeDIalog.propTypes = propTypes;

export default EditTimeDIalog;
