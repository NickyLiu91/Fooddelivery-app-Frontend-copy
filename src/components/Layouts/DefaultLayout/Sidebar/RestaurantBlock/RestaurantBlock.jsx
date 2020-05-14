import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Box, Typography, Button, Divider } from '@material-ui/core';
import { RestaurantSelectDialog } from 'components/common';
import { useStyles } from './RestaurantBlock.styled';

function RestaurantBlock({ restaurant }) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  // eslint-disable-next-line
  useEffect(() => { if (!restaurant.id) setDialogIsOpen(true); }, [restaurant]);
  const classes = useStyles();

  return (
    <Box m={2} mt={0}>
      <Divider />
      <Typography variant="h6" className={classes.restaurantName}>
        Restaurant: {restaurant.name}
      </Typography>
      <Button
        onClick={() => setDialogIsOpen(true)}
        variant="contained"
        color="primary"
        fullWidth
      >
        Change Restaurant
      </Button>
      {
        dialogIsOpen &&
        <RestaurantSelectDialog
          open
          onClose={() => setDialogIsOpen(false)}
        />
      }
    </Box>
  );
}

RestaurantBlock.propTypes = {
  restaurant: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({
  restaurant: state.auth.user.restaurant,
});

export default connect(mapStateToProps)(RestaurantBlock);

