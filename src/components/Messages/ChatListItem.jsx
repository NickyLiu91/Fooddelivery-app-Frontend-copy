/* eslint-disable react/prop-types */
import React from 'react';
import moment from 'moment';

import history from 'browserHistory';
import ROUTES from 'constants/routes';
import { ChatItem } from './Messages.styled';

function ChatListItem({ item, isActive }) {
  const isUserMessage = !!item.user_message;
  const subtitle = isUserMessage ?
    `${item.user_first_name}: ${item.user_message}` :
    `Manager: ${item.manager_message}`;

  return (
    <ChatItem
      isActive={isActive}
      title={`${item.user_first_name} ${item.user_last_name ? item.user_last_name : ''}`}
      subtitle={subtitle}
      unread={isUserMessage && !item.read ? 1 : null}
      onClick={() => history.push(`${ROUTES.MESSAGES}/${item.user_id}`)}
      date={moment(item.created_at).toDate()}
    />
  );
}

export default ChatListItem;
