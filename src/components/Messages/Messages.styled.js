import {
  ChatItem as rceChatItem,
  MessageList as rceMessageList,
  Navbar as rceNavBar,
} from 'react-chat-elements';
import styled from 'styled-components';
import { makeStyles, Box } from '@material-ui/core';

export const ChatItem = styled(rceChatItem)`
  .rce-citem-avatar {
    display: none;
  }

  .rce-citem-body {
    padding-left: 15px;
  }

  .rce-citem {
    background-color: ${props => props.isActive ? '#eee' : '#fff'};
  }
`;

export const RoomContainer = styled.div`
  border: 1px solid #ccc;
  box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
`;

export const ChatsListContainer = styled(Box)`
  && {
    width: 260px;
    max-height: calc(100vh - 170px);
    overflow-y: auto;
  }
`;

export const MessagesList = styled(rceMessageList)`
  height: 64vh;
  border-left: 2px solid #fff;
  border-right: 2px solid #fff;

  .rce-mbox-text {
    white-space: pre-wrap;
  }

  .rce-mbox.rce-mbox-right {
    background-color: #d0f3fe;
  }

  .rce-mbox-right-notch {
    fill: #d0f3fe;
  }
`;

export const NavBar = styled(rceNavBar)`
  &.rce-navbar.light {
    background-color: #fff;
    padding: 16px;
  }

  .rce-navbar-item__left {
    display: block;
  }
`;

export const useMessagesStyles = makeStyles(theme => ({
  inputFormControl: {
    width: '100%',
    backgroundColor: theme.palette.common.white,
    borderTop: '1px solid',
    borderColor: theme.palette.divider,
  },
  input: {
    padding: theme.spacing(1, 1),
  },
}));
