import userActionTypes from '../actions/action_types/userActionTypes';

const {
    
    FETCH_STUDENT_INFO,
    FETCH_STUDENT_INFO_FAIL,
    FETCH_STUDENT_INFO_SUCCESS,

    FETCH_SETTING,
    FETCH_SETTING_SUCCESS,
    FETCH_SETTING_FAIL,
    
    SET_SETTING,
    SET_SETTING_SUCCESS,
    SET_SETTING_FAIL,

    CHECK_USER,
    CHECK_USER_DONE,
    CHECK_USER_FAIL,

    UPDATE_PARENT_INFO_SUCCESS,
    UPDATE_PARENT_INFO_FAIL,
    UPDATE_PARENT_INFO,

    UPDATE_FACILITATOR_INFO_SUCCESS,
    UPDATE_FACILITATOR_INFO_FAIL,
    UPDATE_FACILITATOR_INFO,

    UPDATE_PASSWORD,
    UPDARE_PASSWORD_FAIL,
    UPDATE_PASSWORD_SUCCESS

} = userActionTypes;

let initStates = {
    is_loading: false,
    studentInfo:{},
    userSetting:{},
    is_success:false,
    message:'',
    should_login:false,
    is_loading_user:false,
    is_password_update_loading: false
}

const userReducer = (state = initStates,action) => {
    switch (action.type) {
        case FETCH_STUDENT_INFO:
            return {
                ...state,
                is_loading:true,
                userSetting:{}
            }

        case FETCH_STUDENT_INFO_FAIL:
            return {
                ...state,
                userSetting:{},
                is_loading:false,
            }

        case FETCH_STUDENT_INFO_SUCCESS:
            return {
                ...state,
                studentInfo:action.data,
                is_loading:false,
            }

        case SET_SETTING:
            return {
                    ...state,
                    is_loading:true,
            }

        case SET_SETTING_SUCCESS:
            return {
                    ...state,
                    is_loading:false,
                    userSetting:action.data,
            }
    
        case SET_SETTING_FAIL:
            return {
                    ...state,
                    is_loading:false,
            }    
        
        case FETCH_SETTING:
            return {
                    ...state,
                    is_loading:true,
            }

        case FETCH_SETTING_SUCCESS:
            return {
                    ...state,
                    is_loading:false,
                    userSetting:action.data,
            }
    
        case FETCH_SETTING_FAIL:
            return {
                    ...state,
                    is_loading:false,
            }
            
        case CHECK_USER:
            return {
                ...state,
                message:'',
                should_login:false,
                is_loading_user:true,
                is_success:false,
            }

        case CHECK_USER_DONE:
            return {
                ...state,
                message:action.message,
                should_login:action.data.should_login,
                is_loading_user:false,
                is_success:true,
            }

        case CHECK_USER_FAIL:
            return {
                ...state,
                message:'Please try again!',
                should_login:false,
                is_loading_user:false,
                is_success:false,
            }

        case UPDATE_FACILITATOR_INFO:
            return {
                ...state,
                is_loading_user:true,
                is_success:false,
            }

        case UPDATE_FACILITATOR_INFO_FAIL:
            return {
                ...state,
                is_loading_user:false,
                is_success:false,
            }

        case UPDATE_FACILITATOR_INFO_SUCCESS:
            return {
                ...state,
                is_loading_user:false,
                is_success:true,
            }

        case UPDATE_PARENT_INFO:
            return {
                ...state,
                is_loading_user:true,
                is_success:false,
            }

        case UPDATE_PARENT_INFO_FAIL:
            return {
                ...state,
                is_loading_user:false,
                is_success:false,
            }

        case UPDATE_PARENT_INFO_SUCCESS:
            return {
                ...state,
                is_success:true,
                is_loading_user:false,
            }
        case UPDATE_PASSWORD:
            return {
                ...state,
                is_password_update_loading: true,
            }
        case UPDATE_PASSWORD_SUCCESS:
            return {
                ...state,
                is_password_update_loading: false,
            }
        case UPDARE_PASSWORD_FAIL:
            return {
                    ...state,
                    is_password_update_loading: false,
            }
        default:
            return state;
    }
}

export default userReducer;