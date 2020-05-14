import React from 'react';
import { connect } from 'react-redux';
import { Card, CardContent, CardHeader, Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import OrderManagementDialog from './OrderManagementDialog';
import { useStyles } from '../RestaurantProfile.styled';

function OrderManagement(props) {
  const {
    defaultData,
    openHandler,
    closeHandler,
    isOpen,
    submitHandler,
  } = props;
  const classes = useStyles();

  return (
    <Grid item xs={8}>
      <Card>
        <CardHeader
          title="Order management"
          className={classes.cardHeader}
          action={
            <OrderManagementDialog
              defaultData={defaultData}
              submitHandler={submitHandler}
              isOpen={isOpen}
              closeHandler={closeHandler}
              openHandler={openHandler}
            />
            }
        />
        <CardContent>
          <Typography variant="h5" component="h4">
              Delivery and Pick Up
          </Typography>
          <Typography className={classes.managementTitle} variant="h6" component="p">
              Delivery minimum
          </Typography>
          <Typography component="p">
              ${defaultData.delivery_min_price}
          </Typography>
          <Typography className={classes.managementTitle} variant="h6" component="p">
              Default preparation estimate
          </Typography>
          <Typography component="p">
            {defaultData.preparation_time} min
          </Typography>
          <Typography className={classes.managementTitle} variant="h6" component="p">
              Default prep + delivery estimate
          </Typography>
          <Typography component="p">
            {defaultData.delivery_time} min
          </Typography>
          <Typography color="textSecondary" component="p">
            You can set up additional delivery time for each delivery zone in Delivery Boundaries
          </Typography>
          <Typography className={classes.managementTitle} variant="h6" component="p">
              Sales Tax:
          </Typography>
          <Typography component="p">
            {defaultData.sales_tax}%
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

OrderManagement.propTypes = {
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

export default connect(null)(OrderManagement);
