import React, {Component} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Platform, 
  PermissionsAndroid,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {
  DotIndicator,
} from 'react-native-indicators';
import AsyncStorage from '@react-native-community/async-storage';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import configs from '../../utils/configs';
import {Space} from '../../components/space';
import RBSheet from 'react-native-raw-bottom-sheet';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-simple-toast';
import homeAction from '../../actions/homeAction';
import {connect} from 'react-redux';
import Loading from '../../components/Loading';
import moment from 'moment';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {getLauguageNameShort} from '../../screens/More/Settings/popSwitchLanguage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import utilities from '../../utils/utilities'

const Header = ({navigation, openConfirm, has_read}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={{flexDirection:'row', width: '100%', alignItems:'center', justifyContent: 'space-between' }}>
        <TouchableOpacity 
          style={{flex: 0.2, paddingLeft: 16, alignItems: 'flex-start'}}
          onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            color={configs.colors.primaryColor}
            size={24}
          />
        </TouchableOpacity>
        <View style={{flex: 0.6, alignSelf: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 18, fontWeight: '700'}}>Notification</Text>
        </View>
        <TouchableOpacity style={{flex: 0.2, marginRight: 5}}
          onPress={() => openConfirm()}
          disabled={!has_read}>
          <Text
            style={{
            color: has_read ? configs.colors.primaryColor : configs.colors.grey,
            fontSize: 18,
            fontWeight: '700',
          }}>
          All read
          </Text>
        </TouchableOpacity> 
      </View>           
    </View>
    
  );
};

class Notification extends Component {
  state = {
    data: [],
    selectedItem: '',
    isFetching: false,
    isLoadMore: false,
    refreshing: false,
    updated_date:'',
   
  };

  async componentDidMount() {
    let {
      fetchAllNotification,
      userInfo,
      notifications,
      isLoadingNoti,
      notificationNext,
    } = this.props;

    let all_read_data = JSON.parse(await AsyncStorage.getItem(configs.constant.AS_KEY.HAS_READ_NOTIFICATION));
    console.log("++++++++++++++++++++++++");
    console.log(all_read_data);
    console.log("++++++++++++++++++++++++");
    if(all_read_data !== "" && all_read_data !== null && all_read_data !== undefined && all_read_data !== {}){
      if(all_read_data.updated_by == userInfo.id){
        this.setState({
          updated_date:all_read_data.updated_date,
        });
      }
    }

    this.setState({
      isFetching: true,
    });

    fetchAllNotification(userInfo.id, userInfo.user_type, 10, '', false, () =>
      this.setState({isFetching: false}),
    );
  }

  _checkHasReadNoti =  (noti) =>{
    var returnValue = false;
    if(this.state.updated_date !== ""){
      let last_updated = moment(noti.last_updated);
      returnValue = moment(this.state.updated_date).isAfter(last_updated);
      console.log(moment(this.state.updated_date),last_updated);
    }else{
      returnValue = false;
    }
    return returnValue;
  }

  _copyMessage = () => {
    let getTextNoti = this.props.notifications.find(
      (data) => data.id === this.state.selectedItem,
    ).message;
    getTextNoti === undefined ? '' : getTextNoti;
    Clipboard.setString(getTextNoti);
    this.RBSheet.close();
    Toast.show('Copied successfully');
  };

  _translateMessage = () => {
    let {userSetting} = this.props;
    let selected = this.state.selectedItem;
    let selectedMessage = this.props.notifications.find(
      (data) => data.id === selected,
    ).message;
    let target =
      userSetting !== undefined
        ? getLauguageNameShort(userSetting.preferred_language)
        : '';
    this.props.getTranslate(
      selected,
      target,
      selectedMessage,
      this._translateMessageUpdate,
    );
    this.RBSheet.close();
  };

  _translateMessageUpdate = (id, data, isTranslate) => {
    if (isTranslate) {
      if (
        data.translations !== undefined &&
        data.translations !== null &&
        data.translations.length !== 0
      ) {
        this.props.setTranslate(id, data.translations[0].translatedText);
      }
    } else {
      alert('Unable to translate.');
    }
  };

  _setReadNotification = (isAll, selectedId) => {
    let {readNotification, userInfo, notifications} = this.props;
    let notification_id = [];
    if (isAll) {
      let getAllNotUpdate = notifications.filter(
        (data) => data.has_read === false,
      );
      for (let itemData of getAllNotUpdate) {
        notification_id.push(itemData.id);
      }
      readNotification(notification_id, userInfo.id, userInfo.user_type);
    } else {
      notification_id.push(selectedId);
      console.log(notification_id);
      readNotification(notification_id, userInfo.id, userInfo.user_type);
    }
  };

  _formatDate = (text) => {
    const receiveDate = moment(text, 'YYYY MMM DD hh:mm:ss').format(
      'YYYY-MM-DD',
    );
    const currentDate = moment().format('YYYY-MM-DD');

    if (currentDate === receiveDate) {
      return moment(receiveDate).format('hh:mm');
    } else {
      return moment(receiveDate).format('DD/MM');
    }
  };
  _onOpenNotification = (id, has_read, checkNotificationIsRead, userInfo) => {
    let {notifications} = this.props;
    let selectedNoti = notifications.find((data) => data.id === id);

    if (!has_read) {
      this._setReadNotification(false, id);
      checkNotificationIsRead(userInfo.id, userInfo.user_type);
    }
    // to detect which type navigate (to do)
    if (selectedNoti !== undefined && selectedNoti !== null) {
      if (selectedNoti.ref_type === 'donation') {
        console.log('GO TO DONATION : ID ', selectedNoti.ref_id);
      } else if (selectedNoti.ref_type === 'form') {
        console.log('GO TO FORM : ID ', selectedNoti.ref_id);
      }
    }
  };

  _onRefresh = () => {
    let {
      fetchAllNotification,
      userInfo,
      notifications,
      isLoadingNoti,
      notificationNext,
    } = this.props;

    this.setState({refreshing: true});
    fetchAllNotification(
      userInfo.id,
      userInfo.user_type,
      10,
      '',
      false,
      this.handleCallbackFirst,
    );
  };

  handleCallbackFirst = () => {
    this.setState({
      refreshing: false,
    });
  };

  onLoadMore = () => {
    let {
      fetchAllNotification,
      userInfo,
      notifications,
      isLoadingNoti,
      notificationNext,
    } = this.props;

    if (
      notificationNext !== undefined &&
      notificationNext !== '' &&
      notificationNext !== null
    ) {
      this.setState({isLoadMore: true});

      fetchAllNotification(
        userInfo.id,
        userInfo.user_type,
        10,
        notificationNext,
        true,
        this.handleCallbackLoad,
      );
    }
  };

  handleCallbackLoad = () => this.setState({isLoadMore: false});

  listFooter = () => (
    <View style={{width: '100%'}}>
      <ActivityIndicator color={'blue'} size={20} />
    </View>
  );

  skeletonLoader = () => {
    return (
      <>
        {[0, 1, 2, 3].map(() => (
          <View style={{marginHorizontal: 20, marginVertical: 25}}>
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center">
                <SkeletonPlaceholder.Item marginLeft={20}>
                  <SkeletonPlaceholder.Item
                    width={180}
                    height={10}
                    borderRadius={4}
                  />
                  <SkeletonPlaceholder.Item
                    marginTop={6}
                    width={80}
                    height={10}
                    borderRadius={4}
                  />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item>
                  <SkeletonPlaceholder.Item
                    width={30}
                    height={10}
                    borderRadius={4}
                    marginTop={-13}
                  />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </View>
        ))}
      </>
    );
  };

  setAllReadNotification = async () => {
    this._setReadNotification(true);
    
    await AsyncStorage.setItem(configs.constant.AS_KEY.HAS_READ_NOTIFICATION,JSON.stringify({
      updated_date:moment(),
      updated_by:this.props.userInfo.id,
    }));
    this.setState({
      updated_date:moment(),
    });
    this.props.checkNotificationIsRead(
      this.props.userInfo.id,
      this.props.userInfo.user_type,
    );
  }
  _renderEmptyNotification = () => {
    return <View style={{
      backgroundColor:configs.colors.backgroundColor,
      height:'100%',
      width:'100%',
      justifyContent:'center',
      alignItems:'center',
    }}>
      <Image source={require('../../assets/images/ic_empty_notification.png')} style={{height:67,width:67,resizeMode:'contain'}} />
      <Space height={20}/>
      <Text style={{alignSelf:'center',color: '#DADADA',
                          fontSize: 14,
                          fontWeight: 'bold',
                          fontFamily: configs.fontFamily.OPS700,}}>No Notification</Text>
    </View>
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

  render() {
    let {notifications = [], isLoadingNoti, isReadNotification} = this.props;

    console.log(notifications)

    return (
      <SafeAreaView style={styles.container}>
       <RBSheet
          closeOnPressBack
          dragFromTopOnly={true}
          closeOnDragDown={true}
          ref={(ref) => {
            this.RBSheetDelete = ref;
          }}
          dragFromTopOnly={true}
          openDuration={250}
          customStyles={{
            container: styles.bottomSheetContainer,
            draggableIcon: {
              width: 40,
              height: 5,
              marginTop: 18,
              backgroundColor: configs.colors.lightgrey,
            },
          }}
          closeOnDragDown
        >
          <View style={{justifyContent:'center',alignItems:'center',marginVertical:10,marginBottom:20,}}>
            <Text style={{fontSize:16,fontWeight:'bold',alignSelf:'center'}}>Are you sure you want to mark all notifications as read?</Text>
           
            <Space height={36}/>
            <View style={{flexDirection:'row',justifyContent:'space-around',}}>
              <TouchableOpacity style={{paddingVertical:10,width:configs.width * 0.35,borderWidth:1,borderColor:configs.colors.primaryColor,borderRadius:20}} onPress={()=>this.RBSheetDelete.close()}>
                <Text style={{color:configs.colors.primaryColor,fontWeight:'bold',alignSelf:'center'}}>Cancel</Text>
              </TouchableOpacity>
              <Space width={configs.width * 0.1}/>
              <TouchableOpacity style={{paddingVertical:10,width:configs.width * 0.35,backgroundColor:configs.colors.primaryColor,borderRadius:20}} onPress={()=>{
                this.RBSheetDelete.close();
                this.setAllReadNotification();
              }}>
                <Text style={{color:'white',fontWeight:'bold',alignSelf:'center'}}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
         <Header
          navigation={this.props.navigation}
          openConfirm={ () => this.RBSheetDelete.open()}
          has_read={this.props.has_read}
        />
        <View style={styles.mainViewContainer}>
       
        {this.state.isFetching ||
        this.state.refreshing ||
        // isReadNotification ||
        this.props.isHidingNoti
          ? this.skeletonLoader()
          : notifications.length <= 0 ? this._renderEmptyNotification() : <FlatList
          data={notifications}
          // refreshControl
          refreshControl={
            <RefreshControl
              colors={['#9Bd35A', '#689F38']}
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          showsVerticalScrollIndicator={false}
          onEndReached={() => this.onLoadMore()}
          ListFooterComponent={() =>
            this.state.isLoadMore ? (
              // this.listFooter()
              <View style={{width:'100%',justifyContent:'center',paddingVertical:10}}>
                <DotIndicator size={5} color={configs.colors.grey}/>
              </View>
            ) : (
              <View style={{height: 20}}></View>
            )
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            let isAttachmentExist = false;
            let fileName = "";
            if(item.attachment !== undefined && item.attachment !== "" && item.attachment !== null){
              isAttachmentExist = true;
              let tempArray = item.attachment.split("/");
              fileName = tempArray[tempArray.length - 1];
            }
            return (
            <View style={styles.item}>
              <View>
                {
                  item.ref_type == "form" ?
                  <TouchableOpacity
                  onPress={() =>{
                    this._onOpenNotification(
                      item.id,
                      item.has_read,
                      this.props.checkNotificationIsRead,
                      this.props.userInfo,
                    );
                    this.props.navigation.navigate("DigitalFormsDetails",{
                      id:item.ref_id,
                    });
                  }
                  }>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flex: 0.8, flexDirection: 'row'}}>
                      {!item.has_read ? (
                        <View style={styles.dot}></View>
                      ) : (
                        <View style={{width: 8}}></View>
                      ) }
                      <Text
                        style={{
                          color: configs.colors.primaryColor,
                          marginLeft: 6,
                        }}>
                        {item.sender}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 0.2,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{color: configs.colors.grey, fontSize: 12}}>
                        {this._formatDate(item.created_at)}
                      </Text>
                    </View>
                  </View>
                  <Space height={5} />
                  <View style={{paddingLeft: 14, paddingRight: 21,}}>
                      <Text style={{
                        fontWeight:'bold',
                        marginBottom:5,
                        fontSize:15,
                      }}>{item.title}</Text>
                      <Text>{item.message}</Text>
                      
                    </View>
                    <View style={{position:'absolute',right:0,height:'100%',justifyContent:'center',alignItems:'center'}}>
                      <Ionicons name="chevron-forward" size={18} color={configs.colors.lightgrey}/>
                    </View>
                </TouchableOpacity>
                  :
                  <TouchableOpacity
                  onPress={() =>
                    this._onOpenNotification(
                      item.id,
                      item.has_read,
                      this.props.checkNotificationIsRead,
                      this.props.userInfo,
                    )
                  }>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flex: 0.8, flexDirection: 'row'}}>
                      {!item.has_read ? (
                        <View style={styles.dot}></View>
                      ) : (
                        <View style={{width: 8}}></View>
                      ) }
                      <Text
                        style={{
                          color: configs.colors.primaryColor,
                          marginLeft: 6,
                        }}>
                        {item.sender}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 0.2,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{color: configs.colors.grey, fontSize: 12}}>
                        {this._formatDate(item.created_at)}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({selectedItem: item.id});
                          this.RBSheet.open();
                        }}>
                        <Feather
                          name="more-vertical"
                          color={configs.colors.lightgrey}
                          size={18}
                          style={{marginRight: -5}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Space height={5} />
                  <View style={{paddingLeft: 14, paddingRight: 14}}>
                    {/* <TouchableWithoutFeedback
                    onPress={() =>
                      
                    }> */}
                     <Text style={{
                        fontWeight:'bold',
                        marginBottom:5,
                        fontSize:15,
                      }}>{item.title}</Text>
                      <Text>{item.message}</Text>
                      {
                        isAttachmentExist === true && <View style={{
                          flexDirection:'row',
                          marginTop:5,
                        }}>
                          <Ionicons name="download-outline" color={configs.colors.primaryColor} size={20}/>
                          <Text onPress={()=>{
                            if(Platform.OS == "ios"){
                              utilities.openURLInBrowser(item.attachment);
                            }else{
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
                                      const { config, fs } = RNFetchBlob;
                                      let date = new Date();
                                      var pdf_url = item.attachment;
                                      let PictureDir = fs.dirs.PictureDir;
                                      let options = {
                                        fileCache: true,
                                        addAndroidDownloads: {
                                          //Related to the Android only
                                          useDownloadManager: true,
                                          notification: true,
                                          path:
                                            PictureDir +
                                            '/'+ fileName +
                                            Math.floor(date.getTime() + date.getSeconds() / 2) +
                                            '.pdf',
                                          description: fileName,
                                        },
                                      };
                                      config(options)
                                        .fetch('GET', pdf_url)
                                        .then((res) => {
                                          //Showing alert after successful downloading
                                          console.log('res -> ', JSON.stringify(res));
                                          utilities.showToastMessage("Successful! you have download pdf file.");
                                        });
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
                          }} style={{
                            color:configs.colors.primaryColor,
                            fontSize:16,
                            // fontWeight:'bold',
                            alignItems:"center",
                            justifyContent:'center',
                            // textShadowColor: '#000000001',
                            // textShadowOffset: { width: 1, height: 1 },
                            // textShadowRadius: 5,
                          }}>
                            Download file
                          </Text>
                        </View>
                      }
                    {/* </TouchableWithoutFeedback> */}
                  </View>
                </TouchableOpacity>
                }

                {item.is_translate && (
                  <View>
                    <Space height={10} />
                    <View
                      style={{
                        marginLeft: 14,
                        marginRight: 14,
                        borderBottomColor: configs.colors.primaryColor,
                        borderBottomWidth: 1,
                      }}
                    />
                    <View style={{paddingLeft: 14, paddingRight: 14}}>
                      <Space height={10} />

                      <Text style={{color: configs.colors.primaryColor}}>
                        {item.translate}
                      </Text>
                    </View>

                    <Space height={10} />

                    <View
                      style={{
                        alignSelf: 'flex-start',
                        borderRadius: 4,
                        backgroundColor: configs.colors.primaryColor,
                        paddingLeft: 6,
                        paddingRight: 8,
                        paddingTop: 4,
                        paddingBottom: 4,
                        marginLeft: 14,
                        marginRight: 14,
                      }}>
                      <View
                        style={{alignItems: 'center', flexDirection: 'row'}}>
                        <Ionicons
                          size={16}
                          style={{marginRight: 4}}
                          color={configs.colors.white}
                          name="checkmark-outline"
                        />
                        <Text
                          style={{
                            fontFamily: configs.fontFamily.OPS600,
                            size: 12,
                            color: configs.colors.white,
                          }}>
                          Translate
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}}
        />}
        
     
        

      
     
        <View>
          <RBSheet
            closeOnPressBack
            ref={(ref) => {
              this.RBSheet = ref;
            }}
            dragFromTopOnly={true}
            openDuration={250}
            customStyles={{
              container: styles.bottomSheetContainer,
            }}
            closeOnDragDown>
            <View style={{padding: 20}}>
              <TouchableOpacity
                style={styles.bottom_sheet_item}
                onPress={this._copyMessage}>
                <Text style={{fontSize: 16, fontWeight: '700'}}>
                  Copy Message
                </Text>
              </TouchableOpacity>
              {
                this.props.userInfo.user_type == "parent" && <TouchableOpacity
                  style={styles.bottom_sheet_item}
                  onPress={this._translateMessage}>
                  <Text style={{fontSize: 16, fontWeight: '700'}}>Translate</Text>
                </TouchableOpacity>
              }
              <TouchableOpacity
                style={styles.bottom_sheet_item}
                onPress={() => {
                  let notification_id = this.state.selectedItem;
                  var role = this.props.userInfo.user_type;
                  var id = this.props.userInfo.id;
                  this.props.hideNotificationItem(notification_id, id, role);

                  this.setState({
                    isFetching: true,
                  });

                  this.props.fetchAllNotification(
                    this.props.userInfo.id,
                    this.props.userInfo.user_type,
                    10,
                    '',
                    false,
                    () => this.setState({isFetching: false}),
                  );

                  this.RBSheet.close();
                }}>
                <Text style={{fontSize: 16, fontWeight: '700'}}>
                  Delete Message
                </Text>
              </TouchableOpacity>
            </View>
          </RBSheet>
        </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: configs.colors.white,
  },
  mainViewContainer: {
    flex: 1,
    backgroundColor: configs.colors.backgroundColor,
  },
  bottom_sheet_item: {
    padding: 10,
    width: 'auto',
    // backgroundColor:'blue',
    height: 50,
  },
  dot: {
    height: 8,
    width: 8,
    alignSelf: 'center',
    borderRadius: 8,
    backgroundColor: '#F66460',
  },
  headerContainer: {
    flexDirection: 'row',
    height: 48,
    width: '100%',
    marginTop: Platform.OS == 'ios' ?  0   : StatusBar.currentHeight,
    backgroundColor: configs.colors.white,
   //backgroundColor: 'black'
    
  },
  item: {
    marginHorizontal: 17,
    marginTop: 17,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    width: 'auto',
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

const bindState = (state) => {
  return {
    userInfo: state.authState.userInfo,
    notifications: state.homeState.notifications,
    isLoadingNoti: state.homeState.isLoadingNoti,
    isReadNotification: state.homeState.isReadNotification,
    notificationNext: state.homeState.notificationNext,
    userSetting: state.userState.userSetting,
    has_read: state.homeState.has_read,
    isHidingNoti: state.homeState.isHidingNoti,
  };
};

const bindDispatch = (dispatch) => {
  return {
    fetchAllNotification: (
      userId,
      role,
      size = 10,
      next,
      isNext,
      handleCallback,
    ) =>
      dispatch(
        homeAction.fetchAllNotification(
          userId,
          role,
          (size = 10),
          next,
          isNext,
          handleCallback,
        ),
      ),
    getTranslate: (id, target, text, handleCallback) =>
      dispatch(homeAction.getTranslate(id, target, text, handleCallback)),
    setTranslate: (id, value) => dispatch(homeAction.setTranslate(id, value)),
    readNotification: (notification_id, id, role) =>
      dispatch(homeAction.readNotification(notification_id, id, role)),
    checkNotificationIsRead: (user_id, role) =>
      dispatch(homeAction.checkNotificationIsRead(user_id, role)),
    hideNotificationItem: (notification_id, id, role) =>
      dispatch(homeAction.hideNotificationItem(notification_id, id, role)),
  };
};

export default connect(bindState, bindDispatch)(Notification);
