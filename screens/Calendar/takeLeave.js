import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TouchableHighlight,
  Alert,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import configs from '../../utils/configs';
import DropDownV2 from '../../components/dropdownV2';
import CalendarPicker from 'react-native-calendar-picker';
import Modal from 'react-native-modal';
import moment from 'moment';
import {connect} from 'react-redux';
import homeAction from '../../actions/homeAction';
import Loading from '../../components/Loading';
const {width} = Dimensions.get('window');
class TakeLeave extends Component {
  constructor(props){
    super(props);
    this.state = {
      showFromDatePicker: false,
      showEndDatePicker: false,
      fromDate: null,
      endDate: null,
      description: '',
      showUpdatedBtn: false,
      leaveTypes: [],
      selectedType: '',
      isAttendanceLoading: false,
      
    }
} 
  
  onChangeSelectedType = (data) => {
    this.setState({ selectedType: data.value});
    
  };
  changeDescription = (text) => {
    
    this.setState({description: text});
   
  };

  handleCallbackFromMakeAttendance = (success) => {
    if (success) {
      this.setState({isAttendanceLoading: false});
      this.props.navigation.replace('CalendarScreen');
    } else {
      Alert.alert('Unable to submit, please try again.');
    }
    //success === true && this.props.fetchAllAttendanceForDotsCalendar(this.props.studentInfo.id,moment().format("YYYY")+"-01-01",moment().format("YYYY")+"-12-31",()=>console.log('get attendance for dots calendar'));
    
  };

   componentDidMount() {

     
     const {description, fromDate, endDate, update, reason } = this.props.route.params;
     if(description) {
       this.setState({ description});
     }
     if(fromDate) {
       this.setState({ fromDate});
     }
     if(endDate) {
       this.setState({ endDate});
     }
     this.setState({ showUpdatedBtn: update});

     if(reason) {
       this.setState({selectedType: reason})
     }
    
    console.log(" leaves param : ");
    console.log(this.props.route.params);
  
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    // do things with nextProps.someProp and prevState.cachedSomeProp
    let dropdownData = [];
    nextProps.leaveTypes.map((x) => {
      dropdownData.push({
        label: x.name,
        value: x.name,
      });
    });

    return {
      leaveTypes: dropdownData,
      // ... other derived state properties
    };
    
  }
  render() {
    if(this.state.leaveTypes.length > 0) {
      var leave =  this.state.leaveTypes.find((_,i) => i == 0);
      var defaultLabel = leave.label;
    }
    return (
      <ScrollView>
      {
        this.props.isLoadingLeaveType && this.state.leaveTypes &&  <Loading />
      }

      {
        this.state.isAttendanceLoading &&  <Loading />
      }
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={{marginBottom: 20}}>
            <Text style={styles.title}>Date From</Text>
            <TouchableOpacity
              style={styles.drop}
              onPress={() => this.setState({showFromDatePicker:true})}>
              <View>
                <Text>
                  {/* {fromDate
                    ? fromDate.toString().slice(4, 15).split(' ').join('-')
                    : ''} */}
                  {this.state.fromDate}
                </Text>
              </View>
              <TouchableOpacity>
                <Image
                  source={require('../../assets/icons/ic_calendar_2.png')}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
          <View style={{marginBottom: 20}}>
            <Text style={styles.title}>To</Text>
            <TouchableOpacity
              style={styles.drop}
              onPress={() => this.setState({showEndDatePicker: true})}>
              <View>
                <Text>
                  {/* {endDate
                    ? endDate.toString().slice(4, 15).split(' ').join('-')
                    : ''} */}
                  {this.state.endDate}
                </Text>
              </View>
              <TouchableOpacity>
                <Image
                  source={require('../../assets/icons/ic_calendar_2.png')}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
          <View style={{marginBottom: 20}}>
            <Text style={styles.title}>Type</Text>

            <DropDownV2
              options={this.state.leaveTypes}
              selectedValue={this.state.selectedType == '' ? defaultLabel : this.state.selectedType}
              datas={this.state.leaveTypes}
              onChangeSelected={this.onChangeSelectedType}
              containerText={{
                justifyContent: 'center',
                textAlign: 'center',
                paddingVertical: 8,
              }}
              style={{
                borderWidth: 1,
                borderColor: '#DADADA',
                borderRadius: 999999,
                height: 44,
                paddingTop: 10,
                marginTop: 10,
              }}
              dropdownTextHighlightStyle={{
                color: 'grey',
              }}
              iconStyle={{width: 10, height: 8, marginRight: 15}}
              dropdownTextStyle={{fontSize: 13, textAlign: 'center'}}
              dropDownStyle={{
                // borderBottomLeftRadius: 30,
                // borderBottomRightRadius: 30,
                backgroundColor: 'white',
                width: width - 73,
                height: 110,
                marginTop: -10
              }}
              textStyle={{
                color: '#000',

                fontSize: 14,
                paddingLeft: 10,
                flex: 1,
              }}
            />
          </View>
          <View
            style={{
              borderColor: '#DADADA',
              borderWidth: 1,
              flexDirection: 'row',
              marginBottom: 30,
              borderRadius: 10,
            }}>
              
            <TextInput
             // defaultValue={this.state.description}
              multiline={true}
              numberOfLines={4}
              style={{width: '100%', justifyContent: 'flex-start', height: 60, textAlignVertical: 'top', paddingHorizontal: 10}}
              value={this.state.description}
              onChangeText={this.changeDescription}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={{...styles.btn, marginRight: 10}}
              onPress={() => this.props.navigation.goBack()}>
              <Text style={{color: '#4075FF', fontWeight: '700'}}>Cancel</Text>
            </TouchableOpacity>
            {this.state.showUpdatedBtn ? (
              <TouchableOpacity
                style={{...styles.btn, backgroundColor: '#4075FF'}}
                onPress={() => {
                
                   if(this.state.selectedType == '' || this.state.fromDate == null || this.state.endDate == null
                     || this.state.description == '' ) {
                     Alert.alert("Please fill in all the fields");
                   
                   } else if (this.state.fromDate > this.state.endDate) {
                     Alert.alert("Please fill the valid end date");
                   }
                   else {

                    this.setState({isAttendanceLoading: true});
                    this.props.makeAttendanceAlertUpdate(
                      this.props.route.params.id,
                      this.state.description,
                      this.state.selectedType,
                      this.props.userInfo.id,
                      this.state.fromDate,
                      this.state.endDate,
                      this.handleCallbackFromMakeAttendance,
                    )
                   }
               
                  }
                }>
                <Text style={{color: '#fff', fontWeight: '700'}}>Update</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{...styles.btn, backgroundColor: '#4075FF'}}
                onPress={() => {
                    var reason = this.state.selectedType == '' ? defaultLabel : this.state.selectedType;
                    if(reason == '' || this.state.fromDate == null || this.state.endDate == null || this.state.description == '') {
                      Alert.alert("Please fill in all the fields");
                    } else if (this.state.fromDate > this.state.endDate) {
                      Alert.alert("Please fill the valid end date");
                    } else {

                      this.setState({isAttendanceLoading: true});
                      this.props.makeAttendanceAlert(
                        this.props.studentInfo.id,
                        this.props.studentInfo.class_id[0],
                        this.props.studentInfo.centre_id[0],
                        reason,
                        this.state.description,
                        this.props.userInfo.id,
                        this.state.fromDate,
                        this.state.endDate,
                        this.handleCallbackFromMakeAttendance,
                      )
                    }
                 
                 } }>
                <Text style={{color: '#fff', fontWeight: '700'}}>Submit</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <Modal
        hasBackdrop={true}
        backdropColor={'#000000'}
        backdropOpacity={0.5}
        animationType="slide"
        statusBarTranslucent={true}
      //  transparent={false}
        isVisible={this.state.showFromDatePicker}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.'); //temporary behavior, retest on physical device
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{paddingHorizontal: 50, marginHorizontal: 10}}>
              <CalendarPicker
                onDateChange={(date) => {
                  this.setState({ fromDate : date.format('YYYY-MM-DD') });
                  console.log(this.state.fromDate);
                }}
                headerWrapperStyle={{ height: 30}}
                textStyle={{fontWeight: '700'}}
                monthTitleStyle={{color: '#4075FF'}}
                yearTitleStyle={{color: '#4075FF'}}
                todayTextStyle={{color: '#fff'}}
                selectedDayColor="#E9F0FD"
                todayBackgroundColor="#F6D102"
                previousTitleStyle={{ height: 30,}}
                nextTitleStyle={{ height: 30}}
                previousTitle={
                  <Image
                    style={{height: 20, width: 8, resizeMode: 'contain'}}
                    source={require('../../assets/icons/ic_arrow_left_blue.png')}
                  />
                }
                nextTitle={
                  <Image
                    style={{
                      height: 20,
                      width: 8,
                      resizeMode: 'contain',
                    }}
                    source={require('../../assets/icons/ic_arrow_right_blue.png')}
                  />
                }
              />
            </View>
            <TouchableHighlight
              style={styles.openButton}
              onPress={() => {
                this.setState({ showFromDatePicker: false});
              }}>
              <Text style={styles.textStyle}>Ok</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
      <Modal
        hasBackdrop={true}
        backdropColor={'#000000'}
        backdropOpacity={0.5}
        animationType="slide"
        statusBarTranslucent={true}
       // transparent={false}
        isVisible={this.state.showEndDatePicker}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.'); //temporary behavior, retest on physical device
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{paddingHorizontal: 50, marginHorizontal: 10}}>
              <CalendarPicker
                onDateChange={(date) => {
                  console.log('>>', date);
                  this.setState({ endDate: date.format('YYYY-MM-DD')});
                }}
                headerWrapperStyle={{ height: 30}}
                previousTitleStyle={{ height: 30,}}
                nextTitleStyle={{ height: 30}}
                textStyle={{fontWeight: '700'}}
                monthTitleStyle={{color: '#4075FF'}}
                yearTitleStyle={{color: '#4075FF'}}
                todayTextStyle={{color: '#fff'}}
                selectedDayColor="#E9F0FD"
                todayBackgroundColor="#F6D102"
                previousTitle={
                  <Image
                    style={{height: 20, width: 8, resizeMode: 'contain'}}
                    source={require('../../assets/icons/ic_arrow_left_blue.png')}
                  />
                }
                nextTitle={
                  <Image
                    style={{
                      height: 20,
                      width: 8,
                      resizeMode: 'contain',
                    }}
                    source={require('../../assets/icons/ic_arrow_right_blue.png')}
                  />
                }
              />
            </View>
            <TouchableHighlight
              style={styles.openButton}
              onPress={() => {
                this.setState({ showEndDatePicker: false});
               
              }}>
              <Text style={styles.textStyle}>Ok</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    leaveTypes: state.homeState.leave_types,
    userInfo: state.authState.userInfo,
    studentInfo: state.userState.studentInfo,
    isLoadingLeaveType: state.homeState.isLoadingLeaveType,
    isAttendanceAlertLoading: state.homeState.isAttendanceAlertLoading,

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLeaveType: () => {
      dispatch(homeAction.fetchLeaveType());
    },
    fetchAllAttendanceForDotsCalendar:(student_id,start_date,end_date,handleCallback) => dispatch(homeAction.fetchAllAttendanceForDotsCalendar(student_id,start_date,end_date,handleCallback)),

    makeAttendanceAlertUpdate: (
      id,
      details,
      reason,
      parent_id,
      from_date,
      to_date,
      handleCallBack,
    ) => {
      dispatch(
        homeAction.makeAttendanceAlertUpdate(
          id,
          details,
          reason,
          parent_id,
          from_date,
          to_date,
          handleCallBack,
        ),
      );
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
    ) =>
      dispatch(
        homeAction.makeAttendanceAlert(
          student_id,
          class_id,
          centre_id,
          reason,
          details,
          parent_id,
          from_date,
          to_date,
          handleCallback,
        ),
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TakeLeave);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: configs.colors.backgroundColor,
  },
  formContainer: {
    height: 609,
    backgroundColor: '#fff',
    width: width / 1.1,
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 15,
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: '600',
  },
  drop: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 999999,
    height: 45,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btn: {
    borderColor: '#4075FF',
    borderWidth: 1,
    width: width / 2.6,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    borderRadius: 999999,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#DADADA',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width,
  },
  openButton: {
    padding: 10,
    elevation: 2,
    width: 150,
    height: 48,
    backgroundColor: '#4075FF',
    borderRadius: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    height: '100%',
    alignSelf: 'center',
    paddingTop: 5,
    fontSize: 16,
  },
  modalText: {
    marginVertical: 20,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    color: '#000000',
  },
});