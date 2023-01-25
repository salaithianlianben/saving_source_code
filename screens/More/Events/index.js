import React, {Component, createRef, useState } from 'react';
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
  Alert,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import configs from '../../../utils/configs';
import {Calendar} from '../../../components/calendars';
import moment from 'moment';
import {Space} from '../../../components/space';
import ImageOverlap from './imageOverlap';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import homeAction from '../../../actions/homeAction';
import RBSheet from 'react-native-raw-bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ImageLoad from '../../../components/ImageLoad';
import utilities from '../../../utils/utilities';
import PopSuccessfulSend from './success_popup';
import { isTemplateMiddle } from 'typescript';

const DISABLED_DAYS = ['Saturday', 'Sunday'];

// Dot color
const notTakenAttendance = {key: 'noTaken', color: '#FFFFFF'};
const absence = {key: 'absence', color: '#F6D102'};
const attend = {key: 'attend', color: '#7CD227'};
const event = {key: 'event', color: '#F66460'};
const holiday = {key: 'holiday', color: '#7F00FF'};

const {width} = Dimensions.get('window');


 
const AbsentComponent = ({ data, onSentMessageSuccess, onCloseButtonSheet, props}) => {


  const [ status, setStatus ] = useState('absent');
  const [ selectedStudent, setSelectedStudent ] = useState({});
  const [ description, setDescription ] = useState('');
  const [ room_id,setRoomId ] = useState('');

  const shortName = (text) =>{
    let arrayName = text.split(" ");
    return arrayName[0];
  }

  const { getRoomIdBetweenUsers,userInfo, sendMessageBetweenUsers} = props;

  return (
    <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 15,
            marginBottom: 20,
          }}>
          <View style={styles.dots}></View>
          <Text style={{paddingLeft: 10, fontWeight: 'bold', fontSize: 16}}>
            { status == "absent" ? "Absent" :"Message" }
          </Text>
        </View>

        {
          status == "absent" ? <View style={{height: data.length > 8 ? configs.height - 200 : 'auto'}}>
            <FlatList 
              data={data}
              renderItem={({item, index}) => (
              <View key={item.id} style={styles.absent_card}>
                <View style={{flex: 1, marginLeft: 3}}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: '#F3B329',
                      position: 'absolute',
                      right: 30,
                      zIndex: 1000,
                    },
                  ]}
                />
                {item.img != undefined && item.img != '' ? (
                  <ImageLoad
                    style={styles.imageArrived}
                    loadingStyle={{size: 'small', color: 'white'}}
                    borderRadius={30}
                    placeholderStyle={styles.imageArrived}
                    source={{uri: item.img, cache: 'force-cache'}}
                    placeholderSource={require('../../../assets/icons/ic_account.png')}
                  />
                ) : (
                  <Image
                    source={require('../../../assets/icons/ic_account.png')}
                    style={styles.imageArrived}
                  />
                )}
              </View>
                <View style={{flex: 4}}>
                  <Text style={styles.nameText}>{item.name}</Text>
                  {
                    item.reason != undefined && item.reason != "" && item.reason != null && <Text
                    style={{fontSize: 12, color: configs.colors.primaryColor}}>
                    {item.reason}
                  </Text>
                  }
                </View>
                <TouchableOpacity onPress={()=> {
                getRoomIdBetweenUsers(item.parent_id[0],userInfo.id,3,(status,room_id)=>{
                  if(status == true){
                    setRoomId(room_id);
                  }
                })
                setStatus("message");
                setSelectedStudent(item);
              }}>
                <Image
                  source={require('../../../assets/icons/ic_message.png')}
                  style={{width: 20, height: 20, resizeMode: 'contain',marginRight:10}}
                />
              </TouchableOpacity>
              </View>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
            <View style={{marginVertical: 10}}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => onCloseButtonSheet()}>
              <Text
              style={{
                fontFamily: configs.fontFamily.OPS700,
                fontSize: 14,
                color: configs.colors.white,
                }}>
                OK
                </Text>
              </TouchableOpacity>
            </View>
          </View> 
          : <View style={{height: 'auto'}}>
              {
                selectedStudent != {} && selectedStudent.parent && selectedStudent.parent.length > 0 ? 
                <View style={{
                  flexDirection:'row',
                  alignItems:'center',
                  justifyContent:'flex-start',
                  borderRadius:8,
                  borderWidth:1,
                  borderColor:'#DADADA',
                  paddingHorizontal:10,
                  paddingVertical:10,
                }}>
                  {
                    selectedStudent.parent[0].img && selectedStudent.parent[0].img != "" ? 
                    <ImageLoad
                      style={{
                        height:40,width:40,borderWidth:1,borderColor:configs.colors.primaryColor,borderRadius:40,
                      }}
                      borderRadius={40}
                      loadingStyle={{size: 'small', color: 'white'}}
                      placeholderStyle={{height:40,width:40,borderWidth:1,borderColor:configs.colors.primaryColor,borderRadius:40,}}
                      source={{uri: selectedStudent.parent[0].img, cache: 'force-cache'}}
                      placeholderSource={require('../../../assets/icons/ic_account.png')}
                    />
                    : <Image source={require('../../../assets/icons/ic_account.png')} style={{height:40,width:40,borderWidth:1,borderColor:configs.colors.primaryColor,borderRadius:40,}}/>
                  }
                  <View style={{marginLeft:10}}>
                    <Text style={{fontWeight:'600',fontSize:16,}}>{selectedStudent.parent[0].name}</Text>
                    <Text style={{color:configs.colors.grey,fontSize:12,fontWeight:'600'}}>{ shortName(selectedStudent.name)}{"'s "+ selectedStudent.parent[0].relationship}</Text>
                  </View>
                </View>
                : null
              }
            <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    borderColor: configs.colors.lightgrey,
                    marginTop: 10,
                  }}>
                  <TextInput
                    multiline={true}
                    onChangeText={(value) =>
                      setDescription(value)
                    }
                    value={description}
                    style={{
                      height: 120,
                      textAlignVertical: 'top',
                      paddingHorizontal: 15,
                      paddingVertical: 11,
                    }}
                  />
                </View>
            
            <View style={{marginVertical: 10,flexDirection:'row'}}>
              <TouchableOpacity
                style={styles.cancel_button}
                onPress={() => onCloseButtonSheet()}>
                <Text
                  style={{
                    fontFamily: configs.fontFamily.OPS700,
                    fontSize: 14,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <Space width={10}/>
              <TouchableOpacity
                style={styles.button_notification}
                onPress={() => {
                  sendMessageBetweenUsers(userInfo.id,data[0].parent_id[0],'',description,room_id,'','','',
                  ()=>{
                    console.log('send message to comms : '+ status);
                    if(status){
                      onSentMessageSuccess();
                    }
                  });
                  onCloseButtonSheet();
                }}>
                <Text
                  style={{
                    fontFamily: configs.fontFamily.OPS700,
                    fontSize: 14,
                    color: configs.colors.white,
                  }}>
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      </View>
  );
}

const Divider = () => {
  return (
    <View
      style={{height: 1, backgroundColor: configs.colors.borderColor}}></View>
  );
};

const Vacacies = ({data = [], state}) => {
  const {is_fetching_unregistered_data} = state;

  const getShortName = ( name ) =>{
    let tempArray = name.split(" ");
    return tempArray[0];
  }

  return (
    <View
      style={{
        height: configs.height * 0.45,
      }}>
      {is_fetching_unregistered_data == false ? (
        <FlatList
          data={data}
          style={{backgroundColor:'white'}}
          keyExtractor={(item,index)=>index.toString()}
          renderItem={({item,index})=>{
            return (
              <View key={index}>
                <View
                  style={{marginVertical: 10, marginHorizontal: 10}}
                  key={index}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View>
                      {item.img != undefined &&
                      item.img != null &&
                      isTemplateMiddle.img != '' ? (
                        <ImageLoad
                          style={{height: 40, width: 40}}
                          loadingStyle={{size: 'small', color: 'white'}}
                          borderRadius={40}
                          placeholderStyle={{
                            borderRadius: 40,
                            height: 40,
                            width: 40,
                          }}
                          source={{uri: item.img, cache: 'force-cache'}}
                          placeholderSource={require('../../../assets/icons/ic_account.png')}
                        />
                      ) : (
                        <Image
                          style={{
                            height: 40,
                            width: 40,
                            borderRadius: 40,
                          }}
                          source={require('../../../assets/icons/ic_account.png')}
                        />
                      )}
                    </View>
                    <View style={{paddingLeft: 8}}>
                      <View style={{flexDirection: 'row', width: 200, }}>
                        <Text numberOfLines={1} style={{fontWeight: '700', width: 100}}>{item.name}</Text>
                        <Text numberOfLines={1} style={{color: configs.colors.grey, width: 100}}>
                          ・{item.children_names[0] && getShortName(item.children_names[0])+"'s"} {item.relationship}
                        </Text>
                      </View>
                      <Text style={{color: configs.colors.grey, fontSize: 12}}>
                        Send on {item.created_at}
                      </Text>
                    </View>
                    <View
                      style={{
                        alignSelf: 'center',
                        alignItems: 'flex-end',
                        flex: 1,
                      }}>
                      <AntDesign
                        name="minuscircle"
                        color={'#F3B329'}
                        size={16}
                      />
                    </View>
                  </View>
                </View>

                <Divider />
              </View>
            )
          }}
        />
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center',height:'100%',width:'100%',backgroundColor:configs.colors.backgroundColor}}>
          <ActivityIndicator size={20} color={configs.colors.primaryColor} />
        </View>
      )}
    </View>
  );
};

const Registered = ({data = [], state}) => {
  const {is_fetching_registered_data} = state;
  const getShortName = ( name ) =>{
    let tempArray = name.split(" ");
    return tempArray[0];
  }
  return (
    <View
      style={{
        height: configs.height * 0.5,
        backgroundColor:configs.colors.backgroundColor,
      }}>
      {is_fetching_registered_data == false ? (
        <ScrollView>
          {data.map((reg, i) => {
            return (
              <View key={i}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    marginVertical: 14,
                  }}>
                  <View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View>
                        {reg.img != undefined &&
                        reg.img != null &&
                        reg.img != '' ? (
                          <ImageLoad
                            style={{height: 36, width: 36}}
                            loadingStyle={{size: 'small', color: 'white'}}
                            borderRadius={36}
                            placeholderStyle={styles.image}
                            source={{uri: reg.img, cache: 'force-cache'}}
                            placeholderSource={require('../../../assets/icons/ic_account.png')}
                          />
                        ) : (
                          <Image
                            source={require('../../../assets/icons/ic_account.png')}
                            style={styles.image}
                          />
                        )}
                      </View>
                      <View style={{paddingLeft: 8}}>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              fontFamily: configs.fontFamily.OPS700,
                              fontSize: 14,
                            }}>
                            {reg.name}
                          </Text>
                          <Text
                            style={{
                              fontFamily: configs.fontFamily.OPS600,
                              fontSize: 14,
                              color: configs.colors.grey,
                            }}>
                            ・{getShortName(reg.children_names[0])+"'s"} {reg.relationship}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: configs.colors.grey,
                            fontSize: 12,
                            fontFamily: configs.fontFamily.OPS600,
                          }}>
                          Send on {reg.created_at}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      alignSelf: 'center',
                      alignItems: 'flex-end',
                      flex: 1,
                    }}>
                    <Ionicons
                      name="md-checkmark-circle"
                      color={'#7CD227'}
                      size={22}
                    />
                  </View>
                </View>
                <Divider />
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center',height:'100%',width:'100%',backgroundColor:configs.colors.backgroundColor}}>
          <ActivityIndicator size={20} color={configs.colors.primaryColor} />
        </View>
      )}
    </View>
  );
};

const Tab = createMaterialTopTabNavigator();

const TabNavigation = ({eventPeopleData = [],unregistered_data = [], state}) => {
  let registeredData = eventPeopleData;
  let vacanciesData = unregistered_data;
  return (
    <Tab.Navigator
      tabBarOptions={{
        indicatorStyle: {
          height: 4,
        },
        showIcon: true,
        labelStyle: {
          fontSize: 10,
          textTransform: 'none',
          paddingTop: 10,
          fontFamily: configs.fontFamily.OPS700,
          width: '100%',
          marginTop: 10,
        },

        style: {
          elevation: 0,
          shadowColor: '#000000',
          shadowOffset: {width: 0, height: 10}, // change this for more shadow
          shadowOpacity: 0.4,
          shadowRadius: 6,
        },

        iconStyle: {
          alignItems: 'center',
          alignSelf: 'center',
          width: '100%',
        },
      }}>
      <Tab.Screen
        children={() => <Registered data={registeredData} state={state} />}
        name="Registered"
        options={{
          tabBarIcon: () => {
            return (
              <Text
                style={{
                  color: '#7CD227',
                  fontSize: 32,
                  fontFamily: configs.fontFamily.OPS600,
                  height: 42,
                }}>
                {registeredData.length}
              </Text>
            );
          },

          tabBarLabel: 'Registered',
        }}
      />
      <Tab.Screen
        children={() => <Vacacies data={vacanciesData} state={state} />}
        name="Vacacies"
        options={{
          tabBarIcon: () => {
            return (
              <Text
                style={{
                  color: configs.colors.lightblue1,
                  fontSize: 32,
                  fontFamily: configs.fontFamily.OPS600,
                  height: 42,
                }}>
                {vacanciesData.length}
              </Text>
            );
          },
          tabBarLabel: 'Vacancies',
        }}
      />
    </Tab.Navigator>
  );
};

class EventsScreen extends Component {
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
    is_fetching_student_attendance_alert: false,
    selectedEvent: {},
    selectBottomSheetType: '',
    is_fetching_registered_data: false,
    is_fetching_unregistered_data:false,
    is_successful_popup:false,
  };

  componentDidMount() {
    this.onFirstLoad();
  }

  _getTimeFormat = (time) => {
    let tempTime = time.split(':');
    return tempTime[0] + ':' + tempTime[1];
  };

  _renderLoading = () =>{
    return (
      <View style={{width:'100%',height:'100%',padding:20}}>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item height={70} width={'100%'} borderRadius={10} />
          
          <SkeletonPlaceholder.Item height={70} width={'100%'} borderRadius={10} marginTop={10} />
          
          <SkeletonPlaceholder.Item height={70} width={'100%'} borderRadius={10} marginTop={10} />
          
          <SkeletonPlaceholder.Item height={70} width={'100%'} borderRadius={10} marginTop={10} />
          
        </SkeletonPlaceholder>
      </View>
    )
  }

  _renderEventBottomSheet = () => {
    const {selectedEvent} = this.state;
    const {data_attended_event} = this.props;
    return (
      <View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 15,
              marginBottom: 20,
            }}>
            <View style={styles.dots}></View>
            <Text style={{paddingLeft: 10, fontWeight: 'bold', fontSize: 16}}>
              Event
            </Text>
          </View>

          <View
            style={{borderRadius: 5, borderWidth: 1, borderColor: '#DADADA'}}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                paddingVertical: 13,
                paddingHorizontal: 13,
              }}>
              <View style={{flex: 3}}>
                <Text
                  style={{
                    color: '#939494',
                    fontSize: 14,
                    fontFamily: configs.fontFamily.OPS600,
                    fontWeight: '600',
                  }}>
                  {moment(selectedEvent.date).format('YYYY MMM DD') +
                    ' ' +
                    this._getTimeFormat(selectedEvent.from_time) +
                    ' ~ ' +
                    this._getTimeFormat(selectedEvent.to_time)}
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 18,
                    fontFamily: configs.fontFamily.OPS600,
                    fontWeight: '600',
                  }}>
                  {selectedEvent.title}
                </Text>
              </View>
              <View style={{flex: 1}}>
                {selectedEvent != undefined &&
                selectedEvent.img_url != null &&
                selectedEvent.img_url != '' ? (
                  <ImageLoad
                    style={{
                      height: 56,
                      width: 80,
                      borderRadius: 8,
                      borderColor: '#DADADA',
                      borderWidth: 1,
                    }}
                    loadingStyle={{size: 'small', color: 'white'}}
                    borderRadius={8}
                    placeholderStyle={{
                      height: 56,
                      width: 80,
                      borderRadius: 8,
                      borderColor: '#DADADA',
                      borderWidth: 1,
                    }}
                    source={{uri: selectedEvent.img_url, cache: 'force-cache'}}
                    placeholderSource={require('../../../assets/images/placeholder_image.png')}
                  />
                ) : (
                  <Image
                    source={require('../../../assets/images/placeholder_image.png')}
                    style={{
                      height: 56,
                      width: 80,
                      borderRadius: 8,
                      borderColor: '#DADADA',
                      borderWidth: 1,
                    }}
                  />
                )}
              </View>
            </View>
            <Divider />
            <Space height={3} />
            <TabNavigation
              eventPeopleData={data_attended_event}
              unregistered_data={this.props.event_unregistered_data}
              state={this.state}
            />
          </View>
        </View>

        <View style={{marginVertical: 10}}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.RBSheet.close()}>
            <Text
              style={{
                fontFamily: configs.fontFamily.OPS700,
                fontSize: 14,
                color: configs.colors.white,
              }}>
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  _renderArrivedBottomSheet = () => {
    let data = this._getArrivedData();
    return (
      <View style={{height: data.length > 8 ? configs.height - 200 : 'auto'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 15,
            marginBottom: 20,
          }}>
          <View style={styles.dots}></View>
          <Text style={{paddingLeft: 10, fontWeight: 'bold', fontSize: 16}}>
            Arrived
          </Text>
        </View>
        {
       

        data.map((arr, index) => {
          <View key={arr.id} style={styles.arrivedCard} key={index}>
            <View style={{flex: 1, marginLeft: 3}}>
              {arr.img != undefined && arr.img != '' ? (
                <ImageLoad
                  style={styles.imageArrived}
                  loadingStyle={{size: 'small', color: 'white'}}
                  borderRadius={30}
                  placeholderStyle={styles.imageArrived}
                  source={{uri: arr.img, cache: 'force-cache'}}
                  placeholderSource={require('../../../assets/icons/ic_account.png')}
                />
              ) : (
                <Image
                  source={require('../../../assets/icons/ic_account.png')}
                  style={styles.imageArrived}
                />
              )}
              <View style={[styles.dot, {backgroundColor: '#7CD227'}]} />
            </View>
            <View style={{flex: 4}}>
              <Text style={styles.nameText}>{item.name}</Text>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end', paddingRight: 10}}>
              <Text style={{color: configs.colors.primaryColor}}>
                {item.temperature}
              </Text>
            </View>

            <View style={{marginVertical: 10}}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.RBSheet.close()}>
                <Text
                  style={{
                    fontFamily: configs.fontFamily.OPS700,
                    fontSize: 14,
                    color: configs.colors.white,
                  }}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>;
        }) 
      
      }
      </View>
    );
  };

  _renderBottomSheet = () => {
    const {selectBottomSheetType} = this.state;

    switch (selectBottomSheetType) {
      case 'event':
        return this._renderEventBottomSheet();

      case 'arrived':
        return this._renderArrivedBottomSheet();

      case 'absent':
        return this._renderAbsentBottomSheet();

      case 'unfilled':
        return this._renderUnfilledBottomSheet();

      default:
        return null;
    }
  };

  _renderUnfilledBottomSheet = () =>{
    let data = this._getUnfilledData();
    return (
      <View style={{height: data.length > 8 ? configs.height - 200 : 'auto'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 15,
            marginBottom: 20,
          }}>
          <View style={styles.dots}></View>
          <Text style={{paddingLeft: 10, fontWeight: 'bold', fontSize: 16}}>
          Pending
          </Text>
        </View>
        <FlatList
          data={data}
          renderItem={({item,index}) => (

            <View key={item.id} style={styles.absent_card}>
              <View style={{flex: 1, marginLeft: 3}}>
              <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: '#7CD227',
                      position: 'absolute',
                      right: 30,
                      zIndex: 1000,
                    },
                  ]}
                />
              {item.img != undefined && item.img != '' ? (
                  <ImageLoad
                    style={styles.imageArrived}
                    loadingStyle={{size: 'small', color: 'white'}}
                    borderRadius={30}
                    placeholderStyle={styles.imageArrived}
                    source={{uri: item.img, cache: 'force-cache'}}
                    placeholderSource={require('../../../assets/icons/ic_account.png')}
                  />
                ) : (
                  <Image
                    source={require('../../../assets/icons/ic_account.png')}
                    style={styles.imageArrived}
                  />
                )}
              </View>
              <View style={{flex: 4}}>
                <Text style={styles.nameText}>{item.name}</Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
        <View style={{marginVertical: 10,flexDirection:'row'}}>
          <TouchableOpacity
            style={styles.cancel_button}
            onPress={() => this.RBSheet.close()}>
            <Text
              style={{
                fontFamily: configs.fontFamily.OPS700,
                fontSize: 14,
                color: configs.colors.primaryColor,
              }}>
              Back
            </Text>
          </TouchableOpacity>
          <Space width={5} />
          <TouchableOpacity
            style={styles.button_notification}
            onPress={() => {
              let receiver = [];
              for (let index = 0; index < data.length; index++) {
                const element = data[index];
                if(element.parent_id){
                  receiver = receiver.concat(element.parent_id);
                }
              }
              this.RBSheet.close();
              const { userInfo ,setMultipleParentMessages } = this.props;
              if(receiver.length > 0)
                setMultipleParentMessages(userInfo.id,receiver,(status,message)=>{
                  
                  if(status == false){
                    utilities.showToastMessage(message);
                  }else{
                    utilities.showToastMessage("Successful!");
                  }
                  
                });
            }}>
            <Text
              style={{
                fontFamily: configs.fontFamily.OPS700,
                fontSize: 14,
                color: configs.colors.white,
              }}>
              Send Notification
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _renderAbsentBottomSheet = () => {
    let data = this._getAbsentData();

    return (
      <AbsentComponent 
        data={data} 
        onSentMessageSuccess={()=>setTimeout(() => {
          this.setState({
            is_successful_popup:true,
          })
        }, 300)} 
        onCloseButtonSheet={()=>{
          this.RBSheet.close();
        }} 
        props={this.props} />
    )
  };

  onFirstLoad = () => {
    const {
      userInfo,
      fetchAttendanceForDotsByClass,
      fetchAttendanceAlert,
      // fetchAllEventsForDots
      selected_class_index,
    } = this.props;

    // const from_date = moment().year() +"-01-01";
    // const to_date = moment().year()+"-12-31";

    // fetchAllEventsForDots(from_date,to_date,"admin_view","all");

    const start_date = moment().clone().startOf('month').format('YYYY-MM-DD');
    const end_date = moment().clone().endOf('month').format('YYYY-MM-DD');
    const date = moment().format('YYYY-MM-DD');

    fetchAttendanceAlert(userInfo.class[selected_class_index].id, date, () => {
      console.log('Hi Attendance alert');
    });

    this.setState({
      is_loading_for_student_attendance:true,
    })

    fetchAttendanceForDotsByClass(
      userInfo.class[selected_class_index].id,
      start_date,
      end_date,
      (status, data) => {
        let tempMarkedDates = this._setMarkedDates();
        this.setState(
          {
            markedDates: tempMarkedDates,
            is_loading_for_student_attendance:false,
          },
          () => {
            this.Calendar.onRefresh();
          },
        );
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
    var TEMP = {
      [moment().format('YYYY-MM-DD')]: {selected: true},
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
      holidaysDate = [],
      all_events_for_dots,
      userInfo,
      calendar_dots_of_attendance_by_class = [],
      selected_class_index,
    } = this.props;
    let temp = DATA;

    // attendance dots
    if (
      calendar_dots_of_attendance_by_class != undefined &&
      calendar_dots_of_attendance_by_class.length > 0
    ) {
      for (
        let att = 0;
        att < calendar_dots_of_attendance_by_class.length;
        att++
      ) {
        const element = calendar_dots_of_attendance_by_class[att];

        let x = temp[element.date];

        if (x != undefined) {
          let tempDots = temp[element.date].dots;
          let newDots = [];
          if (element.absent != 0) {
            newDots = [
              ...newDots,
              {
                key: 'attendance',
                color: '#F3B329',
              },
            ];
          }
          if (element.present != 0) {
            newDots = [
              ...newDots,
              {
                key: 'attendance',
                color: '#7CD227',
              },
            ];
          }
          temp[element.date] = {
            ...x,
            marked: true,
            dots: tempDots != null ? newDots.concat(tempDots) : newDots,
          };
        } else {
          let newDots = [];
          if (element.absent != 0) {
            newDots = [
              ...newDots,
              {
                key: 'attendance',
                color: '#F3B329',
              },
            ];
          }
          if (element.present != 0) {
            newDots = [
              ...newDots,
              {
                key: 'attendance',
                color: '#7CD227',
              },
            ];
          }

          temp = {
            ...temp,
            [element.date]: {
              marked: true,
              dots: newDots,
            },
          };
        }
      }
    }

    let allEvents = all_events_for_dots.filter(
      (ev) =>
        ev.centre_ids.includes(userInfo.centre_id[0]) &&
        ev.class_ids.includes(userInfo.class[selected_class_index].id),
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

  _getEventData = () => {
    const {all_events_for_dots, userInfo, selected_class_index} = this.props;
    let dateString = moment(this.state.selectedDate).format('YYYY-MM-DD');
    return all_events_for_dots.filter(
      (ev) =>
        ev.centre_ids.includes(userInfo.centre_id[0]) &&
        ev.class_ids.includes(userInfo.class[selected_class_index].id) &&
        ev.date == dateString,
    );
  };

  _getHoliday = () => {
    const {holidaysDate} = this.props;
    let dateString = moment(this.state.selectedDate).format('YYYY-MM-DD');
    return holidaysDate.filter((holi) => holi.date == dateString);
  };

  _getArrivedData = () => {
    const {attendanceAlert} = this.props;
    return attendanceAlert.filter((att) => att.status == 'present');
  };

  _getAbsentData = () => {
    const {attendanceAlert} = this.props;
    return attendanceAlert.filter((att) => att.status == 'absent');
  };

  _getUnfilledData = () => {
    const {attendanceAlert} = this.props;
    return attendanceAlert.filter((att) => att.status == 'undefined');
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

  onRefresh = () => {
    this.setState({
      isRefreshing: true,
    });
    this.onFirstLoad();
    this.setState({
      isRefreshing: false,
    });
  };

  _filterObjectByValue = (obj, predicate) =>
    Object.keys(obj)
      .filter((key) => predicate(obj[key]))
      .reduce((res, key) => ((res[key] = obj[key]), res), {});

  _onDayPressCalendar = (date) => {
    this.setState({
      is_fetching_student_attendance_alert: true,
    });

    const {userInfo, fetchAttendanceAlert, selected_class_index} = this.props;

    fetchAttendanceAlert(
      userInfo.class[selected_class_index].id,
      date.dateString,
      (status, data) => {
        console.log(status);
        this.setState({
          is_fetching_student_attendance_alert: false,
        });
      },
    );

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
        [Object.keys(tempSelectedDate)]: tempSelectedDate[
          Object.keys(tempSelectedDate)
        ],
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

  getTimeRangeOfEvent = (f_time, t_time) => {
    var f_time_array = f_time.split(':');
    var t_time_array = t_time.split(':');
    var c_time =
      f_time_array[0] +
      ':' +
      f_time_array[1] +
      '-' +
      t_time_array[0] +
      ':' +
      t_time_array[1];
    return c_time;
  };

  render() {
    // console.log(JSON.stringify(this.state.markedDates));
    console.log("***************************************************************");
    console.log(this.props.calendar_dots_of_attendance_by_class);
    console.log(this.props.attendanceAlert);
    console.log("***************************************************************");
    // console.log(this.props.userInfo);
    // console.log(this.props.holidaysDate);

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
      <View style={{flex: 1}}>
        <StatusBar
            translucent={true}
            backgroundColor={
              this.state.is_successful_popup == true
                ? '#00000020'
                : 'transparent'
            }
            barStyle="dark-content"
          />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh}
            />
          }
          contentContainerStyle={{flexGrow: 1}}
          nestedScrollEnabled={false}
          showsVerticalScrollIndicator={false}>
          <View style={{flex: 1, backgroundColor: configs.colors.loginColor}}>
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
                        source={require('../../../assets/icons/ic_arrow_left_blue.png')}
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
                          source={require('../../../assets/icons/ic_arrow_right_blue.png')}
                        />
                      );
                  }
                }}
                headerShown={true}
                markingType={'multi-dot'}
                onDayPress={this._onDayPressCalendar}
                onMonthChange={(date) => {
                  this.setState({
                    is_loading_for_student_attendance:true,
                  });
                  const { userInfo,fetchAttendanceForDotsByClass,selected_class_index } = this.props;
                  const start_date = moment(date.dateString).clone().startOf('month').format('YYYY-MM-DD');
                  const end_date = moment(date.dateString).clone().endOf('month').format('YYYY-MM-DD');
                  fetchAttendanceForDotsByClass(
                    userInfo.class[selected_class_index].id,
                    start_date,
                    end_date,
                    (status, data) => {
                      let tempMarkedDates = this._setMarkedDates();
                      this.setState(
                        {
                          is_loading_for_student_attendance:false,
                          selectedMonth: date.month,
                          markedDates: tempMarkedDates,
                        },
                        () => {
                          this.Calendar.onRefresh();
                        },
                      );
                    },
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
                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 16}}>
                  <View style={[configs.styles.agenda,{marginRight: 8, backgroundColor: configs.colors.present_dot_color}]} />
                  <Text style={[configs.styles.font14_bold]}>Present</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 16}}>
                  <View style={[configs.styles.agenda,{marginRight: 8, backgroundColor: configs.colors.absent_dot_color}]} />
                  <Text style={[configs.styles.font14_bold]}>Absent</Text>
                </View>
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
                // marginBottom: 24,
                marginBottom: 0,
                marginLeft: 24,
                marginRight: 24,
                marginTop: 20,
              }}>
              <View style={[styles.dots, {marginRight: 10}]}></View>
              <Text
                style={{fontSize: 16, fontFamily: configs.fontFamily.OPS700}}>
                {/*2020 Aug 18 Fri*/}
                {moment(this.state.selectedDate).format('YYYY MMM DD ddd')}
              </Text>
            </View>

            {
              this.state.is_fetching_student_attendance_alert == true || this.state.is_loading_for_student_attendance == true  ? this._renderLoading() : <>
              <View style={{marginHorizontal: 10}}>
              {
                this._getArrivedData().length > 0 &&
                <>
                <TouchableOpacity
                style={[styles.card]}
                onPress={
                  this._getArrivedData().length > 0
                    ? () => {
                        this.setState({
                          selectBottomSheetType: 'arrived',
                        });
                        this.RBSheet.open();
                      }
                    : null
                }>
                <View
                  style={[
                    {
                      backgroundColor: '#7CD227',
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
                      Arrived
                    </Text>
                    <Space height={5} />
                    <View>
                      <ImageOverlap students={this._getArrivedData()} />
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
                          {color: '#7CD227'},
                        ]}>
                        {this._getArrivedData().length}
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

              <Space height={5} /></>
              }

              {
                this._getAbsentData().length > 0 && (
                  <>
                  <TouchableOpacity
                style={[styles.card]}
                onPress={
                  this._getAbsentData().length > 0
                    ? () => {
                        this.setState({
                          selectBottomSheetType: 'absent',
                        });
                        this.RBSheet.open();
                      }
                    : null
                }>
                <View
                  style={[
                    {
                      backgroundColor: '#F3B329',
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
                      Absent
                    </Text>
                    <Space height={5} />
                    <View>
                      <ImageOverlap students={this._getAbsentData()} />
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
                          {color: '#F3B329'},
                        ]}>
                        {this._getAbsentData().length}
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

              <Space height={5} /></>
                )
              }

              {
                this._getUnfilledData().length > 0 &&
                <>
                <TouchableOpacity style={[styles.card]}
                onPress={
                  this._getUnfilledData().length > 0
                    ? () => {
                        this.setState({
                          selectBottomSheetType: 'unfilled',
                        });
                        this.RBSheet.open();
                      }
                    : null
                }
              >
                <View
                  style={[
                    {
                      backgroundColor: '#8DC3E9',
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
                      Pending
                    </Text>
                    <Space height={5} />
                    <View>
                      <ImageOverlap students={this._getUnfilledData()} />
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
                          {color: '#F3B329'},
                        ]}>
                        {this._getUnfilledData().length}
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

              <Space height={5} />
              </>
              }

              {this._getEventData().length > 0
                ? this._getEventData().map((e, index) => (
                    <TouchableOpacity
                      style={[styles.card]}
                      key={index}
                      onPress={() => {
                        this.setState({
                          is_fetching_registered_data: true,
                          is_fetching_unregistered_data:true,
                        });
                        this.props.fetchAllDataAttendedByEvent(
                          'event_id',
                          e.id,
                          () => {
                            this.setState({
                              is_fetching_registered_data: false,
                            });
                          },
                        );
                        this.props.getUnregisteredParentByEvent(e.id,()=>{
                          this.setState({
                            is_fetching_unregistered_data:false,
                          })
                        });
                        this.setState({
                          selectedEvent: e,
                          selectBottomSheetType: 'event',
                        });
                        this.RBSheet.open();
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
                        <View style={{flex:0.95}}>
                          <Text
                            style={{
                              fontSize: 16,
                              color: '#F66460',
                            }}>
                            Event
                          </Text>
                          <Space height={5} />
                          <View>
                            <Text numberOfLines={2} ellipsizeMode="tail">{e.title}</Text>
                          </View>
                        </View>
                        <View
                          style={{ flex:0.05,alignItems: 'center',justifyContent:'flex-end',}}>
                          <Ionicons
                            name="chevron-forward"
                            size={24}
                            color={configs.colors.primaryColor}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                : null}

              {/* Holiday dates */}
              {this._getHoliday().length > 0
                ? this._getHoliday().map((e, index) => (
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
                  ))
                : null}
            </View>
              </> 
            }

            <View>
              <RBSheet
                ref={(ref) => {
                  this.RBSheet = ref;
                }}
                closeOnPressBack
                dragFromTopOnly={true}
                closeOnDragDown={true}
                
                dragFromTopOnly={true}
                openDuration={250}
                customStyles={{
                  container: styles.bottomSheetContainer,
                }}>
                <ScrollView style={styles.bottomSheetBody} showsVerticalScrollIndicator={false}>
                  {this._renderBottomSheet()}
                </ScrollView>
              </RBSheet>
            </View>

            <PopSuccessfulSend isVisibles={this.state.is_successful_popup} onCloseModals={()=>{
              this.setState({
                is_successful_popup:false,
              })
            }}/>
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
    holidaysDate: state.homeState.holidaysDate,
    is_fetching_student_attendance:
      state.homeState.is_fetching_student_attendance,
    parentEventData: state.homeState.parentEventData,
    student_attendance: state.homeState.student_attendance,
    student_attendance_in_class: state.homeState.student_attendance_in_class,
    attendanceAlert: state.homeState.attendanceAlert,
    calendar_dots_of_attendance_by_class:
      state.homeState.calendar_dots_of_attendance_by_class,
    data_attended_event: state.homeState.data_attended_event,
    event_unregistered_data: state.homeState.event_unregistered_data,
    selected_class_index: state.homeState.selected_class_index,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAttendanceForDotsByClass: (
      class_id,
      start_date,
      end_date,
      handleCallback,
    ) =>
      dispatch(
        homeAction.fetchAttendanceForDotsByClass(
          class_id,
          start_date,
          end_date,
          handleCallback,
        ),
      ),
    fetchAttendanceAlert: (class_id, date, handleCallback) =>
      dispatch(homeAction.fetchAttendanceAlert(class_id, date, handleCallback)),
    fetchAllDataAttendedByEvent: (filtered_by, event_id, handleCallback) =>
      dispatch(
        homeAction.fetchAllDataAttendedByEvent(
          filtered_by,
          event_id,
          handleCallback,
        ),
      ),
    setMultipleParentMessages: (sender, receiver, handleCallback) =>
      dispatch(
        homeAction.setMultipleParentMessages(sender, receiver, handleCallback),
      ),
    fetchAllEventsForDots: (from_date, to_date, filtered_by, reg_status) =>
      dispatch(
        homeAction.fetchAllEventsForDots(
          from_date,
          to_date,
          filtered_by,
          reg_status,
        ),
      ),
    sendMessageBetweenUsers:(sender,
      receiver,
      img,
      message,
      room_id,
      video,
      thumbnail,
      id,handleCallback, )=>dispatch( homeAction.sendMessageBetweenUsers(sender,
        receiver,
        img,
        message,
        room_id,
        video,
        thumbnail,
        id, handleCallback,)),
    getUnregisteredParentByEvent:(event_id,handleCallback) => dispatch( homeAction.getUnregisteredParentByEvent(event_id,handleCallback)),
    getRoomIdBetweenUsers:(receiver,sender,size,handleCallback) => dispatch(homeAction.getRoomIdBetweenUsers(receiver,sender,size,handleCallback)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsScreen);

const styles = StyleSheet.create({
  image: {
    borderRadius: 30,
    // position: 'absolute',
    width: 24,
    height: 24,
    borderColor: 'white',
    borderWidth: 1,
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
  },
  bottomSheetBody: {
    marginHorizontal: 20,
    marginVertical: 10,
    height: 'auto',
  },
  button: {
    borderRadius: 20,
    backgroundColor: configs.colors.primaryColor,
    height: 46,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_notification:{
    borderRadius: 20,
    backgroundColor: configs.colors.primaryColor,
    height: 46,
    flex:0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancel_button:{
    borderRadius: 20,
    backgroundColor: 'white',
    height: 46,
    flex:0.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:1,
    borderColor:configs.colors.primaryColor
  },
  dots: {
    height: 12,
    width: 12,
    borderRadius: 20,
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
  absent_card: {
    minHeight: 48,
    borderColor: configs.colors.borderColor,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
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
  leftStyle: {
    width: 8,
    height: '100%',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  arrivedcontainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 14,
    color: configs.colors.black,
    fontFamily: configs.fontFamily.OPS700,
  },
  imageArrived: {
    height: 36,
    width: 36,
    borderRadius: 30,
  },
  arrivedCard: {
    minHeight: 48,
    borderColor: configs.colors.borderColor,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  dot: {
    height: 10,
    width: 10,
    position: 'absolute',
    bottom: 1,
    right: 10,
    borderRadius: 12,
  },
});
