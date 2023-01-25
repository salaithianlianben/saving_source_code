import homeActionTypes from './action_types/homeActionTypes';

const {
  MAINTENANCE_MODE,
  SAVE_SELECTED_CLASS,
  FETCH_ALL_NOTIFICATION,
  FETCH_ATTENDANCE_CALENDAR_STUDENT,
  FETCH_MERCHANDISE_TYPE,
  MAKE_ATTENDANT_ALERT,
  FETCH_LEAVE_TYPE,
  FETCH_STUDENT_ATTENDANCE_BY_CLASS,
  FETCH_CALENDAR_VIEW_OF_EVENTS_OR_SCHEDULES,
  GET_MESSAGES_BETWEEN_USERS,
  SEND_MESSAGES_BETWEEN_USERS,
  UPDATE_ORDERED_MERCHANDISE_DATA_IS_SELECT,
  FETCH_CONTACT_LIST,
  FETCH_SCHEDULE_INFO,
  FETCH_SCHEDULE_ITEM,
  CLEAR_MERCHANDISE_DETAILS_DATA,
  FETCH_ALL_EVENTS,
  FETCH_EVENT_DATA,
  SET_EVENT_PEOPLE_DATA,
  FETCH_EVENT_PEOPLE_DATA,
  FETCH_STUDENT_ATTENDANCE_DETAILS,
  MAKE_STUDENT_ATTENDANCE_DETAILS_UPDATE,
  MAKE_STUDENT_ATTENDANCE_DETAILS,
  GET_TRANSLATE,
  CHANGE_SUCCESSFUL_NEWSFEED,
  SET_TRANSLATE,
  MAKE_NOTIFICATION_READ,
  FETCH_MERCHANDISE_DATA,
  FETCH_ALL_MERCHANDISE_DATA,
  FETCH_MERCHANDISE_DETAILS,
  ADD_TO_CART,
  SET_DATA,
  GET_ROOM_LIST,
  DELETE_ROOM,
  FETCH_ALL_NEWSFEEDS,
  FOUND_NEW_POST,
  FETCH_ORDERED_MERCHANDISE_DATA,
  CHANGE_ORDERED_MERCHANDISE_STATUS,
  ORDER_MERCHANDISE,
  FETCH_FUTURE_ATTENDANCE_DETAIL,
  MAKE_ATTENDANT_ALERT_UPDATE,
  GET_ORDERED_LIST_FOR_PARENTS,
  MAKE_PARENT_EVENT_REGISTER,
  MAKE_PARENT_EVENT_REGISTER_UPDATE,
  FETCH_ALL_REGISTER_PARENTID_EVENT,
  POST_NEWSFEED,
  FETCH_ATTENDANCE_ALERT,
  FETCH_HOLIDAYS_DATE,
  MAKE_MULTIPLE_PARENT_MESSAGES,
  FETCH_STUDENT_ATTENDANCE_BY_CLASS_SUCCESS,
  FETCH_HOLIDAY,
  FETCH_SCHEDULE_COLORS,
  CHECK_NOTIFICATION_IS_READ,
  HIDE_NOTIFICATION_ITEM,
  CHAT_MESSAGE_BETWEEN_USERS,
  UPDATE_MERCHANDISE_DATA_ORDERED_DELIVERED,
  SET_SCREEN_OPENING,
  SET_INITIALIZING,
  FETCH_DIGITAL_FORMS,
  POST_FORMS,
  UPLOAD_S3,
  UPLOAD_S3_FAIL,
  READ_COMMS_MESSAGE,
  SET_COUNT_OF_CART_ITEMS,
  SET_SELECTED_DATE,
  RESET_EVENT_PEOPLE,
  FETCH_ATTENDANCE_CALENDAR,
  FETCH_ALL_EVENTS_FOR_DOTS,
  FETCH_ALL_ATTENDANCE_FOR_DOTS,
  GET_ATTENDANCE_DETAILS_OF_STUDENT,
  FETCH_ATTENDANCE_FOR_DOTS_BY_CLASS,
  FETCH_ALL_DATA_ATTENDED_BY_EVENT,
  FETCH_NOTE_DATA,
  GET_ROOM_ID_BETWEEN_USERS,
  GET_UNREGISTERED_PARENT_BY_EVENT,
  SET_TRANSLATE_MESSAGES,
  GET_FORM_DETAILS_DATA,
  DELETE_NEWSFEED,
  GET_DELIVERED_MERCHANDISE_DATA,
  SUBMIT_ORDER_MERCHANDISE,
  GET_SCHEDULE_TYPES,
  FETCH_DASHBOARD_CAROUSEL,

} = homeActionTypes;

const homeAction = {
  saveMaintenanceMode: (value) => {
    return {
      type: MAINTENANCE_MODE,
      value,
    };
  },
  saveSelectedClass: (value) => {
    return {
      type: SAVE_SELECTED_CLASS,
      value,
    };
  },
  fetchAllNotification: (
    userId,
    role,
    size = 10,
    next,
    isNext,
    handleCallback,
  ) => {
    return {
      type: FETCH_ALL_NOTIFICATION,
      userId,
      role,
      size,
      next,
      isNext,
      handleCallback,
    };
  },
  fetchAttendanceCalendarByStudent: (
    student_id,
    start_date,
    end_date,
    handleCallback,
    from_month,
    to_month,
  ) => {
    return {
      type: FETCH_ATTENDANCE_CALENDAR_STUDENT,
      student_id,
      start_date,
      end_date,
      handleCallback,
      from_month,
      to_month,
    };
  },
  fetchMerchandiseType: () => {
    return {
      type: FETCH_MERCHANDISE_TYPE,
    };
  },
  fetchLeaveType: (handleCallback) => {
    return {
      type: FETCH_LEAVE_TYPE,
      handleCallback,
    };
  },
  fetchEventPeopleById: (id) => {
    return {
      type: FETCH_EVENT_PEOPLE_DATA,
      id,
    };
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
    handleCallback,
  ) => {
    return {
      type: MAKE_ATTENDANT_ALERT,
      student_id,
      class_id,
      centre_id,
      reason,
      details,
      parent_id,
      from_date,
      to_date,
      handleCallback,
    };
  },
  makeAttendanceAlertUpdate: (
    id,
    details,
    reason,
    parent_id,
    from_date,
    to_date,
    handleCallBack,
  ) => {
    return {
      type: MAKE_ATTENDANT_ALERT_UPDATE,
      id,
      details,
      reason,
      parent_id,
      from_date,
      to_date,
      handleCallBack,
    };
  },
  fetchStudentAttendanceByClass: (class_id, date, handleCallback) => {
    return {
      type: FETCH_STUDENT_ATTENDANCE_BY_CLASS,
      class_id,
      date,
      handleCallback,
    };
  },
  fetchCalendarViewOfEventsOrSchedule: (
    from_date,
    to_date,
    centre_id,
    class_id,
    search_type,
    scfa,
    student_id,
  ) => {
    return {
      type: FETCH_CALENDAR_VIEW_OF_EVENTS_OR_SCHEDULES,
      from_date,
      to_date,
      centre_id,
      class_id,
      search_type,
      scfa,
      student_id,
    };
  },
  fetchMessageBetweenUsers: (
    receiver,
    sender,
    size,
    isNext,
    isLoading,
    nextUrl,
    handleCallback,
  ) => {
    return {
      type: GET_MESSAGES_BETWEEN_USERS,
      receiver,
      sender,
      size,
      isNext,
      isLoading,
      nextUrl,
      handleCallback,
    };
  },
  sendMessageBetweenUsers: (
    sender,
    receiver,
    img,
    message,
    room_id,
    video,
    thumbnail,
    id,
    handleCallback,
  ) => {
    return {
      type: SEND_MESSAGES_BETWEEN_USERS,
      sender,
      receiver,
      img,
      message,
      room_id,
      video,
      thumbnail,
      id,
      handleCallback,
    };
  },
  getRoomList: (sender,handleCallback) => {
    return {
      type: GET_ROOM_LIST,
      sender,handleCallback
    };
  },

  deleteRoom: (roomID,handleCallback) => {
    return {
      type: DELETE_ROOM,
      roomID,handleCallback
    };
  },

  fetchContactList: (centre_id, class_id, user_id) => {
    return {
      type: FETCH_CONTACT_LIST,
      centre_id,
      class_id,
      user_id,
    };
  },
  fetchScheduleInfo: (id) => {
    return {
      type: FETCH_SCHEDULE_INFO,
      id,
    };
  },
  fetchScheduleItem: (id) => {
    return {
      type: FETCH_SCHEDULE_ITEM,
      id,
    };
  },
  fetchAllEvents: (class_id, from_date, to_date, parent_id, handleCallback) => {
    return {
      type: FETCH_ALL_EVENTS,
      class_id,
      from_date,
      to_date,
      parent_id,
      handleCallback,
    };
  },
  fetchEventById: (id, handleCallback) => {
    return {
      type: FETCH_EVENT_DATA,
      id,
      handleCallback,
    };
  },
  fetchNoteDataForAttendance: (class_id, date, parent_id, facilitator_id, handleCallback) => {
    return {
      type: FETCH_NOTE_DATA,
      class_id,
      date,
      parent_id,
      facilitator_id,
      handleCallback,
    };
  },
  setStudentAttendDetails: (
    facilitator_id,
    student_id,
    details,
    centre_id,
    class_id,
    handleCallback,
  ) => {
    return {
      type: MAKE_STUDENT_ATTENDANCE_DETAILS,
      facilitator_id,
      student_id,
      details,
      centre_id,
      class_id,
      handleCallback,
    };
  },
  setStudentAttendDetailsUpdate: (id, details, handleCallback) => {
    return {
      type: MAKE_STUDENT_ATTENDANCE_DETAILS_UPDATE,
      id,
      details,
      handleCallback,
    };
  },
  getTranslate: (id, target, text, handleCallback) => {
    return {
      type: GET_TRANSLATE,
      id,
      target,
      text,
      handleCallback,
    };
  },
  setTranslate: (id, value) => {
    return {
      type: SET_TRANSLATE,
      id,
      value,
    };
  },
  readNotification: (notification_id, id, role) => {
    return {
      type: MAKE_NOTIFICATION_READ,
      notification_id,
      id,
      role,
    };
  },
  fetchMerchandiseDataByType: (
    merchandise_type_id,
    size,
    merchandise_data_by_type_next_url,
    isNext,
    handleCallback,
  ) => {
    return {
      type: FETCH_MERCHANDISE_DATA,
      merchandise_type_id,
      size,
      merchandise_data_by_type_next_url,
      isNext,
      handleCallback,
    };
  },
  fetchAllMerchandiseData: (
    isNext,
    all_merchandise_data_next_url,
    handleCallback,
  ) => {
    return {
      type: FETCH_ALL_MERCHANDISE_DATA,
      isNext,
      all_merchandise_data_next_url,
      handleCallback,
    };
  },
  fetchMerchandiseDetails: (id) => {
    return {
      type: FETCH_MERCHANDISE_DETAILS,
      id,
    };
  },
  addToCart: (carts) => {
    return {
      type: ADD_TO_CART,
      data: carts,
    };
  },
  setData: (temp) => {
    return {
      type: SET_DATA,
      data: temp,
    };
  },
  getAllNewsfeeds: (page, pagesize, checkNewPost, handleCallback) => {
    return {
      type: FETCH_ALL_NEWSFEEDS,
      page: page,
      pagesize: pagesize,
      checkNewPost,
      handleCallback: handleCallback,
    };
  },
  foundNewPostForNew: (value) => {
    return {
      type: FOUND_NEW_POST,
      value,
    };
  },
  getOrderedMerchandiseData: (
    start_date,
    end_date,
    size,
    merchandise_type_id,
    class_id,
    status,
    isNext,
    next_url,
    handleCallback,
  ) => {
    return {
      type: FETCH_ORDERED_MERCHANDISE_DATA,
      start_date,
      end_date,
      size,
      merchandise_type_id,
      class_id,
      status,
      isNext,
      next_url,
      handleCallback,
    };
  },
  getDeliveredMerchandiseData: (
    start_date,
    end_date,
    size,
    merchandise_type_id,
    class_id,
    status,
    isNext,
    next_url,
    handleCallback,
  ) => {
    return {
      type: GET_DELIVERED_MERCHANDISE_DATA,
      start_date,
      end_date,
      size,
      merchandise_type_id,
      class_id,
      status,
      isNext,
      next_url,
      handleCallback,
    };
  },
  postOrderedMerchandiseStatus: (id, updated_by, order_details_id, status, handleCallback) => {
    return {
      type: CHANGE_ORDERED_MERCHANDISE_STATUS,
      id,
      updated_by,
      order_details_id,
      status,
      handleCallback
    };
  },
  postOrderMerchandise: (ordered_by, items, selected_Payment, currency_code, payment_mode, parent_id, total_amount, minimum, sub_total, tax_total, itemsPayment, handleMerchandisePayment) => {
    return {
      type: ORDER_MERCHANDISE,
      ordered_by,
      items,
      selected_Payment, currency_code, payment_mode, parent_id, total_amount, minimum, sub_total, tax_total, itemsPayment, handleMerchandisePayment
    };
  },
  clearFetchMerchandiseDetailsData: () => {
    return {
      type: CLEAR_MERCHANDISE_DETAILS_DATA,
    };
  },
  updateOrderedMerchandiseDataIsSelect: (data,status) => {
    return {
      type: UPDATE_ORDERED_MERCHANDISE_DATA_IS_SELECT,
      data,status,
    };
  },
  fetchFutureAttendanceDetail: (class_id, date, student_id) => {
    return {
      type: FETCH_FUTURE_ATTENDANCE_DETAIL,
      class_id,
      date,
      student_id,
    };
  },
  getOrderedListForParents: (
    user_id,
    status,
    size,
    isNext,
    ordered_next_url,
    handleCallback,
  ) => {
    return {
      type: GET_ORDERED_LIST_FOR_PARENTS,
      user_id,
      status,
      size,
      isNext,
      ordered_next_url,
      handleCallback,
    };
  },
  setParentEventRegister: (event_id, parent_id,status, handleCallback) => {
    return {
      type: MAKE_PARENT_EVENT_REGISTER,
      event_id,
      parent_id,
      status,
      handleCallback,
    };
  },
  setParentEventRegisterUpdate: (id, status, handleCallback) => {
    return {
      type: MAKE_PARENT_EVENT_REGISTER_UPDATE,
      id,
      status,
      handleCallback,
    };
  },
  fetchRegisterParentEventById: (filtered_by, parent_id) => {
    return {
      type: FETCH_ALL_REGISTER_PARENTID_EVENT,
      filtered_by,
      parent_id,
    };
  },
  postNewsfeed: (
    title,
    description,
    facilitator_id,
    img_url,
    video_url,
    thumbnail_url,
    handleCallback
  ) => {
    return {
      type: POST_NEWSFEED,
      title,
      description,
      facilitator_id,
      img_url,
      video_url,
      thumbnail_url,
      handleCallback
    };
  },
  fetchAttendanceAlert: (class_id, date,handleCallback) => {
    return {
      type: FETCH_ATTENDANCE_ALERT,
      class_id,
      date,
      handleCallback
    };
  },
  fetchHolidaysDate: (month, date) => {
    return {
      type: FETCH_HOLIDAYS_DATE,
      month,
      date,
    };
  },
  resetEventPeople: () => {
    return {
      type: RESET_EVENT_PEOPLE,
    };
  },
  setMultipleParentMessages: (sender, receiver, handleCallback) => {
    return {
      type: MAKE_MULTIPLE_PARENT_MESSAGES,
      sender,
      receiver,
      handleCallback,
    };
  },
  setStudentAttendanceByClassUpdate: (data) => {
    return {
      type: FETCH_STUDENT_ATTENDANCE_BY_CLASS_SUCCESS,
      data: data,
    };
  },
  getHoliday: (this_month, month, handleCallback) => {
    return {
      type: FETCH_HOLIDAY,
      this_month,
      month,
      handleCallback,
    };
  },
  getScheduleColors: () => {
    return {
      type: FETCH_SCHEDULE_COLORS,
    };
  },
  setChangeisSuccesfuleNewFeed: () => {
    return {
      type: CHANGE_SUCCESSFUL_NEWSFEED,
    };
  },
  checkNotificationIsRead: (user_id, role) => {
    return {
      type: CHECK_NOTIFICATION_IS_READ,
      user_id,
      role,
    };
  },
  hideNotificationItem: (notification_id, id, role) => {
    return {
      type: HIDE_NOTIFICATION_ITEM,
      notification_id,
      id,
      role,
    };
  },
  chatMessageBetweenUsers: (data) => {
    return {
      type: CHAT_MESSAGE_BETWEEN_USERS,
      data,
    };
  },
  setScreenIsOpening: (isOpening) => {
    return {
      type: SET_SCREEN_OPENING,
      isOpening,
    };
  },
  setInitializing: (value) => {
    return {
      type: SET_INITIALIZING,
      value,
    };
  },
  fetchDigitalForms: (
    status,
    class_id,
    user_id,
    user_role,
    valid_from_date,
    valid_to_date,
    size,
    next,
    isNext,
    handleCallback,
  ) => {
    return {
      type: FETCH_DIGITAL_FORMS,
      status,
      class_id,
      user_id,
      user_role,
      valid_from_date,
      valid_to_date,
      size,
      next,
      isNext,
      handleCallback,
    };
  },
  postDigitalForms: (
    form_id,
    form_settings,
    submitted_by,
    submitted_by_role,
    class_id,
    centre_id,
    handleCallback,
    is_submitted,
  ) => {
    return {
      type: POST_FORMS,
      form_id,
      form_settings,
      submitted_by,
      submitted_by_role,
      class_id,
      centre_id,
      handleCallback,
      is_submitted,
    };
  },
  uploadS3: () => {
    return {
      type: UPLOAD_S3,
    };
  },
  uploadS3Fail: () => {
    return {
      type: UPLOAD_S3_FAIL,
    };
  },
  readCommsAllMessage: (room_id, sender) => {
    return {
      type: READ_COMMS_MESSAGE,
      room_id,
      sender,
    };
  },
  setCountOfCartItems: (value) => {
    return {
      type: SET_COUNT_OF_CART_ITEMS,
      value,
    };
  },
  setSelectedDate: (date) => {
    return {
      type: SET_SELECTED_DATE,
      date,
    };
  },
  clearEventPeopleData: () => {
    return {
      type: SET_EVENT_PEOPLE_DATA,
    };
  },
  fetchAllEventsForDots:(from_date,to_date,filtered_by,reg_status)=>{
    return {
      type:FETCH_ALL_EVENTS_FOR_DOTS,
      from_date,to_date,filtered_by,reg_status
    }
  },
  fetchAllAttendanceForDotsCalendar:(student_id,start_date,end_date,handleCallback)=>{
    return {
      type:FETCH_ALL_ATTENDANCE_FOR_DOTS,
      student_id,start_date,end_date,handleCallback
    }
  },
  getAttendanceDetailsOfStudent:(class_id,date,student_id,handleCallback)=>{
    return {
      type:GET_ATTENDANCE_DETAILS_OF_STUDENT,
      class_id,date,student_id,handleCallback
    }
  },
  fetchAttendanceForDotsByClass:(class_id,start_date,end_date,handleCallback)=>{
    return {
      type:FETCH_ATTENDANCE_FOR_DOTS_BY_CLASS,
      class_id,start_date,end_date,handleCallback,
    }
  },
  fetchAllDataAttendedByEvent:(filtered_by,event_id,handleCallback)=>{
    return {
      type : FETCH_ALL_DATA_ATTENDED_BY_EVENT,
      filtered_by,event_id,handleCallback
    }
  },
  getRoomIdBetweenUsers:(receiver,sender,size,handleCallback)=>{
    return {
      type:GET_ROOM_ID_BETWEEN_USERS,
      receiver,sender,size,handleCallback
    }
  },
  getUnregisteredParentByEvent:(event_id,handleCallback) =>{
    return {
      type:GET_UNREGISTERED_PARENT_BY_EVENT,
      event_id,handleCallback
    }
  },
  setTraslateMessages:(id,target,text,handleCallback) =>{
    return {
      type:SET_TRANSLATE_MESSAGES,
      id,target,text,handleCallback
    }
  },
  getFormDetailsData:(id,size,user_id,handleCallback) => {
    return {
      type:GET_FORM_DETAILS_DATA,
      id,size,user_id,handleCallback,
    }
  },
  onDeleteNewsFeed:(id,facilitator_id,handleCallback)=>{
    return {
      type:DELETE_NEWSFEED,
      id,facilitator_id,handleCallback
    }
  },
  updateMerchandiseDataOrderedDelivered:(data)=>{
    return {
      type:UPDATE_MERCHANDISE_DATA_ORDERED_DELIVERED,
      data,
    }
  },
  submitOrderMerchandise:(ordered_by, items, centre_id, class_id, handleCallback)=>{
    return {
      type:SUBMIT_ORDER_MERCHANDISE,
      ordered_by, items, centre_id, class_id, handleCallback
    }
  },
  getScheduleTypes:()=>{
    return {
      type:GET_SCHEDULE_TYPES,
    }
  },
  fetchDashboardCarousel:(class_id, handleCallback)=>{
    return {
      type: FETCH_DASHBOARD_CAROUSEL,
      class_id,
      handleCallback
    }
  }
};

export default homeAction;
