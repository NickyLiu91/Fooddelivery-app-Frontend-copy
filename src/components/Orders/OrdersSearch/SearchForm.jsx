import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, Form, Formik } from 'formik';
import moment from 'moment';

import {
  Grid,
  Box,
  Typography,
  Button,
  FormControl,
  Select,
  InputAdornment,
  IconButton,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';

import { DatePickerField } from 'components/common';
import { materialClassesType } from 'types';

export default class SearchForm extends Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      startDate: PropTypes.instanceOf(moment).isRequired,
      endDate: PropTypes.instanceOf(moment).isRequired,
      search: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
    onSubmit: PropTypes.func.isRequired,
    classes: materialClassesType.isRequired,
  }

  handleSubmit = (data) => {
    if (data.search) {
      this.props.onSubmit(data);
    }
  }

  render() {
    const {
      classes,
      initialValues,
    } = this.props;
    return (
      <Formik
        onSubmit={this.handleSubmit}
        initialValues={initialValues}
        enableReinitialize
      >
        {({
          errors,
          values,
          handleChange,
          touched,
        }) => {
          const startInvalid = values.enableDates && (!values.startDate || !!errors.startDate);
          const endInvalid = values.enableDates && (!values.endDate || !!errors.endDate);
          const searchInvalid = !values.search && !!touched.search;
          return (
            <Form>
              <Grid container direction="row">
                <Box mt={1} ml={1}>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={values.enableDates}
                        onChange={handleChange}
                        name="enableDates"
                        color="primary"
                      />
                    )}
                    label="Search for period"
                  />
                </Box>
                {
                values.enableDates &&
                <>
                  <Box mr={1} mb={1}>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                      <Typography className={classes.titleDate}>
                        From:
                      </Typography>
                      <Field
                        className={classes.fieldDate}
                        name="startDate"
                        component={DatePickerField}
                      />
                    </Grid>
                  </Box>
                  <Box mr={1} mb={1}>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                      <Typography className={classes.titleDate}>
                        To:
                      </Typography>
                      <Field
                        className={classes.fieldDate}
                        name="endDate"
                        component={DatePickerField}
                      />
                    </Grid>
                  </Box>
                </>
                }
                <Box mt={1}>
                  <Grid container direction="row" justify="space-between" alignItems="center">
                    <span className={classes.status}>
                    Type
                    </span>
                    <FormControl variant="outlined" className={classes.formControl}>
                      <Select
                        native
                        margin="dense"
                        value={values.type}
                        onChange={handleChange}
                        inputProps={{
                          name: 'type',
                        }}
                      >
                        <option value="">All</option>
                        <option value="delivery">Delivery</option>
                        <option value="pickup">Pick up</option>
                      </Select>
                    </FormControl>
                  </Grid>
                </Box>
                <Box ml={2}>
                  <TextField
                    style={{ maxWidth: '290px', backgroundColor: '#fff' }}
                    placeholder="Order ID or Customer"
                    value={values.search}
                    name="search"
                    error={searchInvalid}
                    helperText={searchInvalid && 'Required'}
                    onChange={handleChange}
                    variant="outlined"
                    margin="dense"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                      endAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            className={classes.iconButton}
                            onClick={() => handleChange({ target: { name: 'search', value: '' } })}
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Box mt={1}>
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    className={classes.applyItemButton}
                    disabled={startInvalid || endInvalid}
                  >
                    Apply
                  </Button>
                </Box>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    );
  }
}
