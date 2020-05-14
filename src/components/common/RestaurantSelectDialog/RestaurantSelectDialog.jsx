import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  DialogActions,
  Button,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { setRestaurant } from 'actions/authActions';
import { notifyService, RestaurantsService } from 'services';
import { Select } from '..';
import { useStyles } from './styled';
import history from 'browserHistory';
import ROUTES from 'constants/routes';

function RestaurantSelectDialog({
  open,
  onClose,
  changeRestaurant,
  restaurant,
}) {
  const [restaurantsLoading, setRestaurantsLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurant);
  const [errorText, setErrorText] = useState(null);
  const classes = useStyles();

  async function getRestaurants() {
    setRestaurantsLoading(true);
    try {
      const data = await RestaurantsService.getRestaurantsList();
      setRestaurantsLoading(false);
      setRestaurants(data);
    } catch (error) {
      setRestaurantsLoading(false);
      const { response } = error;
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  }

  useEffect(() => { getRestaurants(); }, []);

  function handleClose() {
    if (restaurant.id || (!restaurantsLoading && !restaurants.length)) onClose(false);
  }

  function handleRestaurantChange(r) {
    setErrorText(null);
    setSelectedRestaurant(r);
  }

  async function handleSubmit() {
    if (!selectedRestaurant.id) {
      setErrorText('You need to select restaurant to continue.');
    } else {
      await changeRestaurant(selectedRestaurant);
      if (history.location.pathname === `${ROUTES.RESTAURANTS}/${restaurant.id}/edit`) {
        history.replace(`${ROUTES.RESTAURANTS}/${selectedRestaurant.id}/edit`);
      }
      window.location.reload();
    }
  }

  return (
    <Dialog
      aria-labelledby="select-restaurant-dialog-title"
      maxWidth="sm"
      classes={{ paperScrollPaper: classes.visibleOverflow }}
      fullWidth
      onClose={handleClose}
      open={open}
    >
      <DialogTitle id="simple-dialog-title">
        Select Restaurant
        {
          !restaurantsLoading &&
          !restaurants.length &&
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        }
      </DialogTitle>
      <DialogContent className={classes.visibleOverflow}>
        <Box mb={3}>
          <Select
            isLoading={restaurantsLoading}
            data={restaurants}
            error={!!errorText}
            helperText={errorText}
            value={selectedRestaurant.id}
            label="Restaurant"
            placeholder="Select Restaurant"
            onChange={handleRestaurantChange}
            getOptionValue={r => r.id}
            getOptionLabel={r => r.name}
            optionValue="id"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

RestaurantSelectDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  changeRestaurant: PropTypes.func.isRequired,
  restaurant: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({
  restaurant: state.auth.user.restaurant,
});

const mapDispatchToProps = dispatch => ({
  changeRestaurant: restaurant => dispatch(setRestaurant(restaurant)),
});

// eslint-disable-next-line max-len
export default connect(mapStateToProps, mapDispatchToProps)(RestaurantSelectDialog);

