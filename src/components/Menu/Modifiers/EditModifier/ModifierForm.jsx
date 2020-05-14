/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Formik, FieldArray } from 'formik';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';

import {
  Typography,
  Box,
  Paper,
  Divider,
  TextField,
  Grid,
  Button,
  IconButton,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  CircularProgress,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { materialClassesType } from 'types';
import validationSchema from './validationSchema';
import { ConfirmLeaving } from 'components/common';

const SortableContainer = sortableContainer(({ children }) => <Box>{children}</Box>);

const SortableItem = sortableElement(({ children }) => <Box>{children}</Box>);

const DragHandle = sortableHandle(() => <MenuIcon fontSize="large" />);

function ModifierForm({
  modifier,
  onSubmit,
  classes,
  isNew,
  onDeleteModifier,
  onCancel,
  onSetDirty,
}) {
  const handleDeleteModifierItem = callback => {
    // eslint-disable-next-line no-alert
    const confirmation = window.confirm('Do you really want to delete modidier ?');
    if (confirmation) {
      callback();
    }
  };
  return (
    <Formik
      initialValues={{ ...modifier }}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          dirty,
        } = props;
        onSetDirty(dirty);
        const itemsError = touched.items && typeof errors.items === 'string' && errors.items;
        return (
          <form onSubmit={handleSubmit}>
            <Paper className={classes.formPaper}>
              <Typography variant="h6">
                Modifier Prompt
              </Typography>
              <Divider />
              <TextField
                label="Instruction to dinner*"
                name="title"
                error={errors.title && touched.title}
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={(errors.title && touched.title) && errors.title}
                margin="normal"
                fullWidth
              />
              <TextField
                label="Internal Name"
                name="internal_name"
                error={errors.internal_name && touched.internal_name}
                value={values.internal_name}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={(errors.internal_name && touched.internal_name)
                  && errors.internal_name}
                margin="normal"
                fullWidth
              />
            </Paper>
            <Paper
              className={`${classes.formPaper} ${itemsError ? classes.modifiersError : ''}`}
            >
              <Typography variant="h6">
                Modifiers
              </Typography>
              <Divider />
              <Box mt={2}>
                <Typography color="error">
                  {itemsError}
                </Typography>
                {
                  values.items &&
                  values.items.length !== 0 &&
                  <Grid
                    justify="center"
                    container
                    spacing={2}
                  >
                    <Grid item className={classes.modifierIconWrapper} />
                    <Grid item xs={8}>Name</Grid>
                    <Grid item xs={2}>Upcharge</Grid>
                  </Grid>
                }
              </Box>

              <FieldArray
                name="items"
                render={arrayHelpers => values.items ?
                  (
                    <SortableContainer lockAxis="y" onSortEnd={({ oldIndex, newIndex }) => arrayHelpers.move(oldIndex, newIndex)} useDragHandle>
                      {
                        values.items.length > 0 ?
                        values.items.map((item, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <SortableItem index={index} key={index}>
                            <Grid
                              container
                              justify="center"
                              spacing={2}
                            >
                              <Grid item className={classes.modifierIconWrapper}>
                                <DragHandle />
                              </Grid>
                              <Grid item xs={8}>
                                <TextField
                                  name={`items[${index}].title`}
                                  variant="outlined"
                                  className={classes.inputBgcWhite}
                                  error={errors.items &&
                                    errors.items[index] &&
                                    errors.items[index].title &&
                                    touched.items &&
                                    touched.items[index] &&
                                    touched.items[index].title}
                                  value={values.items[index] && values.items[index].title}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  helperText={
                                    (
                                      errors.items &&
                                      errors.items[index] &&
                                      errors.items[index].title &&
                                      touched.items &&
                                      touched.items[index] &&
                                      touched.items[index].title)
                                    && errors.items[index].title}
                                  margin="dense"
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={2}>
                                <TextField
                                  name={`items[${index}].price`}
                                  variant="outlined"
                                  InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                  }}
                                  className={classes.inputBgcWhite}
                                  error={
                                    errors.items &&
                                    errors.items[index] &&
                                    errors.items[index].price &&
                                    touched.items &&
                                    touched.items[index] &&
                                    touched.items[index].price
                                  }
                                  value={values.items[index].price}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  helperText={
                                    (
                                      errors.items &&
                                      errors.items[index] &&
                                      errors.items[index].price &&
                                      touched.items &&
                                      touched.items[index] &&
                                      touched.items[index].price) &&
                                      errors.items &&
                                      errors.items[index] &&
                                      errors.items[index].price}
                                  margin="dense"
                                  fullWidth
                                />
                              </Grid>
                              <Grid item>
                                <IconButton
                                  className={classes.deleteBtn}
                                  color="secondary"
                                  onClick={
                                    () => handleDeleteModifierItem(() => arrayHelpers.remove(index))
                                  }
                                >
                                  <ClearIcon fontSize="large" />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </SortableItem>
                        )) : null
                      }
                      <Box ml={2} mt={1}>
                        <Button
                          onClick={() => arrayHelpers.push({ title: '', price: 0 })}
                          color="primary"
                          startIcon={<AddIcon />}
                        >
                          Add modifier
                        </Button>
                      </Box>
                    </SortableContainer>
                  ) : null
                }
              />
            </Paper>

            <Paper className={classes.formPaper}>
              <Typography variant="h6">
                Selection Model
              </Typography>
              <Divider />
              <Box mt={2}>
                <Typography>
                  Is the customer required to select a choice or choices from this list?
                </Typography>
                <RadioGroup aria-label="required_choice" name="required_choice" value={values.required_choice} onChange={handleChange} row>
                  <FormControlLabel value="true" control={<Radio color="primary" />} label="Yes" />
                  <FormControlLabel value="false" control={<Radio color="primary" />} label="No" />
                </RadioGroup>
              </Box>
              <Box mt={1}>
                <Typography>
                  Number of choices
                </Typography>
                <RadioGroup aria-label="number_of_choices" name="number_of_choices" value={values.number_of_choices} onChange={handleChange} row>
                  <FormControlLabel value="one" control={<Radio color="primary" />} label="One" />
                  <FormControlLabel value="no-limit" control={<Radio color="primary" />} label="No limit" />
                  <FormControlLabel value="minMax" control={<Radio color="primary" />} label="Set a min-max" />
                </RadioGroup>
                { values.number_of_choices === 'minMax' && (
                  <Box>
                    <Grid container >
                      <TextField
                        className={classes.minMaxInput}
                        label="Min*"
                        variant="outlined"
                        name="number_of_choices_min"
                        error={errors.number_of_choices_min && touched.number_of_choices_min}
                        value={values.number_of_choices_min}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="dense"
                      />
                      {
                        !values.unlimitedMax &&
                        <React.Fragment>
                          <Box mt={2} component="span">
                            <RemoveIcon />
                          </Box>
                          <TextField
                            className={classes.minMaxInput}
                            label="Max*"
                            variant="outlined"
                            name="number_of_choices_max"
                            error={errors.number_of_choices_max && touched.number_of_choices_max}
                            value={values.number_of_choices_max}
                            onChange={handleChange}
                            disabled={values.unlimitedMax}
                            onBlur={handleBlur}
                            margin="dense"
                          />
                        </React.Fragment>
                      }
                      <Box ml={1.5} mt={0.75}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={values.unlimitedMax}
                              onChange={handleChange}
                              value="checkedB"
                              name="unlimitedMax"
                              color="primary"
                            />
                          }
                          label="Unlimited max"
                        />
                      </Box>
                    </Grid>
                    {(errors.number_of_choices_min && touched.number_of_choices_min) &&
                      <Typography variant="caption" display="block" color="secondary">
                        Min value {errors.number_of_choices_min}
                      </Typography>}
                    {(errors.number_of_choices_max && touched.number_of_choices_max) &&
                    <Typography variant="caption" display="block" color="secondary">
                      Max value {errors.number_of_choices_max}
                    </Typography>}
                  </Box>
                )
                }
              </Box>
            </Paper>

            <Paper className={classes.formPaper}>
              <Grid justify="flex-end" container spacing={2}>
                {
                !isSubmitting &&
                <React.Fragment>
                  {
                    !isNew &&
                    <Grid item>
                      <Button
                        variant="contained"
                        color="secondary"
                        type="button"
                        onClick={onDeleteModifier}
                      >
                        Delete
                      </Button>
                    </Grid>
                  }
                  <Grid item>
                    <Button
                      variant="contained"
                      type="button"
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </React.Fragment>
                }
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    { isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
            <ConfirmLeaving active={dirty && !isSubmitting} />
          </form>
        );
    }}
    </Formik>
  );
}

ModifierForm.propTypes = {
  modifier: PropTypes.shape({
    title: PropTypes.string.isRequired,
    internal_name: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      price: PropTypes.number,
    })),
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  classes: materialClassesType.isRequired,
  isNew: PropTypes.bool.isRequired,
  onSetDirty: PropTypes.func.isRequired,
};

export default ModifierForm;

