import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormHelperText,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { listStyles } from '../RestaurantProfile.styled';
import { materialClassesType } from 'types';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import TextEditor from '../TextEditor/TextEditor';
import { EditorState } from 'draft-js';
import { convertFromHTML } from 'draft-convert';


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

class QuestionAddDialog extends React.Component {
  state = {
    question: '',
  };

  handleQuestionChange = (event) => {
    question = event.target.value;
    this.setState({ question: event.target.value });
  };

  render() {
    const {
      classes,
      submitHandler,
      closeHandler,
      isOpen,
    } = this.props;
    const content = convertFromHTML('');

    return (
      <Formik
        initialValues={{ question: '', answer: EditorState.createWithContent(content) }}
        onSubmit={submitHandler}
        validationSchema={validationSchema()}
      >
        {(property) => {
          const {
            values,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            touched,
            errors,
            setFieldValue,
            setErrors,
            setTouched,
          } = property;

          function cleanHelperText() {
            setErrors({});
            setTouched({});
          }

          return (
            <Dialog
              open={isOpen}
              onClose={() => { cleanHelperText(); closeHandler(); }}
              fullWidth
              maxWidth="sm"
              aria-labelledby="form-dialog-title"
            >
              <form onSubmit={handleSubmit}>
                <DialogTitle id="form-dialog-title">Add question</DialogTitle>
                <DialogContent>
                  <Typography className={classes.dialogTitle} variant="h6" component="p">
                    Question
                  </Typography>
                  <TextField
                    name="question"
                    error={errors.question && touched.question}
                    onChange={(event) => { this.handleQuestionChange(event); handleChange(event); }}
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
                    name="answer"
                    editorState={values.answer}
                    onChange={setFieldValue}
                    onBlur={handleBlur}
                    stateName="answer"
                  />
                  <FormHelperText className={classes.helperText} id="answer">{(errors.answer && touched.answer) && errors.answer}</FormHelperText>
                </DialogContent>
                <DialogActions>
                  <Button
                    type="button"
                    className={classes.formButton}
                    disabled={isSubmitting}
                    size="large"
                    onClick={() => { cleanHelperText(); closeHandler(); }}
                    variant="contained"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="large"
                    className={classes.formButton}
                    disabled={isSubmitting || !this.state.question}
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
}

QuestionAddDialog.propTypes = {
  classes: materialClassesType.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default connect(null, null)(withStyles(listStyles)(QuestionAddDialog));
