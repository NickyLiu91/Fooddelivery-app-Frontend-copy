import moment from 'moment';

export const parseMessages = list => list.map(message => {
  const isUserMessage = !!message.user_message;
  return {
    position: isUserMessage ? 'left' : 'right',
    text: message.user_message || message.manager_message,
    date: moment(message.created_at).toDate(),
    status: message.isPending ? 'waiting' : '',
  };
}).reverse();

export const addNewMessageToList = (message, list) => {
  const result = list;

  if (message.user_message) return [message, ...result];

  const pendingMessageIndex = list.findIndex(item =>
    item.isPending && message.sent_at === item.sent_at);

  if (pendingMessageIndex > -1) {
    result[pendingMessageIndex] = message;
    return [...result];
  }

  return [message, ...result];
};

export const addNewMessageToDialogs = (message, list, listTotal) => {
  const result = list;

  const dialogIndex = list.findIndex(item => message.user_id === item.user_id);

  if (dialogIndex > -1) {
    result.splice(dialogIndex, 1);
    return { result: [message, ...result], listTotal };
  }

  return { result: [message, ...result], total: listTotal + 1 };
};

export const newMessagesInList = list => {
  for (let i = 0; i < list.length; i += 1) {
    if (list[i].user_message && !list[i].read) return true;
  }
  return false;
};

