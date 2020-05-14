import { combineReducers } from 'redux';
import auth from './authReducer';
import notifier from './notifier';
import menuItems from './menuItemsReducer';
import orders from './ordersReducer';
import chat from './chatReducer';

const appReducer = combineReducers({
  auth,
  notifier,
  menuItems,
  orders,
  chat,
});

const rootReducer = (state, action) => appReducer(state, action);

export default rootReducer;
