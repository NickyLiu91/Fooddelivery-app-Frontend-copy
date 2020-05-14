import {
  SET_NEW_MESSAGE_FLAG,
  SET_CHAT_LIST,
  SET_CHAT_LIST_LOADING,
  SET_CHAT_LIST_AND_TOTAL,
  SET_MESSAGES_LIST,
  SET_MESSAGES_LIST_LOADING,
  ADD_MESSAGE_TO_LIST,
} from 'constants/actions/chat';
import { newMessagesInList } from 'sdk/utils/chat';

const initialState = {
  unreadMessagesFlag: null,
  chatsList: [],
  isChatListLoading: true,
  chatItemsTotal: 0,
  messagesList: [],
  isMessagesLoading: true,
  messagesTotal: 0,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_NEW_MESSAGE_FLAG:
      return {
        ...state,
        unreadMessagesFlag: payload,
      };
    case SET_CHAT_LIST:
      return {
        ...state,
        chatsList: payload,
        unreadMessagesFlag: newMessagesInList(payload),
      };
    case SET_CHAT_LIST_AND_TOTAL:
      return {
        ...state,
        isChatListLoading: false,
        chatsList: payload.result,
        chatItemsTotal: payload.total,
        unreadMessagesFlag: newMessagesInList(payload.result),
      };
    case SET_CHAT_LIST_LOADING:
      return {
        ...state,
        isChatListLoading: payload,
      };
    case SET_MESSAGES_LIST:
      return {
        ...state,
        isMessagesLoading: false,
        messagesList: payload.result,
        messagesTotal: payload.total,
      };
    case ADD_MESSAGE_TO_LIST:
      return {
        ...state,
        messagesList: [payload, ...state.messagesList],
      };
    case SET_MESSAGES_LIST_LOADING:
      return {
        ...state,
        isMessagesLoading: payload,
      };
    default:
      return state;
  }
};
