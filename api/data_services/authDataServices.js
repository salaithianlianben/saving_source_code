import request from '../request';
import config from '../../utils/configs';

const authDataServices = {
  getUserInfo: (userid) => {
    let path = `${config.constant.api_endpoint.USER_DETAILS}${userid}`;
    
    return request.sendRequestGET(path);
  },
  pushFcmToken: (user_id,token) => {
    let path = `${config.constant.api_endpoint.PUSH_FCM_TOKEN}`;
    console.log(path);

    var data = new FormData();
    data.append('user_id',user_id);
    data.append('token',token);

    return request.fetchFormData(path,data,'POST');
  },
  clearFcmToken: (user_id,token) => {
    let path = `${config.constant.api_endpoint.CLEAR_FCM_TOKEN}`;
    console.log(path);

    var data = new FormData();
    data.append('user_id',user_id);
    data.append('token',token);

    //console.log('CLEARTOKEN: request POST '+user_id + ' ' + token);
    return request.fetchFormData(path,data,'POST');
  },
  forgotPasswordOfUser: (email)=>{
    let path = `${config.constant.HOST_NAME}${config.constant.api_endpoint.USER_FORGOT_PASSWORD}`;

    var data = new FormData();
    data.append('email',email);

    // console.log(email);

    let headers =  {
      'Content-Type': 'multipart/form-data',
    }
    
    return request.fetchFormDataCust(path,data,headers,'POST');
  },
  changePasswordOfUser:(email,password)=>{
    let path = `${config.constant.api_endpoint.USER_CHANGE_PASSWORD}?email=${email}&password=${password}`;
    let formData = new FormData();
    formData.append('email',email);
    formData.append('password',password);

    return request.fetchFormData(path,formData,'POST');
  }
};

export default authDataServices;