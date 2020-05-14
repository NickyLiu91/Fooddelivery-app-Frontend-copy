import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Box, Button } from '@material-ui/core';
import { AlertDialog } from 'components/common';
import { notifyService as notifier, notifyService, RestaurantProfileService } from 'services';
import StopTakingOrdersDialog from './StopTakingOrdersDialog';
import { getErrorMessage } from 'sdk/utils';
import { setOrderingIsAllowed } from 'actions/restaurantActions';

function StopTakingOrders({
  restaurant,
  setOrderingAllowed,
}) {
  const [active, setActive] = useState(restaurant.ordering_allowed);
  const [alertDialogIsOpen, setAlertDialogIsOpen] = useState(false);
  const [stopTakingOrdersDialogIsOpen, setStopTakingOrdersDialogIsOpen] = useState(false);
  const [resumeSubmitting, setResumeSubmitting] = useState(false);

  const handleButtonClick = () => {
    if (active) {
      setStopTakingOrdersDialogIsOpen(true);
    } else {
      setAlertDialogIsOpen(true);
    }
  };

  const handleConfirmResumeTakingOrders = async () => {
    try {
      await RestaurantProfileService.resumeTakingOrders(restaurant.id);
      setResumeSubmitting(true);
      notifier.showSuccess('Taking orders are successfully resumed');
      setActive(true);
      setOrderingAllowed(true);
      setAlertDialogIsOpen(false);
      setResumeSubmitting(false);
    } catch (error) {
      console.log('[handleConfirmResumeTakingOrders] error', error);
      const errorMsg = getErrorMessage(error);
      if (errorMsg === 'Orders are currently allowed to be taken') {
        setActive(true);
        setOrderingAllowed(true);
        setAlertDialogIsOpen(false);
        setResumeSubmitting(false);
      }
      notifyService.showError(errorMsg);
    }
  };

  const handleSubmit = async (data, { setSubmitting, resetForm }) => {
    try {
      console.log('data', data);
      await RestaurantProfileService.stopTakingOrders(restaurant.id, data.name, data.reason);
      notifier.showSuccess('Taking orders are successfully stopped');
      setActive(false);
      setOrderingAllowed(false);
      setStopTakingOrdersDialogIsOpen(false);
      setSubmitting(false);
      resetForm({
        name: '',
        reason: '',
      });
    } catch (error) {
      console.log('[Stop Taking Orders] handleSubmit error', error);
      const errorMsg = getErrorMessage(error);
      if (errorMsg === 'Taking orders has already stopped') {
        setActive(false);
        setOrderingAllowed(false);
        setStopTakingOrdersDialogIsOpen(false);
        setSubmitting(false);
        resetForm({
          name: '',
          reason: '',
        });
      }
      notifyService.showError(errorMsg);
      setSubmitting(false);
    }
  };

  return (
    <Box m={2}>
      <Button
        variant="contained"
        onClick={handleButtonClick}
        color={active ? 'secondary' : 'primary'}
        fullWidth
      >
        {`${active ? 'Stop' : 'Resume'} taking orders`}
      </Button>
      <AlertDialog
        isOpen={alertDialogIsOpen}
        title="Resume taking orders"
        message="Are you sure you'd like to resume taking orders?"
        onClose={() => setAlertDialogIsOpen(false)}
        onConfirm={handleConfirmResumeTakingOrders}
        isSubmitting={resumeSubmitting}
      />
      {
        stopTakingOrdersDialogIsOpen &&
        <StopTakingOrdersDialog
          isOpen={stopTakingOrdersDialogIsOpen}
          onConfirm={handleSubmit}
          onClose={() => setStopTakingOrdersDialogIsOpen(false)}
        />
      }
    </Box>
  );
}

StopTakingOrders.propTypes = {
  restaurant: PropTypes.shape({
    id: PropTypes.number.isRequired,
    ordering_allowed: PropTypes.bool.isRequired,
  }).isRequired,
  setOrderingAllowed: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  restaurant: state.auth.user.restaurant,
});

const mapDispatchToProps = dispatch => ({
  setOrderingAllowed: isAllowed => dispatch(setOrderingIsAllowed(isAllowed)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StopTakingOrders);
