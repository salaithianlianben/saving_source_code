import authActionTypes from '../actions/action_types/authActionTypes';

const {
    SAVE_USER_TOKEN,
    LOGIN_AUTHENTICATION,
    LOGOUT,
    SAVE_USER_INFO,
    REMOVE_USER_TOKEN,
    LOGIN_AUTHENTICATION_FAIL,
    PUSH_FCM_TOKEN,
    PUSH_FCM_TOKEN_FAIL,
    PUSH_FCM_TOKEN_SUCCESS,
    CLEAR_FCM_TOKEN,
    CLEAR_FCM_TOKEN_FAIL,
    CLEAR_FCM_TOKEN_SUCCESS,
    USER_FORGOT_PASSWORD_FAIL,
    USER_FORGOT_PASSWORD,
    USER_FORGOT_PASSWORD_SUCCESS,
    LOGIN_AUTHENTICATION_SUCCESS,
    SAVE_PASSWORD,
    CLEAR_PASSWORD,
    CHANGE_PASSWORD_FAIL,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD,
    LOGIN_AGAIN_AFTER_CHANGE_PASSWORD_SUCCESS,
    LOGIN_AGAIN_AFTER_CHANGE_PASSWORD_FAIL,
    LOGIN_AGAIN_AFTER_CHANGE_PASSWORD,

} = authActionTypes;

let initStates = {
    isLoading: false,
    userInfo: {},
    is_loading:false,
    token: "",
    fcm_token:'',
    is_email_send_successful:false,
    password:'',
    email:'',
    is_changing_password:false,
    is_change_password:false,
}

const authReducer = (state = initStates,action) => {
    switch (action.type) {
        case LOGIN_AUTHENTICATION:
            return {
                ...state,
                isLoading: true,
                is_loading:true,
            }

        case LOGIN_AUTHENTICATION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                is_loading:false,
                is_change_password:false,
            }

        case CHANGE_PASSWORD:
            return {
                ...state,
                is_changing_password:true,
                is_change_password:false,
            }

        case CHANGE_PASSWORD_FAIL:
            return {
                ...state,
                is_changing_password:false,
                is_change_password:false,
            }

        case CHANGE_PASSWORD_SUCCESS:
            return {
                ...state,
                is_changing_password:true,
                is_change_password:true,
            }

        case LOGIN_AGAIN_AFTER_CHANGE_PASSWORD:
            return {
                ...state,
                is_changing_password:true,
            }

        case LOGIN_AGAIN_AFTER_CHANGE_PASSWORD_FAIL:
            return {
                ...state,
                is_changing_password:false,
            }

        case LOGIN_AGAIN_AFTER_CHANGE_PASSWORD_SUCCESS:
            return {
                ...state,
                is_changing_password:false,
            }

        case SAVE_PASSWORD:
            return {
                ...state,
                password:action.password,
                email:action.email,
            }

        case CLEAR_PASSWORD:
            return {
                ...state,
                password:'',
                email:'',
            }

        case PUSH_FCM_TOKEN:
            return {
                ...state,
                fcm_token:'',
            }

        case PUSH_FCM_TOKEN_FAIL:
            return {
                ...state,
            }

        case PUSH_FCM_TOKEN_SUCCESS:
            return {
                ...state,
                fcm_token:action.data.token
            }

        case CLEAR_FCM_TOKEN:
            return {
                ...state,
                fcm_token:'',
            }

        case CLEAR_FCM_TOKEN_FAIL:
            return {
                ...state,
            }
    
        case CLEAR_FCM_TOKEN_SUCCESS:
            return {
                ...state,
            }      
            
        case REMOVE_USER_TOKEN:
            return {
                ...state,
                token: "",
                userInfo: {},
                isLoading: false
            }
        case SAVE_USER_TOKEN:
            return {
                ...state,
                token: action.token,
                isLoading: false

            }
        case SAVE_USER_INFO:
            return {
                ...state,
                userInfo: action.userInfo,
                isLoading: false,
                is_loading:false,
            }
        case LOGIN_AUTHENTICATION_FAIL:
            return {
                ...state,
                isLoading: false,
                is_loading:false,
            }

        case USER_FORGOT_PASSWORD:
            return {
                ...state,
                is_email_send_successful:false,
            }

        case USER_FORGOT_PASSWORD_FAIL:
            return {
                ...state,
                is_email_send_successful:false,
            }

        case USER_FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                is_email_send_successful:true,
            }

        default:
            return state;
    }
}

export default authReducer;