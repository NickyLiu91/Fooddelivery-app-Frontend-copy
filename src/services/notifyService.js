import { notify, notifyNew, closeSnackbar } from 'actions/notifier';
import { store } from 'reducers/store';

export default {
  showError: message => {
    notify({ message, variant: 'error' });
  },
  showSuccess: message => {
    notify({ message, variant: 'success' });
  },
  showWarning: message => {
    notify({ message, variant: 'warning' });
  },
  showInfo: message => {
    notify({ message, variant: 'info' });
  },
  showNew: (key, message) => {
    notifyNew(key, message);
  },
  hide: key => {
    store.dispatch(closeSnackbar(key));
  },
};
