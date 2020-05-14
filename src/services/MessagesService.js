import { SocketService } from 'services';
import moment from 'moment';
import debounce from 'lodash/debounce';

import { store } from 'reducers/store';
import {
  setChatList,
  setMessagesList,
  setMessagesListLoading,
  setChatListAndTotal,
  addMessageToList,
} from 'actions/chatActions';
import history from 'browserHistory';
import ROUTES from 'constants/routes';
import { addNewMessageToList, addNewMessageToDialogs } from 'sdk/utils/chat';
import HttpModel from 'sdk/api/HttpModel';
import { RESTAURANTS_PATH } from 'constants/apiPaths';
import notifyService from './notifyService';
import notificationSoundsService from './notificationSoundsService';
import { NOTIFY_KEYS } from 'constants/notifier';

const { dispatch } = store;
const timeToHideNotification = 5 * 60 * 1000;

const debouncedCloseMessageNotification = debounce(() => {
  notifyService.hide(NOTIFY_KEYS.MESSAGE);
}, timeToHideNotification);

class MessagesService {
  constructor() {
    this.currentChatRoomId = null;
  }

  setupMessagesListeners = () => {
    SocketService.subscribe('dialogs-response', data => {
      dispatch(setChatListAndTotal(data));
    });
    SocketService.subscribe('chat-history-response', data => {
      dispatch(setMessagesList(data));
    });
    SocketService.subscribe('new-message', data => {
      this.onGetNewMessage(data);
    });
    SocketService.emit('dialogs-request', {
      limit: 30,
      offset: 0,
    });
  }

  setChatRoomId = id => {
    this.currentChatRoomId = id;
  }

  connectToRoom = (id) => {
    dispatch(setMessagesListLoading(true));
    SocketService.emit('connect-to-room', {
      user_id: id,
    });
  }

  markChatAsRead = (id) => {
    const { chatsList } = store.getState().chat;
    const index = chatsList.findIndex(item => Number(item.user_id) === Number(id));
    if (index > -1) {
      chatsList[index].read = 1;
      dispatch(setChatList([...chatsList]));
      SocketService.emit('read-messages');
    }
  }

  sendMessage = (message) => {
    const timeStamp = +moment();
    SocketService.emit('send-message', {
      message,
      sent_at: timeStamp,
    });
    dispatch(addMessageToList({
      manager_message: message,
      sent_at: timeStamp,
      isPending: true,
    }));
  }

  onGetNewMessage = message => {
    const {
      messagesList, messagesTotal, chatsList, chatItemsTotal,
    } = store.getState().chat;
    const isOnMessagesNow = history.location.pathname.includes(ROUTES.MESSAGES);

    const dialogs = addNewMessageToDialogs(message, chatsList, chatItemsTotal);
    dispatch(setChatListAndTotal(dialogs));

    if (message.user_message !== null) {
      notificationSoundsService.playMessageSound();
      if (!isOnMessagesNow) {
        notifyService.showNew(NOTIFY_KEYS.MESSAGE, 'You have new messages');
        debouncedCloseMessageNotification();
      }
    }

    if (
      isOnMessagesNow
      && messagesList.length
      && message.user_id === +this.currentChatRoomId
    ) {
      const messages = addNewMessageToList(message, messagesList);
      dispatch(setMessagesList({ total: messagesTotal + 1, result: messages }));
    }
  }

  getUserInfo = async id => {
    const restaurantId = store.getState().auth.user.restaurant.id;
    const { data } = await HttpModel.get(`${RESTAURANTS_PATH}/${restaurantId}/clients/${id}`);
    return data;
  }

  loadMoreMessages = () => {
    const { messagesList, messagesTotal } = store.getState().chat;
    if (messagesList.length < messagesTotal) {
      SocketService.emit('chat-history-request', {
        limit: messagesList.length + 25,
        offset: 0,
      });
    }
  }

  loadMoreChatItems = () => {
    const { chatsList } = store.getState().chat;
    SocketService.emit('dialogs-request', {
      limit: chatsList.length + 20,
      offset: 0,
    });
  }
}

export default new MessagesService();
