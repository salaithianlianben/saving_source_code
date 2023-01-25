import authActionTypes from '../actions/action_types/authActionTypes';

const {
    SAVE_USER_TOKEN,
    LOGIN_AUTHENTICATION,
    LOGOUT,
    CHECK_USER_INFO,
    REMOVE_USER_TOKEN,
    REFRESH_USER_TOKEN,
    PUSH_FCM_TOKEN,
    CLEAR_FCM_TOKEN,
    GET_USER_INFO,
    USER_FORGOT_PASSWORD,
    CHANGE_PASSWORD,
} = authActionTypes;

const authAction = {
  login: (email,password) => {
    return {
      type: LOGIN_AUTHENTICATION,
      email,password,
    };
  },
  logout: () => {
    return {
      type: LOGOUT,
    };
  },
  checkUserInfo: (uid)=>{
    return{
      type:CHECK_USER_INFO,
      uid
    };
  },
  saveUserToken: (token) => {
    return {
      type: SAVE_USER_TOKEN,
      token
    };
  },
  refreshUserToken: () => {
    return {
      type:REFRESH_USER_TOKEN,
    }
  },
  pushFcmToken:(user_id,token) => {
    return {
      type:PUSH_FCM_TOKEN,
      token,user_id
    }
  },
  clearFcmToken:(user_id,token,handleCallback) => {
    return {
      type:CLEAR_FCM_TOKEN,
      token,user_id,handleCallback
    }
  },
  getUserData:(id)=>{
    return {
      type:GET_USER_INFO,
      id,
    }
  },
  onUserForgotpassword:(email)=>{
    return {
      type:USER_FORGOT_PASSWORD,
      email,
    }
  },
  onChangePassword:(email,password,userInfo)=>{
    return {
      type:CHANGE_PASSWORD,
      email,password,userInfo
    }
  }
};

export default authAction;