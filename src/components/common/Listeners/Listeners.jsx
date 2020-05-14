import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

// import { SocketService } from 'services';
import { SocketService, notifyService, MessagesService, OrdersService, notificationSoundsService } from 'services';
import { NOTIFY_KEYS } from 'constants/notifier';
import { AlertDialog } from 'components/common';
import history from 'browserHistory';
import ROUTES from 'constants/routes';
import { setOrdersChangedFlag as setOrdersChangedFlagAction } from 'actions/ordersActions';
import { USER_ROLES } from 'constants/auth';

let ordersSoundTimeout = null;

const propTypes = {
  setOrdersChangedFlag: PropTypes.func.isRequired,
};

function Listeners({ setOrdersChangedFlag }) {
  const { auth, orders } = useSelector(state => state);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const setupSocketListeners = useCallback(() => {
    SocketService.subscribe('success-connection', data => {
      console.log('[Sockets] success-connection data', data);
    });
    SocketService.subscribe('error', error => {
      console.log('[Sockets] error', error);
    });
    SocketService.subscribe('disconnect', reason => {
      console.log('[Sockets] disconnect reason:', reason);
    });
    SocketService.subscribe('connect_error', error => {
      console.log('[Sockets] connect_error error:', error);
    });
    SocketService.subscribe('connect_timeout', timeout => {
      console.log('[Sockets] connect_timeout timeout:', timeout);
      notifyService.showError('Connection error');
    });
    SocketService.subscribe('reconnect', error => {
      console.log('[Sockets] reconnect error:', error);
    });
    SocketService.subscribe('reconnect_attempt', attempt => {
      console.log('[Sockets] reconnect_attempt attempt:', attempt);
    });
    SocketService.subscribe('reconnect_error', error => {
      console.log('[Sockets] reconnect_error error:', error);
      notifyService.showError('Connection error');
    });
    SocketService.subscribe('reconnecting', attempt => {
      console.log('[Sockets] reconnecting attempt:', attempt);
    });
    SocketService.subscribe('reconnect_failed attempt:', attempt => {
      console.log('[Sockets] reconnect_failed attempt:', attempt);
      notifyService.showError('Connection error');
    });
    MessagesService.setupMessagesListeners();
    SocketService.subscribe('order', order => {
      if (order.status === 'pending') {
        if (history.location.pathname !== ROUTES.ORDERS) {
          notifyService.showNew(NOTIFY_KEYS.ORDERS, 'You have new orders');
          OrdersService.getNewOrdersCount();
        }
        OrdersService.setNewOrdersFlag(true);
        notificationSoundsService.playOrderSound();
      } else if (history.location.pathname !== ROUTES.ORDERS) {
        OrdersService.getNewOrdersCount();
      }
      setOrdersChangedFlag();
    });
    OrdersService.getNewOrdersCount();
  }, [setOrdersChangedFlag]);

  const alertActionsClb = useCallback(() => {
    setIsAlertOpen(false);
    notificationSoundsService.enableAudioInSafari();
  }, []);

  useEffect(() => {
    if (auth.authenticated && auth.user.role !== USER_ROLES.ROOT) {
      SocketService.connect();
      setupSocketListeners();
      OrdersService.getNewOrdersCount();
    } else if (!auth.authenticated) {
      SocketService.disconnect();
    }
  }, [auth.authenticated, auth.token, auth.user.role, setupSocketListeners]);

  useEffect(() => {
    if (orders.newOrdersFlag && auth.authenticated && auth.user.role !== USER_ROLES.ROOT) {
      ordersSoundTimeout = setInterval(() => {
        notificationSoundsService.playOrderSound();
      }, 10000);
    } else {
      clearInterval(ordersSoundTimeout);
    }
  }, [orders.newOrdersFlag, auth.authenticated, auth.user.role]);

  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (auth.authenticated) {
      if (isSafari) {
        setIsAlertOpen(true);
      } else {
        notificationSoundsService.unlockAudio();
      }
    }
  }, [auth.authenticated]);

  return (
    <AlertDialog
      isOpen={isAlertOpen}
      onClose={alertActionsClb}
      title="Audio"
      message="Please click confirm to enable audio notifications in browser"
      onConfirm={alertActionsClb}
      onlyConfirm
    />
  );
}


Listeners.propTypes = propTypes;

const mapDispatchToProps = dispatch => ({
  setOrdersChangedFlag: () => dispatch(setOrdersChangedFlagAction(true)),
});

export default connect(null, mapDispatchToProps)(Listeners);
