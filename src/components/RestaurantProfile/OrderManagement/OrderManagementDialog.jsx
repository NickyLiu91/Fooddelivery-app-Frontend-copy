import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Formik } from 'formik';
import { withStyles } from '@material-ui/styles';
import { listStyles } from '../RestaurantProfile.styled';
import EditIcon from '@material-ui/icons/Edit';
import { materialClassesType } from 'types';
import PropTypes from 'prop-types';

const validationSchema = () => (
  Yup.object()
    .shape({
      delivery_min_price: Yup.number()
        .typeError('Only digits and . symbol are allowed.')
        .min(1, 'The value should be between 1 and 100.')
        .max(100, 'The value should be between 1 and 100.')
        .required('Required'),
      preparation_time: Yup.number()
        .typeError('Only digits are allowed.')
        .integer('Only digits are allowed.')
        .min(5, 'The value should be between 5 and 180.')
        .max(180, 'The value should be between 5 and 180.')
        .required('Required'),
      delivery_time: Yup.number()
        .typeError('Only digits are allowed.')
        .integer('Only digits are allowed.')
        .min(15, 'The value should be between 15 and 500.')
        .max(500, 'The value should be between 15 and 500.')
        .required('Required'),
      sales_tax: Yup.number()
        .typeError('Only digits and dot are allowed.')
        .test(
          'decimal-test',
          'up to 3 decimal points allowed',
          value => String(value).match(/^(\d+\.?\d{0,3}|\.\d{1,9})$/),
        )
        .min(1, 'The value should be between 1 and 100.')
        .max(100, 'The value should be between 1 and 100.')
        .required('Required'),
    })
);

class OrderManagementDialog extends Component {
  state = {
    defaultPreparationTime: this.props.defaultData.preparation_time,
    defaultDeliveryPreparationTime: this.props.defaultData.delivery_time,
  };

  handleChangeTime = (updatedTime, state) => {
    this.setState({ [state]: updatedTime });
  };

  increaseTime = (state) => {
    const maxNumber = (state === 'defaultPreparationTime') ? 180 : 500;

    if (Number(this.state[state]) < maxNumber) {
      this.setState({ [state]: Number(this.state[state]) + 1 });
    }
  };

  decreaseTime = (state) => {
    const minNumber = (state === 'defaultPreparationTime') ? 5 : 15;

    if (Number(this.state[state]) > minNumber) {
      this.setState({ [state]: Number(this.state[state]) - 1 });
    }
  };

  render() {
    const {
      defaultPreparationTime,
      defaultDeliveryPreparationTime,
    } = this.state;
    const {
      classes,
      defaultData,
      submitHandler,
      openHandler,
      closeHandler,
      isOpen,
    } = this.props;

    return (
      <Formik
        initialValues={{
 ...{
            delivery_min_price: defaultData.delivery_min_price,
            preparation_time: this.state.defaultPreparationTime,
            delivery_time: this.state.defaultDeliveryPreparationTime,
            sales_tax: defaultData.sales_tax,
          },
        }}
        onSubmit={submitHandler}
        validationSchema={validationSchema()}
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
            setFieldValue,
          } = props;
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
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="sm"
              >
                <form onSubmit={handleSubmit}>
                  <DialogTitle id="form-dialog-title">Edit order management</DialogTitle>
                  <DialogContent>
                    <Grid container direction="column">
                      <Grid item className={classes.orderManagementItem}>
                        <Typography variant="h6" component="p">
                          Delivery minimum*
                        </Typography>
                        <TextField
                          name="delivery_min_price"
                          error={errors.delivery_min_price && touched.delivery_min_price}
                          value={values.delivery_min_price}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={(
                            errors.delivery_min_price && touched.delivery_min_price) &&
                          errors.delivery_min_price
                          }
                          margin="normal"
                          fullWidth
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                        />
                      </Grid>
                      <Grid item className={classes.orderManagementItem}>
                        <Typography variant="h6" component="p">
                          Default estimates
                        </Typography>
                        <Typography className={classes.inputTitle} color="textSecondary">
                          Default preparation estimate (min)*
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item>
                            <Fab
                              size="small"
                              color="primary"
                              onClick={() => {
                                this.decreaseTime('defaultPreparationTime');
                                setFieldValue('preparation_time', defaultPreparationTime);
                              }}
                            >
                              -
                            </Fab>
                          </Grid>
                          <Grid item className={classes.orderManagementItem}>
                            <TextField
                              name="preparation_time"
                              error={errors.preparation_time && touched.preparation_time}
                              value={defaultPreparationTime}
                              onChange={(e) => {
                                this.handleChangeTime(e.target.value, 'defaultPreparationTime');
                                handleChange(e);
                              }}
                              onBlur={handleBlur}
                              helperText={(
                                errors.preparation_time && touched.preparation_time) &&
                              errors.preparation_time
                              }
                            />
                          </Grid>
                          <Grid item>
                            <Fab
                              size="small"
                              color="primary"
                              onClick={() => {
                                this.increaseTime('defaultPreparationTime');
                                setFieldValue('preparation_time', defaultPreparationTime);
                              }}
                            >
                              +
                            </Fab>
                          </Grid>
                        </Grid>
                        <Typography className={classes.inputTitle} color="textSecondary">
                          Default prep + delivery estimate (min)*
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item >
                            <Fab
                              size="small"
                              color="primary"
                              onClick={() => {
                                this.decreaseTime('defaultDeliveryPreparationTime');
                                setFieldValue('delivery_time', defaultDeliveryPreparationTime);
                              }}
                            >
                              -
                            </Fab>
                          </Grid>
                          <Grid item className={classes.orderManagementItem}>
                            <TextField
                              name="delivery_time"
                              error={errors.delivery_time && touched.delivery_time}
                              value={defaultDeliveryPreparationTime}
                              onChange={(e) => {
                                this.handleChangeTime(e.target.value, 'defaultDeliveryPreparationTime');
                                handleChange(e);
                              }}
                              onBlur={handleBlur}
                              helperText={(
                                errors.delivery_time && touched.delivery_time) &&
                              errors.delivery_time
                              }
                            />
                          </Grid>
                          <Grid item className={classes.orderManagementItem}>
                            <Fab
                              size="small"
                              color="primary"
                              onClick={() => {
                                this.increaseTime('defaultDeliveryPreparationTime');
                                setFieldValue('delivery_time', defaultDeliveryPreparationTime);
                              }}
                            >
                              +
                            </Fab>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" component="p">
                          Sales Tax*
                        </Typography>
                        <TextField
                          name="sales_tax"
                          error={errors.sales_tax && touched.sales_tax}
                          value={values.sales_tax}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={(errors.sales_tax && touched.sales_tax) && errors.sales_tax}
                          margin="normal"
                          fullWidth
                          InputProps={{
                            startAdornment: <InputAdornment position="start">%</InputAdornment>,
                          }}
                        />
                      </Grid>
                    </Grid>
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
                      onClick={() => {
                        setFieldValue('preparation_time', defaultPreparationTime);
                        setFieldValue('delivery_time', defaultDeliveryPreparationTime);
                      }}
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
}

OrderManagementDialog.propTypes = {
  classes: materialClassesType.isRequired,
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

export default connect(null)(withStyles(listStyles)(OrderManagementDialog));
