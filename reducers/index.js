import {combineReducers} from 'redux';
import authState from './authReducer';
import homeState from './homeReducer';
import userState from './userReducer';
import fundraisingState from './fundraisingReducer'
import paymentState from './paymentReducer';
import authActionTypes from '../actions/action_types/authActionTypes';

const {LOGOUT} = authActionTypes;

const appReducer = combineReducers({
    authState,
    homeState,
    userState,
    paymentState,
    fundraisingState
})

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
      console.log('LOGOUTTTTTTT ....... ');
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
}

export default rootReducer;