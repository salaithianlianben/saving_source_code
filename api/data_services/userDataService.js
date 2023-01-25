import request from '../request';
import config from '../../utils/configs';


const userDataServices = {
  getStudentInfo: ( student_id ) => {
      let path = `${config.constant.api_endpoint.STUDENT_DETAILS}?id=${student_id}`;
      return request.sendRequestGET(path);
  },
  setSetting : (user_id,user_role,facilitator,parent,centre,preferred_language)=>{
    let path = `${config.constant.api_endpoint.USER_SETTING}`;

    const data = new FormData();
    data.append('user_id', user_id); 
    data.append('user_role', user_role);
    data.append('preferred_language', preferred_language);
    data.append('centre', centre);

    if(user_role === "parent"){
      data.append('facilitator', facilitator);
    }else{
      data.append('parent', parent);
    }
  
    return request.fetchFormData(path, data, 'POST')
  },
  getSetting: ( user_id,user_role ) => {
    let path = `${config.constant.api_endpoint.USER_SETTING}?user_id=${user_id}&user_role=${user_role}`;
    return request.sendRequestGET(path);
  },
  checkUserByEmail:(email)=>{
    console.log('ENVIRONMENT NAME: '+ config.current_env);
    let path = `${config.constant.HOST_NAME}${config.constant.api_endpoint.CHECK_USER}`;
    let headers =  {
      'Content-Type': 'multipart/form-data',
    }
    const data = new FormData();
    data.append('email',email);

    return request.fetchFormDataCust(path,data,headers,'POST');
  },
  updateParentData:( id, img,is_active,is_new)=>{
    let path = `${config.constant.api_endpoint.UPDATE_PARENT}`;
    if(img != undefined){
      var temp = img.uri;
      let tempArray = temp.split("/");
      var file = {
          uri: img.uri,
          type: img.mime,
          name: tempArray[tempArray.length - 1],
      }
    }
    let data = new FormData();
    data.append('id',id);
    if(img != undefined){
      data.append('img',file);
    }
    if(is_active != undefined){
      data.append("is_active",is_active);
    }
    if(is_new != undefined){
      data.append("is_new",is_new);
    }

    return request.fetchFormData(path,data,'POST');
  },
  updateFacilitatorData:( id, img,is_active,is_new)=>{
    let path = `${config.constant.api_endpoint.UPDATE_FACILITATOR}`;
    if(img != undefined){
      var temp = img.uri;
      let tempArray = temp.split("/");
      var file = {
          uri: img.uri,
          type: img.mime,
          name: tempArray[tempArray.length - 1],
      }
    }
    let data = new FormData();
    data.append('id',id);
    if(img != undefined){
      data.append('img',file);
    }
    if(is_active != undefined){
      data.append("is_active",is_active);
    }
    if(is_new != undefined){
      data.append("is_new",is_new);
    }

    return request.fetchFormData(path,data,'POST');
  },
  updatePassword: (email, password)=> {
    let path = `${config.constant.api_endpoint.USER_CHANGE_PASSWORD}?email=${email}&password=${password}`;
    let formData = new FormData();
    formData.append('email',email);
    formData.append('password',password);

    return request.fetchFormData(path,formData,'POST');
  }
};

export default userDataServices;