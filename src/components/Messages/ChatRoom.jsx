import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  FormControl,
  Input,
  InputAdornment,
  IconButton,
  Typography,
  CircularProgress,
  Button,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

import { MessagesService, notifyService } from 'services';
import { Loader } from 'components/common';
import { parseMessages } from 'sdk/utils/chat';
import { MessagesList, useMessagesStyles, NavBar, RoomContainer } from './Messages.styled';
import history from 'browserHistory';
import ROUTES from 'constants/routes';
import { getErrorMessage } from 'sdk/utils';
import { debounceEventHandler } from 'sdk/utils/forms';

const renderUserInfo = info => {
  if (!info.firstName) return <CircularProgress size={24} />;
  return (
    <>
      <Typography><b>{`${info.firstName} ${info.lastName ? info.lastName : ''}`}</b></Typography>
      {
        info.phone &&
        <Typography variant="body2">{`Phone: ${info.phone}`}</Typography>
      }
      {
        info.email &&
        <Typography variant="body2">{`Email: ${info.email}`}</Typography>
      }
    </>
  );
};

const getUserInfo = async (id, setUserInfo) => {
  try {
    const info = await MessagesService.getUserInfo(id);
    if (info && info.id === +id) {
      setUserInfo({
        id: info.user_id,
        firstName: info.first_name,
        lastName: info.last_name,
        phone: info.phone,
        email: info.email,
      });
    }
  } catch (error) {
    console.log('[getUserInfo] error', error);
    notifyService.showError(getErrorMessage(error));
  }
};

function ChatRoom() {
  const [input, setInput] = useState('');
  const [isGettingMoreMessages, setIsGettingMoreMessages] = useState(false);
  const [userInfo, setUserInfo] = useState({ id: null, firstName: null, lastName: null });

  const { id } = useParams();
  const classes = useMessagesStyles();

  const { messagesList, isMessagesLoading } = useSelector(state => state.chat);
  const { token } = useSelector(state => state.auth);

  const messages = useMemo(() => parseMessages(messagesList), [messagesList]);

  useEffect(() => {
    setIsGettingMoreMessages(false);
  }, [messagesList]);

  useEffect(() => {
    MessagesService.connectToRoom(id);
    setIsGettingMoreMessages(false);
  }, [id, token]);

  useEffect(() => {
    getUserInfo(id, setUserInfo);
    setUserInfo({ id: null, firstName: null });
  }, [id]);

  useEffect(() => {
    if (messagesList.length) MessagesService.markChatAsRead(id);
  }, [messagesList.length, id]);

  function handleSendMessage() {
    const value = input.trim();
    if (value && !isMessagesLoading) {
      MessagesService.sendMessage(value);
      setInput('');
    }
  }

  const handleScroll = e => {
    if (e.target.scrollTop < 100 && !isGettingMoreMessages && !isMessagesLoading) {
      setIsGettingMoreMessages(true);
      MessagesService.loadMoreMessages();
    }
  };

  function handleKeyPress(e) {
    if (e.key === 'Enter') handleSendMessage();
  }

  return (
    <RoomContainer>
      <NavBar
        left={renderUserInfo(userInfo)}
        right={(
          <Button
            color="primary"
            onClick={() => history.push(`${ROUTES.ORDERS_SEARCH}/${id}`)}
          >
            Go to User Orders
          </Button>
        )}
      />
      {isMessagesLoading && <Loader />}
      <MessagesList
        lockable
        onScroll={debounceEventHandler(handleScroll, 100)}
        dataSource={isMessagesLoading ? [] : messages}
      />
      <FormControl className={classes.inputFormControl}>
        <Input
          value={input}
          className={classes.input}
          fullWidth
          onKeyPress={handleKeyPress}
          onChange={e => setInput(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={handleSendMessage}
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </RoomContainer>
  );
}

export default ChatRoom;
