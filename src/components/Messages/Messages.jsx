import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

import DefaultLayout from 'components/Layouts/DefaultLayout';
import { Grid, Box, FormControlLabel, Checkbox } from '@material-ui/core';
import ChatListItem from './ChatListItem';
import Loader from 'components/common/Loader/Loader';
import { useParams, Switch, Route } from 'react-router-dom';
import ROUTES from 'constants/routes';
import ChatRoom from './ChatRoom';
import { MessagesService, notifyService } from 'services';
import { Search } from 'components/common';
import { RESTAURANTS_PATH } from 'constants/apiPaths';
import history from 'browserHistory';
import { ChatsListContainer } from './Messages.styled';
import { debounceEventHandler } from 'sdk/utils/forms';
import { NOTIFY_KEYS } from 'constants/notifier';

function Messages() {
  const { chatsList, chatItemsTotal, isChatListLoading } = useSelector((state) => state.chat);
  const { id: restaurantId } = useSelector((state) => state.auth.user.restaurant);
  const [isGettingMoreChatItems, setIsGettingMoreChatItems] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const { id } = useParams();

  const list = useMemo(() => {
    const result = showUnreadOnly ?
      chatsList.filter(message => !!message.user_message && !message.read) :
      chatsList;

    return result.map(item => (
      <ChatListItem
        key={item.id}
        item={item}
        isActive={+id === +item.user_id}
      />
    ));
  }, [chatsList, showUnreadOnly, id]);

  useEffect(() => {
    MessagesService.setChatRoomId(id);
  }, [id]);

  useEffect(() => {
    notifyService.hide(NOTIFY_KEYS.MESSAGE);
    return () => {
      MessagesService.setChatRoomId(null);
    };
  }, []);

  useEffect(() => {
    setIsGettingMoreChatItems(false);
  }, [chatsList]);

  const handleScroll = e => {
    if (
      (e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop) < 100
      && !isGettingMoreChatItems
      && chatItemsTotal > chatsList.length
    ) {
      setIsGettingMoreChatItems(true);
      MessagesService.loadMoreChatItems();
    }
  };

  return (
    <DefaultLayout>
      <Box>
        <Grid container>
          <Grid style={{ width: '260px' }}>
            <Box mb={2}>
              <Search
                label="Find user"
                placeholder="Start typing..."
                onChange={(user) => {
                  if (user && user.id) history.push(`${ROUTES.MESSAGES}/${user.id}`);
                }}
                optionLabelCallback={o => `${o.first_name} ${o.last_name ? o.last_name : ''}`}
                searchApiUrl={`${RESTAURANTS_PATH}/${restaurantId}/clients`}
              />
            </Box>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showUnreadOnly}
                    onChange={e => setShowUnreadOnly(e.target.checked)}
                    name="checkedB"
                    color="primary"
                  />
                }
                label="Show only unread messages"
              />
            </Box>
            <ChatsListContainer onScroll={debounceEventHandler(handleScroll, 100)}>
              {!isChatListLoading && list}
              { (isChatListLoading || chatItemsTotal > chatsList.length) && <Loader size={24} /> }
              { !isChatListLoading
                && chatItemsTotal === 0
                && chatsList.length === 0
                && "You don't have any messages yet."
              }
            </ChatsListContainer>
          </Grid>
          <Grid item style={{ flex: '2', marginLeft: '16px' }}>
            <Switch>
              <Route
                component={ChatRoom}
                exact
                path={ROUTES.MESSAGES_ROOM}
              />
            </Switch>
          </Grid>
        </Grid>
      </Box>
    </DefaultLayout>
  );
}

export default Messages;
