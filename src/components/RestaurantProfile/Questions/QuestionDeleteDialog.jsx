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

function QuestionDeleteDialog(props) {
  const {
    isOpen,
    handleDeleteClose,
    questionToDelete,
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
      <DialogTitle id="alert-dialog-title">Delete question</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Do you really want to delete <strong>{`"${questionToDelete && questionToDelete.question}"`}</strong> ?
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

QuestionDeleteDialog.defaultProps = {
  questionToDelete: null,
};

QuestionDeleteDialog.propTypes = {
  handleDeleteClose: PropTypes.func.isRequired,
  handleDeleteConfirm: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired,
  questionToDelete: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(null),
  ]),
};

export default connect(null, null)(QuestionDeleteDialog);
