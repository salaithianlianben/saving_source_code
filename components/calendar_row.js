import React from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  Dimensions,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import configs from '../utils/configs';

// chevron-back

const {width, height} = Dimensions.get('window');

const months = [
  {value: moment().month('January').format('MM'), name: 'January'},
  {value: moment().month('February').format('MM'), name: 'February'},
  {value: moment().month('March').format('MM'), name: 'March'},
  {value: moment().month('April').format('MM'), name: 'April'},
  {value: moment().month('May').format('MM'), name: 'May'},
  {value: moment().month('June').format('MM'), name: 'June'},
  {value: moment().month('July').format('MM'), name: 'July'},
  {value: moment().month('August').format('MM'), name: 'August'},
  {value: moment().month('September').format('MM'), name: 'September'},
  {value: moment().month('October').format('MM'), name: 'October'},
  {value: moment().month('November').format('MM'), name: 'November'},
  {value: moment().month('December').format('MM'), name: 'December'},
];

export default class CalendarRow extends React.Component {
  renderDots = (data, item, events, attendances) => {
    if (data != undefined) {
      let temp = data.filter(
        (x) => x.date == moment(item).format('YYYY-MM-DD').toString(),
      )[0];
      // let eventR = events.filter(
      //   (e) => e.reg_to_date == moment(item).format('YYYY-MM-DD').toString(),
      // )[0];

      // let attendance = attendances.filter(
      //   (e) => e.date == moment(item).format('YYYY-MM-DD').toString(),
      // )[0];

      // return eventR && attendance ? (
      //   <View style={{display: 'flex', flexDirection: 'row'}}>
      //     <View style={[styles.dot, {backgroundColor: '#F66460'}]}></View>
      //     {attendance.status == 'absent' ? (
      //       <View style={[styles.dot, {backgroundColor: '#F3B329'}]}></View>
      //     ) : attendance.status == 'present' ? (
      //       <View style={[styles.dot, {backgroundColor: '#7CD227'}]}></View>
      //     ) : (
      //       <View style={styles.dot}></View>
      //     )}
      //   </View>
      // ) : temp ? (
      //   <View style={[styles.dot, {backgroundColor: '#7F00FF'}]}></View>
      // ) : eventR ? (
      //   <View style={[styles.dot, {backgroundColor: '#F66460'}]}></View>
      // ) : attendance ? (
      //   <>
      //     {attendance.status == 'absent' ? (
      //       <View style={[styles.dot, {backgroundColor: '#F3B329'}]}></View>
      //     ) : attendance.status == 'present' ? (
      //       <View style={[styles.dot, {backgroundColor: '#7CD227'}]}></View>
      //     ) : (
      //       <View style={styles.dot}></View>
      //     )}
      //   </>
      // ) : (
      //   <View style={styles.dot}></View>
      // );
      return temp ? (
        <View style={[styles.dot, {backgroundColor: '#7F00FF'}]}></View>
      ) : (
        <View style={styles.dot}></View>
      );
    } else {
      return <View style={styles.dot}></View>;
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            width,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <TouchableOpacity
            onPress={this.props.onBackPress}
            style={{marginLeft: 16}}>
            <Ionicons size={20} name="chevron-back" color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.props.onForwardPress}
            style={{marginRight: 16}}>
            <Ionicons size={20} name="chevron-forward" color="white" />
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal={true}
          style={{
            width,
            marginHorizontal: 8,
          }}
          data={this.props.weekDays}
          renderItem={({item}) => {
            var x = moment(this.props.selectedDate).format('YYYY-MM-DD');
            var y = moment(item).format('YYYY-MM-DD');
            var isTrue = moment(x).isSame(y);
            var isDisabled = moment(item).format("MM") !== this.props.selectedMonthForCalendarRow ;
            return (
              <TouchableOpacity
                //disabled={isDisabled}
                style={{
                  paddingVertical: 12,
                  backgroundColor: isTrue ? '#F6D102' : isDisabled == true ? "#DADADA" :'white',
                  marginHorizontal: 3.5,
                  height: height / 9,
                  borderRadius: 30,
                  alignItems: 'center',
                  width: width / 8 - 2,
                  justifyContent: 'space-around',
                  borderColor: '#d2d2d2',
                  borderWidth: 0.5,
                }}
                onPress={() => this.props.onChangeDate(item)}>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: 'bold',
                    color: isTrue ? 'white' : 'black',
                  }}>
                  {moment(item).format('ddd')}
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: isTrue ? 'white' : 'black',
                    marginBottom: 3,
                  }}>
                  {moment(item).format('DD')}
                </Text>
                {this.props.markedDots &&
                  this.renderDots(
                    this.props.markedDots,
                    item,
                    this.props.events,
                    this.props.student_attendance_calendar != undefined
                      ? this.props.student_attendance_calendar
                      : [],
                  )}
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  dot: {
    height: 5,
    width: 5,
    borderRadius: 10,
  },
});
