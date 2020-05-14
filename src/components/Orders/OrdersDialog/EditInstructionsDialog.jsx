import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@material-ui/core';

const propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  initialData: PropTypes.string,
};

function EditInstructionsDIalog({
  onClose,
  onConfirm,
  isOpen,
  initialData,
}) {
  const [instructions, setInstructions] = useState(initialData);
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Edit Order Instructions</DialogTitle>
      <DialogContent>
        <TextField
          onChange={e => setInstructions(e.target.value)}
          label="Instructions"
          value={instructions}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onConfirm(instructions)} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EditInstructionsDIalog.propTypes = propTypes;

EditInstructionsDIalog.defaultProps = {
  initialData: '',
};

export default EditInstructionsDIalog;
