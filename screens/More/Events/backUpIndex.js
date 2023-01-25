import React, {Component, useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  StatusBar,
} from 'react-native';
// import {Calendar} from 'react-native-calendars';
import {Calendar} from '../../../components/calendars/index';
import configs from '../../../utils/configs';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RBSheet from 'react-native-raw-bottom-sheet';
import ArrivedStudents from './arrived_students';
import EventStudents from './event_students';
import AbsentStudents from './absent_students';
import UnfilledStudents from './unfilled_students';
import {connect} from 'react-redux';
// import Space from '../../../components/space';
import homeAction from '../../../actions/homeAction';
import Loading from '../../../components/Loading';
import ImageOverlap from './imageOverlap';

const DISABLED_DAYS = ['Saturday', 'Sunday'];
const event = {key: 'event', color: '#F66460'};
const holiday = {key: 'holiday', color: '#7F00FF'};

const data = [
  {id: 1, type: 'arrived', title: 'Arrived', code: '#7CD227'},
  {id: 2, type: 'absent', title: 'Absent', code: '#F3B329'},
  {id: 3, type: 'warrived', title: 'Will Attend', code: '#7CD227'},
  {id: 4, type: 'wabsent', title: 'Will Absent', code: '#F3B329'},
  {id: 5, type: 'unfilled', title: 'Unfilled', code: '#8DC3E9'},
  {id: 6, type: 'event', title: 'Event', code: '#F66460'},
];

//absent and arrived
const passDate = [
  {id: 1, type: 'arrived', title: 'Arrived', code: '#7CD227'},
  {id: 2, type: 'absent', title: 'Absent', code: '#F3B329'},
];

//will attend, will not attend and not indicated
const futureDate = [
  {id: 1, type: 'warrived', title: 'Will Attend', code: '#7CD227'},
  {id: 2, type: 'wabsent', title: 'Will Absent', code: '#F3B329'},
  {id: 3, type: 'unfilled', title: 'Not Indicated', code: '#8DC3E9'},
];

//arrived,absent and not indicated
const currentDate = [
  {id: 1, type: 'arrived', title: 'Arrived', code: '#7CD227'},
  {id: 2, type: 'absent', title: 'Absent', code: '#F3B329'},
  {id: 3, type: 'unfilled', title: 'Not Indicated', code: '#8DC3E9'},
];

const Space = ({height, width}) => {
  return <View style={{height, width}}></View>;
};

class EventsBackUpScreen extends Component {
  state = {
    selectedBottomSheetType: 'event',
    selectedDate: moment(),
    selectedMarkedDate: {},
    markedDates: {
      [moment().format('YYYY-MM-DD')]: {selected: true},
    },
    selectedMonth: parseInt(moment().format('M')),
    selectedDataEvent: [],
    selectedCurrentAttendance: [],
    selectedCurrentFutureAttendance: [],
    isFuture: false,
    selectedEventId: '',
    arrivedStudents: [],
    absentStudents: [],
    pendingStudents: [],
    futureAttend: [],
    futureAbsent: [],
    selectedDataHoliday: [],
    isFetching: false,
  };

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

  handleCallbackFromHoliday = () => {
    let {holidays} = this.props;

    if (holidays !== undefined && holidays !== null && holidays.length !== 0) {
      let getWholeValue = {...this.state.markedDates};
      const toStoreSelectedData = holidays.filter(
        (data) => data.date === this.getCurrentSelectedDateFormat(),
      );

      if (
        toStoreSelectedData !== undefined &&
        toStoreSelectedData.length !== 0
      ) {
        this.setState({selectedDataHoliday: toStoreSelectedData});
      }

      holidays.forEach((value) => {
        const temp = Object.keys(getWholeValue)
          .filter((key) => key === value.date)
          .reduce((obj, key) => {
            return {
              ...obj,
              [key]: getWholeValue[key],
            };
          }, {});

        if (
          temp !== null &&
          temp !== undefined &&
          JSON.stringify(temp) !== '{}'
        ) {
          let getValueToPus = {...getWholeValue[value.date]};

          if (getValueToPus.dots !== undefined && getValueToPus.dots !== null) {
            const findHoliday = getValueToPus.dots.filter(
              (key) => key === holiday,
            );

            if (findHoliday === undefined || findHoliday.length === 0) {
              getValueToPus.dots.push(holiday);
            }
          } else {
            let emptyArray = [];
            emptyArray.push(holiday);
            getValueToPus.dots = emptyArray;
          }
          getWholeValue[value.date] = getValueToPus;
        } else {
          let emptyJson = {dots: []};
          let emptyArray = emptyJson.dots;
          emptyArray.push(holiday);
          getWholeValue[value.date] = emptyJson;
        }
      });
      this.setState({
        markedDates: getWholeValue,
      });
    }
  };
  handleCallbackFromGetDataEvent = (from_date, to_date) => {
    let {events, getHoliday} = this.props;

    // this.props.clearEventPeopleData();
    let allevents = events.filter(
      (x) => x.centre_id == this.props.userInfo.centre_id[0],
    );

    if (
      allevents !== undefined &&
      allevents !== null &&
      allevents.length !== 0
    ) {
      let getWholeValue = {...this.state.markedDates};
      const toStoreSelectedData = allevents.filter(
        (data) => data.reg_to_date === this.getCurrentSelectedDateFormat(),
      );

      if (
        toStoreSelectedData !== undefined &&
        toStoreSelectedData.length !== 0
      ) {
        toStoreSelectedData.map((x) => {
          this.props.fetchEventPeopleById(x.id);
        });
        this.setState({selectedDataEvent: toStoreSelectedData});
      }

      allevents.forEach((value) => {
        const temp = Object.keys(getWholeValue)
          .filter((key) => key === value.reg_to_date)
          .reduce((obj, key) => {
            return {
              ...obj,
              [key]: getWholeValue[key],
            };
          }, {});

        if (
          temp !== null &&
          temp !== undefined &&
          JSON.stringify(temp) !== '{}'
        ) {
          let getValueToPus = {...getWholeValue[value.reg_to_date]};

          if (getValueToPus.dots !== undefined && getValueToPus.dots !== null) {
            const findEvent = getValueToPus.dots.filter((key) => key === event);

            if (findEvent === undefined || findEvent.length === 0) {
              getValueToPus.dots.push(event);
            }
          } else {
            let emptyArray = [];
            emptyArray.push(event);
            getValueToPus.dots = emptyArray;
          }
          getWholeValue[value.reg_to_date] = getValueToPus;
        } else {
          let emptyJson = {dots: []};
          let emptyArray = emptyJson.dots;
          emptyArray.push(event);
          getWholeValue[value.reg_to_date] = emptyJson;
        }
      });
      this.setState({
        markedDates: getWholeValue,
      });
    }
    getHoliday('', from_date, this.handleCallbackFromHoliday);
  };

  handleCallbackFromClass = () => {
    //pass

    let {
      isLoading,
      student_attendance_in_class,
      isLoadingClass,
      attendanceAlert,
    } = this.props;
    const arrivedStudents = student_attendance_in_class.filter(
      (data) => data.status === 'present',
    );
    const absentStudents = student_attendance_in_class.filter(
      (data) => data.status === 'absent',
    );
    const pendingStudents = student_attendance_in_class.filter(
      (data) => data.status === 'undefined',
    );
    const futureAttend = attendanceAlert.filter(
      (data) => data.will_attend === 1,
    );
    const futureAbsent = attendanceAlert.filter(
      (data) => data.will_attend === 0,
    );

    const willAttend = this.filterAttendanceFutureList(
      student_attendance_in_class,
      futureAttend,
      true,
    );
    const willNotAttend = this.filterAttendanceFutureList(
      student_attendance_in_class,
      futureAbsent,
      true,
    );
    const notIndicated = this.filterAttendanceFutureList(
      student_attendance_in_class,
      attendanceAlert,
      false,
    );

    if (this.getCurrentDate() > this.getSelectedDate()) {
      //pass
      this.setState({
        arrivedStudents: arrivedStudents,
        absentStudents: absentStudents,
        pendingStudents: [],
        futureAttend: futureAttend,
        futureAbsent: futureAbsent,
      });
    } else if (this.getCurrentDate() === this.getSelectedDate()) {
      //current
      this.setState({
        arrivedStudents: arrivedStudents,
        absentStudents: absentStudents,
        pendingStudents: pendingStudents,
        futureAttend: futureAttend,
        futureAbsent: futureAbsent,
      });
    } else if (this.getCurrentDate() < this.getSelectedDate()) {
      //future
      this.setState({
        arrivedStudents: willAttend,
        absentStudents: willNotAttend,
        pendingStudents: notIndicated,
        futureAttend: [],
        futureAbsent: [],
      });
    }
  };

  monthChangeCalendar = (date) => {
    let {fetchAllEvents, userInfo} = this.props;

    const startOfMonth = moment(date.dateString)
      .startOf('month')
      .format('YYYY-MM-DD');
    const endOfMonth = moment(date.dateString)
      .endOf('month')
      .format('YYYY-MM-DD');

    const getDisabledDate = this.getDaysInMonth(
      date.month - 1,
      date.year,
      DISABLED_DAYS,
    );

    getDisabledDate[
      moment(this.state.selectedDate).format('YYYY-MM-DD')
    ] = this.state.markedDates[
      moment(this.state.selectedDate).format('YYYY-MM-DD')
    ];
    this.setState({
      markedDates: getDisabledDate,
    });

    fetchAllEvents(
      this.props.userInfo.class_id[this.props.selected_class_index],
      startOfMonth,
      endOfMonth,
      '',
      this.handleCallbackFromGetDataEvent,
    );
  };

  onRefresh = () => {
    this.setState({isFetching: true});
    this.firstLoad();
    this.setState({isFetching: false});
  };
  firstLoad = () => {
    let {
      userInfo,
      fetchAllEvents,
      fetchAttendanceAlert,
      fetchStudentAttendanceByClass,
      selected_class_index,
    } = this.props;
    const month =
      this.state.selectedMonth < 10
        ? '0' + this.state.selectedMonth
        : this.state.selectedMonth;
    const year = moment(this.state.selectedDate).format('Y');

    const startOfMonth = moment(this.state.selectedDate)
      .startOf('month')
      .format('YYYY-MM-DD');
    const endOfMonth = moment(this.state.selectedDate)
      .endOf('month')
      .format('YYYY-MM-DD');
    const day = moment(this.state.selectedDate).format('YYYY-MM-DD');

    fetchAllEvents(
      userInfo.class_id[selected_class_index],
      startOfMonth,
      endOfMonth,
      '',
      this.handleCallbackFromGetDataEvent,
    );
    fetchAttendanceAlert(userInfo.class_id[selected_class_index], day);
    fetchStudentAttendanceByClass(
      userInfo.class_id[selected_class_index],
      day,
      this.handleCallbackFromClass,
    );
    var TEMP = {
      ...this.state.markedDates,
      ...this.getDaysInMonth(month - 1, year, DISABLED_DAYS),
    };

    this.setState({
      markedDates: TEMP,
    });
  };
  componentDidMount() {
    this.firstLoad();
  }

  _filterObjectByValue = (obj, predicate) =>
    Object.keys(obj)
      .filter((key) => predicate(obj[key]))
      .reduce((res, key) => ((res[key] = obj[key]), res), {});

  _onDayPressCalendar = (date) => {
    let {
      events,
      holidays,
      fetchAttendanceAlert,
      fetchStudentAttendanceByClass,
      userInfo,
      fetchEventPeopleById,
      resetEventPeople,
      selected_class_index,
    } = this.props;

    this.setState({
      selectedMarkedDate: {
        [date.dateString]: {selected: true},
      },
      selectedDate: date.dateString,
      arrivedStudents: [],
      absentStudents: [],
      pendingStudents: [],
      futureAttend: [],
      futureAbsent: [],
    });

    const day = moment(date.dateString).format('YYYY-MM-DD');

    // this.props.clearEventPeopleData();

    fetchAttendanceAlert(userInfo.class_id[selected_class_index], day);
    fetchStudentAttendanceByClass(
      userInfo.class_id[selected_class_index],
      day,
      this.handleCallbackFromClass,
    );
    //to store current selected event information
    if (events !== undefined && events !== null && event.length !== 0) {
      const toStoreSelectedData = events.filter(
        (data) =>
          data.reg_to_date === day &&
          data.centre_id === this.props.userInfo.centre_id[0],
      );
      // resetEventPeople();
      // toStoreSelectedData.map((s) => {
      //   return fetchEventPeopleById(s.id);
      // });

      if (
        toStoreSelectedData !== undefined &&
        toStoreSelectedData.length !== 0
      ) {
        toStoreSelectedData.map((x) => {
          this.props.fetchEventPeopleById(x.id);
        });
        this.setState({selectedDataEvent: toStoreSelectedData});
      } else {
        this.setState({selectedDataEvent: []});
      }
    } else {
      this.setState({selectedDataEvent: []});
    }

    //to store current selected holiday information
    if (holidays !== undefined && holidays !== null && holidays.length !== 0) {
      const toStoreSelectedDataholidays = holidays.filter(
        (data) => data.date === day,
      );

      if (
        toStoreSelectedDataholidays !== undefined &&
        toStoreSelectedDataholidays.length !== 0
      ) {
        this.setState({selectedDataHoliday: toStoreSelectedDataholidays});
      } else {
        this.setState({selectedDataHoliday: []});
      }
    } else {
      this.setState({selectedDataHoliday: []});
    }

    let Temp = this.state.markedDates;

    var tempSelectedDate = this._filterObjectByValue(
      Temp,
      (data) => data.selected === true,
    );

    if (
      tempSelectedDate !== null &&
      tempSelectedDate !== undefined &&
      JSON.stringify(tempSelectedDate) !== '{}'
    ) {
      tempSelectedDate[Object.keys(tempSelectedDate)].selected = false;
      tempSelectedDate[Object.keys(tempSelectedDate)].marked = false;

      Temp = {
        ...Temp,
        [Object.keys(tempSelectedDate)]: tempSelectedDate[
          Object.keys(tempSelectedDate)
        ],
      };
    }

    var selectedDate = {[date.dateString]: {selected: true}};

    const allowed = Object.keys(selectedDate);

    const simpleData = Object.keys(Temp)
      .filter((key) => allowed.includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: Temp[key],
        };
      }, {});

    if (Object.keys(simpleData).length !== 0) {
      let getToUpdateDateKey = Object.keys(simpleData);

      let getToUpdateData = {...Temp[getToUpdateDateKey]};

      getToUpdateData.selected = true;
      getToUpdateData.marked = true;

      Temp[getToUpdateDateKey] = getToUpdateData;
    } else {
      Temp[date.dateString] = {selected: true};
    }

    this.setState({
      markedDates: Temp,
    });
  };

  onOpenBottomSheet(type, data, isfuture, futureData) {
    this.setState({
      selectedBottomSheetType: type,
      isFuture: isfuture,
      selectedCurrentAttendance: data,
      selectedCurrentFutureAttendance: futureData,
    });

    this.RBSheet.open();
  }

  getEventColorCode = (type) => {
    var event = data.filter((e) => e.type === type)[0];

    return event.code;
  };

  getTitleDateFormat = () => {
    var str =
      moment(this.state.selectedDate).format('YYYY') +
      ' ' +
      moment()
        .month(moment(this.state.selectedDate).format('M'))
        .format('MMM') +
      ' ' +
      moment(this.state.selectedDate).format('D') +
      ' ' +
      moment(this.state.selectedDate).format('ddd');
    return str;
  };

  getSelectedDate = () => {
    return moment(this.state.selectedDate).format('YYYY-MM-DD');
  };

  getCurrentDate = () => {
    return moment().format('YYYY-MM-DD');
  };

  filterAttendanceFutureList = (
    student_attendance_in_class,
    attendanceAlert,
    isInclude,
  ) => {
    if (isInclude) {
      return student_attendance_in_class.filter(function (obj) {
        return attendanceAlert.some(function (obj2) {
          return obj.id == obj2.student_id;
        });
      });
    } else {
      return student_attendance_in_class.filter(function (obj) {
        return !attendanceAlert.some(function (obj2) {
          return obj.id == obj2.student_id;
        });
      });
    }
  };

  sendNotificationForParents = (students, futureStudents) => {
    let {setMultipleParentMessages, userInfo} = this.props;

    let filterResultParents = this.filterAttendanceFutureList(
      students,
      futureStudents,
      false,
    );

    let reduceAParentIds = [];

    filterResultParents.forEach((element) => {
      if (element.parent_id.length !== 0 && element.parent_id !== undefined) {
        let toPush = 0;
        element.parent_id.forEach((el) => {
          if (toPush === 1) {
            return;
          } else {
            if (el !== '' && toPush === 0) {
              reduceAParentIds.push(el);
              toPush = 1;
            }
          }
        });
      }
    });

    if (reduceAParentIds.length !== 0) {
      setMultipleParentMessages(
        userInfo.id,
        reduceAParentIds,
        this.handleCallbackSentParentMessages,
      );
    } else {
      alert('No parent to notify.');
    }
  };

  handleCallbackSentParentMessages = (isSuccess) => {
    isSuccess
      ? alert('Sent successfully')
      : alert('Unable to send, please try again.');
  };

  ImageOverlap = (data) => {
    //               {/** <Image source={{uri: e.uri}} style={[styles.image]}></Image> */}
    return (
      <View style={{flexDirection: 'row'}}>
        {data.slice(0, 5).map((e, index) => (
          <View
            key={index}
            style={[
              index > 0 && {marginLeft: -10},
              {zIndex: 100 - index * 10, flexDirection: 'row'},
            ]}>
            {data.img === '' ? (
              <Image
                source={require('../../../assets/icons/ic_avatar_more.png')}
                style={[styles.image]}
              />
            ) : (
              <Image source={{uri: data.img}} style={[styles.image]} />
            )}
            {index === data.length - 1 && data.length > 1 && (
              <Image
                source={require('../../../assets/icons/ic_avatar_more.png')}
                style={[styles.image, {marginLeft: -10, zIndex: -1000}]}
              />
            )}
          </View>
        ))}
        {/* <Image  source={require('../assets/boy.jpeg')} style={[styles.image,{ zIndex:2}]}></Image>
                <Image  source={require('../assets/boy.jpeg')} style={[styles.image,{ marginLeft:-40,zIndex:0}]}></Image> */}
      </View>
    );
  };

  render() {
    let {
      isLoading,
      // student_attendance_in_class,
      isLoadingClass,
      attendanceAlert,
      is_loading_for_event_people,
      // events,
      // eventPeopleData,
    } = this.props;

    // console.log(JSON.stringify(events));

    const selectedEvents = this.state.selectedDataEvent;
    const selectedDataHoliday = this.state.selectedDataHoliday;

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

    const renderBottomSheet = () => {
      switch (this.state.selectedBottomSheetType) {
        case 'arrived':
          return (
            <ArrivedStudents
              students={this.state.selectedCurrentAttendance}
              color={this.getEventColorCode('arrived')}
              isFuture={this.state.isFuture}
              futureStudents={this.state.selectedCurrentFutureAttendance}
              onClose={() => this.RBSheet.close()}
            />
          );

        case 'warrived':
          return (
            <ArrivedStudents
              students={this.state.selectedCurrentAttendance}
              color={this.getEventColorCode('arrived')}
              isFuture={this.state.isFuture}
              futureStudents={this.state.selectedCurrentFutureAttendance}
              onClose={() => this.RBSheet.close()}
            />
          );

        case 'absent':
          return (
            <AbsentStudents
              students={this.state.selectedCurrentAttendance}
              color={this.getEventColorCode('arrived')}
              isFuture={this.state.isFuture}
              futureStudents={this.state.selectedCurrentFutureAttendance}
              onClose={() => this.RBSheet.close()}
            />
          );
        case 'wabsent':
          return (
            <AbsentStudents
              students={this.state.selectedCurrentAttendance}
              color={this.getEventColorCode('arrived')}
              isFuture={this.state.isFuture}
              futureStudents={this.state.selectedCurrentFutureAttendance}
              onClose={() => this.RBSheet.close()}
            />
          );
        case 'event':
          const eventPeople = this.props.eventPeopleData.filter(
            (x) => x.event_id == this.state.selectedEventId,
          )[0];
          let eventPeopleDatas =
            eventPeople != undefined && eventPeople != {}
              ? eventPeople.data
              : [];

          return (
            <EventStudents
              students={this.state.selectedDataEvent}
              eventsData={this.state.selectedDataEvent}
              eventId={this.state.selectedEventId}
              onClose={() => this.RBSheet.close()}
              vacanciesCount={
                eventPeopleDatas != undefined
                  ? eventPeopleDatas.filter((x) => !x.attend_status).length
                  : 0
              }
              registeredCount={
                eventPeopleDatas != undefined
                  ? eventPeopleDatas.filter((x) => x.attend_status).length
                  : 0
              }
              eventPeopleData={
                eventPeopleDatas != undefined ? eventPeopleDatas : []
              }
              eventPeopleLoader={this.props.is_loading_for_event_people}
            />
          );

        case 'unfilled':
          return (
            <UnfilledStudents
              students={this.state.selectedCurrentAttendance}
              isFuture={this.state.isFuture}
              futureStudents={this.state.selectedCurrentFutureAttendance}
              onClose={() => this.RBSheet.close()}
              sendNotification={(students, futureStudents) => {
                this.sendNotificationForParents(students, futureStudents);
              }}
            />
          );

        default:
          return <View></View>;
      }
    };
    console.log(isLoading, isLoadingClass, is_loading_for_event_people);
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor={
            isLoading || isLoadingClass || is_loading_for_event_people
              ? '#00000020'
              : 'transparent'
          }
          barStyle="dark-content"
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.isFetching}
              onRefresh={this.onRefresh}
            />
          }>
          {(isLoading || isLoadingClass || is_loading_for_event_people) && (
            <Loading />
          )}

          <View>
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
                      source={require('../../../assets/icons/ic_arrow_left_blue.png')}
                    />
                  );
                } else {
                  if (direction === 'right')
                    return (
                      <Image
                        style={{height: 16, width: 8, resizeMode: 'stretch'}}
                        source={require('../../../assets/icons/ic_arrow_right_blue.png')}
                      />
                    );
                }
              }}
              headerShown={true}
              markingType={'multi-dot'}
              onDayPress={(date) => {
                this._onDayPressCalendar(date);
              }}
              onMonthChange={(date) => {
                this.monthChangeCalendar(date);
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
          </View>
          <View style={{paddingHorizontal: 15, paddingVertical: 20}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.dot}></View>
              <Text style={styles.title}>{this.getTitleDateFormat()}</Text>
            </View>
            <Space height={15} />

            {/*pass date*/}
            {this.getCurrentDate() > this.getSelectedDate() &&
              passDate.map((e, index) => (
                <TouchableOpacity
                  style={[styles.card]}
                  key={index}
                  onPress={() => {
                    this.onOpenBottomSheet(
                      e.type,
                      e.type === 'absent'
                        ? this.state.absentStudents
                        : this.state.arrivedStudents,
                      false,
                      e.type === 'absent' ? this.state.futureAbsent : [],
                    );
                  }}>
                  <View
                    style={[
                      {
                        backgroundColor: e.code,
                      },
                      styles.leftStyle,
                    ]}></View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      paddingHorizontal: 15,
                    }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          color: configs.colors.black,
                        }}>
                        {e.title}
                      </Text>
                      <Space height={5} />
                      <View>
                        <ImageOverlap
                          students={
                            e.type === 'absent'
                              ? this.state.absentStudents
                              : this.state.arrivedStudents
                          }
                          setFail={(id) => {
                            if (e.type === 'absent') {
                              const dataSet = [...this.state.absentStudents];
                              const existingIndex = this.state.absentStudents.findIndex(
                                (data) => data.id === id,
                              );

                              if (existingIndex >= 0) {
                                dataSet[existingIndex].fail = true;
                              }
                              this.setState({absentStudents: dataSet});
                            } else {
                              const dataSet = [...this.state.arrivedStudents];
                              const existingIndex = this.state.arrivedStudents.findIndex(
                                (data) => data.id === id,
                              );

                              if (existingIndex >= 0) {
                                dataSet[existingIndex].fail = true;
                              }

                              this.setState({arrivedStudents: dataSet});
                            }
                          }}
                        />
                        {/*this.ImageOverlap(e.type==="absent"?absentStudents:arrivedStudents )*/}
                      </View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View>
                        <Text
                          style={[
                            {
                              fontFamily: configs.fontFamily.OPS600,
                              fontSize: 32,
                            },
                            {color: e.code},
                          ]}>
                          {e.type === 'absent'
                            ? this.state.absentStudents.length
                            : this.state.arrivedStudents.length}
                        </Text>
                      </View>
                      <Space width={5} />
                      <Ionicons
                        name="chevron-forward"
                        size={24}
                        color={configs.colors.primaryColor}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

            {/*current date*/}
            {this.getCurrentDate() === this.getSelectedDate() &&
              currentDate.map((e, index) => (
                <TouchableOpacity
                  style={[styles.card]}
                  key={index}
                  onPress={() => {
                    this.onOpenBottomSheet(
                      e.type,
                      e.type === 'absent'
                        ? this.state.absentStudents
                        : e.type === 'arrived'
                        ? this.state.arrivedStudents
                        : this.state.pendingStudents,
                      false,
                      e.type === 'absent'
                        ? this.state.futureAbsent
                        : e.type === 'arrived'
                        ? this.state.futureAttend
                        : attendanceAlert,
                    );
                  }}>
                  <View
                    style={[
                      {
                        backgroundColor: e.code,
                      },
                      styles.leftStyle,
                    ]}></View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      paddingHorizontal: 15,
                    }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          color: configs.colors.black,
                        }}>
                        {e.title}
                      </Text>
                      <Space height={5} />
                      <View>
                        <ImageOverlap
                          students={
                            e.type === 'absent'
                              ? this.state.absentStudents
                              : e.type === 'arrived'
                              ? this.state.arrivedStudents
                              : this.state.pendingStudents
                          }
                          setFail={(id) => {
                            if (e.type === 'absent') {
                              const dataSet = [...this.state.absentStudents];
                              const existingIndex = this.state.absentStudents.findIndex(
                                (data) => data.id === id,
                              );

                              if (existingIndex >= 0) {
                                dataSet[existingIndex].fail = true;
                              }
                              this.setState({absentStudents: dataSet});
                            } else if (e.type === 'arrived') {
                              const dataSet = [...this.state.arrivedStudents];
                              const existingIndex = this.state.arrivedStudents.findIndex(
                                (data) => data.id === id,
                              );

                              if (existingIndex >= 0) {
                                dataSet[existingIndex].fail = true;
                              }

                              this.setState({arrivedStudents: dataSet});
                            } else {
                              const dataSet = [...this.state.pendingStudents];
                              const existingIndex = this.state.pendingStudents.findIndex(
                                (data) => data.id === id,
                              );

                              if (existingIndex >= 0) {
                                dataSet[existingIndex].fail = true;
                              }

                              this.setState({pendingStudents: dataSet});
                            }
                          }}
                        />
                        {/*this.ImageOverlap(e.type==="absent"?this.state.absentStudents: e.type==="arrived"? this.state.arrivedStudents:this.state.pendingStudents )*/}
                      </View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View>
                        <Text
                          style={[
                            {
                              fontFamily: configs.fontFamily.OPS600,
                              fontSize: 32,
                            },
                            {color: e.code},
                          ]}>
                          {e.type === 'absent'
                            ? this.state.absentStudents.length
                            : e.type === 'arrived'
                            ? this.state.arrivedStudents.length
                            : this.state.pendingStudents.length}
                        </Text>
                      </View>
                      <Space width={5} />
                      <Ionicons
                        name="chevron-forward"
                        size={24}
                        color={configs.colors.primaryColor}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

            {/*future date*/}
            {this.getCurrentDate() < this.getSelectedDate() &&
              futureDate.map((e, index) => (
                <TouchableOpacity
                  style={[styles.card]}
                  key={index}
                  onPress={() => {
                    this.onOpenBottomSheet(
                      e.type,
                      e.type === 'wabsent'
                        ? this.state.absentStudents
                        : e.type === 'warrived'
                        ? this.state.arrivedStudents
                        : this.state.pendingStudents,
                      true,
                      e.type === 'wabsent'
                        ? this.state.futureAbsent
                        : e.type === 'warrived'
                        ? this.state.futureAttend
                        : [],
                    );
                  }}>
                  <View
                    style={[
                      {
                        backgroundColor: e.code,
                      },
                      styles.leftStyle,
                    ]}></View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      paddingHorizontal: 15,
                    }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          color: configs.colors.black,
                        }}>
                        {e.title}
                      </Text>
                      <Space height={5} />
                      <View>
                        <ImageOverlap
                          students={
                            e.type === 'wabsent'
                              ? this.state.absentStudents
                              : e.type === 'warrived'
                              ? this.state.arrivedStudents
                              : this.state.pendingStudents
                          }
                          setFail={(id) => {
                            if (e.type === 'wabsent') {
                              const dataSet = [...this.state.absentStudents];
                              const existingIndex = this.state.absentStudents.findIndex(
                                (data) => data.id === id,
                              );

                              if (existingIndex >= 0) {
                                dataSet[existingIndex].fail = true;
                              }
                              this.setState({absentStudents: dataSet});
                            } else if (e.type === 'warrived') {
                              const dataSet = [...this.state.arrivedStudents];
                              const existingIndex = this.state.arrivedStudents.findIndex(
                                (data) => data.id === id,
                              );

                              if (existingIndex >= 0) {
                                dataSet[existingIndex].fail = true;
                              }

                              this.setState({arrivedStudents: dataSet});
                            } else {
                              const dataSet = [...this.state.pendingStudents];
                              const existingIndex = this.state.pendingStudents.findIndex(
                                (data) => data.id === id,
                              );

                              if (existingIndex >= 0) {
                                dataSet[existingIndex].fail = true;
                              }

                              this.setState({pendingStudents: dataSet});
                            }
                          }}
                        />
                        {/*this.ImageOverlap(e.type==="wabsent"?this.state.absentStudents: e.type==="warrived"? this.state.arrivedStudents:this.state.pendingStudents )*/}
                      </View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View>
                        <Text
                          style={[
                            {
                              fontFamily: configs.fontFamily.OPS600,
                              fontSize: 32,
                            },
                            {color: e.code},
                          ]}>
                          {e.type === 'wabsent'
                            ? this.state.absentStudents.length
                            : e.type === 'warrived'
                            ? this.state.arrivedStudents.length
                            : this.state.pendingStudents.length}
                        </Text>
                      </View>
                      <Space width={5} />
                      <Ionicons
                        name="chevron-forward"
                        size={24}
                        color={configs.colors.primaryColor}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

            {/*events*/}
            {selectedEvents.map((e, index) => (
              <TouchableOpacity
                style={[styles.card]}
                key={index}
                onPress={() => {
                  this.setState({selectedEventId: e.id});
                  this.onOpenBottomSheet('event');
                }}>
                <View
                  style={[
                    {
                      backgroundColor: '#F66460',
                    },
                    styles.leftStyle,
                  ]}></View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingHorizontal: 15,
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#F66460',
                      }}>
                      Event
                    </Text>
                    <Space height={5} />
                    <View>
                      <Text>{e.title}</Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Space width={5} />
                    <Ionicons
                      name="chevron-forward"
                      size={24}
                      color={configs.colors.primaryColor}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {/*holiday*/}
            {selectedDataHoliday.map((e, index) => (
              <View style={[styles.card]} key={index}>
                <View
                  style={[
                    {
                      backgroundColor: '#7F00FF',
                    },
                    styles.leftStyle,
                  ]}></View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingHorizontal: 15,
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        color: configs.colors.black,
                      }}>
                      Holiday
                    </Text>
                    <Space height={5} />
                    <View>
                      <Text>{e.name}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
          <View>
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
              <ScrollView style={styles.bottomSheetBody}>
                {renderBottomSheet()}
              </ScrollView>
            </RBSheet>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  card: {
    height: 72,
    borderColor: configs.colors.borderColor,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    marginVertical: 5,
    // shadowColor: '#f2f2f2',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.5,
    // shadowRadius: 1,
    // elevation: 1,
  },
  dot: {
    height: 12,
    width: 12,
    borderRadius: 12,
    backgroundColor: configs.colors.primaryColor,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  leftStyle: {
    width: 8,
    height: '100%',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  image: {
    borderRadius: 30,
    // position: 'absolute',
    width: 24,
    height: 24,
    borderColor: 'white',
    borderWidth: 1,
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
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.authState.userInfo,
    isLoading: state.homeState.isLoading,
    events: state.homeState.events,
    attendanceAlert: state.homeState.attendanceAlert,
    student_attendance_in_class: state.homeState.student_attendance_in_class,
    isLoadingClass: state.homeState.isLoadingClass,
    holidays: state.homeState.holidays,
    eventPeopleData: state.homeState.eventPeopleData,
    is_loading_for_event_people: state.homeState.is_loading_for_event_people,
    selected_class_index: state.homeState.selected_class_index,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
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
    fetchStudentAttendanceByClass: (class_id, date, handleCallback) =>
      dispatch(
        homeAction.fetchStudentAttendanceByClass(
          class_id,
          date,
          handleCallback,
        ),
      ),
    fetchEventPeopleById: (id) => dispatch(homeAction.fetchEventPeopleById(id)),
    fetchAttendanceAlert: (class_id, date) =>
      dispatch(homeAction.fetchAttendanceAlert(class_id, date)),
    setMultipleParentMessages: (sender, receiver, handleCallback) =>
      dispatch(
        homeAction.setMultipleParentMessages(sender, receiver, handleCallback),
      ),
    getHoliday: (this_month, month, handleCallback) =>
      dispatch(homeAction.getHoliday(this_month, month, handleCallback)),
    fetchEventPeopleById: (id) => dispatch(homeAction.fetchEventPeopleById(id)),
    resetEventPeople: () => dispatch(homeAction.resetEventPeople()),
    clearEventPeopleData: () => dispatch(homeAction.clearEventPeopleData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsBackUpScreen);
