import {
  SET_NEW_MESSAGE_FLAG,
  SET_CHAT_LIST,
  SET_CHAT_LIST_LOADING,
  SET_MESSAGES_LIST,
  ADD_MESSAGE_TO_LIST,
  SET_MESSAGES_LIST_LOADING,
  SET_CHAT_LIST_AND_TOTAL,
} from 'constants/actions/chat';

export const setUnreadMessages = (value = false) => ({
  type: SET_NEW_MESSAGE_FLAG,
  payload: value,
});

export const setChatList = (value = []) => ({
  type: SET_CHAT_LIST,
  payload: value,
});

export const setChatListAndTotal = (value = { result: [], total: 0 }) => ({
  type: SET_CHAT_LIST_AND_TOTAL,
  payload: value,
});

export const setChatListLoading = (value = false) => ({
  type: SET_CHAT_LIST_LOADING,
  payload: value,
});

export const setMessagesList = (value = []) => ({
  type: SET_MESSAGES_LIST,
  payload: value,
});

export const addMessageToList = (value = { manager_message: '' }) => ({
  type: ADD_MESSAGE_TO_LIST,
  payload: value,
});

export const setMessagesListLoading = (value = false) => ({
  type: SET_MESSAGES_LIST_LOADING,
  payload: value,
});
