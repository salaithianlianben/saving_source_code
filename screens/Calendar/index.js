import React, {Component, createRef} from 'react';
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Text,
  Image,
  RefreshControl,
  Dimensions,
  Linking,
  StatusBar,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {connect} from 'react-redux';
import AttendanceText from './attendanceText';
import configs from '../../utils/configs';
import {Calendar} from '../../components/calendars';
import moment from 'moment';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import homeAction from '../../actions/homeAction';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImageLoad from '../../components/ImageLoad';
import utilities from '../../utils/utilities';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import SliderEntry from '../../components/SliderEntry';
const DISABLED_DAYS = ['Saturday', 'Sunday'];

// Dot color
const notTakenAttendance = {key: 'noTaken', color: '#FFFFFF'};
const absence = {key: 'absence', color: '#F6D102'};
const event = {key: 'event', color: '#F66460'};
const SLIDER_1_FIRST_ITEM = 1;
const SLIDER_2_FIRST_ITEM = 1;
const {width} = Dimensions.get('window');

const horizontalMargin = 20;

const sliderWidth = Dimensions.get('window').width;
const itemWidth = sliderWidth - horizontalMargin * 2;

class CalendarsScreen extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    selectedDate: moment(),
    markedDates: {},
    isRefreshing: false,
    selectedMonth: parseInt(moment().format('M')),
    selectedMarkedDate: {
      [moment().format('YYYY-MM-DD')]: {selected: true},
    },
    is_day_pressing: false,
    is_loading_for_student_attendance: false,
    attendancingBtnActive: false,
    allBtnActive: true,
    is_fetching_student_attendance: false,
    selectedEvent: {},
    activeIndex: 0,
    slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
    slider2ActiveSlide: SLIDER_2_FIRST_ITEM,
  };

  componentDidMount() {
    this.onFirstLoad();
  }

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
        utilities.showToastMessage("Successful! You have downloaded event file.");
      });
  }

  onFirstLoad = () => {
    this.setState({
      is_loading_for_student_attendance: true,
      is_fetching_student_attendance: true,
    });
    const {
      fetchAllAttendanceForDotsCalendar,
      fetchRegisterParentEventById,
      studentInfo,
      userInfo,
      // getStudentAttendDetails,
      getAttendanceDetailsOfStudent,
    } = this.props;

    userInfo.user_type == 'parent' &&
      fetchAllAttendanceForDotsCalendar(
        studentInfo.id,
        moment().clone().startOf('month').format('YYYY-MM-DD'),
        moment().clone().endOf('month').format('YYYY-MM-DD'),
        this.handleCallback,
      );

    if (userInfo.user_type == 'facilitator') {
      this.setState({
        markedDates: {...this._setMarkedDates()},
      });
    }

    userInfo.user_type == 'parent' &&
      fetchRegisterParentEventById('parent_id', userInfo.id);

    userInfo.user_type == 'parent' &&
      getAttendanceDetailsOfStudent(
        studentInfo.class_id,
        moment().format('YYYY-MM-DD'),
        studentInfo.id,
        () =>
          this.setState({
            is_fetching_student_attendance: false,
          }),
      );
    //  getStudentAttendDetails(studentInfo.class_id,moment().format("YYYY-MM-DD"), studentInfo.id, (status) => console.log(status));
  };

  handleCallback = () => {
    let temp = this._setMarkedDates();
    this.setState(
      {
        markedDates: {...temp},
      },
      () => {
        this.Calendar.onRefresh();
        this.setState({
          is_loading_for_student_attendance: false,
        });
      },
    );
  };

  getDaysInMonth(month, year, days) {
    let pivot = moment().month(month).year(year).startOf('month');
    const end = moment().month(month).year(year).endOf('month');

    const dayOfDate = moment(this.state.selectedDate).format('dddd').toString();

    let dates = {};
    const disabled = {disabled: true, disableTouchEvent: false};

    //const disabled = {color: 'blue'}
    while (pivot.isBefore(end)) {
      days.forEach((day) => {
        if (dayOfDate == day)
          dates[pivot.day(day).format('YYYY-MM-DD')] = {
            ...disabled,
            selected: true,
            marked: true,
          };
        dates[pivot.day(day).format('YYYY-MM-DD')] = disabled;
      });
      pivot.add(7, 'days');
    }

    return dates;
  }

  _setMarkedDates = () => {
    const month =
      this.state.selectedMonth < 10
        ? '0' + this.state.selectedMonth
        : this.state.selectedMonth;
    const year = moment(this.state.selectedDate).format('Y');
    var TEMP = {};

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
        ...this.getDaysInMonth(month - 1, year, DISABLED_DAYS),
      };
    }

    TEMP = {
      ...this._addDotstoCalendar(TEMP),
    };

    return TEMP;
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

    //todo
    
   // Alert.alert(" title "+ data.title);
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
    console.log('onPressEvent');
    console.log(data);
   // Alert.alert(data);
   
    this.setState(
      {
        selectedEvent: {
          ...data, 
          isRegistered: this._getRegisteredEventsByEventID(data.id).length > 0 ? true : false},
      },
      () => this.RBSheet.open(),
    );
  }
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

    if (userInfo.user_type === 'parent') {
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
                              ? configs.colors.present_dot_color
                              : eve.status == 'absent'
                              ? configs.colors.absent_dot_color
                              : 'white',
                        },
                      ].concat(ttDots)
                    : [
                        {
                          key: 'record',
                          color:
                            eve.status == 'present'
                              ? configs.colors.present_dot_color
                              : eve.status == 'absent'
                              ? configs.colors.absent_dot_color
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
                          ? configs.colors.present_dot_color
                          : eve.status == 'absent'
                          ? configs.colors.absent_dot_color
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

    let allEvents = [];

    if (userInfo.user_type == 'parent') {
      allEvents = all_events_for_dots.filter(
        (ev) =>
          ev.centre_ids.includes(studentInfo.centre_id[0]) &&
          ev.class_ids.includes(studentInfo.class_id[0]) && ev.status != "inactive"
      );

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
                  ? [{key: 'event', color: configs.colors.event_dot_color}].concat(tempDots)
                  : [{key: 'event', color: configs.colors.event_dot_color}],
            };
          } else {
            temp = {
              ...temp,
              [element.date]: {
                marked: true,
                dots: [{key: 'event', color: configs.colors.event_dot_color}],
              },
            };
          }
        }
      }
    } else {
      allEvents = all_events_for_dots.filter(
        (ev) =>
          ev.centre_ids.includes(userInfo.centre_id[0]) &&
          ev.class_ids.includes(userInfo.class[selected_class_index].id) && ev.status != "inactive"
      );

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
                  ? [{key: 'event', color: configs.colors.event_dot_color}].concat(tempDots)
                  : [{key: 'event', color: configs.colors.event_dot_color}],
            };
          } else {
            temp = {
              ...temp,
              [element.date]: {
                marked: true,
                dots: [{key: 'event', color: configs.colors.event_dot_color}],
              },
            };
          }
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
            dots: [{key: 'holiday', color: configs.colors.holiday_dot_color}],
          };
        } else {
          temp = {
            ...temp,
            [element.date]: {
              marked: true,
              dots: [{key: 'holidays', color: configs.colors.holiday_dot_color}],
            },
          };
        }
      }
    }

    return temp;
  };

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

  onRefresh = () => {
    this.setState({
      isRefreshing: true,
    });
    this.onFirstLoad();
    this.setState({
      isRefreshing: false,
    });
  };

  getFilterDonationList = () => {
    const {donationList} = this.props;

    return donationList.filter((d) =>
      moment(this.state.selectedDate).isBetween(
        moment(d.from_date),
        moment(d.to_date),
      ) && d.id != 'yfKV6fLMxq8Q4SND4nyJ',
    );
  };

  handleCallbackRegister = (value, message) => {
    const {fetchRegisterParentEventById, userInfo} = this.props;
    if (value == true) {
      fetchRegisterParentEventById('parent_id', userInfo.id);
    } else {
      utilities.showToastMessage(message);
    }

    if(this.state.selectedEvent.register_link != '' &&
      this.state.selectedEvent.register_link != undefined &&
      this.state.selectedEvent.register_link != 'http://' &&
      this.state.selectedEvent.register_link != 'https://') {

        utilities.openURLInBrowser(this.state.selectedEvent.register_link);
    }
  };

  _onRegisterAction = () => {
    const {userInfo, setParentEventRegister} = this.props;

    this.RBSheet.close();

    if(!this.state.selectedEvent.isRegistered){
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

  _renderLoading = () =>{
    return (
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item marginHorizontal={20}>
          <SkeletonPlaceholder.Item height={45} width={'100%'} borderRadius={8} marginBottom={10}></SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    )
  }

  _renderAttendanceRateForLoading = (type) => {
    return (
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
          alignItems="center"
          justifyContent="center"
          marginTop={5}>
          <SkeletonPlaceholder.Item
            height={24}
            width={type == 'rate' ? 37 : 24}
            borderRadius={24}
            marginBottom={5}
          />
          <SkeletonPlaceholder.Item
            height={12}
            width={50}
            marginTop={5}
            borderRadius={10}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    );
  };

  _openEventFromNoti=(e)=>{
    let {parentEventData} = this.props;
    if (parentEventData){
      this.setState(
        {
          selectedEvent: {
            ...e, 
            isRegistered: this._getRegisteredEventsByEventID(e.id).length > 0 ? true : false},
        },
        () => this.RBSheet.open(),
      );
    }
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

  _getRegisteredEventsByDate = () => {
    let {parentEventData} = this.props;
    return parentEventData.filter(
      (ev) => ev.date == moment(this.state.selectedDate).format('YYYY-MM-DD'),
    );
  };

  _renderAttendanceAbsent = () => {
    const {student_attendance, all_attendance_for_dots} = this.props;
    let data = student_attendance ? student_attendance : undefined;
   
    let Status = all_attendance_for_dots != undefined && all_attendance_for_dots.length > 0 && all_attendance_for_dots.find(d => d.date == moment(this.state.selectedDate).format('YYYY-MM-DD') && d);
    
    return (
      <>
         {
           Status != undefined &&
           Status.status === 'absent' &&
           <>
            <View
            style={{
              ...styles.itemContainer,
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <View style={{flexDirection: 'column'}}>
              <Text
                style={{fontFamily: configs.fontFamily.OPS700, fontSize: 16}}>
                Leave of absence
              </Text>
              {data != undefined && data.reason != '' && data.details != '' && (
                <View
                  style={{
                    backgroundColor: configs.colors.absent_dot_color,
                    width: 'auto',
                    maxWidth: 200,
                    borderRadius: 99999,
                    paddingHorizontal: 10,
                  }}>
                  <Text numberOfLines={1} style={{color: '#fff'}}>
                    {data.reason != '' &&
                      data.details != '' &&
                      data.reason + '/' + data.details}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              disabled={data == undefined}
              onPress={() => {
                
                this.props.navigation.navigate('LeaveScreen', {
                  description: data != undefined ? data.details : '',
                  id: data != undefined ? data.id : '',
                  reason: data != undefined ? data.reason : '',
                  update: data != undefined ? true : false,
                  fromDate: data != undefined ? data.from_date : null,
                  endDate: data != undefined ? data.to_date : null,
                });
              }}>
              <Image
                style={{width: 40, height: 40}}
                source={require('../../assets/icons/ic_button_edit.png')}
              />
            </TouchableOpacity>
            </View>
           </>
         }
        
      
      </>
    );
  };

  _renderNoEventView = ()  =>{
    return (
    <View 
        style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 50,
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
        No Event
      </Text>
    </View>
    );
  }

  renderRegistedEvents = () => {
    return (
      <>
        {this._getRegisteredEventsByDate() &&
          this._getRegisteredEventsByDate().map((e, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                // this.onOpenBottomSheet();
                //this.setState({eventDataOne: e});
                // this.RBSheet.open();

                this.setState(
                  {
                    selectedEvent: {
                      ...e, 
                      isRegistered: this._getRegisteredEventsByEventID(e.id).length > 0 ? true : false},
                  },
                  () => this.RBSheet.open(),
                );
              }}
              style={{
                ...styles.itemContainer,
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{fontFamily: configs.fontFamily.OPS700, fontSize: 16}}>
                  {e.title}
                </Text>
                <Text style={{fontSize: 12}}>
                  {e.from_time &&
                    e.to_time &&
                    this.getTimeRangeOfEvent(e.from_time, e.to_time)}
                </Text>
              </View>

              <Image
                style={{width: 5, height: 12}}
                source={require('../../assets/icons/ic_arrow_right_blue.png')}
              />
            </TouchableOpacity>
          ))}
      </>
    );
  };

  _filterObjectByValue = (obj, predicate) =>
    Object.keys(obj)
      .filter((key) => predicate(obj[key]))
      .reduce((res, key) => ((res[key] = obj[key]), res), {});

  _onDayPressCalendar = (date) => {
    const {
      studentInfo,
      getAttendanceDetailsOfStudent,
      getStudentAttendDetails,
      userInfo,
    } = this.props;

    this.setState({
      is_fetching_student_attendance: true,
    });

    userInfo.user_type == 'parent' &&
      getAttendanceDetailsOfStudent(
        studentInfo.class_id,
        date.dateString,
        studentInfo.id,
        () =>
          this.setState({
            is_fetching_student_attendance: false,
          }),
      );
    // getStudentAttendDetails(studentInfo.class_id,"2021-05-11", studentInfo.id, (status) => console.log(status));
    this.setState({
      selectedMarkedDate: {
        [date.dateString]: {selected: true},
      },
      is_day_pressing: true,
    });

    let Temp = this.state.markedDates;

    var tempSelectedDate =
      Temp && this._filterObjectByValue(Temp, (data) => data.selected === true);

    if (
      tempSelectedDate !== null &&
      tempSelectedDate !== undefined &&
      JSON.stringify(tempSelectedDate) !== '{}'
    ) {
      tempSelectedDate[Object.keys(tempSelectedDate)].selected = false;
      tempSelectedDate[Object.keys(tempSelectedDate)].marked = false;

      Temp = {
        ...Temp,
        [Object.keys(tempSelectedDate)]:
          tempSelectedDate[Object.keys(tempSelectedDate)],
      };
    }

    var selectedDate = {[date.dateString]: {selected: true}};

    const allowed = Object.keys(selectedDate);

    if (Temp) {
      const simpleData = Temp
        ? Object.keys(Temp)
            .filter((key) => allowed.includes(key))
            .reduce((obj, key) => {
              return {
                ...obj,
                [key]: Temp[key],
              };
            }, {})
        : [];

      if (Object.keys(simpleData).length !== 0) {
        let getToUpdateDateKey = Object.keys(simpleData);

        let getToUpdateData = {...Temp[getToUpdateDateKey]};

        getToUpdateData.selected = true;
        getToUpdateData.marked = true;

        Temp[getToUpdateDateKey] = getToUpdateData;
      } else {
        Temp[date.dateString] = {selected: true};
      }
    }

    this.setState(
      {
        markedDates: Temp,
        selectedDate: moment(date.dateString),
        is_day_pressing: false,
      },
      () => this.Calendar.onRefresh(),
    );
  };
  renderCarouselEvents = () => {
    let {all_events_for_dots, studentInfo, userInfo, selected_class_index} = this.props;

    let allEvents = [];
    
    allEvents = all_events_for_dots.filter(
      (ev) => {
        return moment(ev.reg_to_date).isSameOrAfter(this.state.selectedDate) &&
        ev.centre_ids.includes(
          userInfo.user_type == 'parent'
          ? studentInfo.centre_id[0]
          : userInfo.centre_id[0]) &&
        ev.class_ids.includes(
          userInfo.user_type == 'parent'
          ? studentInfo.class_id[0]
          : userInfo.class[selected_class_index].id)
          && ev.status != "inactive"
    });
    
    return allEvents ? allEvents : [];
  }

  renderEvents = () => {
    let {all_events_for_dots, studentInfo, userInfo, selected_class_index} = this.props;
    // console.log(all_attendance_for_dots)
    let allEvents = [];
    
    allEvents = all_events_for_dots.filter(
      (ev) =>
        ev.date == moment(this.state.selectedDate).format('YYYY-MM-DD') &&
        ev.centre_ids.includes(
          (userInfo.user_type == 'parent'
            ? studentInfo.centre_id[0]
            : userInfo.centre_id[0])) &&
        ev.class_ids.includes(
          (userInfo.user_type == 'parent'
            ? studentInfo.class_id[0]
            : userInfo.class[selected_class_index].id))
             && ev.status != "inactive"
    );

    // let allevents = events.filter( (ev)=> ev.date == moment(this.state.selectedDate).format("YYYY-MM-DD"));
    // console.log(JSON.stringify(allEvents));
    return (
      <>
        {userInfo.user_type == 'parent'
          ? this._renderAttendanceAbsent()
          : null}
        {allEvents &&
          allEvents.map((e, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                // this.onOpenBottomSheet();
                this.setState(
                  {
                    selectedEvent: {
                      ...e, 
                      isRegistered: this._getRegisteredEventsByEventID(e.id).length > 0 ? true : false},
                  },
                  () => this.RBSheet.open(),
                );
              }}
              style={{
                ...styles.itemContainer,
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <View style={{flexDirection: 'column', flex: 0.9}}>
                <Text
                  numberOfLines={1}
                  style={{fontFamily: configs.fontFamily.OPS700, fontSize: 16}}>
                  {e.title}
                </Text>
                <Text style={{fontSize: 12}}>
                  {e.from_time &&
                    e.to_time &&
                    this.getTimeRangeOfEvent(e.from_time, e.to_time)}
                </Text>
              </View>

              <Image
                style={{width: 5, height: 12, marginRight: 3}}
                source={require('../../assets/icons/ic_arrow_right_blue.png')}
              />
            </TouchableOpacity>
          ))}
      </>
    );
  };


  renderEventsEmpty = () => {
    let {all_events_for_dots, studentInfo, userInfo, selected_class_index} = this.props;
    // console.log(all_attendance_for_dots)
    let allEvents = [];
    allEvents = all_events_for_dots.filter(
      (ev) =>
        ev.date == moment(this.state.selectedDate).format('YYYY-MM-DD') &&
        ev.centre_ids.includes(
          (userInfo.user_type == 'parent'
            ? studentInfo.centre_id[0]
            : userInfo.centre_id[0])) &&
        ev.class_ids.includes(
          (userInfo.user_type == 'parent'
            ? studentInfo.class_id[0]
            : userInfo.class[selected_class_index].id))
            && ev.status != "inactive"
    );
    
    // let allevents = events.filter( (ev)=> ev.date == moment(this.state.selectedDate).format("YYYY-MM-DD"));
    // console.log(JSON.stringify(allEvents));
    return allEvents ? allEvents : [];
  };

  getTimeRangeOfEvent = (f_time, t_time) => {
    var f_time_array = f_time.split(':');
    var t_time_array = t_time.split(':');
    var c_time =
      ' ' +
      f_time_array[0] +
      ':' +
      f_time_array[1] +
      ' - ' +
      t_time_array[0] +
      ':' +
      t_time_array[1];
    return c_time;
  };

  _getStatus = () => {
    const {all_attendance_for_dots = []} = this.props;
    const temp =
      all_attendance_for_dots != undefined
        ? all_attendance_for_dots.filter(
            (at) =>
              at.date == moment(this.state.selectedDate).format('YYYY-MM-DD'),
          )[0]
        : undefined;
    // console.log(temp);

    if (temp != undefined) {
      return temp.status;
    } else {
      return 'undefined';
    }
  };

  renderEventsLoader = () => {
    return (
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
          <SkeletonPlaceholder.Item marginLeft={20} marginBottom={10}>
            <SkeletonPlaceholder.Item
              width={10}
              height={10}
              borderRadius={20}
            />
            {/* <SkeletonPlaceholder.Item
              width={350}
              height={60}
              borderRadius={20}
            /> */}
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    );
  };
  
  renderAttendEmpty = () => {
     let attendStatus =   this.props.all_attendance_for_dots != undefined && this.props.all_attendance_for_dots.length > 0 && this.props.all_attendance_for_dots.find(d => d.date == moment(this.state.selectedDate).format('YYYY-MM-DD') && d);
     return attendStatus;
  }
  
  _isRegisteredEventByParent = ( event_id ) => {
    var isRegistered = this._getRegisteredEventsByEventID(event_id).length > 0 ? true :false;
    return isRegistered;
  }

  _onCheckRegisterAction = () => {
    let event = this.state.selectedEvent;
    if(
      event.register_link !== '' &&
      event.register_link !== undefined 
    ){
      utilities.openURLInBrowser(event.register_link);
    }else{
      this._isRegisteredEventByParent(event.id) === true ? console.log("Attending event") : this._onRegisterAction;
    }
  }

  getButtonTextForEvent = (event) => {
    if(
      event.register_link !== '' &&
      event.register_link !== undefined 
    ){
      return "For Info/ Sign up";
    }else{
      return this._isRegisteredEventByParent(event.id) === true ? "Attending" : "For Info/ Sign up";
    }
  }
  
  getFilterDonationListForIOS = () => {
    const {carousel_list} = this.props;

    if(Platform.OS == 'ios')
      return carousel_list.filter((d) => d.type != 'donation');
    else
      return carousel_list;
  };
  
  render() {
    const {
      all_attendance_for_dots,
      is_fetching_student_attendance,
      attendance_records,
      userInfo,
      carousel_list,
    } = this.props;

    var filteredCarouselList = this.getFilterDonationListForIOS();

    /*var filteredDonationList = this.getFilterDonationList();
    var filteredEventList = this.renderCarouselEvents();

    filteredDonationList =  filteredDonationList.map((item) => {
      return {...item, 'type': 'donation'};
    });
    filteredEventList =  filteredEventList.map((item) => {
      return {...item, 'type': 'event'};
    });
    const carouselList = [...filteredDonationList, ...filteredEventList];*/
   
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

    return (
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh}
            />
          }
          contentContainerStyle={{flexGrow: 1,}}
          nestedScrollEnabled={false}
          showsVerticalScrollIndicator={false}>
          <View style={{flex: 1, backgroundColor: configs.colors.loginColor}}>
            
            {userInfo != undefined && userInfo.user_type == 'parent' && (
              <View style={{marginHorizontal: -1, marginTop: -10}}>
               
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
                  removeClippedSubviews={false}
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
            )}

            {userInfo != undefined && userInfo.user_type == 'parent' && (
              <View
                  style={{
                    width: '100%',
                    marginTop: Platform.OS == 'ios' ? 0 : 10,
                    marginBottom: 24,
                  }}>
                  <View
                    style={{
                      height: 160,
                      borderRadius: 20,
                      backgroundColor: configs.colors.white,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.18,
                      shadowRadius: 1.0,
                      elevation: 1,
                      flexDirection: 'row',
                      paddingTop: 26,
                      paddingBottom: 14,
                      paddingLeft: 13,
                      paddingRight: 13,
                      marginLeft: 18,
                      marginRight: 18,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        ...(Platform.OS == 'ios' && {zIndex: 100}),
                      }}>
                      {is_fetching_student_attendance == true &&
                      this.state.is_loading_for_student_attendance == true ? (
                        this._renderAttendanceRateForLoading('rate')
                      ) : attendance_records != undefined &&
                        attendance_records.present != undefined ? (
                        <AttendanceText
                          amount={attendance_records.present}
                          title="Attendance"
                          color={configs.colors.lightgreen}
                        />
                      ) : (
                        <AttendanceText
                          amount={'0'}
                          title="Attendance"
                          color={configs.colors.lightgreen}
                        />
                      )}
                      <TouchableOpacity
                        style={{
                          backgroundColor: configs.colors.primaryColor,
                          marginVertical: 20,
                          width: width / 1.2,
                          height: 48,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 99999999,
                        }}
                        onPress={() =>
                          this.props.navigation.navigate('LeaveScreen', {
                            description: '',
                            id: '',
                            reason: '',
                            update: false,
                          })
                        }>
                        <Text
                          style={{
                            color: configs.colors.white,
                            fontFamily: configs.fontFamily.OPS700,
                            fontSize: 14,
                            textAlign: 'center',
                          }}>
                          Inform leave of absence
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{flex: 1}}>
                      {is_fetching_student_attendance == true &&
                      this.state.is_loading_for_student_attendance == true ? (
                        this._renderAttendanceRateForLoading('rate')
                      ) : attendance_records != undefined &&
                        attendance_records.absent != undefined ? (
                        <AttendanceText
                          amount={attendance_records.absent}
                          title="Leave of absence"
                          color={configs.colors.orange}
                        />
                      ) : (
                        <AttendanceText
                          amount={'0'}
                          title="Leave of absence"
                          color={configs.colors.orange}
                        />
                      )}
                    </View>

                    <View style={{flex: 1}}>
                      {is_fetching_student_attendance == true &&
                      this.state.is_loading_for_student_attendance == true ? (
                        this._renderAttendanceRateForLoading('rate')
                      ) : attendance_records != undefined &&
                        attendance_records.percent != undefined ? (
                        <AttendanceText
                          amount={attendance_records.percent}
                          title={`Attendance rate`}
                          color={configs.colors.primaryColor}
                        />
                      ) : (
                        <AttendanceText
                          amount={'0%'}
                          title={`Attendance rate`}
                          color={configs.colors.primaryColor}
                        />
                      )}
                    </View>
                  </View>
                </View>      
            )}

            <View
              style={{
                paddingTop: 0,
                backgroundColor: configs.colors.calendarbg,
                zIndex: 1,
              }}>
              <Calendar
                onRef={(ref) => (this.Calendar = ref)}
                enableSwipeMonths={true}
                current={currentMonth}
                markedDates={JSON.parse(JSON.stringify(this.state.markedDates))}
                renderArrow={(direction) => {
                  if (direction === 'left') {
                    return (
                      <Image
                        style={{height: 16, width: 8, resizeMode: 'stretch'}}
                        source={require('../../assets/icons/ic_arrow_left_blue.png')}
                      />
                    );
                  } else {
                    if (direction === 'right')
                      return (
                        <Image
                          style={{
                            height: 16,
                            width: 8,
                            resizeMode: 'stretch',
                          }}
                          source={require('../../assets/icons/ic_arrow_right_blue.png')}
                        />
                      );
                  }
                }}
                headerShown={true}
                markingType={'multi-dot'}
                onDayPress={this._onDayPressCalendar}
                onMonthChange={(date) => {
                  this.setState(
                    {
                      selectedMonth: date.month,
                    },
                    () =>
                      this.setState({
                        markedDates: {...this._setMarkedDates()},
                      }),
                  );
                  const start_date = moment(date.dateString)
                    .clone()
                    .startOf('month')
                    .format('YYYY-MM-DD');
                  const end_date = moment(date.dateString)
                    .clone()
                    .endOf('month')
                    .format('YYYY-MM-DD');
                  this.props.userInfo.user_type == 'parent' &&
                    this.props.fetchAllAttendanceForDotsCalendar(
                      this.props.studentInfo.id,
                      start_date,
                      end_date,
                      this.handleCallback,
                    );
                }}
                theme={{
                  calendarBackground: configs.colors.calendarbg,

                  todayTextColor: '#57B9BB',
                  // dayTextColor: configs.colors.grey,
                  textDayFontSize: 12,
                  textDisabledColor: configs.colors.grey,
                  textDayFontWeight: '700',
                  'stylesheet.calendar.header': {
                    dayHeader: {
                      color: configs.colors.primaryColor,
                      fontFamily: configs.fontFamily.OPS600,
                      fontSize: 12,
                      marginBottom: 20,
                    },
                  },
                  // textDisabledColor: '#d9e1e8',

                  monthTextColor: configs.colors.primaryColor,
                  arrowColor: configs.colors.primaryColor,

                  textDayFontFamily: configs.fontFamily.OPS600,
                  textDayFontSize: 14,

                  textMonthFontFamily: configs.fontFamily.OPS700,
                  textMonthFontSize: 16,

                  selectedDayBackgroundColor: configs.colors.primaryColor,
                  selectedDayTextColor: 'white',
                }}
              />
              <View style={{flexDirection: 'row', width: '100%', backgroundColor: configs.colors.calendarbg, marginVertical: 20}}>
                {userInfo.user_type == 'parent' && <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 16}}>
                  <View style={[configs.styles.agenda,{marginRight: 8, backgroundColor: configs.colors.present_dot_color}]} />  
                  <Text style={[configs.styles.font14_bold]}>Present</Text>
                </View>}
                {userInfo.user_type == 'parent' && <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 16}}>
                  <View style={[configs.styles.agenda,{marginRight: 8, backgroundColor: configs.colors.absent_dot_color}]} />
                  <Text style={[configs.styles.font14_bold]}>LOA</Text>
                </View>}
                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 16}}>
                  <View style={[configs.styles.agenda,{marginRight: 8, backgroundColor: configs.colors.holiday_dot_color}]} />
                  <Text style={[configs.styles.font14_bold]}>Holiday</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 16}}>
                  <View style={[configs.styles.agenda,{marginRight: 8, backgroundColor: configs.colors.event_dot_color}]} />
                  <Text style={[configs.styles.font14_bold]}>Event</Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 0,
                marginLeft: 24,
                marginRight: 24,
                marginTop: 20,
              }}>
              <Text
                style={{fontSize: 16, fontFamily: configs.fontFamily.OPS700}}>
                {/*2020 Aug 18 Fri*/}
                {moment(this.state.selectedDate).format('YYYY MMM DD ddd')}
              </Text>
            </View>

            {this._getStatus() == 'undefined' && this.renderEventsEmpty().length == 0 
            &&  this._getRegisteredEventsByDate().length == 0 
                ? this._renderNoEventView()
                : userInfo != undefined && userInfo.user_type == 'parent' ? (
                  <View style={{flex: 1}}>
                  <View
                    style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: this.state.allBtnActive
                          ? configs.colors.primaryColor
                          : '#fff',
                        paddingTop: 14,
                        paddingBottom: 15,
                        paddingLeft: 19,
                        paddingRight: 24,
                        marginVertical: 20,
                        width: width / 2.2,
                        borderRadius: 99999999,
                        borderColor: configs.colors.primaryColor,
                        borderWidth: 1,
                      }}
                      onPress={() =>
                        this.setState({
                          allBtnActive: true,
                          attendancingBtnActive: false,
                        })
                      }>
                      <Text
                        style={{
                          color: this.state.allBtnActive
                            ? configs.colors.white
                            : configs.colors.primaryColor,
                          fontFamily: configs.fontFamily.OPS700,
                          fontSize: 14,
                          textAlign: 'center',
                        }}>
                        All
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: this.state.attendancingBtnActive
                          ? configs.colors.primaryColor
                          : '#fff',
                        paddingTop: 14,
                        paddingBottom: 15,
                        paddingLeft: 19,
                        paddingRight: 24,
                        marginVertical: 20,
                        width: width / 2.2,
                        borderRadius: 99999999,
                        borderColor: configs.colors.primaryColor,
                        borderWidth: 1,
                      }}
                      onPress={() =>
                        this.setState({
                          allBtnActive: false,
                          attendancingBtnActive: true,
                        })
                      }>
                      <Text
                        style={{
                          color: this.state.attendancingBtnActive
                            ? configs.colors.white
                            : configs.colors.primaryColor,
                          fontFamily: configs.fontFamily.OPS700,
                          fontSize: 14,
                          textAlign: 'center',
                        }}>
                        Attending
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {this.state.attendancingBtnActive && this._getRegisteredEventsByDate().length == 0 && this._renderNoEventView()}
                  </View>
                )
                : null
            }
            {this.state.allBtnActive && this.renderEvents()}

            {/* { is_fetching_student_attendance == true ? this._renderAttendanceRateForLoading(): this.state.allBtnActive && this.renderEvents()} */}
            {userInfo != undefined && userInfo.user_type == 'parent' &&
              (is_fetching_student_attendance == true
                ? this._renderLoading()
                : this.state.attendancingBtnActive &&
                  this.renderRegistedEvents())}

          <RBSheet
            closeOnPressBack
            dragFromTopOnly={true}
            closeOnDragDown={true}
            ref={(ref) => {
              this.RBSheet = ref;
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
            <ScrollView style={styles.bottomSheetBody}>
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
                              .toString() + ','}
                          </Text>
                          <Text style={{color: '#939494', fontWeight: '600'}}>
                            {' ' + this.state.selectedEvent.from_time &&
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
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.authState.userInfo,
    all_events_for_dots: state.homeState.all_events_for_dots,
    all_attendance_for_dots: state.homeState.all_attendance_for_dots,
    donationList: state.fundraisingState.donationList,
    attendance_records: state.homeState.attendance_records,
    holidaysDate: state.homeState.holidaysDate,
    studentInfo: state.userState.studentInfo,
    is_fetching_student_attendance:
      state.homeState.is_fetching_student_attendance,
    parentEventData: state.homeState.parentEventData,
    student_attendance: state.homeState.student_attendance,
    studentAttendDetail: state.homeState.studentAttendDetail,
    selected_class_index: state.homeState.selected_class_index,
    carousel_list: state.homeState.carousel_list,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //   getStudentAttendDetails: (class_id, date, student_id, handleCallback) => dispatch(homeAction.getStudentAttendDetails(class_id, date, student_id, handleCallback)),
    fetchRegisterParentEventById: (filtered_by, parent_id) =>
      dispatch(homeAction.fetchRegisterParentEventById(filtered_by, parent_id)),
    setParentEventRegister: (event_id, parent_id,status, handleCallback) =>
      dispatch(
        homeAction.setParentEventRegister(event_id, parent_id,status, handleCallback),
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
          handleCallback,
        ),
      ),
    getAttendanceDetailsOfStudent: (
      class_id,
      date,
      student_id,
      handleCallback,
    ) =>
      dispatch(
        homeAction.getAttendanceDetailsOfStudent(
          class_id,
          date,
          student_id,
          handleCallback,
        ),
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: configs.colors.loginColor,
  },
  backgroundImage: {
    flex: 1,
    height: 234,
    width: 340,
    alignSelf: 'stretch',
    resizeMode: 'contain',
    marginTop: 52,
    marginLeft: 17,
    marginRight: 18,
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
  dots: {
    height: 10,
    width: 10,
    borderRadius: 10,
    backgroundColor: configs.colors.primaryColor,
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#00000080',
  },
  imageContainer: {
    height: configs.height / 2.55,
    backgroundColor: configs.colors.lightblue,
    alignContent: 'center',
  },
  itemContainer: {
    height: 72,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: configs.colors.white,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    marginLeft: 15,
    marginRight: 17,
    marginBottom: 12,
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
  FundraisingContainer: {
    height: 72,
    borderWidth: 1,
    borderColor: configs.colors.primaryColor,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E5FAFF',
    marginBottom: 10,
    marginTop: 30,
    width: configs.width - 39,
    marginHorizontal: 17,
  },
  slider: {
    width: width,
    marginTop: 15,
    overflow: 'visible', // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 10, // for custom animation
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
  }
});
