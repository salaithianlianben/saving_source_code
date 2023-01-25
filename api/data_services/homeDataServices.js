import request from '../request';
import config from '../../utils/configs';
import {Platform} from 'react-native';
import configs from '../../utils/configs';

const homeDataServices = {
  getDataNotification: (userId, role, size, next, isNext) => {
    let path = isNext
      ? next
      : `${config.constant.api_endpoint.NOTIFICATION}?id=${userId}&role=${role}&size=${size}`;
    return request.sendRequestGET(path);
  },
  getAttendanceCalendarStudent: (student_id, start_date, end_date) => {
    let path = `${config.constant.api_endpoint.ATTENDANCE_CALENDARS}?student_id=${student_id}&start_date=${start_date}&end_date=${end_date}`;
    return request.sendRequestGET(path);
  },
  getMerchandiseType: () => {
    let path = `${config.constant.api_endpoint.MERCHANDISE_TYPE}`;
    return request.sendRequestGET(path);
  },
  getLeaveType: () => {
    let path = config.constant.api_endpoint.LEAVE_TYPE;
    return request.sendRequestGET(path);
  },
  makeAttendanceAlert: (
    student_id,
    class_id,
    centre_id,
    reason,
    details,
    parent_id,
    from_date,
    to_date,
  ) => {
    let path = config.constant.api_endpoint.ATTENDANCE_ALERT;
    const data = new FormData();
    data.append('student_id', student_id);
    data.append('class_id', class_id);
    data.append('centre_id', centre_id);
    data.append('reason', reason);
    data.append('details', details);
    data.append('parent_id', parent_id);
    data.append('from_date', from_date);
    data.append('to_date', to_date);

    return request.fetchFormData(path, data, 'POST');
  },
  makeAttendanceAlertUpdate: (
    id,
    details,
    reason,
    parent_id,
    from_date,
    to_date,
  ) => {
    let path = config.constant.api_endpoint.ATTENDANCE_ALERT;
    const data = new FormData();

    data.append('id', id);
    data.append('details', details);
    data.append('reason', reason);
    data.append('parent_id,', parent_id);
    data.append('from_date', from_date);
    data.append('to_date', to_date);

    return request.fetchFormData(path, data, 'POST');
  },
  getStudentsAttendanceByClass: (class_id, date) => {
    let path = `${config.constant.api_endpoint.STUDENTS_ATTENDANCE_BY_CLASS}?class_id=${class_id}&date=${date}`;
    return request.sendRequestGET(path);
  },

  getCalendarViewOfEventsOrSchedules: (
    from_date,
    to_date,
    centre_id,
    class_id,
    search_type,
    scfa,
    student_id,
  ) => {
    let path = `${config.constant.api_endpoint.CALENDAR_VIEW_OF_EVENTS_OR_SCHEDULES}?from_date=${from_date}&to_date=${to_date}&centre_id=${centre_id}&class_id=${class_id}&search_type=${search_type}&scfa=${scfa}`;
    if(student_id !== null && student_id !== undefined && student_id !== "")
      path += '&student_id='+ student_id;
    return request.sendRequestGET(path);
  },
  getMessagesBetweenUsers: (receiver, sender, size, isNext, nextUrl) => {
    let path = isNext
      ? nextUrl
      : `${config.constant.api_endpoint.COMMS}?receiver=${receiver}&sender=${sender}&size=${size}`;
    return request.sendRequestGET(path);
  },
  sendMessageBetweenUsers: (
    sender,
    receiver,
    img,
    message,
    room_id,
    video,
    thumbnail,
  ) => {
    let path = config.constant.api_endpoint.COMMS;
    const data = new FormData();
    data.append('sender', sender);
    data.append('receiver', receiver);

    if (img == '') {
      data.append('img', '');
    } else {
      var temp = img.uri;
      let tempArray = temp.split('/');
      var file = {
        uri: img.uri,
        type: img.mime,
        name: tempArray[tempArray.length - 1],
      };
      data.append('img', file);
    }

    if (video == '') {
      data.append('video', '');
    } else {
      data.append('video', config.constant.S3_KEYS.AWS_CLOUD_FRONT + video);
    }

    if (thumbnail == '') {
      data.append('video_thumbnail', '');
    } else {
      data.append(
        'video_thumbnail',
        config.constant.S3_KEYS.AWS_CLOUD_FRONT + thumbnail,
      );
    }

    data.append('message', message);
    data.append('room_id', room_id);
    return request.fetchFormData(path, data, 'POST');
  },
  getContactLists: (centre_id, class_id, user_id) => {
    let path = `${config.constant.api_endpoint.COMMS_CONTACT}?centre_id=${centre_id}&class_id=${class_id}&user_id=${user_id}`;
    console.log("COMMS CONTACT URL : GET ", path);
    return request.sendRequestGET(path);
  },
  getScheduleInfo: (id) => {
    let path = `${config.constant.api_endpoint.SCHEDULE_INFO}?id=${id}`;
    return request.sendRequestGET(path);
  },
  getScheduleItem: (id) => {
    let path = `${config.constant.api_endpoint.SCHEDULE_ITEM}?id=${id}`;
    return request.sendRequestGET(path);
  },
  getAllEvents: (class_id, from_date, to_date, parent_id) => {
    let path = '';
    class_id !== '' && parent_id !== ''
      ? (path = `${config.constant.api_endpoint.GET_EVENTS}?class_id=${class_id}&from_date=${from_date}&to_date=${to_date}&parent_id=${parent_id}`)
      : (path =
          class_id !== null || class_id !== ''
            ? `${config.constant.api_endpoint.GET_EVENTS}?class_id=${class_id}&from_date=${from_date}&to_date=${to_date}`
            : `${config.constant.api_endpoint.GET_EVENTS}?from_date=${from_date}&to_date=${to_date}`);
    return request.sendRequestGET(path);
  },
  getEventById: (id) => {
    let path = `${config.constant.api_endpoint.GET_EVENT_DATA}?id=${id}`;
    return request.sendRequestGET(path);
  },
  getEventPeopleDataById: (id) => {
    let path = `${config.constant.api_endpoint.PARENT_EVENT}?filtered_by=event_id&event_id=${id}`;
    return request.sendRequestGET(path);
  },
  getMerchandiseDataByType: (
    merchandise_type_id,
    size,
    merchandise_data_by_type_next_url,
  ) => {
    let path =
      merchandise_data_by_type_next_url === ''
        ? `${config.constant.api_endpoint.MERCHANDISE_BY_TYPE}?merchandise_type_id=${merchandise_type_id}&size=${size}&filter_out_of_stock=${1}`
        : merchandise_data_by_type_next_url;
    return request.sendRequestGET(path);
  },
  getAllMerchandiseData: (all_merchandise_data_next_url) => {
    // console.log(all_merchandise_data_next_url);
    const nexturl = all_merchandise_data_next_url.slice(
      1,
      all_merchandise_data_next_url.length,
    );
    let path =
      all_merchandise_data_next_url === ''
        ? `${config.constant.api_endpoint.MERCHANDISE_BY_TYPE}?filter_out_of_stock=1`
        : `${nexturl}`;
    return request.sendRequestGET(path);
  },
  getMerchandiseDetails: (id) => {
    let path = `${config.constant.api_endpoint.GET_MERCHANDISE_DETAILS}?id=${id}`;
    return request.sendRequestGET(path);
  },
  getAllNewsFeeds: (page, pagesize) => {
    let path = `${config.constant.api_endpoint.GET_ALL_NEWFEEDS}`;
    if (page !== null || page !== undefined) {
      path = path + `?page=${page}`;
      if (pagesize !== null || pagesize !== undefined) {
        path = path + `&pagesize=${pagesize}`;
      }
    }
    return request.sendRequestGET(path);
  },
  getDeliveredMerchandiseData:(
    start_date,
    end_date,
    size,
    merchandise_type_id,
    class_id,
    status,
    next_url,
  )=>{
    let path = '';
    if (next_url == '') {
      path = `${config.constant.api_endpoint.GET_ORDERED_MERCHANDISE_INFO}?start_date=${start_date}&end_date=${end_date}`;
      if (size !== undefined) {
        path += `&size=${size}`;
      }
      if (merchandise_type_id !== undefined) {
        path += `&merchandise_type_id=${merchandise_type_id}`;
      }
      if (class_id !== undefined) {
        path += `&class_id=${class_id}`;
      }
      if(status !== undefined){
        path += `&status=${status}`;
      }
    } else {
      path = next_url;
    }
    return request.sendRequestGET(path);
  },
  getOrderedMerchandiseData: (
    start_date,
    end_date,
    size,
    merchandise_type_id,
    class_id,
    status,
    next_url,
  ) => {
    let path = '';
    if (next_url == '') {
      path = `${config.constant.api_endpoint.GET_ORDERED_MERCHANDISE_INFO}?start_date=${start_date}&end_date=${end_date}`;
      if (size !== undefined) {
        path += `&size=${size}`;
      }
      if (merchandise_type_id !== undefined) {
        path += `&merchandise_type_id=${merchandise_type_id}`;
      }
      if (class_id !== undefined) {
        path += `&class_id=${class_id}`;
      }
      if(status !== undefined){
        path += `&status=${status}`;
      }
    } else {
      path = next_url;
    }
    console.log('Get Ordered Merchandise Data URL : '+ path);
    return request.sendRequestGET(path);
  },

  // post method, update order status by facilitator
  postOrderedMerchandiseStatus: (id, updated_by, order_details_id, status = "") => {
    let path = `${config.constant.api_endpoint.GET_ORDERED_MERCHANDISE_INFO}`;
    const data = new FormData();
    data.append('id', id);
    data.append('updated_by', updated_by);
    data.append('order_details_id', JSON.stringify(order_details_id));
    if(status != "") {
      data.append(status, 1);
    }
    return request.fetchFormData(path, data, 'POST');
  },

  submitOrderMerchandise:(ordered_by,items,centre_id,class_id)=>{
    let path = `${config.constant.api_endpoint.GET_ORDERED_MERCHANDISE_INFO}`;
    const data = new FormData();
    data.append('ordered_by', ordered_by);
    data.append('items', JSON.stringify(items));
    data.append('centre_id',centre_id);
    data.append('class_id',class_id);

    return request.fetchFormData(path, data, 'POST');
  },

  // post method, order new merchandise by parent
  postOrderMerchandise: (ordered_by, items) => {
    let path = `${config.constant.api_endpoint.GET_ORDERED_MERCHANDISE_INFO}`;
    const data = new FormData();
    data.append('ordered_by', ordered_by);
    data.append('items', JSON.stringify(items));

    return request.fetchFormData(path, data, 'POST');
  },
  getTranslate: (target, value) => {
    let path = `${config.constant.TRANSLATE_API}`;
    let header = {
      'Content-Type': 'multipart/form-data',
    };
    const data = new FormData();
    data.append(
      'key',
      Platform.OS == 'android'
        ? config.constant.ANDROID_TRANSLATE_KEY
        : config.constant.IOS_TRANSLATE_API_KEY,
    );
    data.append('target', target);
    data.append('q', value);

    return request.fetchFormDataCust(path, data, header, 'POST');
  },
  getStudentAttendDetails: (class_id, date, parent_id) => {
    let path = `${config.constant.api_endpoint.STUDENT_ATTENDANCE_DETAILS}?class_id=${class_id}&date=${date}&parent_id=${parent_id}`;
    return request.sendRequestGET(path);
  },
  setStudentAttendDetails: (
    facilitator_id,
    student_id,
    details,
    centre_id,
    class_id,
  ) => {
    let path = `${config.constant.api_endpoint.STUDENT_ATTENDANCE_DETAILS}`;

    const data = new FormData();
    data.append('facilitator_id', facilitator_id);
    data.append('student_id', student_id);
    data.append('details', details);
    data.append('centre_id', centre_id);
    data.append('class_id', class_id);

    return request.fetchFormData(path, data, 'POST');
  },
  setStudentAttendDetailsUpdate: (id, details) => {
    let path = `${config.constant.api_endpoint.STUDENT_ATTENDANCE_DETAILS}`;

    const data = new FormData();
    data.append('id', id);
    data.append('details', details);

    return request.fetchFormData(path, data, 'POST');
  },
  readNotification: (notification_id, id, role) => {
    let path = `${config.constant.api_endpoint.READ_NOTIFICATION}`;

    const data = new FormData();
    data.append('notification_id', JSON.stringify(notification_id));
    data.append('id', id);
    data.append('role', role);

    return request.fetchFormData(path, data, 'POST');
  },
  getRoomList: (sender) => {
    let path = `${config.constant.api_endpoint.COMMS_ROOMS}?sender=${sender}`;
    return request.sendRequestGET(path);
  },
  deleteRoom: (roomID) => {
    let path = config.constant.api_endpoint.COMMS_ROOMS;
    let formData = new FormData();
    formData.append('room_id', roomID);

    return request.fetchFormData(path, formData, 'DELETE');
  },
  
  // getFutureAttendanceDetail: (start_date, end_date, student_id) => {
  //   let path = `${config.constant.api_endpoint.STUDENT_FUTURE_ATTENDANCE_DETAIL}?start_date=${start_date}&end_date=${end_date}&student_id=${student_id}`;
  //   return request.sendRequestGET(path);
  // },
  getFutureAttendanceDetail: (class_id, date, student_id) => {
    let path = `${config.constant.api_endpoint.STUDENT_FUTURE_ATTENDANCE_ALERT_DETAIL}?class_id=${class_id}&date=${date}&student_id=${student_id}`;
    return request.sendRequestGET(path);
  },
  getOrderedListForParents: (user_id, status, size, ordered_next_url) => {
    let path = '';
    if (ordered_next_url != '') {
      path = ordered_next_url;
    } else {
      path = `${config.constant.api_endpoint.GET_ORDER_LIST_FOR_PARENTS}?user_id=${user_id}`;
      if (status != '') {
        path = path + `&status=${status}`;
      }
      if (size != '') {
        path = path + `&size=${size}`;
      }
    }

    return request.sendRequestGET(path);
  },
  setParentEventRegister: (event_id, parent_id,status) => {
    let path = `${config.constant.api_endpoint.PARENT_EVENT}`;

    const data = new FormData();
    data.append('event_id', event_id);
    data.append('parent_id', parent_id);
    data.append('status',status);

    return request.fetchFormData(path, data, 'POST');
  },
  setParentEventRegisterUpdate: (id, status) => {
    //let path = `${config.constant.api_endpoint.PARENT_EVENT}?id=${id}`;
    let path = `${config.constant.api_endpoint.PARENT_EVENT}`;

    const data = new FormData();
    data.append('status', status);
    data.append('id', id);

    return request.fetchFormData(path, data, 'POST');
  },
  fetchAllParentEventById: (filtered_by, parent_id) => {
    let path = `${config.constant.api_endpoint.PARENT_EVENT}?filtered_by=${filtered_by}&parent_id=${parent_id}`;
    return request.sendRequestGET(path);
  },
  fetchAbsenceTypeList: () => {},
  postNewsFeed: (
    title,
    description,
    facilitator_id,
    img_url,
    video_url,
    thumbnail_url,
  ) => {
    let path = `${config.constant.api_endpoint.POST_NEWSFEED}`;
    var file = null;
    if (img_url != null) {
      var temp = img_url.uri;
      let tempArray = temp.split('/');
      file = {
        uri: img_url.uri,
        type: img_url.mime,
        name: tempArray[tempArray.length - 1],
      };
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('facilitator_id', facilitator_id);

    if (file != null) formData.append('img_url', file);

    if (video_url != null)
      formData.append(
        'video_url',
        config.constant.S3_KEYS.AWS_CLOUD_FRONT + video_url,
      );

    if (thumbnail_url != null) formData.append('thumbnail_url', thumbnail_url);

    return request.fetchFormData(path, formData, 'POST');
  },
  fetchAttendanceAlertByClassId: (class_id, date) => {
    let path = `${config.constant.api_endpoint.STUDENTS_ATTENDANCE_BY_CLASS}?class_id=${class_id}&date=${date}`;
    return request.sendRequestGET(path);
  },
  fetchHolidaysDate: (month, date) => {
    let path = `${config.constant.api_endpoint.HOLIDAY}`;
    if (month != null) {
      path = path + `?this_month=${month}`;
      if (date != null) {
        path = path + `&date=${date}`;
      }
    } else {
      if (date != null) {
        path = path + `?date=${date}`;
      }
    }
    return request.sendRequestGET(path);
  },
  postNotifyMultipleParents: (sender, receiver) => {
    let path = `${config.constant.api_endpoint.COMMS_PARENT_MULTIPLE}`;
    const data = new FormData();
    data.append('sender', sender);
    data.append('receiver', JSON.stringify(receiver));

    return request.fetchFormData(path, data, 'POST');
  },
  getHoliday: (this_month, month) => {
    let path = `${config.constant.api_endpoint.HOLIDAY}`;
    if (this_month !== '') {
      path = path + `?this_month=${this_month}`;
    } else if (month !== '') {
      path = path + `?date=${month}`;
    }
    return request.sendRequestGET(path);
  },
  getSchedulecolors: () => {
    let path = `${config.constant.api_endpoint.SCHEDULE_COLORS}`;
    return request.sendRequestGET(path);
  },
  checkNotificationHasRead: (user_id, role) => {
    let path = `${config.constant.api_endpoint.CHECK_IS_ALL_READ}/?id=${user_id}&role=${role}`;
    return request.sendRequestGET(path);
  },
  hideNotificationItems: (notification_id, id, role) => {
    let path = `${config.constant.api_endpoint.HIDE_NOTIFICATION}`;
    const formData = new FormData();
    formData.append('id', id);
    formData.append('role', role);
    formData.append('notification_id', notification_id);

    return request.fetchFormData(path, formData, 'POST');
  },
  postform: (
    form_id,
    form_settings,
    submitted_by,
    submitted_by_role,
    class_id,
    centre_id,
    is_submitted,
  ) => {
    let path = config.constant.api_endpoint.DIGITAL_FORMS;
    const data = new FormData();
    if (is_submitted == true) {
      data.append('id', form_id);
    } else {
      data.append('form_id', form_id);
    }
    data.append('form_settings', form_settings);
    data.append('submitted_by', submitted_by);
    data.append('submitted_by_role', submitted_by_role);
    data.append('class_id', class_id);
    data.append('centre_id', centre_id);

    return request.fetchFormData(path, data, 'POST');
  },
  getDigitalForms: (status, class_id, user_id, user_role, valid_from_date, valid_to_date, size, next, isNext) => {
    let path =
      next === ''
        ? `${config.constant.api_endpoint.DIGITAL_FORMS}?status=${status}&class_id=${class_id}&user_id=${user_id}&user_role=${user_role}&valid_from_date=${valid_from_date}&valid_to_date=${valid_to_date}&size=${size}`
        //? `${config.constant.api_endpoint.DIGITAL_FORMS}?user_id=${user_id}&user_role=${user_role}&size=${size}`
        : next;
    return request.sendRequestGET(path);
  },
  readCommsMessage: (room_id, user_id) => {
    let path = config.constant.api_endpoint.READ_COMMS_MESSAGE;
    let formData = new FormData();
    formData.append('room_id', room_id);
    formData.append('user_id', user_id);

    return request.fetchFormData(path, formData, 'POST');
  },
  getAllEventsForDotsCalendar:(from_date,to_date,filtered_by,reg_status) => {
    let path = `${config.constant.api_endpoint.GET_EVENTS}?from_date=${from_date}&to_date=${to_date}&filtered_by=${filtered_by}&reg_status=${reg_status}`;
    return request.sendRequestGET(path);
  },
  getAllAttendanceForDotsCalendar:(student_id,start_date,end_date)=>{
    let path = `${config.constant.api_endpoint.ATTENDANCE_CALENDARS}?student_id=${student_id}&start_date=${start_date}&end_date=${end_date}`;
    return request.sendRequestGET(path);
  },
  getAttendanceDetailsOfStudent:(class_id,date,student_id) => {
    let path = `${config.constant.api_endpoint.ATTENDANCE_ALERT}?class_id=${class_id}&date=${date}&student_id=${student_id}`;
    return request.sendRequestGET(path);
  },
  getAttendanceForCalendarByClass:(class_id,start_date,end_date) =>{
    let path = `${config.constant.api_endpoint.ATTENDANCE_RECORDS_BY_CLASS}?class_id=${class_id}&start_date=${start_date}&end_date=${end_date}`;
    return request.sendRequestGET(path);
  },
  getAllDataEventAttended:(filtered_by,event_id)=>{
    let path = `${config.constant.api_endpoint.PARENT_EVENT}?filtered_by=${filtered_by}&event_id=${event_id}`;
    return request.sendRequestGET(path);
  },
  getNoteDataForFacilitator:(class_id,date, parent_id, facilitator_id)=>{
    let path = `${configs.constant.api_endpoint.STUDENT_ATTENDANCE_DETAILS}/?class_id=${class_id}&date=${date}`;
    if(parent_id != undefined && parent_id != null && parent_id != ''){
      path = path + "&parent_id="+ parent_id;
    }
    if(facilitator_id != undefined && facilitator_id != null && facilitator_id != ''){
      path = path + "&facilitator_id="+ facilitator_id;
    }
    return request.sendRequestGET(path);
  },
  getRoomIdBetweenUsers:(receiver,sender,size,)=>{
    let path = `${config.constant.api_endpoint.COMMS}?receiver=${receiver}&sender=${sender}&size=${size}`;
    return request.sendRequestGET(path);
  },
  getEventUnregisteredParentsData:(event_id)=>{
    let path = `${configs.constant.api_endpoint.EVENT_UNREGISTERED_PARENT}?event_id=${event_id}`;
    return request.sendRequestGET(path);
  },
  fetchFormDetailsData:(id,size,user_id) =>{
    let path = `${config.constant.api_endpoint.FORM_DETAILS}?id=${id}`;
    if(size != null && size != "" && size != 0 && size != undefined){
      path += "&size="+size;
    }
    if( user_id != undefined && user_id != {} && user_id != ""){
      path += "&user_id="+user_id;
    }
    return request.sendRequestGET(path);
  },
  onDeleteNewsfeed:(id,facilitator_id,) => {
    let path = `${config.constant.api_endpoint.POST_NEWSFEED}`;
    let data = new FormData();
    data.append("id",id);
    data.append("facilitator_id",facilitator_id);
    return request.fetchFormData(path,data,'DELETE');

  },
  fetchScheduleTypes:() =>{
    let path = config.constant.api_endpoint.SCHEDULE_TYPES;
    return request.sendRequestGET(path);
  },
  fetchDashboardCarousel:(class_id) =>{
    let path = `${config.constant.api_endpoint.DASHBOARD_CAROUSEL}?class_id=${class_id}`;
    return request.sendRequestGET(path);
  },
};

export default homeDataServices;
