import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  Linking,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
  RefreshControl,
  Animated,
  Modal,
  SafeAreaView,
} from 'react-native';
import BackgroundImage from '../../assets/images/comms_header.png';
import configs from '../../utils/configs';
import {connect} from 'react-redux';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import homeAction from '../../actions/homeAction';
import Loading from '../../components/Loading';
import ImageLoad from '../../components/ImageLoad';
import RBSheet from 'react-native-raw-bottom-sheet';
import AlertRBSheet from 'react-native-raw-bottom-sheet';
import Divider from '../../components/divider';
import {Space} from '../../components/space';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import Swipeable from 'react-native-gesture-handler/Swipeable'
import CONSTANTS from '../../utils/constants';
import style from '../../components/calendars/calendar/header/style';
import { getConfigFileParsingDiagnostics } from 'typescript';

class CommsScreen extends Component {
  state = {
    searchValue: '',
    checked: false,
    refreshing: false,
    delete_room_id: '',
    is_show_no_contact_modal:false,
  };

  _onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    const {userInfo, studentInfo} = this.props;
    this.props.getRoomList(userInfo.id,()=>this.setState({
      refreshing: false,
    }));
    
  };

  timeFormat = (dateTime) => {
    if (dateTime == '' || dateTime == undefined) {
      return '';
    } else {
      let tempArray = dateTime.split(' ');
      var m = moment().month(tempArray[1]).format('MM');
      var r = tempArray[0] + '-' + m + '-' + tempArray[2] + ' ' + tempArray[3];
      var datetime = moment(r).startOf('day');
      if (
        moment().startOf('day').diff(datetime, 'days') > 0 &&
        datetime.diff(moment(), 'days') < 7
      ) {
        if (moment().startOf('day').diff(datetime, 'days') == 1) {
          return 'Yesterday';
        } else {
          return moment().format('dddd');
        }
      } else {
        /*if (moment().startOf('day').diff(datetime, 'days') == 0) {
          var time = tempArray[3];
          var tempTimeArray = time.split(':');
          var h = parseInt(tempTimeArray[0]);
          if (h < 12) {
            return tempTimeArray[0] + ':' + tempTimeArray[1] + ' am';
          } else {
            return tempTimeArray[0] + ':' + tempTimeArray[1] + ' pm';
          }
        } else {
          return moment(datetime).format('DD MMM YYYY');
        }*/
        if(moment().startOf('day').diff(datetime,"days") == 0){
          //2021 May 03 13:35:32
          return moment(dateTime, 'YYYY MMM DD HH:mm:ss').format("hh:mm a");
          
        }else{
          return moment(datetime).format("DD MMM YYYY");
        }

      }
    }
  };

  getRoomList = () => {
    var data = this.props.roomList.filter((entry) =>
      Object.values(entry.receiver).some(
        (val) =>
          typeof val === 'string' && val.includes(this.state.searchValue),
      ),
    );
    const filteredData = data.filter(obj => Object.values(obj.last_message).find(o => o.value != ""));
    return filteredData;
  };

  getLastMessage = (text) => {
    /*if (text.length > 90) {
      var textString = text.substr(0, 90);
      textString += '...';
      return textString;
    } else {*/
      
    return text;
  };

  renderLoading = () => {
    return (
      <View
        style={{
          width: '90%',
          justifyContent: 'center',
          alignSelf: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          paddingHorizontal: 30,
          paddingVertical: 10,
          borderRadius: 20,
          marginHorizontal: 30,
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 8,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            <View style={styles.avartarPlaceholder}></View>
          </View>
          <View style={{flex: 5}}>
            <View style={styles.contenctPlaceholder}></View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 8,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            <View style={styles.avartarPlaceholder}></View>
          </View>
          <View style={{flex: 5}}>
            <View style={styles.contenctPlaceholder}></View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 8,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            <View style={styles.avartarPlaceholder}></View>
          </View>
          <View style={{flex: 5}}>
            <View style={styles.contenctPlaceholder}></View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 8,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            <View style={styles.avartarPlaceholder}></View>
          </View>
          <View style={{flex: 5}}>
            <View style={styles.contenctPlaceholder}></View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 8,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            <View style={styles.avartarPlaceholder}></View>
          </View>
          <View style={{flex: 5}}>
            <View style={styles.contenctPlaceholder}></View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 8,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            <View style={styles.avartarPlaceholder}></View>
          </View>
          <View style={{flex: 5}}>
            <View style={styles.contenctPlaceholder}></View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 8,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            <View style={styles.avartarPlaceholder}></View>
          </View>
          <View style={{flex: 5}}>
            <View style={styles.contenctPlaceholder}></View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 8,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            <View style={styles.avartarPlaceholder}></View>
          </View>
          <View style={{flex: 5}}>
            <View style={styles.contenctPlaceholder}></View>
          </View>
        </View>
      </View>
    );
  };

  _renderEmptyRoomList = () => {
    return (
      <View style={{
        flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height:configs.height / 2,
      }}>
        <Image 
          style={{height:56,width:40.46}}
          source={require('../../assets/icons/ic_empty_room_list.png')} resizeMode="contain"/>
        <Text
          style={{
            color: '#CAD9FC',
            fontSize: 14,
            fontWeight: '600',
            fontFamily: configs.fontFamily.OPS700,
          }}>
          No message
        </Text>
      </View>
    )
  }
  
  getRoomListBySnapShop = async(userID) => {
    this.commsDataSubscriber = firestore()
    .collection('comms')
    .where('receiver', '==', userID)
    .onSnapshot((querySnapshot) => {
      this.props.getRoomList(userID);
    });
  }

  componentWillUnmount(){
    if(this.commsDataSubscriber)
      this.commsDataSubscriber();
  }

  componentDidMount() {
    const {userInfo, studentInfo, selected_class_index} = this.props;
    //this.props.getRoomList(userInfo.id);
    this.getRoomListBySnapShop(userInfo.id);

    const center_id =
      userInfo.user_type == 'parent'
        ? studentInfo != undefined &&
          studentInfo != {} &&
          studentInfo.centre_id != undefined &&
          studentInfo.centre_id[0]
        : userInfo.centre_id[0];
    const class_id =
      userInfo.user_type == 'parent'
        ? studentInfo != undefined &&
          studentInfo != {} &&
          studentInfo.class_id != undefined &&
         studentInfo.class_id[0]
        : userInfo.class[selected_class_index].id;
    this.props.fetchContactList(center_id, class_id, userInfo.id);
  }

  _onDeletePress = (roomID) => {
    console.log('LONG PRESS ...........');
    Alert.alert(
      "Are you sure you want to permanently delete this conversation?",
      null,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { 
          text: "Delete", onPress: () => {
            console.log("Delete Pressed");
            this.props.deleteRoom(roomID,()=>{
              console.log("Deleted room");
            });
            
          }
        }
      ]
    );
  }

  render() {
    const { userInfo } = this.props;
    return (
        <View style={{flex: 1, backgroundColor: configs.colors.loginColor}}>
          <StatusBar translucent={true}/>
          <Modal 
            visible={this.state.is_show_no_contact_modal} 
            statusBarTranslucent={true}
            style={{width:'100%',height:'100%',flexDirection:'column'}}>
            <SafeAreaView style={{marginTop: getStatusBarHeight(), backgroundColor: 'white'}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{padding:10,backgroundColor:'white',width:'100%',}}>
                <TouchableOpacity style={{alignSelf:'flex-end'}} onPress={()=>{
                  this.RBSheet.open();
                  this.setState({
                    is_show_no_contact_modal:false,
                  });
                }}>
                    <Image source={require("../../assets/icons/ic_button_cross.png")} style={{width:25,height:25,resizeMode:'contain'}}/>
                </TouchableOpacity>

                <View style={{padding:10,marginTop:5,}}>
                  <Text>
                    {userInfo.user_type === "parent" ? "If you couldn't find the contact, you may need to do a switch of the child's profile under the Profile & Settings page. See below the 2 steps needed." : "If you couldn’t find the contact here, you may need to do switch the class.  See below the 2 steps needed."}
                  </Text>
                </View>
              </View>

              <View style={{
                backgroundColor:'#E5FAFF',
                paddingHorizontal:10,
                paddingVertical:30,
              }}>
                <View style={{width:'100%',paddingLeft:20,}}>
                  <Text style={{
                    fontSize:24,
                    color:configs.colors.primaryColor,
                    fontWeight:'bold'
                  }}>Step 1</Text>
                </View>
                <Space height={20}/>

                <Image source={userInfo.user_type === "parent" ? require("../../assets/images/switch_child_more.png") :require("../../assets/images/switch_class_home.png")} style={{
                  width:'100%',
                  height:350,
                  resizeMode:"cover"
                }}/>

                <Space height={30}/>
                <View style={{width:'100%',paddingLeft:20,}}>
                  <Text style={{
                    fontSize:24,
                    color:configs.colors.primaryColor,
                    fontWeight:'bold'
                  }}>Step 2</Text>
                </View>
                <Space height={20}/>

                <Image source={userInfo.user_type === "parent" ? require("../../assets/images/switch_child.png") :require("../../assets/images/switch_class.png")} style={{
                  width:'85%',
                  height:250,
                  resizeMode:"cover",
                  alignSelf:'center'
                }}/>
              </View>
            </ScrollView>
            </SafeAreaView>
          
          </Modal>
          <View
            style={{
              backgroundColor: configs.colors.primaryColor,
              height: configs.height / 3.5,
              borderBottomStartRadius: 20,
              borderBottomEndRadius: 20,
            }}>
            <Text style={styles.Header}>Comms</Text>
            <Space height={getStatusBarHeight()}/>
            <Image
              source={BackgroundImage}
              style={{
                height: '100%',
                width: '100%',
                alignSelf: 'flex-end'
              }}
              resizeMode="cover"
            />
          </View>
          <View
            style={{
              height: 40,
              backgroundColor: configs.colors.backgroundColor,
            }}/>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 17,
              justifyContent: 'space-between',
              marginTop: -65,
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.RBSheet.open()}>
              <Image
                source={require('../../assets/icons/ic_message.png')}
                style={{width: 17, height: 16, marginTop: 3}}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: configs.fontFamily.OPS700,
                  lineHeight: 19,
                  marginLeft: 6,
                  color: configs.colors.primaryColor,
                }}>
                New message
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                Linking.openURL(`tel:+6562851377`);
              }}>
              <Image
                source={require('../../assets/icons/ic_phone.png')}
                style={{width: 16, height: 16}}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: configs.fontFamily.OPS700,
                  lineHeight: 19,
                  marginLeft: 6,
                  color: configs.colors.primaryColor,
                }}>
                Call hotline
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{marginHorizontal: 16, marginBottom: 20, marginTop: 16, backgroundColor: configs.colors.backgroundColor}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 20,
                paddingLeft: 5,
                borderWidth: 1,
                borderColor: '#E9F0FD',
                backgroundColor: '#E9F0FD',
              }}>
              <TextInput
                value={this.state.searchValue}
                onChangeText={(value) => this.setState({searchValue: value})}
                placeholder="Search ..."
                placeholderTextColor={configs.colors.primaryColor}
                style={{
                  flex: 10,
                  height: 45,
                  paddingLeft: 8,
                  paddingRight: 8,
                }}
              />
              <Ionicons
                name="search"
                color={configs.colors.primaryColor}
                size={24}
                style={{flex: 1}}
              />
            </View>
          </View>

          {/* Body  */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                colors={['#9Bd35A', '#689F38']}
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          >
            <TouchableOpacity style={styles.freeUpStorageContainer}
              onPress={()=>this.props.navigation.navigate('FreeUpStorage')}>
                <View style={{flex:0.2,}}>
                  <Image 
                    source={require('../../assets/icons/ic_free_up_comms.png')} 
                    style={styles.freeUpStorageIcon} />
                  </View>
              
                  <Text style={styles.freeUpStorageText}>{CONSTANTS.COMMS_FREE_UP_STORAGE_DESC}</Text>
                <View style={{flex:0.05}}>
                  <Image
                    style={{height: 12, width: 6, resizeMode: 'cover',}}
                    source={require('../../assets/icons/ic_arrow_right_blue.png')} />
                </View>
            </TouchableOpacity>
            {this.props.room_list_loading || this.state.refreshing ? (
              this.renderLoading()
            ) : (
              <View>
                {this.getRoomList() && this.getRoomList().length > 0 ? 
                <FlatList
                  style={{
                    marginLeft: configs.margin.leftRightmargin,
                    marginRight: configs.margin.leftRightmargin,
                  }}
                  showsVerticalScrollIndicator={false}
                  data={this.getRoomList()}
                  contentContainerStyle={{
                    marginHorizontal: 5,
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    marginTop: 5,
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                  renderItem={({item, index}) => {
                    const rightSwipe = (progress, dragX) => {
                      const scale = dragX.interpolate({
                        inputRange: [0,100],
                        outputRange: [1,0],
                        extrapolate: 'clamp'
                      })
                      return (
                        <TouchableOpacity 
                          onPress={()=> {
                            this.AlertRBSheet.open();
                            //this._onDeletePress(item.id);
                            this.setState({
                              delete_room_id: item.id,
                            });
                          }} 
                          activeOpacity={0.6}>
                          <View style={styles.rightActionStyle}>
                            <View style={styles.rightIconBgStyle}>
                            <Image 
                              style={{height:20,width:18.46}}
                              source={require('../../assets/icons/ic_trash.png')}/>
                            </View>
                              <Animated.Text 
                                style={{
                                  transform: [{scale}], 
                                  color: 'white', 
                                  fontSize: 14, 
                                  fontWeight: '600'}}>
                                  Delete
                              </Animated.Text>
                          </View>
                        </TouchableOpacity>
                      );
                    };

                    return (
                      <Swipeable key={item.id} renderRightActions={rightSwipe}>
                      <View style={{backgroundColor: configs.colors.white}}>
                      <TouchableOpacity
                        style={{
                          paddingHorizontal: 24,
                        }}
                        //onLongPress={()=> this._onDeletePress(item.id)}
                        onPress={() => {
                          // this.props.readCommsAllMessage(
                          //   item.id,
                          //   this.props.userInfo.id,
                          // );
                          // this.props.getRoomList(this.props.userInfo.id);
                          this.props.navigation.navigate('ChatRoom', {
                            receiver_info: {
                              id: item.receiver.id,
                              name: item.receiver.name,
                              role: item.receiver.role,
                              img: item.receiver.img,
                            },
                          });
                        }}>
                        {item.last_message_has_read == false ? (
                          <>
                            <View
                              style={[
                                styles.dot,
                                {left: 10, right: 10, bottom: 25, top: 25},
                              ]}></View>
                          </>
                        ) : null}
                        <View>
                          <View
                            style={{
                              flexDirection: 'row',
                              width: '100%',
                              marginVertical: 5,
                            }}>
                            <View
                              style={{
                                height: 42,
                                width: 42,
                                backgroundColor: configs.colors.primaryColor,
                                borderRadius: 42,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <ImageLoad
                                style={styles.image}
                                loadingStyle={{size: 'small', color: 'white'}}
                                borderRadius={40}
                                placeholderStyle={styles.image}
                                source={{
                                  uri: item.receiver.img,
                                  cache: 'force-cache',
                                }}
                                placeholderSource={require('../../assets/icons/ic_account.png')}
                              />
                            </View>
                            <View
                              style={{
                                flex: 1,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                marginLeft: 10,
                              }}>
                              <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                                {item.receiver.name}
                              </Text>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                              <Text style={{fontSize: 10}}>
                                {this.timeFormat(item.last_message_datetime)}
                              </Text>
                            </View>
                          </View>
                          {item.last_message != '' ? (
                            <View
                              style={{
                                paddingLeft: 52,
                                marginBottom: 10,
                                color:
                                  item.last_message_has_read == true
                                    ? 'black'
                                    : 'grey',
                              }}>
                              <Text 
                                  style={{minHeight: 30, textAlignVertical: 'top'}} 
                                  numberOfLines={3}>
                                    {this.getLastMessage(item.last_message)}
                              </Text>

                              {/* <Text>Hello , How are u today, Ben? I hope u will be fine</Text> */}
                            </View>
                          ) : null}
                        </View>
                        {this.getRoomList().length - 1 != index && <Divider />}
                      </TouchableOpacity>
                      </View>
                      </Swipeable>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                /> : this._renderEmptyRoomList()
                }
                
              </View>
            )}

            <Space height={50} />
          </ScrollView>

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
                height: configs.height - 200,
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
            <View style={styles.ContactTitle}>
              <View style={styles.Active}></View>
              <Text style={{color: '#1B1A1A', fontSize: 16, fontWeight: '700'}}>
                Contact
              </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity onPress={()=> {
                this.RBSheet.close();
                setTimeout(() => {
                  this.setState({
                    is_show_no_contact_modal:true,
                  })
                }, 300);
                
              }
              } style={{
                flexDirection:'row',
                borderRadius:20,
                borderColor:configs.colors.primaryColor,
                borderWidth:1,
                width:'100%',
                alignItems:'center',
                backgroundColor:"#E5FAFF",
                paddingVertical:15,
                paddingHorizontal:15,
              }}>
                <View style={{flex:0.15}}>
                  <Image style={{
                    width:30,height:30,
                    resizeMode:'contain',
                  }} source={require("../../assets/icons/ic_no_contact.png")}/>
                </View>
                <Text style={{color:configs.colors.primaryColor,flex:0.8 }}>Couldn’t find the contact </Text>
                <Ionicons name="chevron-forward" color={configs.colors.primaryColor} size={20} style={{flex:0.1,}}/>
              </TouchableOpacity>

              <Space height={20}/>

              <FlatList
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                data={this.props.contact_list}
                renderItem={({item, index}) => this.renderContactList(item)}
                keyExtractor={(item, index) => index.toString()}
              />
            </ScrollView>

            <View style={{paddingBottom: 20, marginTop: 17}}>
              <TouchableOpacity
                style={styles.Cancel}
                onPress={() => this.RBSheet.close()}>
                <Text
                  style={{
                    color: configs.colors.primaryColor,
                    fontSize: 14,
                    fontWeight: '700',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </RBSheet>
          <AlertRBSheet
            ref={(ref) => {
              this.AlertRBSheet = ref;
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
            <View style={styles.AlertTitle}>
              <Text style={{
                color: '#1B1A1A', 
                fontSize: 16, 
                fontWeight: '700',
                marginTop: 20,}}>
                Delete this conversation
              </Text>
              <Text style={{
                color: '#1B1A1A', 
                fontSize: 14, 
                fontWeight: '400',
                marginTop: 16,}}>
                Are you sure you want to permanently delete this conversation?
              </Text>
            </View>

            <View style={{paddingBottom: 20, marginTop: 17, flexDirection: 'row'}}>
              <TouchableOpacity
                style={styles.AlertCancel}
                onPress={() => this.AlertRBSheet.close()}>
                <Text
                  style={{
                    color: configs.colors.primaryColor,
                    fontSize: 14,
                    fontWeight: '700',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <Space width={15}/>
              <TouchableOpacity
                style={styles.AlertDelete}
                onPress={() => {
                  this.AlertRBSheet.close();
                  setTimeout(() => {
                    this.props.deleteRoom(this.state.delete_room_id,()=>{
                      console.log("Deleted room");
                    });
                  }, 300)
                  
                }}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 14,
                    fontWeight: '700',
                  }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </AlertRBSheet>
          {(this.props.delete_room_loading == true && <Loading style={{zIndex: 100}}/>)}
        </View>
    );
  }

  renderContactList = (item) => {
    return (
      <TouchableOpacity
        onPress={() => {
          var rolename = item.role.toLowerCase();
          this.RBSheet.close();
          this.props.readCommsAllMessage(item.id, this.props.userInfo.id);
          this.props.navigation.navigate('ChatRoom', {
            receiver_info: {
              id: item.id,
              name: item.name,
              role: rolename,
            },
          });
        }}
        style={[
          {
            paddingHorizontal: 16,
            paddingVertical: 18,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#DADADA',
            flexDirection: 'row',
            justifyContent: 'space-between',
          },
          {marginBottom: this.props.marginBottom ? 50 : 8},
        ]}>
        <View style={{flex: 2}}>
          <View
            style={{
              height: 38,
              width: 38,
              backgroundColor: configs.colors.primaryColor,
              borderRadius: 38,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ImageLoad
              style={{
                height: 36,
                width: 36,
              }}
              loadingStyle={{size: 'small', color: 'white'}}
              borderRadius={36}
              placeholderStyle={{
                height: 36,
                width: 36,
                borderRadius: 36,
              }}
              source={{uri: item.img, cache: 'force-cache'}}
              placeholderSource={require('../../assets/icons/ic_account.png')}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
            flex: 6,
            justifyContent: 'flex-start',
          }}>
          <Text style={{fontSize: 14, fontWeight: '700'}}>{item.name}</Text>
          <Text style={{fontSize: 14, fontWeight: '400', color: '#939494'}}>
            {item.role}
          </Text>
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        </View>
      </TouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  image: {
    height: 40,
    width: 40,
    borderRadius: 40,
    resizeMode: 'cover',
  },
  container: {
    backgroundColor: configs.colors.backgroundColor,
    height: configs.height,
    width: configs.width,
  },
  Header: {
    fontSize: 18,
    color: 'white',
    zIndex: 1000,
    fontFamily: configs.fontFamily.OPS700,
    lineHeight: 25,
    marginTop: getStatusBarHeight() + 10,
    marginLeft: 18,
    position: 'absolute',
  },
  button: {
    paddingHorizontal: 23,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#9DA5F150',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    elevation: 1,
  },
  SendingBox: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  PhotoPicker: {
    backgroundColor: '#DADADA',
    height: 160,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
  },
  Cancel: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderColor: configs.colors.primaryColor,
    borderWidth: 1,
  },
  AlertCancel: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderColor: configs.colors.primaryColor,
    borderWidth: 1,
    flex: 1,
  },
  AlertDelete: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: configs.colors.primaryColor,
    borderRadius: 20,
    borderColor: '#fff',
    borderWidth: 1,
    flex: 1,
  },
  Send: {
    width: 150,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: configs.colors.primaryColor,
    borderRadius: 8,
    borderWidth: 1,
  },
  ContactTitle: {
    flexDirection: 'row',
    marginLeft: 5,
    marginBottom: 24,
  },
  AlertTitle: {
    flexDirection: 'column',
    marginLeft: 5,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  Active: {
    width: 12,
    height: 12,
    borderRadius: 12,
    marginRight: 6,
    backgroundColor: configs.colors.primaryColor,
    marginTop: 5,
  },
  Receiper: {
    backgroundColor: '#D1EAFF',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 4,
    marginBottom: 4,
  },
  DeletePhoto: {
    width: 24,
    height: 24,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 9,
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: configs.colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabStyle: {
    height: 40,
    borderRadius: 25,
    borderColor: configs.colors.primaryColor,
    marginHorizontal: 10,
  },
  firstTabStyle: {
    //custom styles
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderEndWidth: 1,
  },
  lastTabStyle: {
    //custom styles
    marginLeft: 0,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    borderStartWidth: 1,
  },
  tabTextStyle: {
    fontSize: 14,
    fontWeight: '600',
    color: configs.colors.primaryColor,
  },
  activeTabStyle: {
    backgroundColor: configs.colors.primaryColor,
  },
  activeTabTextStyle: {
    color: '#fff',
  },
  avartarPlaceholder: {
    height: 40,
    width: 40,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
  },
  contenctPlaceholder: {
    height: 8,
    // flex:6,
    width: '100%',
    backgroundColor: '#E0E0E0',
  },
  datePlaceholder: {
    height: 5,
    width: 5,
    backgroundColor: '#E0E0E0',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 5,
    position: 'absolute',
    backgroundColor: '#F66460',
  },
  rightActionStyle: {
    width: 70,
    flex: 1,
    backgroundColor: configs.colors.white, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  rightIconBgStyle: {
    width: 48,
    height: 48,
    borderRadius: 48/2,
    backgroundColor: configs.colors.grey1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  freeUpStorageContainer: {
    flexDirection: 'row',
    padding: 16,    
    alignContent:'center',
    alignItems:'center',
    backgroundColor: configs.colors.lightblue2,
    borderRadius: 20,
    borderColor: configs.colors.primaryColor,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  freeUpStorageText: {
    fontSize: 14,
    lineHeight: 19,
    flex:0.8,
    fontWeight: '600',
    color: configs.colors.primaryColor,
    marginHorizontal: 10,
  },
  freeUpStorageIcon: {
    height:39,width:35,resizeMode:'cover',
  }
});

const bindState = (state) => {
  return {
    roomList: state.homeState.room_list,
    room_list_loading: state.homeState.room_list_loading,
    delete_room_loading: state.homeState.delete_room_loading,
    userInfo: state.authState.userInfo,
    contact_list: state.homeState.contact_list,
    studentInfo: state.userState.studentInfo,
    isOpeningChatRoom: state.homeState.isOpeningChatRoom,
    selected_class_index: state.homeState.selected_class_index,
  };
};

const bindDispatch = (dispatch) => {
  return {
    getRoomList: (sender,handleCallback) => 
      dispatch(homeAction.getRoomList(sender,handleCallback)),
    deleteRoom: (roomID,handleCallback) => 
      dispatch(homeAction.deleteRoom(roomID,handleCallback)),
    readCommsAllMessage: (room_id, sender) =>
      dispatch(homeAction.readCommsAllMessage(room_id, sender)),
    fetchContactList: (centre_id, class_id, user_id) =>
      dispatch(homeAction.fetchContactList(centre_id, class_id, user_id)),
  };
};

export default connect(bindState, bindDispatch)(CommsScreen);
