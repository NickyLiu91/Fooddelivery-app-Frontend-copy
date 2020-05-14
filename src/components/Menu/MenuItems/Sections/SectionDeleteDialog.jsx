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

function SectionDeleteDialog(props) {
  const {
    isOpen,
    handleDeleteClose,
    sectionToDelete,
    handleDeleteConfirm,
    deleting,
  } = props;

  return (
    <Dialog
      open={isOpen}
      onClose={handleDeleteClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete section</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Do you really want to delete <strong>{`"${sectionToDelete && sectionToDelete.name}"`}</strong> ?
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

SectionDeleteDialog.defaultProps = {
  sectionToDelete: null,
};

SectionDeleteDialog.propTypes = {
  sectionToDelete: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(null),
  ]),
  handleDeleteClose: PropTypes.func.isRequired,
  handleDeleteConfirm: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired,
};

export default connect(null, null)(SectionDeleteDialog);
