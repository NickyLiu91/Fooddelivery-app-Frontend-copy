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

function ScheduleDeleteDialog(props) {
  const {
    isOpen,
    handleDeleteClose,
    scheduleToDelete,
    handleDeleteConfirm,
    deleting,
  } = props;

  return (
    <Dialog
      open={isOpen}
      onClose={handleDeleteClose}
    >
      <DialogTitle>Delete schedule</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Do you really want to delete <strong>{`"${scheduleToDelete && scheduleToDelete.name}"`}</strong> ?
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

ScheduleDeleteDialog.defaultProps = {
  scheduleToDelete: null,
};

ScheduleDeleteDialog.propTypes = {
  scheduleToDelete: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(null),
  ]),
  handleDeleteClose: PropTypes.func.isRequired,
  handleDeleteConfirm: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired,
};

export default connect(null, null)(ScheduleDeleteDialog);
