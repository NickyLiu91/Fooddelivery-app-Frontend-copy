import React from 'react';
import { IconButton } from '@material-ui/core';
import { ENQUEUE_SNACKBAR, CLOSE_SNACKBAR, REMOVE_SNACKBAR } from 'constants/actions/notifier';
import { store } from 'reducers/store';
import Clear from '@material-ui/icons/Clear';

export const enqueueSnackbar = notification => {
  const key = notification.options && notification.options.key;

  return {
    type: ENQUEUE_SNACKBAR,
    notification: {
      ...notification,
      key: key || new Date().getTime() + Math.random(),
    },
  };
};

export const closeSnackbar = key => ({
  type: CLOSE_SNACKBAR,
  dismissAll: !key,
  key,
});

export const removeSnackbar = key => ({
  type: REMOVE_SNACKBAR,
  key,
});

export const notify = ({ message, variant }) => {
  store.dispatch(enqueueSnackbar({
    message,
    options: {
      key: new Date().getTime() + Math.random(),
      variant,
      action: key => (
        // eslint-disable-next-line react/jsx-filename-extension
        <IconButton color="inherit" onClick={() => store.dispatch(closeSnackbar(key))}>
          <Clear />
        </IconButton>
      ),
    },
  }));
};

export const notifyNew = (notifyKey, message) => {
  store.dispatch(enqueueSnackbar({
    message,
    options: {
      key: notifyKey,
      variant: 'warning',
      persist: true,
      preventDuplicate: true,
      action: key => (
        <React.Fragment>
          <IconButton color="inherit" onClick={() => store.dispatch(closeSnackbar(key))}>
            <Clear />
          </IconButton>
        </React.Fragment>
      ),
    },
  }));
};

