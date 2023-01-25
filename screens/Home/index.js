import React, {Component, createRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  FlatList,
  PermissionsAndroid,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Orientation from 'react-native-orientation-locker';
import NetInfo from '@react-native-community/netinfo';
import {connect} from 'react-redux';
import {Space} from '../../components/space';
import {Platform} from 'react-native';
import moment from 'moment';
import configs from '../../utils/configs';
import CalendarRow from '../../components/calendar_row';
import HomeActivity from '../../components/home_activity';
import Divider from '../../components/divider';
import Calendar from '../../components/calendars/calendar/index';
import homeAction from '../../actions/homeAction';
import userAction from '../../actions/userAction';
import fundraisingAction from '../../actions/fundraisingAction';
import AsyncStorage from '@react-native-community/async-storage';
import ImageLoad from '../../components/ImageLoad';
import NotificationHandler from '../../notifications/notiService';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import authAction from '../../actions/authAction';
import DropdownV2 from '../../components/dropdownV2';
import messaging from '@react-native-firebase/messaging';
import CollapsibleToolbar from '../../components/CollapsibleToolbar';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import SliderEntry from '../../components/SliderEntry';
import RBSheet from 'react-native-raw-bottom-sheet';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import {reset} from '../../navigation/rootNavigator';
import utilities from '../../utils/utilities';
import RNFetchBlob from 'rn-fetch-blob';

const horizontalMargin = 20;
const SLIDER_1_FIRST_ITEM = 1;
const SLIDER_2_FIRST_ITEM = 1;
const sliderWidth = Dimensions.get('window').width;
const itemWidth = sliderWidth - horizontalMargin * 2;
const DISABLED_DAYS = ['Saturday', 'Sunday'];

const {width} = Dimensions.get('window');

const colors = [
  '#2190DC',
  '#939494',
  '#C697DF',
  '#F66460',
  '#065CA4',
  '#11AEE3',
  '#41CEC3',
  '#F3B329',
];

const months = [
  {label: 'January', value: 1},
  {label: 'February', value: 2},
  {label: 'March', value: 3},
  {label: 'April', value: 4},
  {label: 'May', value: 5},
  {label: 'June', value: 6},
  {label: 'July', value: 7},
  {label: 'August', value: 8},
  {label: 'September', value: 9},
  {label: 'October', value: 10},
  {label: 'November', value: 11},
  {label: 'December', value: 12},
];

class Home extends Component {
  NetInfoSubscribtion = null;
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  
  state = {
    schedule_items: [],
    selected_active: 'weekly',
    selectedMonth: parseInt(moment().format('M')),
    refreshing: false,
    isRefreshing: false,
    isInitializing: true,
    selectedDate: moment(),
    selectedMonthForCalendarRow: moment().format('MM'),
    weekDays: [
      moment().subtract(3, 'days'),
      moment().subtract(2, 'days'),
      moment().subtract(1, 'days'),
      moment(),
      moment().add(1, 'days'),
      moment().add(2, 'days'),
      moment().add(3, 'days'),
    ],
    selectedEvent: {},
    slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
    slider2ActiveSlide: SLIDER_2_FIRST_ITEM,
    selectedDataEvent: {},
    markedDatesArray: [],
    count: 0,
    selectedMarkedDate: {
      [moment().format('YYYY-MM-DD')]: {selected: true, marked: true},
    },
    markedDates: null,
    donationTest: [
      {
        id: 1,
        created_ts: '2021 Jan 15 11:31:54',
        description: 'loreiopasdmoapciapsdo apsdoifpajsdfkljpqeoirfa jpaiosdfa',
        donation_id: '4SDafhbEY6Z8aBwilzZU',
        duration: '[object Object]',
        from_date: '2021-01-15',
        from_time: '07:55:00',
        title: 'Donation UP',
        to_date: '2021-01-17',
        to_time: '07:55:00',
        total_needs: '5000',
        updated_ts: '2021 Jan 15 11:31:54',
      },
    ],
    selectedDateData: {},
    
  };

  _checkYourNetworkConnection = async () => {
    var isConnected = false;
    this.NetInfoSubscribtion = await NetInfo.fetch().then((state) => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      isConnected = state.isConnected;
    });
    return isConnected;
  };

  historyDownload(url,file_name) {
    var tempFileName = file_name.toLowerCase();
    var tempFileName = tempFileName.replace(" ","_");
    utilities.showToastMessage("Downloading ...");
    if (Platform.OS === 'ios') {
      this.downloadHistory(url,tempFileName);
    } else {
      try {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'storage title',
            message: 'storage_permission',
          },
        ).then((granted) => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //Once user grant the permission start downloading
            // console.log('Storage Permission Granted.');
            this.downloadHistory(url,tempFileName);
          } else {
            //If permission denied then show alert 'Storage Permission Not Granted
            utilities.showToastMessage('storage_permission not granted','error');
          }
        });
      } catch (err) {
        //To handle permission related issue
        console.log('error', err);
      }
    }
  }

  async downloadHistory(url,file_name) {
    const { config, fs } = RNFetchBlob;
    let date = new Date();
    var pdf_url = url;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        //Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/'+file_name +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          '.pdf',
        description: file_name,
      },
    };
    config(options)
      .fetch('GET', pdf_url)
      .then((res) => {
        //Showing alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        utilities.showToastMessage("Successful! you have download event file.");
      });
  }

  handleCallbackRegister = (value, message) => {
    const {fetchRegisterParentEventById, userInfo} = this.props;
    if (value == true) {
      fetchRegisterParentEventById('parent_id', userInfo.id);
    } else {
      utilities.showToastMessage(message);
    }
    console.log(this.state.selectedEvent.register_link);

    if(this.state.selectedEvent.register_link !== '' &&
      this.state.selectedEvent.register_link !== undefined &&
      this.state.selectedEvent.register_link !== 'http://' &&
      this.state.selectedEvent.register_link !== 'https://') {

        utilities.openURLInBrowser(this.state.selectedEvent.register_link);
    }
  };

  _isRegisteredEventByParent = ( event_id ) => {
    var isRegistered = this._getRegisteredEventsByEventID(event_id).length > 0 ? true :false;
    return isRegistered;
  }

  _onRegisterAction = () => {
    const {userInfo, setParentEventRegister} = this.props;

    this.RBSheetEvent.close();

    if(!this._isRegisteredEventByParent(this.state.selectedEvent.id)){
      setParentEventRegister(
        this.state.selectedEvent.id,
        userInfo.id,
        "active",
        this.handleCallbackRegister,
      );
    }  
    
  };

  _onDownloadClick = () => {

    if(this.state.selectedEvent.event_file != undefined && this.state.selectedEvent.event_file != "" && this.state.selectedEvent.event_file != null && this.state.selectedEvent.event_file != 'null'){
      if (Platform.OS === 'ios') {
        utilities.openURLInBrowser(this.state.selectedEvent.event_file);
      } else{
        this.historyDownload(this.state.selectedEvent.event_file,this.state.selectedEvent.title);
      }
    }
  };

  componentWillUnmount() {
    this.NetInfoSubscribtion && this.NetInfoSubscribtion();

    this.didFocusSubscription && this.didFocusSubscription();
  }

 // _renderItemWithParallax = ({item, index}, parallaxProps) => {
    //var navigation = this.props.navigation;
    //const { navigation} = this.props;
  //  return (
  //     <SliderEntry
  //       data={item}
  //       even={(index + 1) % 2 === 0}
  //       parallax={true}
  //       navigation={this.props.navigation}
  //       parallaxProps={parallaxProps}
  //     />
  //   );
  // };
  onBackPress = () => {
    const {weekDays} = this.state;
    let startData = weekDays[0];
    let temp = [
      moment(startData).subtract(7, 'days'),
      moment(startData).subtract(6, 'days'),
      moment(startData).subtract(5, 'days'),
      moment(startData).subtract(4, 'days'),
      moment(startData).subtract(3, 'days'),
      moment(startData).subtract(2, 'days'),
      moment(startData).subtract(1, 'days'),
    ];
    const month = moment(temp[3]).format('MM');

    if (month != this.state.selectedMonthForCalendarRow) {
      console.log(month);
      this.setState({
        selectedMonthForCalendarRow: month,
        selectedMonth: month,
      });
    }
    this.setState({
      weekDays: temp,
    });
  };

  onForwardPress = () => {
    const {weekDays} = this.state;
    let lastData = weekDays[weekDays.length - 1];
    let temp = [
      moment(lastData).add(1, 'days'),
      moment(lastData).add(2, 'days'),
      moment(lastData).add(3, 'days'),
      moment(lastData).add(4, 'days'),
      moment(lastData).add(5, 'days'),
      moment(lastData).add(6, 'days'),
      moment(lastData).add(7, 'days'),
    ];
    const month = moment(temp[3]).format('MM');

    if (month != this.state.selectedMonthForCalendarRow) {
      this.setState({
        selectedMonthForCalendarRow: month,
        selectedMonth: month,
      });
    }
    this.setState({
      weekDays: temp,
    });
  };

  onChangeMonth = (month) => {
    // if (month.value != this.state.selectedMonthForCalendarRow) {
    //   var year = moment().format('YYYY').toString();
    //   var monthValue = month.value >= 10 ? month.value : '0' + month.value;
    //   var date = year + '-' + monthValue + '-01';
    //   const data = moment(date);
    //   let temp = [
    //     moment(data).subtract(3, 'days'),
    //     moment(data).subtract(2, 'days'),
    //     moment(data).subtract(1, 'days'),
    //     data,
    //     moment(data).add(1, 'days'),
    //     moment(data).add(2, 'days'),
    //     moment(data).add(3, 'days'),
    //   ];
    //   this.setState({
    //     weekDays: temp,
    //     selectedMonthForCalendarRow: month.value,
    //   });
    // }

    console.log('onChangeMonth selected : ' + month.value);
    if (month.value != this.state.selectedMonthForCalendarRow) {
      console.log('onChangeMonth not equal with calendar row');
      var year = moment().format('YYYY').toString();
      var monthValue = month.value >= 10 ? month.value : '0' + month.value;
      var date = year + '-' + monthValue + '-01';
      const data = moment(date);

      let temp = [
        moment(data).subtract(3, 'days'),
        moment(data).subtract(2, 'days'),
        moment(data).subtract(1, 'days'),
        data,
        moment(data).add(1, 'days'),
        moment(data).add(2, 'days'),
        moment(data).add(3, 'days'),
      ];
      this.setState({
        weekDays: temp,
        selectedMonthForCalendarRow: month.value,
      });

      this.onChangeDate({item: data, type: 'onStart'});
      this.props.setSelectedDate(data);
    }
  };

  onChangeDate({item, type}) {
    this.setState({
      selectedDate: moment(item),
      selectedMonthForCalendarRow: moment(item).format('MM'),
    });
    const {userInfo, studentInfo, selected_class_index} = this.props;

    let isHolidayDate = this.checkHolidayDate(moment(item));

    if (isHolidayDate == false) {
      let centre_id =
        userInfo.user_type == 'parent'
          ? studentInfo != undefined &&
            studentInfo != {} &&
            studentInfo.centre_id != undefined
            ? studentInfo.centre_id[0]
            : undefined
          : userInfo.centre_id[0];
      let class_id =
        userInfo.user_type == 'parent'
          ? studentInfo != undefined &&
            studentInfo != {} &&
            studentInfo.class_id != undefined
            ? studentInfo.centre_id[0]
            : undefined
          : userInfo.class[selected_class_index].id;

      if (centre_id != undefined && class_id != undefined) {
        // this.setScheduleData(moment(item));
        this.props.fetchCalendarViewOfEventsOrSchedule(
          moment(item).format('YYYY-MM-DD'),
          moment(item).format('YYYY-MM-DD'),
          userInfo.user_type == 'parent'
            ? studentInfo.centre_id[0]
            : userInfo.centre_id[0],
          userInfo.user_type == 'parent'
            ? studentInfo.class_id[0]
            : userInfo.class[selected_class_index].id,
          'schedule_only',
          'all',
          userInfo.user_type == 'parent' ? studentInfo.id : undefined,
        );
      }
    }

    console.log('onChangeDate : type ' + type);
    if (type === 'onClick') {
      this.setState({
        selectedMonth: moment(item).format('M'),
      });
    }
  }

  getScheduleItems = () => {
    let schedules = this.getCalendarScheduleData(false);
    let schedule_items = [];
    if (schedules != undefined) {
      for (let index = 0; index < schedules.length; index++) {
        const element = schedules[index];
        if (element.schedule_item_ids.length !== 0) {
          schedule_items = [
            ...schedule_items,
            {
              title: element.title,
              data: element.schedule_item_ids,
            },
          ];
        }
      }
    }

    return schedule_items;
  };

  _renderItemWithParallaxDonation = ({item, index}, parallaxProps) => {
    //var navigation = this.props.navigation;
    //const { navigation} = this.props;
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        onPress={this._onPressCarousel}
        navigation={this.props.navigation}
        parallaxProps={parallaxProps}
      />
    );
  };

  _renderItemWithParallaxEvents = ({item, index}, parallaxProps) => {
    //var navigation = this.props.navigation;
    //const { navigation} = this.props;
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        onPress={this._onPressEvent}
        navigation={this.props.navigation}
        parallaxProps={parallaxProps}
      />
    );
  };

  _onPressCarousel = (data) => {
    if(data){
      if(data.type === 'donation'){
        this._onPressDonation(data);
      }else{
        this._onPressEvent(data);
      }
    }
  }

  _onPressDonation = (data) => {
    //console.log('onPress Carousel : '+ data.title);
    //console.log(data);

    //Alert.alert(" title "+ data.title);
    this.props.navigation.navigate('FundraisingScreen', {
      title: data.title,
      description: data.description,
      totalNeeds: data.total_needs,
      range: data.range,
      item: data,
      from: 'CalendarScreen',
    })

  }

  _onPressEvent = (data) => {

    // console.log(" Event "+ JSON.stringify(data));
    this.setState(
      {
        selectedEvent: {
          ...data, 
          isRegistered: this._getRegisteredEventsByEventID(data.id).length > 0 ? true : false},
      },
      () => this.RBSheetEvent.open(),
    );
  }

  _getRegisteredEventsByEventID = (eventID) => {
    let {parentEventData} = this.props;
    console.log('Registered Event size : '+ parentEventData.length);
    return parentEventData.filter(
      (ev) => {
        console.log('Registered Event by parent');
        console.log(ev);
        return ev.id == eventID;
      });
  };

  setActiveStudentForParentsRole = () => {};

  getDaysInMonth(month, year, days) {
    let pivot = moment().month(month).year(year).startOf('month');
    const end = moment().month(month).year(year).endOf('month');

    let dates = {};
    const disabled = {disabled: true, disableTouchEvent: false};
    while (pivot.isBefore(end)) {
      days.forEach((day) => {
        dates[pivot.day(day).format('YYYY-MM-DD')] = disabled;
      });
      pivot.add(7, 'days');
    }

    return dates;
  }

  // getObjectValueFromState = () => {
  //   return this.state.selectedMarkedDate
  // }

  // _getObjectFilter = (obj, predicate) =>
  //   Object.keys(obj)
  //         .filter( key => predicate(obj[key]) )
  //         .reduce( (res, key) => (res[key] = obj[key], res), {} );

  _getExistDotsInMarkedDate = (data) => {
    const allowed = Object.keys(this.state.selectedMarkedDate);

    const temp = Object.keys(data)
      .filter((key) => allowed.includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: data[key],
        };
      }, {});

    if (Object.keys(temp).length !== 0) {
      return {
        isValid:
          Object.values(temp)[0].dots !== null ||
          Object.values(temp)[0].dots !== {} ||
          Object.values(temp)[0].dots !== undefined,
        data: Object.values(temp)[0],
        key: Object.keys(temp),
      };
    } else {
      return {isValid: false, data: null, key: null};
    }
  };

  getCurrentSelectedDateFormat = () => {
    return moment(this.state.selectedDate).format('YYYY-MM-DD');
  };

  // setScheduleData = (date) => {
  //   if (!this._checkYourNetworkConnection()) {
  //     utilities.showToastMessage('Check your internet connection ', 'danger');
  //     Toast.show('Check your internet connection ');
  //   } else {
  //     const {userInfo} = this.props;
  //     const centre_id =
  //       userInfo.user_type === 'parent'
  //         ? this.props.studentInfo != undefined  ?this.props.studentInfo.centre_id[0] != undefined ? this.props.studentInfo.centre_id[0] : undefined :undefined
  //         : userInfo.centre_id[0];
  //     const class_id =
  //       userInfo.user_type === 'parent'
  //         ? this.props.studentInfo != undefined  ?this.props.studentInfo.class_id[0] != undefined ? this.props.studentInfo.class_id[0]: undefined :undefined
  //         : userInfo.class_id[0];
  //     // this.props.fetchCalendarViewOfEventsOrSchedule(moment(this.state.selectedDate).format("YYYY-MM-DD"),moment(this.state.selectedDate).format("YYYY-MM-DD"),"KNSLmqsAF7gWWXdudWGM","11Pxr6cnodcS0qsf4MaG","schedule_only",0);
  //     if(centre_id != undefined && class_id != undefined){
  //       this.props.fetchCalendarViewOfEventsOrSchedule(
  //         moment(date).format('YYYY-MM-DD'),
  //         moment(date).format('YYYY-MM-DD'),
  //         centre_id,
  //         class_id,
  //         'schedule_only',
  //         'all',
  //       );
  //     }
  //   }
  // };
  _scrollEnd = (ref) => {
    ref.current.scrollToEnd({animated: true});
  };
  _currentDateTime = () => {
    let today = new Date();
    let DD = String(today.getDate()).padStart(2, '0');
    let MM = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let YYYY = today.getFullYear();
    let ss = String(today.getSeconds()).padStart(2, '0');
    let mm = String(today.getMinutes()).padStart(2, '0');
    let hh = String(today.getHours()).padStart(2, '0');

    today = YYYY + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss;
    return today;
  };

  onInitializingNotification = async () => {
    if (Platform.OS === 'ios') {
      
      PushNotificationIOS.setApplicationIconBadgeNumber(0);

      const res = await PushNotificationIOS.getInitialNotification();
      if (res !== null) {
        console.log('iOS Push Noti ' + res.getData());
        console.log('Android Push Noti ' + JSON.stringify(res));

        if(res.getData())  
          this.handlingNotiClickAction(res.getData());

      } else {
        console.log('res is null');
      }
    } else {
      PushNotification.popInitialNotification((remoteMessage) => {
        if (remoteMessage !== null || remoteMessage !== undefined) {
          console.log('Android Push Noti '+ JSON.stringify(remoteMessage));
          
          if(remoteMessage.hasOwnProperty('data'))  
            this.handlingNotiClickAction(remoteMessage.data);
        } else {
          console.log('userinfo is null');
        }
      });
    }

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification caused app to open from Home: ', remoteMessage);
      //console.log('User ID : ', this.props.userInfo.id);
      
      if(remoteMessage.hasOwnProperty('data'))  
        this.handlingNotiClickAction(remoteMessage.data);

    });
  };

  handlingNotiClickAction = (pushNotification) => {
    if( pushNotification.push_type === 'comms'){
      this.props.navigation.navigate('Comms');

      if(this.props.roomList){
        var room = this.props.roomList.filter(obj => obj.receiver.id === pushNotification.sender);
        
        if(room && room.length>0){
          receiverRoom = room[0];
          this.props.navigation.navigate('ChatRoom', {
            receiver_info: {
              id: receiverRoom.receiver.id,
              name: receiverRoom.receiver.name,
              role: receiverRoom.receiver.role,
              img: receiverRoom.receiver.img,
            },
          });
        }
      }
      
    } else if ( pushNotification.push_type === 'checkin' ){
      this.props.navigation.navigate('Home');
    } else if ( pushNotification.push_type === 'checkout' ){
      this.props.navigation.navigate('Home');
    } else if ( pushNotification.push_type === 'notification' ){
      this.props.navigation.navigate('NotificationStack');
    }  
  }

  handleStudentInfo = (value) => {
    if (value != undefined) {
      console.log('Student info >>> ');
      console.log(value);
      console.log(value.class_id[0]);
      const centre_id = value.centre_id[0];
      const class_id = value.class_id[0];
      this.props.fetchCalendarViewOfEventsOrSchedule(
        moment().format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
        centre_id,
        class_id,
        'schedule_only',
        'all',
        value.id,
      );
      this.setState({
        markedDates: this._setMarkedDates(),
        isInitializing: false,
      });

      this.props.fetchDashboardCarousel(class_id, ()=>{});
      
    }
  };

  gettingStudentInfo = async () => {
    const {userInfo} = this.props;

    await AsyncStorage.getItem(
      configs.constant.AS_KEY.ACTIVE_STUDENT_ID,
      (err, STUDENT_ID) => {
        if (STUDENT_ID != null && STUDENT_ID != '') {
          // console.log(STUDENT_ID+ " -------------------------------------------"+this.props.userInfo.children[0])
          this.props.setStudentInfo(STUDENT_ID, true, this.handleStudentInfo);
        } else {
          // console.log(this.props.userInfo.children[0].id);
          if (this.props.userInfo.user_type === 'parent') {
            this.props.setStudentInfo(
              this.props.userInfo.children[0].id,
              true,
              this.handleStudentInfo,
            );
            AsyncStorage.setItem(
              configs.constant.AS_KEY.ACTIVE_STUDENT_ID,
              this.props.userInfo.children[0].id,
            );
          }
        }
      },
    );
  };

  componentDidMount() {
    const {
      getSetting,
      userInfo,
      fetchCalendarViewOfEventsOrSchedule,
      fetchAllEventsForDots,
      selected_class_index,
      getScheduleTypes,
    } = this.props;

    this.props.fetchLeaveType();
    this.props.getRoomList(userInfo.id);

    if (userInfo.user_type == 'facilitator') {
      const from_date = moment().year() + '-01-01';
      const to_date = moment().year() + '-12-31';

      fetchAllEventsForDots(from_date, to_date, 'admin_view', 'all');
    }

    this.onChangeDate({item: moment(), type: 'onStart'});
    this.props.setSelectedDate(moment());

    this.props.userInfo.user_type == 'parent' &&
      this.props.getGeneralDonation();

    if (userInfo.user_type == 'parent') {
      this.gettingStudentInfo();
    } else {
      const centre_id = userInfo.centre_id[0];
      const class_id = userInfo.class[selected_class_index].id;
      fetchCalendarViewOfEventsOrSchedule(
        moment().format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
        centre_id,
        class_id,
        'schedule_only',
        'all',
        undefined,
      );
      this.setState({
        // markedDates: this._setMarkedDates(),
        isInitializing: false,
      });
    }

    Orientation.lockToPortrait();

    this.onInitializingNotification();

    this.props.getScheduleColors();

    getScheduleTypes();

    this.props.fetchHolidaysDate(null, null);

    getSetting(userInfo.id, userInfo.user_type);

    this.props.userInfo.user_type == 'parent' && this.props.fetchDonationList();

    if (userInfo.user_type == 'parent') {

      this.props.fetchRegisterParentEventById('parent_id', userInfo.id);

      this.props.fetchMerchandiseType();
      this.props.fetchAllMerchandiseData(false, '', () => console.log('Get Data for all merchandise.'));
      // this.setTopTabItems();
      //this.setMerchandiseData();
      /*if (this.props.merchandise_types && this.props.merchandise_types[0] != undefined) {
          this.props.fetchMerchandiseDataByType(this.props.merchandise_types && this.props.merchandise_types[0].id, 10);
      }*/
    }

    this.didFocusSubscription = this.props.navigation.addListener(
      'focus',
      payload => {
        console.log('Home page focus!');
        this.props.checkNotificationIsRead(
          this.props.userInfo.id,
          this.props.userInfo.user_type,
        );
      }
    );
    
  }

  setMerchandiseData = () => {
    const {merchandise_types} = this.props;
    for (let index = 4; index < merchandise_types.length; index++) {
      const element = merchandise_types[index];
      setTimeout(() => {
        this.props.fetchMerchandiseDataByType(element.id, 10);
      }, 200);
    }
  };

  _setMarkedDates = () => {
    const month =
      this.state.selectedMonth < 10
        ? '0' + this.state.selectedMonth
        : this.state.selectedMonth;
    const year = moment(this.state.selectedDate).format('Y');
    var TEMP = {
      [moment(this.state.selectedDate).format('YYYY-MM-DD')]: {
        selected: true,
        marked: true,
      },
    };

    var result = this._getExistDotsInMarkedDate(TEMP);

    if (result.isValid) {
      result.data.selected = true;
      result.data.marked = true;
      TEMP = {
        ...TEMP,
        [result.key]: result.data,
        ...this.getDaysInMonth(month - 1, year, DISABLED_DAYS),
      };
    } else {
      TEMP = {
        ...TEMP,
        ...this.state.selectedMarkedDate,
        ...this.getDaysInMonth(month - 1, year, DISABLED_DAYS),
      };
    }

    TEMP = {
      ...this._addDotstoCalendar(TEMP),
    };

    return TEMP;
  };

  _addDotstoCalendar = (DATA) => {
    const {
      holidaysDate,
      all_events_for_dots,
      all_attendance_for_dots = [],
      studentInfo,
      userInfo,
      selected_class_index,
    } = this.props;
    let temp = DATA;

    if (this.props.userInfo.user_type === 'parent') {
      // let all_attendance = all_attendance_for_dots.filter((at)=> at.date.includes((moment().year()+"-"+this.state.selectedMonth > 10 ? this.state.selectedMonth : "0"+this.state.selectedMonth).toString()));
      if (
        all_attendance_for_dots != undefined &&
        all_attendance_for_dots.length > 0
      ) {
        for (let ind = 0; ind < all_attendance_for_dots.length; ind++) {
          const eve = all_attendance_for_dots[ind];
          const x = temp[eve.date];
          if (x != undefined) {
            if (eve.status != 'undefined') {
              let ttDots = temp[eve.date].dots;
              temp[eve.date] = {
                ...x,
                marked: true,
                dots:
                  ttDots != null
                    ? [
                        {
                          key: 'record',
                          color:
                            eve.status == 'present'
                              ? '#7CD227'
                              : eve.status == 'absent'
                              ? '#F3B329'
                              : 'white',
                        },
                      ].concat(ttDots)
                    : [
                        {
                          key: 'record',
                          color:
                            eve.status == 'present'
                              ? '#7CD227'
                              : eve.status == 'absent'
                              ? '#F3B329'
                              : 'white',
                        },
                      ],
              };
            }
          } else {
            if (eve.status != 'undefined') {
              temp = {
                ...temp,
                [eve.date]: {
                  marked: true,
                  dots: [
                    {
                      key: 'record',
                      color:
                        eve.status == 'present'
                          ? '#7CD227'
                          : eve.status == 'absent'
                          ? '#F3B329'
                          : 'white',
                    },
                  ],
                },
              };
            }
          }
        }
      }
    }

    let allEvents = all_events_for_dots;

    let centre_id =
      userInfo.user_type == 'parent'
        ? studentInfo != undefined &&
          studentInfo != {} &&
          studentInfo.centre_id != undefined
          ? studentInfo.centre_id[0]
          : undefined
        : userInfo.centre_id[0];
    let class_id =
      userInfo.user_type == 'parent'
        ? studentInfo != undefined &&
          studentInfo != {} &&
          studentInfo.class_id != undefined
          ? studentInfo.class_id[0]
          : undefined
        : userInfo.class[selected_class_index].id;

    if (centre_id != undefined || class_id != undefined) {
      allEvents = all_events_for_dots.filter(
        (e) => e.centre_ids.includes(centre_id) && e.class_ids.includes(class_id),
      );
    }

    if (allEvents != undefined && allEvents.length > 0) {
      for (let index = 0; index < allEvents.length; index++) {
        const element = allEvents[index];

        var x = temp[element.date];

        if (x != undefined) {
          // var result = this._checkingExistingDots(temp,{ [element.date]: {marked: true,
          //   dots: [{key: 'event', color: '#F66460'}],}});
          // if(result.isValid){

          // }
          let tempDots = temp[element.date].dots;
          temp[element.date] = {
            ...x,
            marked: true,
            dots:
              tempDots != null
                ? [{key: 'event', color: '#F66460'}].concat(tempDots)
                : [{key: 'event', color: '#F66460'}],
          };
        } else {
          temp = {
            ...temp,
            [element.date]: {
              marked: true,
              dots: [{key: 'event', color: '#F66460'}],
            },
          };
        }
      }
    }

    if (holidaysDate != undefined) {
      for (let index = 0; index < holidaysDate.length; index++) {
        const element = holidaysDate[index];
        var x = temp[element.date];

        if (x != undefined) {
          temp[element.date] = {
            ...x,
            marked: true,
            dots: [{key: 'holiday', color: '#7F00FF'}],
          };
        } else {
          temp = {
            ...temp,
            [element.date]: {
              marked: true,
              dots: [{key: 'holidays', color: '#7F00FF'}],
            },
          };
        }
      }
    }

    return temp;
  };

  getScheduleColorsByIndex = (index) => {
    const {schedule_colors} = this.props;
    if (schedule_colors == undefined) {
      return 'white';
    }
    console.log("Color by index : "+JSON.stringify(schedule_colors));
    var i = index % schedule_colors.length;

    console.log("Color by index : i ==> "+i);
    let data = schedule_colors.filter((x) => x.serial_number == i + 1)[0];
    return data ? data.hex_color_code : 'white';
  };

  _checkCentreClosed = () => {
    let data = this.getCalendarScheduleData(true);
    if( data.length > 0){
      var index = data.findIndex((cal)=> cal.Closure_Date === true);
      return index !== -1;
    }else{
      return false;
    }
    
  }

  getCalendarScheduleData = (isAll = false) => {
    const {calendar_view_of_events_or_schedules} = this.props;
    console.log("events or schdules json ==> ");
    console.log(JSON.stringify(calendar_view_of_events_or_schedules));
    if (calendar_view_of_events_or_schedules != null) {
      if (calendar_view_of_events_or_schedules != {}) {
        if (calendar_view_of_events_or_schedules != undefined) {
          if (calendar_view_of_events_or_schedules.length >= 0) {
            if (
              calendar_view_of_events_or_schedules[0].schedules != undefined &&
              calendar_view_of_events_or_schedules[0].schedules != {} &&
              calendar_view_of_events_or_schedules[0].schedules != null
            ) {
              return isAll === true ? calendar_view_of_events_or_schedules : calendar_view_of_events_or_schedules[0].schedules;
            }
          }
        }
      }
    }

    return [];
    // return calendar_view_of_events_or_schedules[0].schedules ? calendar_view_of_events_or_schedules[0].schedules : [];
  };

  renderWeeklyBody = (navigation) => {
    const {userInfo, studentInfo} = this.props;

    return (
      <View style={{marginHorizontal: 16}}>
        {/* Activities */}
        {
          <View>
            {/* Food Nutrition  */}
            {this.getScheduleItems().length > 0 && (
              <View>
                <Text style={{fontWeight: '700', fontSize: 16}}>
                  Food {'&'} nutrition
                </Text>
                <Space height={10} />
                <View style={styles.food_nutrition_container}>
                  {this.getScheduleItems().length > 0 &&
                    this.getScheduleItems().map((item, index) => (
                      <View key={index}>
                        <Text style={{fontWeight: '700'}}>{item.title}</Text>
                        <Space height={10} />
                        {item.data &&
                          item.data.map((element, index) => (
                            <View key={index}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                {element.thumbnail != undefined ||
                                element.thumbnail != null ||
                                element.thumbnail != '' ? (
                                  <ImageLoad
                                    style={styles.food_image}
                                    loadingStyle={{
                                      size: 'small',
                                      color: 'white',
                                    }}
                                    borderRadius={8}
                                    placeholderStyle={{
                                      borderRadius: 8,
                                      height: 48,
                                      width: 48,
                                    }}
                                    source={{
                                      uri: element.img_url,
                                      cache: 'force-cache',
                                    }}
                                    placeholderSource={require('../../assets/images/placeholder_image.png')}
                                  />
                                ) : (
                                  <Image
                                    style={[
                                      styles.food_image,
                                      {borderRadius: 8},
                                    ]}
                                    source={require('../../assets/images/placeholder_image.png')}
                                  />
                                )}
                                <Text
                                  style={{
                                    paddingHorizontal: 10,
                                    alignSelf: 'center',
                                  }}>
                                  {element.name}
                                </Text>
                              </View>
                              <Space height={10} />
                            </View>
                          ))}

                        <Space height={20} />
                        <Divider />
                        <Space height={20} />
                      </View>
                    ))}
                </View>
              </View>
            )}
          </View>
        }
      </View>
    );
  };

  checkHolidayDate = (sdate) => {
    const {holidaysDate = []} = this.props;

    let date = moment(sdate).format('YYYY-MM-DD');
    var index = holidaysDate.findIndex((ho) => ho.date == date);
    return index != -1;
  };

  renderAttendance = () => {
    const {all_attendance_for_dots = []} = this.props;
    var temp = all_attendance_for_dots.filter(
      (att) =>
        att.date === moment(this.state.selectedDate).format('YYYY-MM-DD'),
    )[0];
    var status = temp && temp[0] != undefined ? temp[0].status : undefined;
    if (status != undefined) {
      if (status === 'present') {
        return (
          <View
            style={{
              borderRadius: 20,
              height: 78,
              width: '100%',
              paddingVertical: 14,
              paddingHorizontal: 15,
              backgroundColor: '#fff',
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: 48,
                height: 48,
                backgroundColor: '#E5FAFF',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#4075FF',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 17,
              }}>
              <View style={{width: 30, height: 32, alignItems: 'center'}}>
                <Text
                  style={{
                    color: '#4075FF',
                    fontSize: 12,
                    fontFamily: configs.fontFamily.OPS700,
                  }}>
                  {moment(this.state.selectedDate).format('DD')}
                </Text>
                <Text
                  style={{
                    color: '#4075FF',
                    fontSize: 12,
                    fontFamily: configs.fontFamily.OPS700,
                  }}>
                  {moment(this.state.selectedDate).format('MMM')}
                </Text>
              </View>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  color: '#1B1A1A',
                  fontFamily: configs.fontFamily.OPS600,
                  marginBottom: 4,
                }}>
                {this.props.studentInfo.name}'s Attendance
              </Text>

              <View
                style={{
                  borderRadius: 15,
                  backgroundColor: '#7CD227',
                  width: 62,
                  height: 20,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    fontFamily: configs.fontFamily.OPS600,
                  }}>
                  Attend
                </Text>
              </View>
            </View>
          </View>
        );
      } else if (status === 'absent') {
        return (
          <View
            style={{
              borderRadius: 20,
              height: 78,
              width: '100%',
              paddingVertical: 14,
              paddingHorizontal: 15,
              backgroundColor: '#fff',
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: 48,
                height: 48,
                backgroundColor: '#E5FAFF',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#4075FF',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 17,
              }}>
              <View style={{width: 30, height: 32, alignItems: 'center'}}>
                <Text
                  style={{
                    color: '#4075FF',
                    fontSize: 12,
                    fontFamily: configs.fontFamily.OPS700,
                  }}>
                  {moment(this.state.selectedDate).format('DD')}
                </Text>
                <Text
                  style={{
                    color: '#4075FF',
                    fontSize: 12,
                    fontFamily: configs.fontFamily.OPS700,
                  }}>
                  {moment(this.state.selectedDate).format('MMM')}
                </Text>
              </View>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  color: '#1B1A1A',
                  fontFamily: configs.fontFamily.OPS600,
                  marginBottom: 4,
                }}>
                {this.props.studentInfo.name}'s Attendance
              </Text>
              <View
                style={{
                  borderRadius: 15,
                  backgroundColor: '#F3B329',
                  width: 62,
                  height: 20,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    fontFamily: configs.fontFamily.OPS600,
                  }}>
                  Absence
                </Text>
              </View>
            </View>
          </View>
        );
      } else {
        return (
          <View
            style={{
              borderRadius: 20,
              height: 78,
              width: '100%',
              paddingVertical: 14,
              paddingHorizontal: 15,
              backgroundColor: '#fff',
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: 48,
                height: 48,
                backgroundColor: '#E5FAFF',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#4075FF',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 17,
              }}>
              <View style={{width: 30, height: 32, alignItems: 'center'}}>
                <Text
                  style={{
                    color: '#4075FF',
                    fontSize: 12,
                    fontFamily: configs.fontFamily.OPS700,
                  }}>
                  {moment(this.state.selectedDate).format('DD')}
                </Text>
                <Text
                  style={{
                    color: '#4075FF',
                    fontSize: 12,
                    fontFamily: configs.fontFamily.OPS700,
                  }}>
                  {moment(this.state.selectedDate).format('MMM')}
                </Text>
              </View>
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#1B1A1A',
                  fontFamily: configs.fontFamily.OPS600,
                  marginBottom: 4,
                }}>
                {this.props.studentInfo.name}'s Attendance
              </Text>
            </View>
          </View>
        );
      }
    }
  };

  renderMonthlyBody = () => {
    const {userInfo, all_events_for_dots, studentInfo, selected_class_index} = this.props;

    let allEvents = [];

    let centre_id =
      userInfo.user_type == 'parent'
        ? studentInfo != undefined && studentInfo != {}
          ? studentInfo.centre_id[0]
          : undefined
        : userInfo.centre_id[0];
    let class_id =
      userInfo.user_type == 'parent'
        ? studentInfo != undefined && studentInfo != {}
          ? studentInfo.class_id[0]
          : undefined
        : userInfo.class[selected_class_index].id;

    if (centre_id != undefined || class_id != undefined) {
      allEvents = all_events_for_dots.filter(
        (e) =>
          e.date == moment(this.state.selectedDate).format('YYYY-MM-DD') &&
          e.centre_ids.includes(centre_id) &&
          e.class_ids.includes(class_id),
      );
    } else {
      allEvents = all_events_for_dots.filter(
        (e) => e.date == moment(this.state.selectedDate).format('YYYY-MM-DD'),
      );
    }

    return (
      <View style={{marginHorizontal: 16}}>
        {userInfo.user_type == 'parent' && <Space height={20} />}
        {userInfo.user_type == 'parent' && this.renderAttendance()}

        {allEvents && allEvents.length > 0 && (
          <>
            <View>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Event</Text>
            </View>
            <Space height={5} />
            <FlatList
              data={allEvents}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <View
                  key={index}
                  style={{
                    borderRadius: 20,
                    height: 78,
                    width: '100%',
                    paddingVertical: 14,
                    paddingHorizontal: 15,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    marginTop: 16,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: '#E5FAFF',
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#4075FF',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 17,
                    }}>
                    <View style={{width: 30, height: 32, alignItems: 'center'}}>
                      <Text
                        style={{
                          color: '#4075FF',
                          fontSize: 12,
                          fontFamily: configs.fontFamily.OPS700,
                        }}>
                        {moment(item.date).format('DD')}
                      </Text>
                      <Text
                        style={{
                          color: '#4075FF',
                          fontSize: 12,
                          fontFamily: configs.fontFamily.OPS700,
                        }}>
                        {moment(item.date).format('MMM')}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#1B1A1A',
                        fontFamily: configs.fontFamily.OPS600,
                        marginBottom: 4,
                      }}>
                      {item.title}
                    </Text>
                    <Text>
                      {item.from_time &&
                        item.to_time &&
                        this.getTimeRangeOfEvent(item.from_time, item.to_time)}
                    </Text>
                  </View>
                </View>
              )}
            />
          </>
        )}
      </View>
    );
  };
  getTimeFormat = (time) => {
    var data = time.split(':');
    var hours = parseInt(data[0]);
    var min = data[1];
    // var sec = data[2];
    var output = '';
    if (hours < 12) {
      if (hours < 10) output = '0' + hours;
      else output = hours;

      let minute = parseInt(min);
      if (minute < 10) {
        output += ':0' + minute + ' AM';
      } else {
        output += ':' + minute + ' AM';
      }
    } else {
      if (hours === 12) {
        output = hours + ':' + min + ' PM';
      } else {
        let h = hours - 12;
        if (h < 10) {
          output = '0' + h;
        } else {
          output = h;
        }
        let mm = parseInt(min);
        if (mm < 10) {
          output += ':0' + mm + ' PM';
        } else {
          output += ':' + mm + ' PM';
        }
      }
    }
    return output;
  };
  getTimeRangeOfEvent = (f_time, t_time) => {
    var from_time = this.getTimeFormat(f_time);
    var to_time = this.getTimeFormat(t_time);
    // var f_time_array = f_time.split(':');
    // var t_time_array = t_time.split(':');
    // var c_time =
    //   f_time_array[0] +
    //   ':' +
    //   f_time_array[1] +
    //   ' - ' +
    //   t_time_array[0] +
    //   ':' +
    //   t_time_array[1];
    return from_time + ' - ' + to_time;
  };

  _renderLoading = () => {
    return (
      <View style={{height: '100%', width: configs.width}}>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item marginHorizontal={16}>
            <SkeletonPlaceholder.Item
              height={144}
              width={'90%'}
              borderRadius={10}
              marginBottom={20}></SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              height={12}
              width={'40%'}
              borderRadius={10}
              margin={3}
            />
            <SkeletonPlaceholder.Item
              height={42}
              width={'100%'}
              borderRadius={10}
              margin={3}
            />
            <SkeletonPlaceholder.Item
              height={42}
              width={'100%'}
              borderRadius={10}
              margin={3}
            />
            <SkeletonPlaceholder.Item
              height={42}
              width={'100%'}
              borderRadius={10}
              margin={3}
            />
            <SkeletonPlaceholder.Item
              height={42}
              width={'100%'}
              borderRadius={10}
              margin={3}
            />
            <SkeletonPlaceholder.Item
              height={42}
              width={'100%'}
              borderRadius={10}
              margin={3}
            />
            <SkeletonPlaceholder.Item
              height={42}
              width={'100%'}
              borderRadius={10}
              margin={3}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </View>
    );
  };

  formatDate = (string) => {
    var options = {year: 'numeric', month: 'long', day: 'numeric'};
    return new Date(string).toLocaleDateString([], options);
  };

  customDatesStylesFunc = (date) => {
    var dates = this.formatDate(date);
    // console.log(dates);
    var selectDate = this.formatDate(this.state.selectedDate);
    if (dates === selectDate) {
      //   console.log(selectDate +"-"+ dates);
      return {
        dateNameStyle: {color: 'white', fontWeight: 'bold'},
        dateNumberStyle: {color: 'white'},

        dateContainerStyle: {
          backgroundColor: '#F6D102',
          height: 80,
          elevation: 5,
          marginHorizontal: 5,
          borderRadius: 20,
          width: width / 7 - 10,
        },
      };
    } else {
      return {
        dateNameStyle: {color: 'black', fontWeight: 'bold'},
        dateNumberStyle: {color: 'black'},
        dateContainerStyle: {
          backgroundColor: 'white',
          width: width / 7 - 10,
          height: 80,
          borderRadius: 20,
          elevation: 1,
          marginHorizontal: 5,
        },
      };
    }
  };

  greetingByTime = () => {
    const currentHour = moment().format('HH');
    // console.log(currentHour);

    if (currentHour >= 0 && currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  changeMonthCount = (newMonth) => {
    const preSelectedMonth = this.state.selectedMonth; // 12
    const currentSelectedMonth = parseInt(newMonth); // 1
    this.setState({
      count: currentSelectedMonth - preSelectedMonth,
    });
    this.Calendar.onUpdatedMonthChange(currentSelectedMonth - preSelectedMonth);
  };

  onChangeSelectedMonth = (data) => {
    const t_date = moment().year() + '-' + data.value + '-01';
    const s_date = moment(t_date).clone().startOf('month').format('YYYY-MM-DD');
    const e_date = moment(t_date).clone().endOf('month').format('YYYY-MM-DD');

    this.setState({
      selectedMonth: parseInt(data.value),
    });

    if (this.props.userInfo.user_type == 'parent')
      if (this.props.studentInfo != undefined)
        this.props.fetchAllAttendanceForDotsCalendar(
          this.props.studentInfo.id,
          s_date,
          e_date,
          () => console.log('can get attendance data'),
        );

    this.onChangeMonth(data);
  };

  _filterObjectByValue = (obj, predicate) =>
    Object.keys(obj)
      .filter((key) => predicate(obj[key]))
      .reduce((res, key) => ((res[key] = obj[key]), res), {});

  _onDayPressCalendar = (date) => {
    let {
      student_attendance_calendar,
      userInfo,
      fetchAllEvents,
      studentInfo,
      events,
      fetchCalendarViewOfEventsOrSchedule,
      selected_class_index,
    } = this.props;

    this.props.setSelectedDate(date.dateString);

    this.setState({
      selectedMarkedDate: {
        [date.dateString]: {selected: true},
      },
      refreshing: true,
    });

    let centre_id =
      userInfo.user_type == 'parent'
        ? studentInfo != undefined &&
          studentInfo != {} &&
          studentInfo.centre_id != undefined
          ? studentInfo.centre_id[0]
          : undefined
        : userInfo.centre_id[0];
    let class_id =
      userInfo.user_type == 'parent'
        ? studentInfo != undefined &&
          studentInfo != {} &&
          studentInfo.class_id != undefined
          ? studentInfo.centre_id[0]
          : undefined
        : userInfo.class[selected_class_index].id;
    if (centre_id != undefined && class_id != undefined) {
      fetchCalendarViewOfEventsOrSchedule(
        moment(date.dateString).format('YYYY-MM-DD'),
        moment(date.dateString).format('YYYY-MM-DD'),
        userInfo.user_type == 'parent'
          ? studentInfo.centre_id[0]
          : userInfo.centre_id[0],
        userInfo.user_type == 'parent'
          ? studentInfo.class_id[0]
          : userInfo.class[selected_class_index].id,
        'schedule_only',
        'all',
        userInfo.user_type == 'parent' ? studentInfo.id : undefined,
      );
    }

    let item = moment(date.dateString);

    var temp = [
      moment(item).subtract(3, 'days'),
      moment(item).subtract(2, 'days'),
      moment(item).subtract(1, 'days'),
      moment(item),
      moment(item).add(1, 'days'),
      moment(item).add(2, 'days'),
      moment(item).add(3, 'days'),
    ];
    this.setState({
      selectedMonthForCalendarRow: moment(item).format('MM'),
      weekDays: temp,
      selectedMonth: moment(item).format('M'), //drop down month
    });

    this.setState({
      selectedDate: moment(date.dateString),
    });

    this.setState({
      refreshing: false,
    });
  };

  _onCheckRegisterAction = () => {
    let event = this.state.selectedEvent;
    if(
      event.register_link !== "" &&
      event.register_link !== undefined 
    ){
      utilities.openURLInBrowser(event.register_link);
    }else{
      console.log("reach here reg event btn click >> else " + this._isRegisteredEventByParent(event.id));
      this._isRegisteredEventByParent(event.id) === true ? console.log("Attending event") : this._onRegisterAction();
    }
  }

  getButtonTextForEvent = (event) => {
    if(
      event.register_link !== "" &&
      event.register_link !== undefined 
    ){
      return "For Info/ Sign up";
    }else{
      return this._isRegisteredEventByParent(event.id) === true ? "Attending" : "For Info/ Sign up";
    }
  }

  _onRefresh = () => {
    this.setState({
      isRefreshing: true,
    });
    this.props.setSelectedDate(moment());
    this.props.userInfo.user_type == 'parent' &&
      this.props.getGeneralDonation();

    const {
      getSetting,
      userInfo,
      fetchCalendarViewOfEventsOrSchedule,
      studentInfo,
      selected_class_index,
    } = this.props;

    this.props.checkNotificationIsRead(
      this.props.userInfo.id,
      this.props.userInfo.user_type,
    );

    //this.onInitializingNotification();

    this.props.getScheduleColors();

    this.props.fetchHolidaysDate(null, null);

    getSetting(userInfo.id, userInfo.user_type);

    this.props.userInfo.user_type == 'parent' && this.props.fetchDonationList();

    if (userInfo.user_type == 'parent') {
      this.gettingStudentInfo();
    } else {
      const centre_id = userInfo.centre_id[0];
      const class_id = userInfo.class[selected_class_index].id;
      fetchCalendarViewOfEventsOrSchedule(
        moment().format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
        centre_id,
        class_id,
        'schedule_only',
        'all',
        undefined,
      );
    }

    // setTimeout(() => {
    this.setState({
      markedDates: this._setMarkedDates(),
      isInitializing: false,
      isRefreshing: false,
    });
  };

  _renderCentreClosed = (isHoliday,isCentreClosed) => {
    const {holidaysDate} = this.props;
    let tempDate = {};
    if (isHoliday == true) {
      const date = moment(this.state.selectedDate).format('YYYY-MM-DD');
      tempDate = holidaysDate.filter((d) => d.date == date)[0];
    }

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: configs.height / 2,
        }}>
        <Image
          source={require('../../assets/icons/ic_closed.png')}
          style={{width: 96, height: 80, marginBottom: 15}}
        />
        <Text>
          <Text
            style={{
              color: '#D8DAFA',
              fontSize: 18,
              fontWeight: '600',
              fontFamily: configs.fontFamily.OPS700,
            }}>
            Closed Today
          </Text>
        </Text>
        {isHoliday == true && (
          <>
            <Space height={10} />
            <Text style={{
              color: configs.colors.primaryColor,
              fontSize: 18,
              fontWeight: '600',
              fontFamily: configs.fontFamily.OPS700,
            }}>
              {tempDate.name}
            </Text>
          </>
        )}
        {isCentreClosed == true && (
          <>
            <Space height={10} />
            <Text style={{
              color: configs.colors.primaryColor,
              fontSize: 18,
              fontWeight: '600',
              fontFamily: configs.fontFamily.OPS700,
            }}>
              {this.getCalendarScheduleData(true)[0].schedules[0].description}
            </Text>
          </>
        )}
      </View>
    );
  };

  getFilterDonationListForIOS = () => {
    const {carousel_list} = this.props;

    if(Platform.OS == 'ios')
      return carousel_list.filter((d) => d.type != 'donation');
    else
      return carousel_list;
  };
  

  render() {
    const {userInfo, selected_class_index, carousel_list} = this.props;

    var filteredCarouselList = this.getFilterDonationListForIOS();

    const year = moment(this.state.selectedDate).format('Y');
    const day =
      parseInt(moment(this.state.selectedDate).format('D')) < 10
        ? '0' + moment(this.state.selectedDate).format('D')
        : moment(this.state.selectedDate).format('D');
    const month =
      this.state.selectedMonth < 10
        ? '0' + this.state.selectedMonth
        : this.state.selectedMonth;
    const currentMonth = `${year}-${month}-${day}`;

    let isHoliday = this.checkHolidayDate(this.state.selectedDate);

    let isCentreClosed = this._checkCentreClosed();


    return (
      <View style={styles.container}>
        <NotificationHandler />
        {Platform.OS === 'ios' 
        ? PushNotificationIOS.getDeliveredNotifications((deliveredNotifications) => {
            const deliveredNotificationsCount = deliveredNotifications ? deliveredNotifications.length : 0; 
            console.log('delivered Noti count : ' + deliveredNotificationsCount);
            PushNotificationIOS.setApplicationIconBadgeNumber(deliveredNotificationsCount)
        }): null}
        <CollapsibleToolbar
          title={this.greetingByTime()}
          userName={userInfo.name}
          headerColor={configs.colors.primaryColor}
          headerColorDark={configs.colors.primaryColor}
          image={require('../../assets/images/home_header.png')}
          backPress={this.backPress}
          type={configs.HEADER_TYPE.HOME_PAGE}
          data={this.props}
          navigation={this.props.navigation}
          appBarHeight={70}
          refreshState={this.state.isRefreshing}
          refreshing={this._onRefresh}
          scrollRef={this.myRef}>
          <View>
            <View
              style={{
                ...(Platform.OS !== 'android' && {
                  zIndex: 100,
                }),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 16,
                  justifyContent: 'space-between',
                  width,
                }}>
                <View>
                  <DropdownV2
                    selectedValue={this.state.selectedMonth}
                    style={[styles.dropdownViewStyle]}
                    textStyle={{
                      color: configs.colors.primaryColor,
                      fontWeight: '700',
                      fontSize: 14,
                      paddingLeft: 10,
                      flex: 1,
                    }}
                    dropDownStyle={{
                      backgroundColor: 'white',
                      width: 120,
                      marginTop: Platform.OS == 'ios' ? 5 : -18,
                      marginLeft: Platform.OS == 'ios' ? -6 : -11,
                    }}
                    dropdownTextStyle={{fontSize: 13, textAlign: 'center'}}
                    options={months}
                    onChangeSelected={this.onChangeSelectedMonth}
                    datas={months}
                    containerText={{
                      justifyContent: 'center',
                      textAlign: 'center',
                      paddingVertical: 8,
                    }}
                    dropdownTextHighlightStyle={{
                      color: 'grey',
                    }}
                    iconStyle={{width: 10, height: 8, marginRight: 15}}
                  />
                </View>
              </View>

              <View
                style={{
                  marginTop: this.state.selected_active === 'weekly' ? -10 : 20,
                }}>
                {this.state.selected_active === 'weekly' ? (
                  <CalendarRow
                    selectedDate={this.state.selectedDate}
                    selectedMonthForCalendarRow={
                      this.state.selectedMonthForCalendarRow
                    }
                    weekDays={this.state.weekDays}
                    onBackPress={() => this.onBackPress()}
                    onForwardPress={() => this.onForwardPress()}
                    onChangeDate={(item) =>
                      this.onChangeDate({item, type: 'onClick'})
                    }
                    markedDots={this.props.holidaysDate}
                    events={this.props.events}
                    student_attendance_calendar={
                      this.props.student_attendance_calendar
                    }
                  />
                ) : this.state.selected_active === 'monthly' ? (
                  <View style={styles.calendar}>
                    <Calendar
                      onRef={(ref) => (this.Calendar = ref)}
                      current={currentMonth}
                      markedDates={
                        this.state.refreshing === true
                          ? {}
                          : JSON.parse(JSON.stringify(this.state.markedDates))
                      }
                      // headerShown={false}
                      // headerShown={true}
                      markingType={'multi-dot'}
                      style={{
                        borderRadius: 20,
                      }}
                      onMonthChange={(date) => {
                        this.setState({
                          markedDates: {...this._setMarkedDates()},
                        });
                        // this.monthChangeCalendar(date);
                      }}
                      onDayPress={this._onDayPressCalendar}
                      disableAllTouchEventsForDisabledDays
                      theme={{
                        // calendarBackground: '#E6F1FC',
                        textSectionTitleColor: 'black',
                        textSectionTitleDisabledColor: 'gray',
                        // dayTextColor: "black",
                        todayTextColor: configs.colors.primaryColor,
                        selectedDayTextColor: 'white',
                        selectedDayBackgroundColor: '#F6D102',
                        textDayFontSize: 12,
                        textDisabledColor: configs.colors.grey,
                        textDayFontWeight: '700',
                        'stylesheet.calendar.header': {
                          week: {
                            marginTop: 5,
                            fontWeight: 'bold',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          },
                        },
                      }}
                    />
                  </View>
                ) : null}
              </View>
              
              <Space height={20} />
              
              {this.props.is_loading_calendar_view_of_events_or_schedules ==
                true || this.props.isIntializingApp == true ? (
                this._renderLoading()
              ) : (
                <View>
                  {(userInfo !== null && filteredCarouselList != undefined && filteredCarouselList.length>0) ? (
                    userInfo.user_type === 'parent' ? (
                      <View style={{marginHorizontal: -1}}>
                       
                        <Carousel
                            ref={(c) => (this._slider1Ref = c)}
                            data={filteredCarouselList}
                            renderItem={this._renderItemWithParallaxDonation}
                            sliderWidth={sliderWidth}
                            itemWidth={itemWidth}
                            // activeSlideAlignment={'center'}
                            hasParallaxImages={true}
                            firstItem={SLIDER_1_FIRST_ITEM}
                            inactiveSlideScale={0.94}
                            inactiveSlideOpacity={0.7}
                            // inactiveSlideShift={20}
                            layout="default"
                            containerCustomStyle={styles.slider}
                            contentContainerCustomStyle={styles.sliderContentContainer}
                            loop={true}
                            loopClonesPerSide={2}
                            autoplay={true}
                            autoplayDelay={500}
                            autoplayInterval={3000}
                            onSnapToItem={(index) =>
                              this.setState({slider1ActiveSlide: index})
                            }
                          />
                          <Pagination
                            dotsLength={filteredCarouselList.length > 8 ? 8 : filteredCarouselList.length}
                            activeDotIndex={this.state.slider1ActiveSlide % 8 }
                            containerStyle={styles.paginationContainer}
                            dotColor={'#4075FF'}
                            dotStyle={styles.paginationDot}
                            inactiveDotColor={'#DADADA'}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={1}
                            inactiveDotStyle={styles.inactiveDot}
                            carouselRef={this._slider1Ref}
                            tappableDots={!!this._slider1Ref}
                          />
                         
                      </View>
                    ) : null
                  ) : null}

                  {(userInfo != null && userInfo != undefined) ? (
                    userInfo.user_type === 'facilitator' ? (
                      <TouchableOpacity 
                        style={styles.ClassSelectorContainer}
                        onPress={()=> {
                          this.RBSheet.open();
                        }} 
                        activeOpacity={0.6}>
                        <View style={styles.ClassContentContainer}>
                          <Text style={{
                            fontSize: 16,
                            lineHeight: 22,
                            color: configs.colors.primaryColor,
                            fontFamily: configs.fontFamily.OPS700,
                            marginHorizontal: 20,
                          }}>{"Class " + userInfo.class[selected_class_index].name}</Text>
                        <Image
                          source={require('../../assets/icons/ic_class_switch.png')}
                          style={{
                            height: 16,
                            width: 24,
                            marginRight: 20,
                          }}
                      />
                        </View>
                      </TouchableOpacity>
                      
                    ) : null
                  ) : null}

                  { (userInfo.user_type === 'parent') ? 
                    filteredCarouselList != undefined || filteredCarouselList.length > 0 
                    ? <Space height={20} /> 
                    : null
                    : <Space height={20} /> 
                  }

                  <View style={{marginHorizontal: 16}}>
                    {isHoliday == true || isCentreClosed == true ? (
                      this._renderCentreClosed(isHoliday,isCentreClosed)
                    ) : this.getCalendarScheduleData(false).length <= 0 ? (
                      this.getCalendarScheduleData(false).length <= 0 &&
                      this.getScheduleItems().length <= 0 && (
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: configs.height / 2,
                          }}>
                          <Image
                            source={require('../../assets/icons/ic_empty_cal.png')}
                            style={{
                              width: 140,
                              height: 64,
                              marginBottom: 15,
                              resizeMode: 'contain',
                            }}
                          />
                          <Text
                            style={{
                              color: '#CAD9FC',
                              fontSize: 14,
                              fontWeight: '600',
                              fontFamily: configs.fontFamily.OPS700,
                            }}>
                            No Schedule
                          </Text>
                        </View>
                      )
                    ) : (
                      <View>
                        <Text style={{fontSize: 16, fontWeight: '700'}}>
                          {userInfo.user_type === 'parent'
                            ? this.props.studentInfo &&
                              this.props.studentInfo != {} &&
                              this.props.studentInfo != null &&
                              this.props.studentInfo.name + "'s"
                            : 'Class'}{' '}
                          activities
                        </Text>
                        <Space height={10} />

                        {this.getCalendarScheduleData(false).map(
                          (activity, index) => (
                            <TouchableOpacity
                              disabled={
                                this.props.userInfo.user_type === 'parent'
                                  ? this.getScheduleItems().length > 0
                                    ? false
                                    : true
                                  : false
                              }
                              onPress={() => { this._scrollEnd(this.myRef)
                                  
                              }}
                              key={index}
                              style={{marginVertical: 3, height: 48}}>
                              <HomeActivity
                                data={activity}
                                color={this.getScheduleColorsByIndex(index)}
                              />
                            </TouchableOpacity>
                          ),
                        )}
                      </View>
                    )}
                  </View>

                  <Space height={20} />

                  {/*  Body  */}
                  {this.renderWeeklyBody(this.props.navigation)}
                </View>
              )}

              <Space height={20} />
              {userInfo.user_type === 'facilitator' ? (
                <RBSheet
                  ref={(ref) => {
                    this.RBSheet = ref;
                  }}
                  closeOnDragDown={true}
                  dragFromTopOnly={true}
                  openDuration={250}
                  customStyles={{
                    wrapper: {
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  },
                  container: {
                    height: 'auto',
                    paddingHorizontal: 25,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  },
                  draggableIcon: {
                    width: 40,
                    height: 5,
                    marginTop: 18,
                    backgroundColor: configs.colors.lightgrey,
                  },
                }}>
                <View>

                  <Text style={{
                    color: configs.colors.black, 
                    fontSize: 16, 
                    lineHeight: 22,
                    fontFamily: configs.fontFamily.OPS700,
                    marginTop: 25,}}>
                    Switch the class
                  </Text>

                  {/* <RadioForm formHorizontal={false} animation={true}> */}
                  {userInfo.class.map((obj, i) => (
                    <RadioButton
                      labelHorizontal={true}
                      key={i}
                      style={{marginVertical: 25}}>
                      <TouchableOpacity 
                        activeOpacity={0.6}
                        onPress={()=>{
                          this.props.saveSelectedClass(i);
                          reset('NavigationRoutes');
                        }}
                        style={{flex: 1}}
                      >
                      <Text 
                        style={{
                          flex: 1,
                          fontSize: 16,
                          lineHeight: 22,
                          color: selected_class_index === i ? configs.colors.primaryColor : configs.colors.black,
                          fontFamily: configs.fontFamily.OPS400,
                      }}>
                        Class {obj.name}
                      </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        activeOpacity={0.6}
                        onPress={()=>{
                          this.props.saveSelectedClass(i);
                          reset('NavigationRoutes');
                        }}>
                        {selected_class_index === i 
                        ?<Image
                          source={require('../../assets/icons/ic_selected.png')}
                          style={{width: 24, height: 24}}
                        />
                        :<Image
                          source={require('../../assets/icons/ic_unselect.png')}
                          style={{width: 24, height: 24}}
                        />}
                      </TouchableOpacity>
                    
                    </RadioButton>
                  ))}
                  {/* </RadioForm> */}
                
                </View>

                <Space height={50} />
              </RBSheet>):null}

              <RBSheet
                closeOnPressBack
                dragFromTopOnly={true}
                closeOnDragDown={true}
                ref={(ref) => {
                  this.RBSheetEvent = ref;
                }}
                dragFromTopOnly={true}
                openDuration={250}
                customStyles={{
                  container: styles.bottomSheetContainer,
                }}
                closeOnDragDown>
            {/* <Ionicons
              name="close-circle-outline"
              color={configs.colors.primaryColor}
              size={34}
              style={{position: 'absolute', top: 10, right: 10}}
              onPress={()=>{
                this.RBSheet.close();
              }}
            /> */}
            <ScrollView style={styles.bottomSheetBody} showsVerticalScrollIndicator={false}>
              {/* {renderBottomSheet()} */}

              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={styles.dots}></View>
                  <Text
                    style={{marginLeft: 10, fontSize: 16, fontWeight: 'bold'}}>
                    Event
                  </Text>
                </View>
              </View>

              {this.state.selectedEvent != {} &&
                this.state.selectedEvent != undefined && (
                  <View>
                    <View
                      style={{
                        borderWidth: 1,
                        borderRadius: 10,
                        borderColor: '#00000020',
                        marginTop: 10,
                      }}>
                      {this.state.selectedEvent.img_url == undefined ? (
                        <Image
                          source={require('../../assets/images/placeholder_image.png')}
                          style={{
                            borderTopRightRadius: 10,
                            borderTopLeftRadius: 10,
                            height: 200,
                            width: '100%',
                          }}
                        />
                      ) : (
                        <ImageLoad
                          style={{height: 140, width: '100%'}}
                          loadingStyle={{size: 'small', color: 'white'}}
                          // borderRadius={40}
                          borderTopLeftRadius={10}
                          borderTopRightRadius={10}
                          placeholderStyle={{
                            borderTopRightRadius: 10,
                            borderTopLeftRadius: 10,
                            height: 140,
                            width: '100%',
                          }}
                          source={{
                            uri: this.state.selectedEvent.img_url,
                            cache: 'force-cache',
                          }}
                          placeholderSource={require('../../assets/images/placeholder_image.png')}
                        />
                      )}
                      <View
                        style={{
                          paddingHorizontal: 20,
                          paddingVertical: 20,
                        }}>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              color: '#939494',
                              fontWeight: '600',
                            }}>
                            {moment(this.state.selectedEvent.date)
                              .format('YYYY MMM DD ddd')
                              .toString() + ", "}
                          </Text>
                          <Text style={{color: '#939494', fontWeight: '600'}}>
                            {" " + this.state.selectedEvent.from_time &&
                              this.state.selectedEvent.to_time &&
                              this.getTimeRangeOfEvent(
                                this.state.selectedEvent.from_time,
                                this.state.selectedEvent.to_time,
                              )}
                          </Text>
                        </View>

                        <Text style={{fontWeight: '600', fontSize: 16, lineHeight: 20}}>
                          {this.state.selectedEvent.title}
                        </Text>
                        <View style={{height: 16}}></View>
                        <Text>{this.state.selectedEvent.description}</Text>
                      </View>
                    </View>

                    {this.props.userInfo.user_type == 'parent' && (
                      <View>
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            backgroundColor: configs.colors.primaryColor,
                            paddingTop: 14,
                            paddingBottom: 15,
                            paddingLeft: 19,
                            paddingRight: 24,
                            marginVertical: 20,
                            borderRadius: 99999999,
                          }}
                          onPress={
                            this._onCheckRegisterAction
                            // this._onRegisterAction
                          }>
                          <Text
                            style={{
                              color: configs.colors.white,
                              fontFamily: configs.fontFamily.OPS700,
                              fontSize: 14,
                              textAlign: 'center',
                            }}>
                            {this.getButtonTextForEvent(this.state.selectedEvent)}  
                          </Text>
                        </TouchableOpacity>

                        { (this.state.selectedEvent.event_file != undefined
                         && this.state.selectedEvent.event_file != ''
                          && this.state.selectedEvent.event_file != null
                          && this.state.selectedEvent.event_file != 'null') &&
                        (<TouchableOpacity
                          style={{
                            flex: 1,
                            backgroundColor: configs.colors.white,
                            paddingTop: 14,
                            paddingBottom: 15,
                            paddingLeft: 19,
                            paddingRight: 24,
                            marginBottom: 20,
                            borderRadius: 99999999,
                            borderColor: configs.colors.primaryColor,
                            borderWidth: 1,
                          }}
                          onPress={this._onDownloadClick}>
                          <Text
                            style={{
                              color: configs.colors.primaryColor,
                              fontFamily: configs.fontFamily.OPS700,
                              fontSize: 14,
                              textAlign: 'center',
                            }}>
                            Download PDF
                          </Text>
                        </TouchableOpacity>)}

                      </View>
                    )}
                  </View>
                )}
            </ScrollView>
          </RBSheet>
            </View>
          </View>
        </CollapsibleToolbar>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.authState.userInfo,
    scheduleItem: state.homeState.scheduleItem,
    scheduleInfo: state.homeState.scheduleInfo,
    studentInfo: state.userState.studentInfo,
    is_loading: state.userState.is_loading,
    is_loading_calendar_view_of_events_or_schedules:
      state.homeState.is_loading_calendar_view_of_events_or_schedules,
    student_attendance_calendar: state.homeState.student_attendance_calendar,
    calendar_view_of_events_or_schedules:
      state.homeState.calendar_view_of_events_or_schedules,
    holidaysDate: state.homeState.holidaysDate,
    schedule_colors: state.homeState.schedule_colors,
    has_read: state.homeState.has_read,
    isIntializingApp: state.homeState.isIntializingApp,
    events: state.homeState.events,
    all_events_for_dots: state.homeState.all_events_for_dots,
    all_attendance_for_dots: state.homeState.all_attendance_for_dots,
    roomList: state.homeState.room_list,
    selected_class_index: state.homeState.selected_class_index,
    schedule_types: state.homeState.schedule_types,
    carousel_list: state.homeState.carousel_list,
    donationList: state.fundraisingState.donationList,
    parentEventData: state.homeState.parentEventData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLeaveType: () => {
      dispatch(homeAction.fetchLeaveType());
    },
    getScheduleTypes:() => dispatch( homeAction.getScheduleTypes()),
    fetchAllEventsForDots: (from_date, to_date, filtered_by, reg_status) =>
      dispatch(
        homeAction.fetchAllEventsForDots(
          from_date,
          to_date,
          filtered_by,
          reg_status,
        ),
      ),
    fetchHolidaysDate: (month, date) =>
      dispatch(homeAction.fetchHolidaysDate(month, date)),
    fetchScheduleItem: (id) => dispatch(homeAction.fetchScheduleItem(id)),
    fetchMerchandiseType: () => dispatch(homeAction.fetchMerchandiseType()),
    fetchScheduleInfo: (id) => dispatch(homeAction.fetchScheduleInfo(id)),
    setStudentInfo: (student_id, from_home, handleCallback) =>
      dispatch(
        userAction.setStudentInfo(student_id, from_home, handleCallback),
      ),
    fetchAllAttendanceForDotsCalendar: (
      student_id,
      start_date,
      end_date,
      handleCallback,
    ) =>
      dispatch(
        homeAction.fetchAllAttendanceForDotsCalendar(
          student_id,
          start_date,
          end_date,
        ),
        handleCallback,
      ),
    fetchAttendanceCalendarByStudent: (
      student_id,
      start_date,
      end_date,
      handleCallback,
      from_month,
      to_month,
    ) =>
      dispatch(
        homeAction.fetchAttendanceCalendarByStudent(
          student_id,
          start_date,
          end_date,
          handleCallback,
          from_month,
          to_month,
        ),
      ),
    fetchCalendarViewOfEventsOrSchedule: (
      from_date,
      to_date,
      centre_id,
      class_id,
      search_type,
      scfa,
      student_id,
    ) =>
      dispatch(
        homeAction.fetchCalendarViewOfEventsOrSchedule(
          from_date,
          to_date,
          centre_id,
          class_id,
          search_type,
          scfa,
          student_id,
        ),
      ),
    fetchDonationList: () => dispatch(fundraisingAction.fetchDonationList()),
    fetchAllEvents: (class_id, from_date, to_date, parent_id, handleCallback) =>
      dispatch(
        homeAction.fetchAllEvents(
          class_id,
          from_date,
          to_date,
          parent_id,
          handleCallback,
        ),
      ),
    setParentEventRegister: (event_id, parent_id,status, handleCallback) =>
      dispatch(
        homeAction.setParentEventRegister(event_id, parent_id,status, handleCallback),
      ),
    getSetting: (user_id, user_type) =>
      dispatch(userAction.getSetting(user_id, user_type)),
    getScheduleColors: () => dispatch(homeAction.getScheduleColors()),
    saveUserToken: (token) => dispatch(authAction.saveUserToken(token)),
    checkNotificationIsRead: (user_id, role) =>
      dispatch(homeAction.checkNotificationIsRead(user_id, role)),
    setInitializing: (value) => dispatch(homeAction.setInitializing(value)),
    setSelectedDate: (date) => dispatch(homeAction.setSelectedDate(date)),
    getGeneralDonation: () => dispatch(fundraisingAction.getGeneralDonation()),
    fetchMerchandiseType: () => dispatch(homeAction.fetchMerchandiseType()),
    getRoomList: (sender, handleCallback) =>
      dispatch(homeAction.getRoomList(sender, handleCallback)),
    fetchAllMerchandiseData: (
      isNext,
      all_merchandise_data_next_url,
      handleCallback,
    ) =>
      dispatch(
        homeAction.fetchAllMerchandiseData(
          isNext,
          all_merchandise_data_next_url,
          handleCallback,
        ),
      ),
    fetchMerchandiseDataByType: (merchandise_type_id, size) =>
      dispatch(
        homeAction.fetchMerchandiseDataByType(merchandise_type_id, size),
      ),
    saveSelectedClass: (value) => dispatch(homeAction.saveSelectedClass(value)),
    fetchDashboardCarousel: (class_id, handleCallback) => dispatch(homeAction.fetchDashboardCarousel(class_id, handleCallback)),
    fetchRegisterParentEventById: (filtered_by, parent_id) =>
      dispatch(homeAction.fetchRegisterParentEventById(filtered_by, parent_id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  FundraisingContainer: {
    height: 144,
    borderWidth: 1,
    borderColor: configs.colors.primaryColor,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#E5FAFF',
    width: configs.width - 60,
    marginRight: 10,
  },
  food_nutrition_container: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 23,
  },
  food_image: {
    height: 48,
    width: 48,
    borderColor: '#DADADA',
    borderWidth: 1,
    borderRadius: 8,
  },
  slider: {
    width: width,
    marginTop: 15,
    overflow: 'visible', // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 10, // for custom animation
  },
  container: {
    flex: 1,
    backgroundColor: configs.colors.backgroundColor,
  },
  headerContainer: {
    height: 210,
    backgroundColor: configs.colors.primaryColor,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerbody: {
    top: 50,
    position: 'absolute',
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    width,
  },
  calendar: {
    // height: 273,
    backgroundColor: 'white',
    borderRadius: 20,
    borderColor: '#f2f2f2',
    marginHorizontal: 16,
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 2,
    shadowColor: 'white',
    shadowOffset: {width: 0, height: 0.1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
    // elevation: 0.2,
    zIndex: 100,
  },
  attendance_card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: 'white',
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 0.3,
  },
  date_container: {
    borderRadius: 8,
    borderColor: configs.colors.primaryColor,
    borderWidth: 1,
    backgroundColor: '#E5FAFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 48,
    height: 48,
  },
  absence: {
    backgroundColor: '#F3B329',
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  dropdownViewStyle: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    // paddingHorizontal:10,
    paddingLeft: 13,
    borderBottomRightRadius: 30,
    shadowColor: 'white',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 15,
    zIndex: 1000,
    marginTop: 10,
    backgroundColor: '#E9F0FD',
    width: width / 3, // Drop Down
    height: 33,
    zIndex: 1000,
    justifyContent: 'center',
  },
  attend: {
    backgroundColor: '#7CD227',
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  paginationContainer: {
    paddingVertical: 8,
  },
  paginationDot: {
    width: 24,
    height: 8,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ClassSelectorContainer: {
    height: 48,
    
    backgroundColor: configs.colors.lightBlue,
    borderRadius: 20,
    borderColor: configs.colors.primaryColor,
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 16,
  },
  bottomSheetContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 'auto',
  },
  bottomSheetBody: {
    marginHorizontal: 20,
    marginVertical: 10,

    // height:"auto",
  },
  ClassContentContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
});
