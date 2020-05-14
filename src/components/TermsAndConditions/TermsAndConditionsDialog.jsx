import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@material-ui/core';
import { Formik } from 'formik';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import TextEditor from './TextEditor/TextEditor';
import { convertFromHTML } from 'draft-convert';
import { EditorState } from 'draft-js';
import { useStyles } from './TermsAndConditions.styled';

function TermsAndConditionsDialog(props) {
  const {
    handleOpen,
    handleClose,
    isOpen,
    handleSubmitData,
    defaultData,
  } = props;
  const content = convertFromHTML(defaultData.terms_and_conditions);
  const classes = useStyles();

  return (
    <Formik
      initialValues={{ ...{ terms_and_conditions: EditorState.createWithContent(content) } }}
      onSubmit={handleSubmitData}
    >
      {(property) => {
        const {
          values,
          isSubmitting,
          handleBlur,
          handleSubmit,
          setFieldValue,
        } = property;
        return (
          <div>
            <Tooltip title="Edit" onClick={handleOpen}>
              <IconButton aria-label="edit">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Dialog
              open={isOpen}
              onClose={handleClose}
              fullWidth
              maxWidth="lg"
              aria-labelledby="form-dialog-title"
            >
              <form onSubmit={handleSubmit}>
                <DialogTitle id="form-dialog-title">Edit terms and conditions</DialogTitle>
                <DialogContent>
                  <TextEditor
                    editorState={values.terms_and_conditions}
                    onChange={setFieldValue}
                    onBlur={handleBlur}
                    stateName="terms_and_conditions"
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    type="button"
                    className={classes.formButton}
                    disabled={isSubmitting}
                    size="large"
                    onClick={handleClose}
                    variant="contained"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="large"
                    className={classes.formButton}
                    disabled={isSubmitting}
                    variant="contained"
                    color="primary"
                  >
                    { isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          </div>
        );
      }}
    </Formik>
  );
}

TermsAndConditionsDialog.propTypes = {
  defaultData: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]).isRequired,
  handleOpen: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmitData: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default connect(null, null)(TermsAndConditionsDialog);
