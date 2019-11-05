import { combineReducers } from 'redux';
import auth from './authReducer';
import notifier from './notifier';

const appReducer = combineReducers({
  auth,
  notifier,
});

const rootReducer = (state, action) => appReducer(state, action);

export default rootReducer;
