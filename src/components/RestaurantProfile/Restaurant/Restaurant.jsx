import React from 'react';
import { connect } from 'react-redux';
import { Card, CardContent, CardHeader, Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import RestaurantDialog from './RestaurantDialog';
import { useStyles } from '../RestaurantProfile.styled';

function Restaurant(props) {
  const {
    defaultData,
    openHandler,
    closeHandler,
    isOpen,
    submitHandler,
  } = props;
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title={defaultData.name ? defaultData.name : 'Restaurant name'}
          className={classes.cardHeader}
          action={
            <RestaurantDialog
              defaultData={defaultData}
              submitHandler={submitHandler}
              isOpen={isOpen}
              closeHandler={closeHandler}
              openHandler={openHandler}
            />
            }
        />
        <CardContent>
          <Typography component="h5">
            {defaultData.address ? defaultData.address.long_name : 'Restaurant address'}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

Restaurant.propTypes = {
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

export default connect(null)(Restaurant);
