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

function LabelsDeleteDialog(props) {
  const {
    isOpen,
    handleDeleteClose,
    labelToDelete,
    handleDeleteConfirm,
    deleting,
  } = props;

  return (
    <Dialog
      open={isOpen}
      onClose={handleDeleteClose}
    >
      <DialogTitle>Delete Label</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Do you really want to delete <strong>{`"${labelToDelete && labelToDelete.name}"`}</strong> ?
          This action can not be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDeleteClose}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={handleDeleteConfirm}
          color="primary"
          autoFocus
          disabled={deleting}
        >
          {deleting ? <CircularProgress size={24} /> : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

LabelsDeleteDialog.defaultProps = {
  labelToDelete: null,
};

LabelsDeleteDialog.propTypes = {
  labelToDelete: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(null),
  ]),
  handleDeleteClose: PropTypes.func.isRequired,
  handleDeleteConfirm: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired,
};

export default connect(null, null)(LabelsDeleteDialog);
