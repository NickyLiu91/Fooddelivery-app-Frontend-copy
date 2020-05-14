import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';

import { withStyles } from '@material-ui/styles';
import { listStyles, useSectionDialogStyles } from './Sections.styled';
import { materialClassesType } from 'types';
import Select from 'components/common/Select/Select';
import { createFakeEvent } from 'sdk/utils/forms';
import { MenuScheduleService, notifyService, modifiersService } from 'services';
import { getErrorMessage } from 'sdk/utils';
import { store } from 'reducers/store';

const additionalValidation = ({ name }) => {
  const errors = {};
  const trimmedName = name.trim();
  if (trimmedName) {
    const words = trimmedName.split(' ');
    if (words.length > 3) {
      errors.name = 'Name should contain maximum 3 words';
    }
  }
  return errors;
};

const onSubmit = (values, methods, submitHandler) => {
  const errors = additionalValidation(values);
  if (!isEmpty(errors)) {
    methods.setErrors(errors);
    methods.setSubmitting(false);
  } else {
    submitHandler(values, methods);
  }
};

const validationSchema = () => (
  Yup.object()
    .shape({
      name: Yup.string()
        .trim()
        .min(2, 'Your input is too short. Minimum length of the name is 3 symbols')
        .required('Required'),
      description: Yup.string()
        .min(2, 'Your input is too short. Minimum length of the address is 3 symbols')
        .max(128, 'Your input is too long. Maximum length of the address is 128 symbols')
        .required('Required'),
    })
);

const getSchedules = async (setSchedulesLoading, setSchedules) => {
  const { id } = store.getState().auth.user.restaurant;
  try {
    setSchedulesLoading(true);
    const { result } = await MenuScheduleService.getSchedules(id);
    setSchedules(result);
  } catch (error) {
    console.log('[getSchedules] error', error);
    notifyService.showError(getErrorMessage(error));
  } finally {
    setSchedulesLoading(false);
  }
};

const getModifiers = async (setModifiersLoading, setModifiers) => {
  const { id } = store.getState().auth.user.restaurant;
  try {
    setModifiersLoading(true);
    const { result } = await modifiersService.getModifiersList(id);
    setModifiers(result);
  } catch (error) {
    console.log('[getModifiers] error', error);
    notifyService.showError(getErrorMessage(error));
  } finally {
    setModifiersLoading(false);
  }
};

function SectionDialog(props) {
  const [schedulesLoading, setSchedulesLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [modifiersLoading, setModifiersLoading] = useState(true);
  const [modifiers, setModifiers] = useState([]);
  const sectionsClasses = useSectionDialogStyles();

  useEffect(() => {
    getSchedules(setSchedulesLoading, setSchedules);
    getModifiers(setModifiersLoading, setModifiers);
  }, []);

  const {
    classes,
    defaultData,
    submitHandler,
    closeHandler,
    isOpen,
  } = props;

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: defaultData.name,
        description: defaultData.description,
        menu_schedules: defaultData.menu_schedules,
        menu_modifiers: defaultData.menu_modifiers,
      }}
      onSubmit={(values, methods) => onSubmit(values, methods, submitHandler)}
      validationSchema={validationSchema()}
    >
      {(property) => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = property;
        return (
          <Dialog
            classes={{ paperScrollPaper: sectionsClasses.root }}
            open={isOpen}
            onClose={closeHandler}
            fullWidth
            maxWidth="sm"
            aria-labelledby="form-dialog-title"
          >
            <form onSubmit={handleSubmit}>
              <DialogTitle id="form-dialog-title">Create section</DialogTitle>
              <DialogContent className={sectionsClasses.visibleOverflow}>
                <TextField
                  label="Name"
                  name="name"
                  error={errors.name && touched.name}
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={(errors.name && touched.name) && errors.name}
                  margin="normal"
                  fullWidth
                />
                <TextField
                  label="Description"
                  name="description"
                  error={errors.description && touched.description}
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={(errors.description && touched.description) && errors.description}
                  margin="normal"
                  fullWidth
                  multiline
                />
                <Select
                  isLoading={schedulesLoading}
                  data={schedules}
                  error={errors.menu_schedules && touched.menu_schedules}
                  helperText={
                    (errors.menu_schedules && touched.menu_schedules)
                    && errors.menu_schedules
                  }
                  value={values.menu_schedules}
                  label="Schedules"
                  placeholder="Select Schedules"
                  isMulti
                  onChange={(value) => handleChange(createFakeEvent({ name: 'menu_schedules', value }))}
                  getOptionValue={r => r.id}
                  getOptionLabel={r => r.name}
                  optionValue="id"
                />
                <Select
                  isLoading={modifiersLoading}
                  data={modifiers}
                  error={errors.menu_modifiers && touched.menu_modifiers}
                  helperText={
                    (errors.menu_modifiers && touched.menu_modifiers)
                    && errors.menu_modifiers
                  }
                  value={values.menu_modifiers}
                  label="Modifiers"
                  placeholder="Select Modifiers"
                  isMulti
                  onChange={(value) => handleChange(createFakeEvent({ name: 'menu_modifiers', value }))}
                  getOptionValue={r => r.id}
                  getOptionLabel={r => `${r.title}${!!r.internal_name && ` [${r.internal_name}]`}`}
                  optionValue="id"
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
        );
      }}
    </Formik>
  );
}

SectionDialog.propTypes = {
  classes: materialClassesType.isRequired,
  defaultData: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]).isRequired,
  closeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default withStyles(listStyles)(SectionDialog);
