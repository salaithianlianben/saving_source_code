import * as React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {Calendar} from '../../components/calendars/index';
import configs from '../../utils/configs';

class CalendarEvent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        selectedDay: null,
        };
    }

    render() {
        const vacation = {key: 'vacation', color: 'red', selectedDotColor: 'blue'};
        const massage = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
        const workout = {key: 'workout', color: 'green'};

        return (
            <View style={{flex: 1}}>
                {/* <Calendar
                
                headerShow={true}
                theme={{
                    calendarBackground: configs.colors.calendarbg,

                    todayTextColor: '#57B9BB',
                    dayTextColor: configs.colors.grey,
                    'stylesheet.calendar.header': {
                    dayHeader: {
                        color: configs.colors.primaryColor,
                        fontFamily: configs.fontFamily.OPS600,
                        fontSize: 12,
                        marginBottom: 20,
                    },
                    },
                    textDisabledColor: '#d9e1e8',

                    monthTextColor: configs.colors.primaryColor,
                    arrowColor: configs.colors.primaryColor,

                    textDayFontFamily: configs.fontFamily.OPS600,
                    textDayFontSize: 14,

                    textMonthFontFamily: configs.fontFamily.OPS700,
                    textMonthFontSize: 16,

                    selectedDayBackgroundColor: configs.colors.primaryColor,
                    selectedDayTextColor: 'white',
                }}
                enableSwipeMonths={true}
                markedDates={{
                    '2020-11-30': {dots: [vacation, massage, workout], selected: true},
                    '2020-11-30': {
                    dots: {key: 'workout', color: 'green'},
                    selected: true,
                    },
                    '2020-12-29': {dots: [massage, workout]},
                }}
                markingType={'multi-dot'}
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
                            style={{height: 16, width: 8, resizeMode: 'stretch'}}
                            source={require('../../assets/icons/ic_arrow_right_blue.png')}
                        />
                        );
                    }
                }}
                /> */}
                <Calendar
                    onRef={ref => (this.Calendar = ref)}
                    enableSwipeMonths={true}
                    //   current={currentMonth}
                    //   markedDates={this.state.refreshing === true ? {} : JSON.parse(JSON.stringify(this.state.markedDates))}
                    // headerShown={false}
                    
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
                                style={{height: 16, width: 8, resizeMode: 'stretch'}}
                                source={require('../../assets/icons/ic_arrow_right_blue.png')}
                            />
                            );
                        }
                    }}
                    headerShown={true}
                    markingType={'multi-dot'}
                    //   onDayPress={this._onDayPressCalendar}
                    disableAllTouchEventsForDisabledDays
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
                            textDisabledColor: '#d9e1e8',

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
        );
    }
}
export default CalendarEvent;
