import userActionTypes from '../actions/action_types/userActionTypes';

const {
    FETCH_STUDENT_INFO,
    SET_SETTING,
    FETCH_SETTING,
    CHECK_USER,
    UPDATE_FACILITATOR_INFO,
    UPDATE_PARENT_INFO,
    UPDATE_PASSWORD
} = userActionTypes;

const userAction = {
  setStudentInfo:(student_id,from_home,handleCallback)=>{
      return {
          type:FETCH_STUDENT_INFO,
          student_id,from_home,handleCallback
      }
  },
  setSetting: (user_id,user_role,facilitator,parent,centre,preferred_language,)=>{
        return {
            type: SET_SETTING,
            user_id,user_role,facilitator,parent,centre,preferred_language
        }
   },
   getSetting: (user_id,user_role)=>{
    return {
        type: FETCH_SETTING,
        user_id,user_role,
        }
    },
    checkUser:(email,password,is_change_password)=>{
        return {
            type:CHECK_USER,
            email,password,
            is_change_password
        }
    },
    updateParentInfo:(id,img,is_active,is_new)=>{
        return {
            type:UPDATE_PARENT_INFO,
            id,img,is_active,is_new
        }
    },
    updateFacilitatorInfo:(id,img,is_active,is_new)=>{
        return {
            type:UPDATE_FACILITATOR_INFO,
            id,img,is_active,is_new,
        }
    },
    updatePassword:(email, password, handleCallback)=> {
        return {
            type:UPDATE_PASSWORD,
            email, password, handleCallback
        }
    }

};

export default userAction;