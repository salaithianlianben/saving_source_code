import homeActionTypes from '../actions/action_types/homeActionTypes';
import AsyncStorage from '@react-native-community/async-storage';
import configs from '../utils/configs';
import moment from 'moment';
import { bool } from 'prop-types';

const {
  MAINTENANCE_MODE,
  SAVE_SELECTED_CLASS,

  FETCH_ATTENDANCE_CALENDAR_STUDENT,
  FETCH_ATTENDANCE_CALENDAR_STUDENT_SUCCESS,
  FETCH_ATTENDANCE_CALENDAR_STUDENT_FAIL,

  FETCH_ATTENDANCE_CALENDAR,
  FETCH_ATTENDANCE_CALENDAR_SUCCESS,
  FETCH_ATTENDANCE_CALENDAR_FAIL,

  FETCH_EVENT_PEOPLE_DATA,
  FETCH_EVENT_PEOPLE_DATA_FAIL,
  FETCH_EVENT_PEOPLE_DATA_SUCCESS,

  SET_INITIALIZING,

  SET_SCREEN_OPENING,

  FETCH_ALL_NOTIFICATION,
  FETCH_ALL_NOTIFICATION_FAIL,
  FETCH_ALL_NOTIFICATION_SUCCESS,

  UPDATE_ORDERED_MERCHANDISE_DATA_IS_SELECT,

  FETCH_MERCHANDISE_TYPE,
  FETCH_MERCHANDISE_TYPE_FAIL,
  FETCH_MERCHANDISE_TYPE_SUCCESS,

  CLEAR_MERCHANDISE_DETAILS_DATA,

  FETCH_LEAVE_TYPE,
  FETCH_LEAVE_TYPE_FAIL,
  FETCH_LEAVE_TYPE_SUCCESS,

  MAKE_ATTENDANT_ALERT,
  MAKE_ATTENDANT_ALERT_SUCCESS,
  MAKE_ATTENDANT_ALERT_FAIL,
  MAKE_ATTENDANT_ALERT_UPDATE,

  FETCH_STUDENT_ATTENDANCE_BY_CLASS,
  FETCH_STUDENT_ATTENDANCE_BY_CLASS_FAIL,
  FETCH_STUDENT_ATTENDANCE_BY_CLASS_SUCCESS,

  FETCH_CALENDAR_VIEW_OF_EVENTS_OR_SCHEDULES,
  FETCH_CALENDAR_VIEW_OF_EVENTS_OR_SCHEDULES_FAIL,
  FETCH_CALENDAR_VIEW_OF_EVENTS_OR_SCHEDULES_SUCCESS,

  GET_MESSAGES_BETWEEN_USERS,
  GET_MESSAGES_BETWEEN_USERS_SUCCESS,
  GET_MESSAGES_BETWEEN_USERS_FAIL,

  FETCH_SCHEDULE_ITEM_FAIL,
  FETCH_SCHEDULE_ITEM,
  FETCH_SCHEDULE_ITEM_SUCCESS,

  FETCH_SCHEDULE_INFO,
  FETCH_SCHEDULE_INFO_FAIL,
  FETCH_SCHEDULE_INFO_SUCCESS,

  FETCH_ALL_EVENTS,
  FETCH_ALL_EVENTS_FAIL,
  FETCH_ALL_EVENTS_SUCCESS,

  FETCH_EVENT_DATA,
  FETCH_EVENT_DATA_FAIL,
  FETCH_EVENT_DATA_SUCCESS,

  CHAT_MESSAGE_BETWEEN_USERS,

  SEND_MESSAGES_BETWEEN_USERS,
  SEND_MESSAGES_BETWEEN_USERS_FAIL,
  SEND_MESSAGES_BETWEEN_USERS_SUCCESS,

  GET_ROOM_LIST,
  GET_ROOM_LIST_FAIL,
  GET_ROOM_LIST_SUCCESS,

  DELETE_ROOM,
  DELETE_ROOM_FAIL,
  DELETE_ROOM_SUCCESS,

  FETCH_CONTACT_LIST,
  FETCH_CONTACT_LIST_FAIL,
  FETCH_CONTACT_LIST_SUCCESS,

  UPDATE_MERCHANDISE_DATA_ORDERED_DELIVERED,

  HIDE_NOTIFICATION_ITEM,
  HIDE_NOTIFICATION_ITEM_FAIL,
  HIDE_NOTIFICATION_ITEM_SUCCESS,

  FETCH_STUDENT_ATTENDANCE_DETAILS,
  FETCH_STUDENT_ATTENDANCE_DETAILS_FAIL,
  FETCH_STUDENT_ATTENDANCE_DETAILS_SUCCESS,

  MAKE_STUDENT_ATTENDANCE_DETAILS,
  MAKE_STUDENT_ATTENDANCE_DETAILS_UPDATE,
  MAKE_STUDENT_ATTENDANCE_DETAILS_SUCCESS,
  MAKE_STUDENT_ATTENDANCE_DETAILS_FAIL,

  GET_TRANSLATE,
  GET_TRANSLATE_SUCCESS,
  GET_TRANSLATE_FAIL,
  SET_TRANSLATE,

  MAKE_NOTIFICATION_READ,
  MAKE_NOTIFICATION_READ_SUCCESS,
  MAKE_NOTIFICATION_READ_FAIL,

  FETCH_MERCHANDISE_DATA,
  FETCH_MERCHANDISE_DATA_FAIL,
  FETCH_MERCHANDISE_DATA_SUCCESS,

  FETCH_ALL_MERCHANDISE_DATA,
  FETCH_ALL_MERCHANDISE_DATA_FAIL,
  FETCH_ALL_MERCHANDISE_DATA_SUCCESS,

  FETCH_MERCHANDISE_DETAILS,
  FETCH_MERCHANDISE_DETAILS_FAIL,
  FETCH_MERCHANDISE_DETAILS_SUCCESS,

  ADD_TO_CART,

  SET_DATA,

  FETCH_ALL_NEWSFEEDS_SUCCESS,
  FETCH_ALL_NEWSFEEDS_FAIL,
  FETCH_ALL_NEWSFEEDS,

  FOUND_NEW_POST,

  FETCH_ORDERED_MERCHANDISE_DATA,
  FETCH_ORDERED_MERCHANDISE_DATA_FAIL,
  FETCH_ORDERED_MERCHANDISE_DATA_SUCCESS,

  CHANGE_ORDERED_MERCHANDISE_STATUS,
  CHANGE_ORDERED_MERCHANDISE_STATUS_FAIL,
  CHANGE_ORDERED_MERCHANDISE_STATUS_SUCCESS,

  ORDER_MERCHANDISE,
  ORDER_MERCHANDISE_FAIL,
  ORDER_MERCHANDISE_SUCCESS,

  FETCH_FUTURE_ATTENDANCE_DETAIL,
  FETCH_FUTURE_ATTENDANCE_DETAIL_SUCCESS,
  FETCH_FUTURE_ATTENDANCE_DETAIL_FAIL,

  GET_ORDERED_LIST_FOR_PARENTS,
  GET_ORDERED_LIST_FOR_PARENTS_FAIL,
  GET_ORDERED_LIST_FOR_PARENTS_SUCCESS,

  MAKE_PARENT_EVENT_REGISTER,
  MAKE_PARENT_EVENT_REGISTER_UPDATE,
  MAKE_PARENT_EVENT_REGISTER_SUCCESS,
  MAKE_PARENT_EVENT_REGISTER_FAIL,

  FETCH_ALL_REGISTER_PARENTID_EVENT,
  FETCH_ALL_REGISTER_PARENTID_EVENT_SUCCESS,
  FETCH_ALL_REGISTER_PARENTID_EVENT_FAIL,

  POST_NEWSFEED,
  POST_NEWSFEED_FAIL,
  POST_NEWSFEED_SUCCESS,

  FETCH_ATTENDANCE_ALERT,
  FETCH_ATTENDANCE_ALERT_SUCCESS,
  FETCH_ATTENDANCE_ALERT_FAIL,

  MAKE_MULTIPLE_PARENT_MESSAGES,
  MAKE_MULTIPLE_PARENT_MESSAGES_SUCCESS,
  MAKE_MULTIPLE_PARENT_MESSAGES_FAIL,

  FETCH_HOLIDAY,
  FETCH_HOLIDAY_FAIL,
  FETCH_HOLIDAY_SUCCESS,

  FETCH_HOLIDAYS_DATE,
  FETCH_HOLIDAYS_DATE_FAIL,
  FETCH_HOLIDAYS_DATE_SUCCESS,

  FETCH_SCHEDULE_COLORS,
  FETCH_SCHEDULE_COLORS_FAIL,
  FETCH_SCHEDULE_COLORS_SUCCESS,

  CHANGE_SUCCESSFUL_NEWSFEED,

  CHECK_NOTIFICATION_IS_READ,
  CHECK_NOTIFICATION_IS_READ_FAIL,
  CHECK_NOTIFICATION_IS_READ_SUCCESS,

  POST_FORMS,
  POST_FORMS_FAIL,
  POST_FORMS_SUCCESS,

  UPLOAD_S3,
  UPLOAD_S3_FAIL,

  FETCH_DIGITAL_FORMS,
  FETCH_DIGITAL_FORMS_FAIL,
  FETCH_DIGITAL_FORMS_SUCCESS,

  SET_COUNT_OF_CART_ITEMS,

  SET_SELECTED_DATE,

  SET_EVENT_PEOPLE_DATA,

  FETCH_ALL_EVENTS_FOR_DOTS,
  FETCH_ALL_EVENTS_FOR_DOTS_FAIL,
  FETCH_ALL_EVENTS_FOR_DOTS_SUCCESS,

  FETCH_ALL_ATTENDANCE_FOR_DOTS,
  FETCH_ALL_ATTENDANCE_FOR_DOTS_FAIL,
  FETCH_ALL_ATTENDANCE_FOR_DOTS_SUCCESS,

  GET_ATTENDANCE_DETAILS_OF_STUDENT,
  GET_ATTENDANCE_DETAILS_OF_STUDENT_FAIL,
  GET_ATTENDANCE_DETAILS_OF_STUDENT_SUCCESS,

  FETCH_ATTENDANCE_FOR_DOTS_BY_CLASS_SUCCESS,
  FETCH_ATTENDANCE_FOR_DOTS_BY_CLASS_FAIL,
  FETCH_ATTENDANCE_FOR_DOTS_BY_CLASS,

  FETCH_ALL_DATA_ATTENDED_BY_EVENT_SUCCESS,
  FETCH_ALL_DATA_ATTENDED_BY_EVENT_FAIL,
  FETCH_ALL_DATA_ATTENDED_BY_EVENT,

  FETCH_NOTE_DATA,
  FETCH_NOTE_DATA_FAIL,
  FETCH_NOTE_DATA_SUCCESS,

  GET_UNREGISTERED_PARENT_BY_EVENT_FAIL,
  GET_UNREGISTERED_PARENT_BY_EVENT,
  GET_UNREGISTERED_PARENT_BY_EVENT_SUCCESS,

  SET_TRANSLATE_MESSAGES_FAIL,
  SET_TRANSLATE_MESSAGES,
  SET_TRANSLATE_MESSAGES_SUCCESS,

  GET_FORM_DETAILS_DATA_FAIL,
  GET_FORM_DETAILS_DATA,
  GET_FORM_DETAILS_DATA_SUCCESS,

  DELETE_NEWSFEED_SUCCESS,

  GET_DELIVERED_MERCHANDISE_DATA,
  GET_DELIVERED_MERCHANDISE_DATA_FAIL,
  GET_DELIVERED_MERCHANDISE_DATA_SUCCESS,

  PENDING_PAYMENT_ORDERED_LISTS_OF_PARENT_SUCCESS,

  PAYMENT_VERIFICATION_ORDERED_LISTS_OF_PARENT_SUCCESS,

  PAID_ORDERED_LISTS_OF_PARENT_SUCCESS,

  CANCELLED_ORDERED_LISTS_OF_PARENT_SUCCESS,

  DELIVERED_ORDERED_LISTS_OF_PARENT_SUCCESS,

  GET_SCHEDULE_TYPES,
  GET_SCHEDULE_TYPES_FAIL,
  GET_SCHEDULE_TYPES_SUCCESS,

  FETCH_DASHBOARD_CAROUSEL,
  FETCH_DASHBOARD_CAROUSEL_SUCCESS,
  FETCH_DASHBOARD_CAROUSEL_FAIL,

} = homeActionTypes;

let initStates = {
  selectedDate: moment(),
  orderListInitialPage: 0,
  isLoading: false,
  student_attendance_calendar: [],
  fetching_student_attendance_calendar: false,
  isAttendanceAlertLoading: false,
  ordered_next_url: '',
  merchandise_types: [],
  leave_types: [],
  isOpeningChatRoom: false,
  student_attendance_in_class: [],
  calendar_view_of_events_or_schedules: {},
  is_loading_calendar_view_of_events_or_schedules: false,
  messages_between_users: {},
  room_id: null,
  messages_between_users_loading: false,
  isIntializingApp: false,
  digital_forms: [],
  digital_forms_next: '',
  digital_forms_loading: false,
  digital_forms_post_loading: false,
  contact_list: {},
  contact_list_loading: false,
  scheduleInfo: {},
  isLoadMoreForNewfeed: false,
  scheduleItem: {},
  is_fetching_all_ordered_lists: false,
    is_fetching_pending_payment_ordered_lists: false,
    is_fetching_payment_verification_ordered_lists: false,
    is_fetching_delivered_ordered_lists: false,
    is_fetching_cancelled_ordered_lists: false,
    all_ordered_next_url: '',
    delivered_ordered_next_url: '',
    pending_payment_ordered_next_url: '',
    cancelled_ordered_next_url: '',
    payment_verification_ordered_next_url: '',
  notifications: [],
  notificationNext: '',
  isLoadingNoti: false,
  events: [],
  next_url: '',
  eventData: [],
  isStudentAttendDetailLoading: false,
  isMakeStudentAttendDetailLoading: false,
  studentAttendDetail: {},
  isTranslateLoading: false,
  isReadNotification: false,
  isLoadMoreLoading: false,
  is_loading_more_delivered:false,
  isLoadingClass: false,
  is_loading_newsfeed: false,
  merchandise_data: [],
  all_merchandise_data: [],
  is_loading_all_merchandise_data: false,
  all_merchandise_data_next_url: '',
  merchandise_details: null,
  merchandise_data_by_type_next_url: '',
  my_carts: AsyncStorage.getItem(configs.constant.AS_KEY.CARTS),
  // my_carts: "Hello",
  temp_data: null,
  room_list: [],
  room_list_loading: false,
  delete_room_loading: false,
  room_list_snapshot: false,
  send_messages_between_users_loading: false,
  all_newsfeeds: [],
  newpost_newsfeeds: [],
  ordered_merchandise_data: [],
  delivered_merchandise_data:[],
  ordered_data: [],
  isFetchFutureAttendanceDetail: false,
  futureAttendanceDetail: [],
  is_Loading_Ordered_List: false,
  ordered_list_parents: [],
  all_ordered_list_of_parent:[],
  pending_payment_ordered_list_of_parent:[],
  payment_verification_ordered_list_of_parent:[],
  paid_ordered_list_of_parent:[],
  delivered_ordered_list_of_parent:[],
  cancelled_ordered_list_of_parent:[],
  parentEventData: [],
  isSuccessNewsFeed: false,
  is_Loading_For_NewsFeedPost: false,
  attendanceAlert: [],
  holidaysDate: [],
  multipleParentMessages: [],
  holidays: [],
  schedule_colors: [],
  has_read: false,
  unread_count: 0,
  isHidingNoti: false,
  get_message_next_url: '',
  count_of_cart_items: 0,
  all_messages_between_users: [],
  eventPeopleData: [],
  is_loading_for_event_people: false,
  all_events_for_dots:[],
  all_attendance_for_dots:[],
  is_fetching_student_attendance:false,
  student_attendance:{},
  attendance_records:{},
  calendar_dots_of_attendance_by_class:[],
  data_attended_event:[],
  all_note_data:[],
  event_unregistered_data:[],
  form_details:{},
  schedule_types:[],
  selected_class_index: 0,
  maintenance_mode: 'OFF',
  carousel_list:[],
  isLoadingLeaveType: false,
};

const homeReducer = (state = initStates, action) => {
  switch (action.type) {
    case MAINTENANCE_MODE:
      return {
        ...state,
        maintenance_mode: action.value,
      };

    case SAVE_SELECTED_CLASS:
      return {
        ...state,
        selected_class_index: action.value,
      };

    case FETCH_ATTENDANCE_CALENDAR_STUDENT_SUCCESS:
      return {
        ...state,
        student_attendance_calendar: action.data.details,
        fetching_student_attendance_calendar: false,
      };

    case FETCH_ATTENDANCE_CALENDAR_STUDENT:
      return {
        ...state,
        student_attendance_calendar: [],
        fetching_student_attendance_calendar: true,
      };

    case FETCH_ATTENDANCE_CALENDAR_STUDENT_FAIL:
      return {
        ...state,
        fetching_student_attendance_calendar: false,
      };

    case FETCH_ALL_NOTIFICATION:
      if (action.isNext) {
        return {
          ...state,
          isLoadingNoti: true,
        };
      } else {
        return {
          ...state,
          isLoadingNoti: true,
          notificationNext: '',
          notifications: [],
        };
      }

    case FETCH_ALL_NOTIFICATION_FAIL:
      return {
        ...state,
        isLoadingNoti: false,
      };

    case FETCH_ALL_NOTIFICATION_SUCCESS:
      return {
        ...state,
        notifications: [...state.notifications, ...action.data],
        notificationNext: action.next,
        isLoadingNoti: false,
      };

    case FETCH_MERCHANDISE_TYPE:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_MERCHANDISE_TYPE_SUCCESS:
      return {
        ...state,
        merchandise_types: action.data,
        isLoading: false,
      };

    case FETCH_MERCHANDISE_TYPE_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    case FETCH_LEAVE_TYPE:
      return {
        ...state,
        isLoadingLeaveType: true,
      };
    case FETCH_LEAVE_TYPE_SUCCESS:
      return {
        ...state,
        leave_types: action.data,
        isLoadingLeaveType: false,
      };
    case FETCH_LEAVE_TYPE_FAIL:
      return {
        ...state,
        isLoadingLeaveType: false,
      };
    case MAKE_ATTENDANT_ALERT:
      return {
        ...state,
        isAttendanceAlertLoading: true,
      };
    case MAKE_ATTENDANT_ALERT_UPDATE:
      return {
        ...state,
        isAttendanceAlertLoading: true,
      };
    case MAKE_ATTENDANT_ALERT_FAIL:
      return {
        ...state,
        isAttendanceAlertLoading: false,
      };
    case MAKE_ATTENDANT_ALERT_SUCCESS:
      return {
        ...state,
        isAttendanceAlertLoading: false,
      };

    case SET_EVENT_PEOPLE_DATA:
      return {
        eventPeopleData: [],
      };

    case FETCH_STUDENT_ATTENDANCE_BY_CLASS:
      return {
        ...state,
        isLoadingClass: true,
        student_attendance_in_class: [],
      };

    case FETCH_STUDENT_ATTENDANCE_BY_CLASS_SUCCESS:
      return {
        ...state,
        student_attendance_in_class: action.data,
        isLoadingClass: false,
      };

    case FETCH_STUDENT_ATTENDANCE_BY_CLASS_FAIL:
      return {
        ...state,
        isLoadingClass: false,
      };

    case FETCH_CALENDAR_VIEW_OF_EVENTS_OR_SCHEDULES:
      return {
        ...state,
        is_loading_calendar_view_of_events_or_schedules: true,
      };

    case FETCH_CALENDAR_VIEW_OF_EVENTS_OR_SCHEDULES_SUCCESS:
      return {
        ...state,
        calendar_view_of_events_or_schedules: action.data,
        is_loading_calendar_view_of_events_or_schedules: false,
        isIntializingApp: false,
      };

    case FETCH_CALENDAR_VIEW_OF_EVENTS_OR_SCHEDULES_FAIL:
      return {
        ...state,
        is_loading_calendar_view_of_events_or_schedules: false,
        isIntializingApp: false,
      };
    case GET_MESSAGES_BETWEEN_USERS:
      if (action.isNext) {
        return {
          ...state,
          messages_between_users_loading: false,
        };
      } else {
        var loading = true;
        if(!action.isLoading)
          loading = false;
          if(loading){
            return {
              ...state,
              messages_between_users_loading: loading,
              get_message_next_url: '',
              messages_between_users: [],
              all_messages_between_users: [],
            };
          } else {
            return {
              ...state,
              messages_between_users_loading: loading,
              get_message_next_url: '',
              messages_between_users: [],
            };
          }
        
      }

    case GET_MESSAGES_BETWEEN_USERS_FAIL:
      return {
        ...state,
        messages_between_users_loading: false,
      };
    case GET_MESSAGES_BETWEEN_USERS_SUCCESS:
      return {
        ...state,
        messages_between_users: [
          ...state.messages_between_users,
          ...action.data,
        ],
        messages_between_users_loading: false,
        room_id: action.room_id,
        get_message_next_url: action.nextUrl,
        all_messages_between_users: [
          ...state.messages_between_users,
          ...action.data,
        ],
      };

    case SEND_MESSAGES_BETWEEN_USERS:
      return {
        ...state,
        send_messages_between_users_loading: true,
      };
    case SEND_MESSAGES_BETWEEN_USERS_FAIL:
      let tempMessageData = state.all_messages_between_users;
      var index = tempMessageData.findIndex((x) => x.id === action.id);
      if (index != -1) {
        tempMessageData[index].is_fail_for_sending = true;
      }

      return {
        ...state,
        send_messages_between_users_loading: false,
        all_messages_between_users: tempMessageData,
      };

    case SEND_MESSAGES_BETWEEN_USERS_SUCCESS:
      let data = state.all_messages_between_users;
      var index = data.findIndex((x) => x.id === action.id);
      if (index != -1) {
        data[index].is_success_for_sending = true;
      }
      
      return {
        ...state,
        send_messages_between_users_loading: false,
        all_messages_between_users: data,
      };
    case GET_ROOM_LIST:
      var loading = true;
      if(state.room_list_snapshot)
        loading = false;
      return {
        ...state,
        room_list_loading: loading,
      };
    case GET_ROOM_LIST_FAIL:
      return {
        ...state,
        room_list_loading: false,
        room_list_snapshot: false,
      };
    case GET_ROOM_LIST_SUCCESS:
      return {
        ...state,
        room_list: action.data,
        room_list_loading: false,
        room_list_snapshot: true,
      };
    case DELETE_ROOM:
      return {
        ...state,
        delete_room_loading: true,
      };
    case DELETE_ROOM_FAIL:
      return {
        ...state,
        delete_room_loading: false,
      };
    case DELETE_ROOM_SUCCESS:
      const remainRoomList = [];

      //const filteredData = state.room_list.filter(obj => Object.values(obj.id).find(o => o.value === action.delete_room_id));

      let filteredData ;
      if(state.room_list){
        filteredData = state.room_list.filter(item => item.id !== action.delete_room_id);
      }
      
      console.log('Before deleting room list : '+ state.room_list);
      console.log('Remaining room list : '+ filteredData);

      return {
        ...state,
        room_list: filteredData,
        delete_room_loading: false,
      };
    case FETCH_CONTACT_LIST:
      return {
        ...state,
        contact_list_loading: true,
      };
    case FETCH_CONTACT_LIST_FAIL:
      return {
        ...state,
        contact_list_loading: false,
      };
    case FETCH_CONTACT_LIST_SUCCESS:
      let list = action.data;
      let dataList = [];
      if (list.admin_users != undefined && list.admin_users.length > 0) {
        let adminList = list.admin_users;
        adminList.forEach((x) => {
          let element = {
            ...x,
            role: 'Admin',
          };
          dataList.push(element);
        });
      }
      if (
        list.facilitator_users != undefined &&
        list.facilitator_users.length > 0
      ) {
        let facilitatorList = list.facilitator_users;
        facilitatorList.forEach((x) => {
          let element = {
            ...x,
            role: 'Facilitator',
          };
          dataList.push(element);
        });
      }
      if (list.parent_users != undefined && list.parent_users.length > 0) {
        let parentList = list.parent_users;
        parentList.forEach((x) => {
          let element = {
            ...x,
            role: 'Parent',
          };
          dataList.push(element);
        });
      }
      return {
        ...state,
        contact_list: dataList,
        contact_list_loading: false,
      };

    case FETCH_SCHEDULE_ITEM:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_SCHEDULE_ITEM_SUCCESS:
      return {
        ...state,
        scheduleItem: action.data,
        isLoading: false,
      };

    case FETCH_SCHEDULE_ITEM_FAIL:
      return {
        ...state,
        isLoading: false,
      };

    case FETCH_SCHEDULE_INFO_SUCCESS:
      return {
        ...state,
        scheduleInfo: action.data,
        isLoading: false,
      };

    case FETCH_SCHEDULE_INFO_FAIL:
      return {
        ...state,
        isLoading: false,
      };

    case FETCH_SCHEDULE_INFO:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_ALL_EVENTS_SUCCESS:
      return {
        ...state,
        events: action.data,
        isLoading: false,
      };

    case FETCH_ALL_EVENTS:
      return {
        ...state,
        events: [],
        isLoading: true,
      };

    case FETCH_ALL_EVENTS_FAIL:
      return {
        ...state,
        isLoading: false,
      };

    case FETCH_EVENT_DATA:
      return {
        ...state,
        eventData: [],
        isLoading: true,
      };

    case FETCH_EVENT_DATA_FAIL:
      return {
        ...state,
        eventData: [],
        isLoading: false,
      };

    case FETCH_EVENT_DATA_SUCCESS:
      // let indexOfEvent = state.eventData.findIndex(x=> x.event_id == action.event_id);
      // let tempDataOfEvent = state.eventData;
      // if(indexOfEvent != -1){
      //     tempDataOfEvent[indexOfEvent].data = action.data;
      //     return {
      //         ...state,
      //         eventData:tempDataOfEvent,
      //         isLoading:false,

      //     }
      // }else
      return {
        ...state,
        eventData: state.eventData.push({
          data: action.data,
          event_id: action.event_id,
        }),
        isLoading: false,
      };
    case MAKE_STUDENT_ATTENDANCE_DETAILS:
      return {
        ...state,
        isMakeStudentAttendDetailLoading: true,
      };
    case MAKE_STUDENT_ATTENDANCE_DETAILS_UPDATE:
      return {
        ...state,
        isMakeStudentAttendDetailLoading: true,
      };

    case MAKE_STUDENT_ATTENDANCE_DETAILS_FAIL:
      return {
        ...state,
        isMakeStudentAttendDetailLoading: false,
      };

    case MAKE_STUDENT_ATTENDANCE_DETAILS_SUCCESS:
      return {
        ...state,
        isMakeStudentAttendDetailLoading: false,
      };

    case FETCH_STUDENT_ATTENDANCE_DETAILS:
      return {
        ...state,
        isStudentAttendDetailLoading: true,
        studentAttendDetail: {},
      };

    case FETCH_STUDENT_ATTENDANCE_DETAILS_FAIL:
      return {
        ...state,
        isStudentAttendDetailLoading: false,
        studentAttendDetail: {},
      };

    case FETCH_STUDENT_ATTENDANCE_DETAILS_SUCCESS:
      return {
        ...state,
        isStudentAttendDetailLoading: false,
        studentAttendDetail: action.data,
      };

    case GET_TRANSLATE:
      return {
        ...state,
        isTranslateLoading: true,
      };

    case GET_TRANSLATE_SUCCESS:
      return {
        ...state,
        isTranslateLoading: false,
      };

    case GET_TRANSLATE_FAIL:
      return {
        ...state,
        isTranslateLoading: false,
      };

    case SET_INITIALIZING:
      return {
        ...state,
        isIntializingApp: action.value,
      };

    case SET_TRANSLATE:
      const dataSet = [...state.notifications];
      // console.log("RAS", dataSet);
      const existingIndex = state.notifications.findIndex(
        (data) => data.id === action.id,
      );

      if (existingIndex >= 0) {
        dataSet[existingIndex].translate = action.value;
        dataSet[existingIndex].is_translate = true;
      }

      return {
        ...state,
        notifications: dataSet,
      };

    case FETCH_EVENT_PEOPLE_DATA:
      return {
        ...state,
        is_loading_for_event_people: true,
      };
    case FETCH_EVENT_PEOPLE_DATA_SUCCESS:
      let indexOfPeople = state.eventPeopleData.findIndex(
        (x) => x.event_id == action.event_id,
      );
      let tempDataOfPeople = state.eventPeopleData;
      if (indexOfPeople != -1) {
        tempDataOfPeople[indexOfPeople].data = [...action.data];
        return {
          ...state,
          eventPeopleData: tempDataOfPeople,
          is_loading_for_event_people: false,
        };
      } else
        return {
          ...state,
          eventPeopleData: [
            ...state.eventPeopleData,
            {data: [...action.data], event_id: action.event_id},
          ],
          is_loading_for_event_people: false,
        };
    case FETCH_EVENT_PEOPLE_DATA_FAIL:
      return {
        ...state,
        is_loading_for_event_people: false,
      };

    case MAKE_NOTIFICATION_READ:
      return {
        ...state,
        isReadNotification: true,
      };

    case MAKE_NOTIFICATION_READ_SUCCESS:
      const dataUpdate = [...state.notifications];

      let toUpdate = action.notification_id;
      for (let itemData of toUpdate) {
        const existingIndex = state.notifications.findIndex(
          (data) => data.id === itemData,
        );
        if (existingIndex >= 0) {
          dataUpdate[existingIndex].has_read = true;
        }
      }

      return {
        ...state,
        isReadNotification: false,
        notifications: dataUpdate,
      };

    case MAKE_NOTIFICATION_READ_FAIL:
      return {
        ...state,
        isReadNotification: false,
      };

    case FETCH_MERCHANDISE_DATA_SUCCESS:
      var index = state.merchandise_data.findIndex((x) => x.id == action.id);
      // console.log(index);
      let temp;
      if (index !== -1) {
        let data = state.merchandise_data[index];
        let itemp = data.data;
        action.data.map((e) => {
          var index = itemp.findIndex((x) => x.id === e.id);
          if (index < 0) {
            data.data = [...data.data, e];
          }
        });
        temp = [
          ...state.merchandise_data.slice(0, index),
          data,
          ...state.merchandise_data.slice(index + 1),
        ];
      } else {
        temp = [
          ...state.merchandise_data,
          {
            id: action.id,
            data: action.data,
          },
        ];
      }

      return {
        ...state,
        merchandise_data: temp,
        isLoading: false,
        merchandise_data_by_type_next_url: action.next,
      };

    case FETCH_MERCHANDISE_DATA:
      // if(action.isNext){
      //     return {
      //         ...state,
      //         isLoading:true,
      //     }
      // }else{
      return {
        ...state,
        isLoading: true,
        merchandise_data_by_type_next_url: '',
      };
    // }

    case FETCH_MERCHANDISE_DATA_FAIL:
      return {
        ...state,
        isLoading: false,
      };

    case FETCH_ALL_MERCHANDISE_DATA:
      if (action.isNext) {
        return {
          ...state,
          is_loading_all_merchandise_data: false,
        };
      } else {
        return {
          ...state,
          is_loading_all_merchandise_data: true,
          all_merchandise_data_next_url: '',
          all_merchandise_data: [],
        };
      }

    case FETCH_ALL_MERCHANDISE_DATA_FAIL:
      return {
        ...state,
        is_loading_all_merchandise_data: false,
      };

    case FETCH_ALL_MERCHANDISE_DATA_SUCCESS:
      return {
        ...state,
        all_merchandise_data: [...state.all_merchandise_data, ...action.data],
        all_merchandise_data_next_url: action.next,
        is_loading_all_merchandise_data: false,
      };

    case FETCH_MERCHANDISE_DETAILS:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_MERCHANDISE_DETAILS_FAIL:
      return {
        ...state,
        isLoading: false,
      };

    case FETCH_MERCHANDISE_DETAILS_SUCCESS:
      return {
        ...state,
        merchandise_details: action.data,
        isLoading: false,
      };

    case ADD_TO_CART:
      return {
        ...state,
        my_carts: action.data,
      };

    case SET_DATA:
      return {
        ...state,
        temp_data: action.data,
      };

    case FETCH_ALL_NEWSFEEDS:
      if(action.checkNewPost){
        return {
          ...state,
          is_loading_newsfeed: true,
          newpost_newsfeeds: [],
        };
      }else if (action.page == 0) {
        return {
          ...state,
          is_loading_newsfeed: true,
          all_newsfeeds: [],
          isLoadMoreForNewfeed: false,
        };
      } else {
        return {
          ...state,
          is_loading_newsfeed: true,
          isLoadMoreForNewfeed: false,
        };
      }

    case FETCH_ALL_NEWSFEEDS_FAIL:
      return {
        ...state,
        is_loading_newsfeed: false,
        isLoadMoreForNewfeed: false,
      };

    case FETCH_ALL_NEWSFEEDS_SUCCESS:
      console.log('NAY CHI : check new post success = ' + action.checkNewPost 
        + ' page = '+ action.page);
      if(action.checkNewPost){
        return {
          ...state,
          newpost_newsfeeds: action.data,
          //is_loading_newsfeed: false,
          //isLoadMoreForNewfeed: action.data.length === 10,
        };
      }else {
        return {
          ...state,
          all_newsfeeds: [...state.all_newsfeeds, ...action.data],
          is_loading_newsfeed: false,
          isLoadMoreForNewfeed: action.data.length === 10,
        };
      }  
    case FOUND_NEW_POST:
      console.log('FOUND NEW POST REDUCER ...', JSON.stringify(action.value));
      return {
        ...state,
        all_newsfeeds: [...action.value,...state.all_newsfeeds]
      };

    case FETCH_ORDERED_MERCHANDISE_DATA:
      if (action.isNext) {
        return {
          ...state,
          isLoading: false,
          isLoadMoreLoading: true,
        };
      } else {
        return {
          ...state,
          ordered_merchandise_data: [],
          isLoading: true,
          next_url: '',
          isLoadMoreLoading: false,
        };
      }

    case FETCH_ORDERED_MERCHANDISE_DATA_FAIL:
      return {
        ...state,
        isLoading: false,
        isLoadMoreLoading: false,
      };

    case FETCH_ORDERED_MERCHANDISE_DATA_SUCCESS:
      return {
        ...state,
        ordered_merchandise_data: [
          ...state.ordered_merchandise_data,
          ...action.data,
        ],
        next_url: action.next_url,
        isLoading: false,
        isLoadMoreLoading: false,
        is_loading_more_delivered:false,
      } 

      case GET_DELIVERED_MERCHANDISE_DATA:
        if (action.isNext) {
          return {
            ...state,
            isLoading: false,
            is_loading_more_delivered: true,
          };
        } else {
          return {
            ...state,
            delivered_merchandise_data: [],
            isLoading: true,
            next_url: '',
            is_loading_more_delivered: false,
          };
        }
  
      case GET_DELIVERED_MERCHANDISE_DATA_FAIL:
        return {
          ...state,
          isLoading: false,
          is_loading_more_delivered: false,
        };
  
      case GET_DELIVERED_MERCHANDISE_DATA_SUCCESS:
        return {
          ...state,
          delivered_merchandise_data: [
            ...state.delivered_merchandise_data,
            ...action.data,
          ],
          next_url: action.next_url,
          isLoading: false,
          is_loading_more_delivered:false,
        } 

    case CHANGE_ORDERED_MERCHANDISE_STATUS:
      return {
        ...state,
        isLoading: true,
      };

    case CHANGE_ORDERED_MERCHANDISE_STATUS_FAIL:
      return {
        ...state,
        isLoading: false,
      };

    case CHANGE_ORDERED_MERCHANDISE_STATUS_SUCCESS:
      return {
        ...state,
        ordered_data: action.data,
        isLoading: false,
      };

    case ORDER_MERCHANDISE:
      return {
        ...state,
        isLoading: true,
      };

    case ORDER_MERCHANDISE_FAIL:
      return {
        ...state,
        isLoading: false,
      };

    case ORDER_MERCHANDISE_SUCCESS:
      return {
        ...state,
        ordered_data: action.data,
        isLoading: false,
      };

    case CLEAR_MERCHANDISE_DETAILS_DATA:
      return {
        ...state,
        merchandise_details: [],
      };

    case UPDATE_ORDERED_MERCHANDISE_DATA_IS_SELECT:
      if(action.status == "Paid"){
        return {
          ...state,
          ordered_merchandise_data: action.data,
        };
      }else{
        return {
          ...state,
          delivered_merchandise_data: action.data,
        };
      }

    case FETCH_FUTURE_ATTENDANCE_DETAIL:
      return {
        ...state,
        futureAttendanceDetail: [],
        isFetchFutureAttendanceDetail: true,
      };

    case FETCH_FUTURE_ATTENDANCE_DETAIL_FAIL:
      return {
        ...state,
        isFetchFutureAttendanceDetail: false,
      };

    case FETCH_FUTURE_ATTENDANCE_DETAIL_SUCCESS:
      return {
        ...state,
        futureAttendanceDetail: action.data,
        isFetchFutureAttendanceDetail: false,
      };

    case GET_ORDERED_LIST_FOR_PARENTS:
      if (action.isNext) {
        return {
          ...state,
        };
      } else {
        switch (action.status) {
          case configs.OrderListStatusMap.All:
            return {
              ...state,
              all_ordered_list_of_parent: [],
              is_fetching_all_ordered_lists:true,
            };

          case configs.OrderListStatusMap.Pending:
            return {
              ...state,
              pending_payment_ordered_list_of_parent: [],
              is_fetching_pending_payment_ordered_lists:true,
            };

          case configs.OrderListStatusMap.Verification:
            return {
              ...state,
              payment_verification_ordered_list_of_parent: [],
              is_fetching_payment_verification_ordered_lists:true,
            };
            //todo
          case configs.OrderListStatusMap.Paid:
            return {
              ...state,
              paid_ordered_list_of_parent: [],
            };

          case configs.OrderListStatusMap.Delivered:
            return {
              ...state,
              delivered_ordered_list_of_parent: [],
              is_fetching_delivered_ordered_lists:true,
            };

          case configs.OrderListStatusMap.Cancelled:
            return {
              ...state,
              cancelled_ordered_list_of_parent: [],
              is_fetching_cancelled_ordered_lists:true,
            };
        
          default:
            return {
              ...state,
              all_ordered_list_of_parent: [],
              is_fetching_all_ordered_lists:true,
            };
        }
      }

    case GET_ORDERED_LIST_FOR_PARENTS_FAIL:
      return {
        ...state,
        is_fetching_all_ordered_lists: false,
        is_fetching_pending_payment_ordered_lists: false,
        is_fetching_payment_verification_ordered_lists: false,
        is_fetching_delivered_ordered_lists: false,
        is_fetching_cancelled_ordered_lists: false,
      };

    case GET_ORDERED_LIST_FOR_PARENTS_SUCCESS:
      return {
        ...state,
        all_ordered_list_of_parent: [...state.all_ordered_list_of_parent, ...action.data],
        is_fetching_all_ordered_lists:false,
        all_ordered_next_url:action.next,
      };

    case PENDING_PAYMENT_ORDERED_LISTS_OF_PARENT_SUCCESS:
      return {
        ...state,
        pending_payment_ordered_list_of_parent: [...state.pending_payment_ordered_list_of_parent, ...action.data],
        is_fetching_pending_payment_ordered_lists:false,
        pending_payment_ordered_next_url:action.next,
      };

    case PAYMENT_VERIFICATION_ORDERED_LISTS_OF_PARENT_SUCCESS:
      return {
        ...state,
        payment_verification_ordered_list_of_parent: [...state.payment_verification_ordered_list_of_parent, ...action.data],
        is_fetching_payment_verification_ordered_lists:false,
        payment_verification_ordered_next_url:action.next,
      };

    case DELIVERED_ORDERED_LISTS_OF_PARENT_SUCCESS:
      return {
        ...state,
        delivered_ordered_list_of_parent: [...state.delivered_ordered_list_of_parent, ...action.data],
        is_fetching_delivered_ordered_lists:false,
        delivered_ordered_next_url:action.next,
      };

    case CANCELLED_ORDERED_LISTS_OF_PARENT_SUCCESS:
      return {
        ...state,
        cancelled_ordered_list_of_parent: [...state.cancelled_ordered_list_of_parent, ...action.data],
        is_fetching_cancelled_ordered_lists:false,
        cancelled_ordered_next_url:action.next,
      };

    case MAKE_PARENT_EVENT_REGISTER:
      return {
        ...state,
        isLoading: true,
      };

    case MAKE_PARENT_EVENT_REGISTER_UPDATE:
      return {
        ...state,
        isLoading: true,
      };

    case MAKE_PARENT_EVENT_REGISTER_FAIL:
      return {
        ...state,
        isLoading: false,
      };

    case MAKE_PARENT_EVENT_REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case FETCH_ALL_REGISTER_PARENTID_EVENT:
      return {
        ...state,
        isLoading: true,
        parentEventData: [],
      };

    case FETCH_ALL_REGISTER_PARENTID_EVENT_FAIL:
      return {
        ...state,
        isLoading: false,
        parentEventData: [],
      };

    case FETCH_ALL_REGISTER_PARENTID_EVENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        parentEventData: action.data,
      };

    case POST_NEWSFEED:
      return {
        ...state,
        is_Loading_For_NewsFeedPost: true,
        isSuccessNewsFeed: false,
      };

    case POST_NEWSFEED_FAIL:
      return {
        ...state,
        is_Loading_For_NewsFeedPost: false,
        isSuccessNewsFeed: false,
      };

    case POST_NEWSFEED_SUCCESS:
      return {
        ...state,
        is_Loading_For_NewsFeedPost: false,
        isSuccessNewsFeed: true,
      };

    case FETCH_ATTENDANCE_ALERT:
      return {
        ...state,
        isLoading: true,
        attendanceAlert: [],
      };

    case FETCH_ATTENDANCE_ALERT_FAIL:
      return {
        ...state,
        isLoading: false,
        attendanceAlert: [],
      };

    case FETCH_ATTENDANCE_ALERT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        attendanceAlert: action.data,
      };

    case FETCH_HOLIDAYS_DATE:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_HOLIDAYS_DATE_SUCCESS:
      return {
        ...state,
        holidaysDate: action.data,
        isLoading: false,
      };

    case FETCH_HOLIDAYS_DATE_FAIL:
      return {
        ...state,
        isLoading: false,
      };

    case MAKE_MULTIPLE_PARENT_MESSAGES:
      return {
        ...state,
        isLoading: true,
        multipleParentMessages: [],
      };

    case MAKE_MULTIPLE_PARENT_MESSAGES_FAIL:
      return {
        ...state,
        isLoading: false,
        multipleParentMessages: [],
      };

    case MAKE_MULTIPLE_PARENT_MESSAGES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        multipleParentMessages: action.data,
      };
    case FETCH_HOLIDAY:
      return {
        ...state,
        isLoading: true,
        holidays: [],
      };

    case FETCH_HOLIDAY_FAIL:
      return {
        ...state,
        isLoading: false,
        holidays: [],
      };

    case FETCH_HOLIDAY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        holidays: action.data,
      };

    case FETCH_SCHEDULE_COLORS:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_SCHEDULE_COLORS_FAIL:
      return {
        ...state,
        isLoading: false,
      };

    case FETCH_SCHEDULE_COLORS_SUCCESS:
      return {
        ...state,
        schedule_colors: action.data,
        isLoading: false,
      };

    case CHANGE_SUCCESSFUL_NEWSFEED:
      return {
        ...state,
        isSuccessNewsFeed: false,
      };

    case CHECK_NOTIFICATION_IS_READ:
      return {
        ...state,
        //has_read: false,
        unread_count: 0,
      };

    case CHECK_NOTIFICATION_IS_READ_FAIL:
      return {
        ...state,
        has_read: false,
        unread_count: 0,
      };

    case CHECK_NOTIFICATION_IS_READ_SUCCESS:
      return {
        ...state,
        has_read: action.data.has_unread,
        unread_count: action.data.unread_count,
      };

    case HIDE_NOTIFICATION_ITEM:
      return {
        ...state,
        isHidingNoti: true,
      };

    case HIDE_NOTIFICATION_ITEM_FAIL:
      return {
        ...state,
        isHidingNoti: false,
      };

    case HIDE_NOTIFICATION_ITEM_SUCCESS:
      return {
        ...state,
        isHidingNoti: false,
      };

    case CHAT_MESSAGE_BETWEEN_USERS:
      return {
        ...state,
        all_messages_between_users: [
          action.data,
          ...state.all_messages_between_users,
        ],
      };

    case SET_SCREEN_OPENING:
      return {
        ...state,
        isOpeningChatRoom: action.isOpening,
      };
    case POST_FORMS:
      return {
        ...state,
        digital_forms_post_loading: true,
      };
    case POST_FORMS_SUCCESS:
      return {
        ...state,
        digital_forms_post_loading: false,
      };
    case POST_FORMS_FAIL:
      return {
        ...state,
        digital_forms_post_loading: false,
      };
    case UPLOAD_S3:
      return {
        ...state,
        digital_forms_post_loading: true,
      };
    case UPLOAD_S3_FAIL:
      return {
        ...state,
        digital_forms_post_loading: false,
      };
    case FETCH_DIGITAL_FORMS:
      if (action.isNext) {
        return {
          ...state,
        };
      } else {
        return {
          ...state,
          digital_forms_loading: true,
          digital_forms: [],
          digital_forms_next: '',
        };
      }
    case FETCH_DIGITAL_FORMS_SUCCESS:
      return {
        ...state,
        digital_forms: [...state.digital_forms, ...action.data,],
        digital_forms_next: action.next,
        digital_forms_loading: false,
      };
    case FETCH_DIGITAL_FORMS_FAIL:
      return {
        ...state,
        digital_forms_loading: false,
      };

    case SET_COUNT_OF_CART_ITEMS:
      return {
        ...state,
        count_of_cart_items: action.value,
      };

    case SET_SELECTED_DATE:
      return {
        ...state,
        selectedDate: action.date,
      };

    case FETCH_ALL_EVENTS_FOR_DOTS:
      return {
        ...state,
      }

    case FETCH_ALL_EVENTS_FOR_DOTS_SUCCESS:
      return {
        ...state,
        all_events_for_dots:action.data,
      }

    case FETCH_ALL_EVENTS_FOR_DOTS_FAIL:
      return {
        ...state,
      }

    case FETCH_ALL_ATTENDANCE_FOR_DOTS:
      return {
        ...state,
        is_fetching_student_attendance:true,
      }

    case FETCH_ALL_ATTENDANCE_FOR_DOTS_FAIL:
      return {
        ...state,
        is_fetching_student_attendance:false,
      }

    case FETCH_ALL_ATTENDANCE_FOR_DOTS_SUCCESS:
      return {
        ...state,
        all_attendance_for_dots:action.data,
        attendance_records: action.records,
        is_fetching_student_attendance:false,
      }

    case GET_ATTENDANCE_DETAILS_OF_STUDENT:
      return {
        ...state,
      }

    case GET_ATTENDANCE_DETAILS_OF_STUDENT_FAIL:
      return {
        ...state,
      }

    case GET_ATTENDANCE_DETAILS_OF_STUDENT_SUCCESS:
      return {
        ...state,
        student_attendance:action.data,
      }

    case FETCH_ATTENDANCE_FOR_DOTS_BY_CLASS:
      return {
        ...state,
      }

    case FETCH_ATTENDANCE_FOR_DOTS_BY_CLASS_FAIL:
      return {
        ...state,
      }

    case FETCH_ATTENDANCE_FOR_DOTS_BY_CLASS_SUCCESS:
      return {
        ...state,
        calendar_dots_of_attendance_by_class:action.data,
      }

    case FETCH_ALL_DATA_ATTENDED_BY_EVENT:
      return {
        ...state,
      }

    case FETCH_ALL_DATA_ATTENDED_BY_EVENT_SUCCESS:
      return{
        ...state,
        data_attended_event:action.data,
      }

    case FETCH_ALL_DATA_ATTENDED_BY_EVENT_FAIL:
      return {
        ...state,
      }

    case FETCH_NOTE_DATA:
      return {
        ...state,
      }

    case FETCH_NOTE_DATA_SUCCESS:
      return{
        ...state,
        all_note_data:action.data,
      }

    case FETCH_NOTE_DATA_FAIL:
      return {
        ...state,
      }

    case GET_UNREGISTERED_PARENT_BY_EVENT:
      return {
        ...state,
      }

    case GET_UNREGISTERED_PARENT_BY_EVENT_FAIL:
      return {
        ...state,
      }

    case GET_UNREGISTERED_PARENT_BY_EVENT_SUCCESS:
      return {
        ...state,
        event_unregistered_data:action.data
      }

    case SET_TRANSLATE_MESSAGES:
      return {
        ...state,
      }

    case SET_TRANSLATE_MESSAGES_FAIL:
      return {
        ...state,
      }

    case SET_TRANSLATE_MESSAGES_SUCCESS:
      const message_id = action.id;
      let tempMessages = state.all_messages_between_users;
      let indexMessage = tempMessages.findIndex((m)=> m.id == message_id);
      if(indexMessage != -1){
        tempMessages[indexMessage].is_translate = true;
        tempMessages[indexMessage].translate = action.message;
      }
      return {
        ...state,
        all_messages_between_users:[
          ...tempMessages
        ]
      }

    case GET_FORM_DETAILS_DATA:
      return {
        ...state,
      }

    case GET_FORM_DETAILS_DATA_FAIL:
      return {
        ...state,
      }

    case GET_FORM_DETAILS_DATA_SUCCESS:
      return {
        ...state,
        form_details:action.data,
      }

    case DELETE_NEWSFEED_SUCCESS:
      let tempNewsFeed = state.all_newsfeeds.filter((n)=>n.id !== action.newsfeed_id);
      return {
        ...state,
        all_newsfeeds: [ ...tempNewsFeed ],
      }

    case UPDATE_MERCHANDISE_DATA_ORDERED_DELIVERED:
      return {
        ...state,
        ordered_merchandise_data: [ ...action.data],
      }

    case GET_SCHEDULE_TYPES:
      return {
        ...state,
      }

    case GET_SCHEDULE_TYPES_SUCCESS:
      return {
        ...state,
        schedule_types:[ ...action.data ],
      }

    case GET_SCHEDULE_TYPES_FAIL:
      return {
        ...state,
      }

    case FETCH_DASHBOARD_CAROUSEL:
      return {
        ...state,
      }

    case FETCH_DASHBOARD_CAROUSEL_SUCCESS:
      return {
        ...state,
        carousel_list: action.data,
      }

    case FETCH_DASHBOARD_CAROUSEL_FAIL:
      return {
        ...state,
      }  
      
    default:
      return state;
  }
};

export default homeReducer;
