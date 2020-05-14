import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, Form, Formik } from 'formik';
import moment from 'moment';

import { Grid, Box, Typography, Button } from '@material-ui/core';

import { DatePickerField } from 'components/common';
import { materialClassesType } from 'types';

export default class MultipleDatesForm extends Component {
  static propTypes = {
    startDate: PropTypes.instanceOf(moment).isRequired,
    endDate: PropTypes.instanceOf(moment).isRequired,
    onSubmit: PropTypes.func.isRequired,
    classes: materialClassesType.isRequired,
  }

  handleSubmit = (data) => {
    console.log('data', data);
  }

  render() {
    const {
      onSubmit,
      classes,
      startDate,
      endDate,
    } = this.props;
    return (
      <Formik
        onSubmit={onSubmit}
        initialValues={{
          datePickerFromField: startDate,
          datePickerToField: endDate,
        }}
      >
        {({ errors, values }) => {
          const startInvalid = !values.datePickerFromField || !!errors.datePickerFromField;
          const endInvalid = !values.datePickerToField || !!errors.datePickerToField;
          return (
            <Form>
              <Grid container direction="row">
                <Box mr={1} mb={1}>
                  <Grid container direction="row" justify="space-between" alignItems="center">
                    <Typography className={classes.titleDate}>
                      From:
                    </Typography>
                    <Field
                      className={classes.fieldDate}
                      name="datePickerFromField"
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
                      name="datePickerToField"
                      component={DatePickerField}
                    />
                  </Grid>
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
