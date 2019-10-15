import { notify } from 'actions/notifier';

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
};
