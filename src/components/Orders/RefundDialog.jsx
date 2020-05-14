import React from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  InputAdornment,
  Typography,
  Grid,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useStyles } from './Orders.styled';

const validationSchema = (props) => (
  Yup.object()
    .shape({
      amount: Yup.number()
        .typeError('Only digits are allowed.')
        .min(
          0.5,
          `The value should be between 0.5 and ${props.orderToEdit && props.orderToEdit.total_amount.toFixed(2)}`,
        )
        .max(
          Number(props.orderToEdit && props.orderToEdit.total_amount),
          `The value should be between 0.5 and ${props.orderToEdit && props.orderToEdit.total_amount.toFixed(2)}`,
        )
        .required('Required'),
    })
);

function RefundDialog(props) {
  const {
    handleCloseRefund,
    isOpenRefund,
    handleRefund,
    orderToEdit,
  } = props;
  const classes = useStyles();

  return (
    <Formik
      enableReinitialize
      initialValues={{ amount: orderToEdit && orderToEdit.total_amount.toFixed(2), status: 'full' }}
      onSubmit={handleRefund}
      validationSchema={validationSchema(props)}
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
          setFieldValue,
        } = property;
        return (
          <Dialog
            open={isOpenRefund}
            onClose={handleCloseRefund}
            fullWidth
            maxWidth="sm"
          >
            <form onSubmit={handleSubmit}>
              <DialogTitle>Refund order</DialogTitle>
              <DialogContent>
                <RadioGroup name="status" value={values.status} onChange={(value) => { handleChange(value); setFieldValue('amount', values.status === 'full' ? 0 : orderToEdit && orderToEdit.total_amount.toFixed(2)); }} row>
                  <FormControlLabel value="full" control={<Radio color="primary" />} label="Full refund" />
                  <FormControlLabel value="partial" control={<Radio color="primary" />} label="Partial refund" />
                </RadioGroup>
                <Grid container direction="row" alignItems="center">
                  <Typography className={classes.amountField}>Refund amount:</Typography>
                  <TextField
                    name="amount"
                    error={errors.amount && touched.amount}
                    value={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={(errors.amount && touched.amount) && errors.amount}
                    margin="normal"
                    disabled={values.status === 'full'}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  type="button"
                  className={classes.formButton}
                  disabled={isSubmitting}
                  size="large"
                  onClick={handleCloseRefund}
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

RefundDialog.defaultProps = {
  orderToEdit: null,
};

RefundDialog.propTypes = {
  orderToEdit: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(null),
  ]),
  handleCloseRefund: PropTypes.func.isRequired,
  handleRefund: PropTypes.func.isRequired,
  isOpenRefund: PropTypes.bool.isRequired,
};

export default connect(null, null)(RefundDialog);
