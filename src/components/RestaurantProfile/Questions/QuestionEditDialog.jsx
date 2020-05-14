import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  TextField,
  Typography,
} from '@material-ui/core';
import { Formik } from 'formik';
import TextEditor from '../TextEditor/TextEditor';
import { EditorState } from 'draft-js';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { convertFromHTML } from 'draft-convert';
import { useStyles } from '../RestaurantProfile.styled';

let question = '';
const validationSchema = () => (
  Yup.object()
    .shape({
      question: Yup.string()
        .trim()
        .min(3, 'Your input length should be between 3 and 200 symbols.')
        .max(200, 'Your input length should be between 3 and 200 symbols.'),
      answer: Yup.object()
        .test('required', 'Required', (value) => {
          const data = value.getCurrentContent().getPlainText().replace(/\s/g, '');
          const validationRule = value.getCurrentContent().hasText() && /\S/.test(data);
          if (question) {
            return validationRule;
          }
          return true;
        }),
    })
);

function QuestionEditDialog(props) {
  const {
    isOpen,
    handleEditClose,
    submitHandler,
    questionToEdit,
  } = props;
  const classes = useStyles();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...{
          question: questionToEdit.question,
          answer: EditorState.createWithContent(convertFromHTML(questionToEdit.answer)),
        },
      }}
      onSubmit={submitHandler}
      validationSchema={validationSchema()}
    >
      {(property) => {
        const {
          values,
          isSubmitting,
          handleChange,
          handleBlur,
          touched,
          errors,
          handleSubmit,
          setFieldValue,
        } = property;

        ({ question } = values);

        return (
          <Dialog
            open={isOpen}
            onClose={handleEditClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="form-dialog-title"
          >
            <form onSubmit={handleSubmit}>
              <DialogTitle id="form-dialog-title">Edit question</DialogTitle>
              <DialogContent>
                <Typography className={classes.dialogTitle} variant="h6" component="p">
                  Question
                </Typography>
                <TextField
                  name="question"
                  value={values.question}
                  error={errors.question && touched.question}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={(errors.question && touched.question) && errors.question}
                  margin="normal"
                  fullWidth
                  multiline
                />
                <Typography className={classes.answer} variant="h6" component="p">
                  Answer
                </Typography>
                <TextEditor
                  editorState={values.answer}
                  onChange={setFieldValue}
                  onBlur={handleBlur}
                  stateName="answer"
                />
                <FormHelperText
                  className={classes.helperText}
                  id="answer"
                >{(errors.answer && touched.answer) && errors.answer}
                </FormHelperText>
              </DialogContent>
              <DialogActions>
                <Button
                  type="button"
                  className={classes.formButton}
                  disabled={isSubmitting}
                  size="large"
                  onClick={handleEditClose}
                  variant="contained"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="large"
                  className={classes.formButton}
                  disabled={isSubmitting || !values.question}
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        );
      }}
    </Formik>
  );
}

QuestionEditDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleEditClose: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  questionToEdit: PropTypes.oneOfType([
    PropTypes.object,
  ]).isRequired,
};

export default connect(null, null)(QuestionEditDialog);
