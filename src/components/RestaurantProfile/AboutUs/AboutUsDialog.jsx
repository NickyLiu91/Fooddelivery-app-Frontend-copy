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
} from '@material-ui/core';
import { Formik } from 'formik';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import TextEditor from '../TextEditor/TextEditor';
import { convertFromHTML } from 'draft-convert';
import { EditorState } from 'draft-js';
import { useStyles } from '../RestaurantProfile.styled';

function AboutUsDialog(props) {
  const {
    openHandler,
    closeHandler,
    isOpen,
    submitHandler,
    defaultData,
  } = props;
  const content = convertFromHTML(defaultData.about_us);
  const classes = useStyles();

  return (
    <Formik
      initialValues={{ ...{ about_us: EditorState.createWithContent(content) } }}
      onSubmit={submitHandler}
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
              <Tooltip title="Edit" onClick={openHandler}>
                <IconButton aria-label="edit">
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Dialog
                open={isOpen}
                onClose={closeHandler}
                fullWidth
                maxWidth="sm"
                aria-labelledby="form-dialog-title"
              >
                <form onSubmit={handleSubmit}>
                  <DialogTitle id="form-dialog-title">Edit About us</DialogTitle>
                  <DialogContent>
                    <TextEditor
                      editorState={values.about_us}
                      onChange={setFieldValue}
                      onBlur={handleBlur}
                      stateName="about_us"
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      type="button"
                      className={classes.formButton}
                      disabled={isSubmitting}
                      size="large"
                      onClick={closeHandler}
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
                      Submit
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

AboutUsDialog.propTypes = {
  defaultData: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]).isRequired,
  openHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default connect(null, null)(AboutUsDialog);
