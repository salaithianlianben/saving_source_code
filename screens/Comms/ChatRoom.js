import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  ActivityIndicator,
  Text,
  Platform,
  StyleSheet,
  Modal,
  Image,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  Linking,
  Dimensions,
} from 'react-native';
import { RNS3 } from 'react-native-aws3';
import CryptoJS from 'react-native-crypto-js';
import homeAction from '../../actions/homeAction';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-simple-toast';
import { connect } from 'react-redux';
import configs from '../../utils/configs';
import moment from 'moment';
import Loading from '../../components/Loading';
import IconButton from '../../components/icon_button';
// import CameraRoll from "@react-native-community/cameraroll";
import ImagePicker from 'react-native-image-crop-picker';
import VideoPlayer from 'react-native-video-player';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import base64 from 'react-native-base64';
import { createThumbnail } from 'react-native-create-thumbnail';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Space } from '../../components/space';
import ImageLoad from '../../components/ImageLoad';
import { v4 as uuidV4 } from 'uuid';
import FilePreviews from './FilePreviews';
import { hasNotch, isIOS } from '../../utils/screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImageViewer from 'react-native-image-zoom-viewer';
import firestore from '@react-native-firebase/firestore';
import RBSheet from 'react-native-raw-bottom-sheet';
import {getLauguageNameShort} from '../../screens/More/Settings/popSwitchLanguage';

const {height, width} = Dimensions.get('window');

class chatRoom extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    message: '',
    isLoadMore: false,
    isFetching: false,
    isSending: false,
    all_messages: [],
    image: null,
    textInputHeight: 0,
    sendContainerHeight: 0,
    is_fetching: false,
    isPreview: false,
    thumbnail: null,
    fileType: false,
    selectToShowImage: null,
    isSelectedToShowImage: false,
    isOnSnapShot: false,
    selectedMessage:'',
  };

  getAllMsgBySnapShop = async(receiverInfoID, userInfoID, roomID) => {
    this.setState({isFetching: true,});

    this.commsDataSubscriber = firestore()
    .collection('comms')
    .where('receiver', '==', userInfoID)//logged in user
    .where('sender', '==', receiverInfoID)
    .onSnapshot((querySnapshot) => {
      
      var loading = true;
      if(this.state.isOnSnapShot)
        loading = false;

      console.log('getMsgBySnapShop : reach ', this.state.isOnSnapShot);

      this.props.fetchMessageBetweenUsers(
        receiverInfoID,
        userInfoID,
        10,
        false,
        loading,//loading
        '',
        () => {
          this.setState({ isFetching: false });
          this.setState({ isOnSnapShot: true });
        },
      );

      //this.props.getRoomList(this.props.userInfo.id);

      setTimeout(() => {
        this.props.readCommsAllMessage(
          roomID,
          userInfoID,
        );
      }, 4000);
    });
  }

  componentWillUnmount(){
    if(this.commsDataSubscriber)
      this.commsDataSubscriber();
  }

  componentDidMount() {
    const { receiver_info } = this.props.route.params;
    this.getAllMsgBySnapShop(receiver_info.id
      , this.props.userInfo.id, this.props.room_id);
  }

  generateThumbnail = async (image) => {
    // console.log(image);
    const timeStamp = 1000;
    var thumbnail_url = null;
    await createThumbnail({
      url: image.path,
      timeStamp,
    })
      .then((response) => {
        var x = response.path;
        var tempList = x.split('/');
        var tempFileName = tempList[tempList.length - 1];
        var i = tempFileName.indexOf('.');
        var type =
          'image/' +
          tempFileName.substring(parseInt(i) + 1, tempFileName.length);
        thumbnail_url = {
          uri: x,
          name: tempFileName,
          type: type,
        };
        return thumbnail_url;
      })
      .catch((err) => {
        console.log({ err });
        return null;
      });
  };

  groupedDays = (messages) => {
    return (
      messages &&
      messages.reduce((acc, el, i) => {
        const messageDay = moment(el.created_at, 'YYYY MMM DD h:mm:ss').format(
          'YYYY-MM-DD',
        );

        if (acc[messageDay]) {
          return { ...acc, [messageDay]: acc[messageDay].concat([el]) };
        }
        return { ...acc, [messageDay]: [el] };
      }, {})
    );
  };

  checkIsSuccess = (item) => {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 3,
          right: 3,
        }}>
        {item.is_success_for_sending != undefined ? (
          <>
            {item.is_success_for_sending ? (
              <>
                <Ionicons name="checkmark" color="green" size={10} />
              </>
            ) : (
              item.is_fail_for_sending == false && (
                <EvilIcons name="clock" color="grey" size={10} />
              )
            )}
          </>
        ) : (
          <>
            <Ionicons name="checkmark-done" color="green" size={15} />
          </>
        )}
      </View>
    );
  };

  pickSingleWithCamera(cropping, mediaType = 'video') {
    ImagePicker.openCamera({
      cropping: cropping,
      width: 500,
      height: 500,
      includeExif: true,
      mediaType,
    })
      .then((image) => {
        this.setState(
          {
            image: {
              uri: image.path,
              width: image.width,
              height: image.height,
              mime: image.mime,
              size: image.size,
            },
          },
          () =>
            this.setState({
              isPreview: true,
            }),
        );
      })
      .catch((e) => {
        console.log(e);
        if(e.message){
          var msg = e.message.toLowerCase();
          if (msg.includes('camera permission')) { 
            Alert.alert('Please grant camera permission.',
              null,
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                {
                  text: "OK",
                  onPress: () => Linking.openURL('app-settings:'),
                  style: "ok"
                }
              ]
            );
          }
        }
      });
  }

  generateItems = (messages) => {
    if (
      messages == undefined ||
      messages.length < 0 ||
      messages == null ||
      messages == {}
    ) {
      return [];
    } else {
      var isNewShow = false;
      const days = this.groupedDays(messages);
      // console.log(JSON.stringify(days));
      const sortedDays = Object.keys(days).sort(
        (x, y) =>
          moment(y, 'YYYY-MM-DD').unix() - moment(x, 'YYYY-MM-DD').unix(),
      );
      const items = sortedDays.reduce((acc, date) => {
        const sortedMessages = days[date].sort(
          (x, y) => new Date(y.created_at) - new Date(x.created_at),
        );
        let newArray=[...sortedMessages];
        //let index = sortedMessages.findIndex((ele, i)=> ele.has_read == true && i != 0);
        
        newArray =  newArray.map((ele, i) => {
          var isShow;
          // if(i == index){
          //   isShow = true;
          // }else{
          //   isShow = false;
          // }
          if(ele.has_read && !isNewShow ){
            isShow = true;
            isNewShow= true;
          }else{
            isShow = false;
          }

          return {...ele, isNew: isShow};
        });
        
        return acc.concat([...newArray, { type: 'day', date, id: date }]);
      }, []);
      return items;
    }
  };

  LoadMoreMessage = () => {
    const { receiver_info } = this.props.route.params;
    this.setState({
      isLoadMore: true,
    });
    this.props.fetchMessageBetweenUsers(
      receiver_info.id,
      this.props.userInfo.id,
      10,
      true,
      false,//loading
      this.props.get_message_next_url,
      () => this.setState({ isLoadMore: false }),
    );
  };

  pickSingle(cropit, circular = false, mediaType) {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: cropit,
      cropperCircleOverlay: circular,
      includeExif: true,
      //sortOrder: 'none',
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      cropperStatusBarColor: 'white',//android only
      cropperToolbarColor: 'white',//android only
      cropperActiveWidgetColor: 'white',//android only
      cropperToolbarWidgetColor: '#3498DB',//android only
      multiple: false,
      maxFiles: 1,
      minFiles: 1,
      showsSelectedCount: false,
      avoidEmptySpaceAroundImage: false//ios only
    })
      .then((image) => {
        this.setState(
          {
            image: {
              uri: image.path,
              width: image.width,
              height: image.height,
              mime: image.mime,
              size: image.size,
            },
          },
          () =>
            this.setState({
              isPreview: true,
            }),
        );
      })
      .catch((e) => {
        console.log('IMAGE PICKER ERROR : '+ e.message);
        if(e.message){
          var msg = e.message.toLowerCase();
          if (msg.includes('cannot access image')) { 
            Alert.alert(e.message,
              null,
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                {
                  text: "OK",
                  onPress: () => Linking.openURL('app-settings:'),
                  style: "ok"
                }
              ]
            );
          }
        }
      });
  }

  onSendMessageToReceiver = () => {
    const {
      room_id,
      userInfo,
      chatMessageBetweenUsers,
      sendMessageBetweenUsers,
    } = this.props;
    const { receiver_info } = this.props.route.params;
    var temp = null;
    const { message } = this.state;

    var date = moment()
      .utcOffset('+08:00')
      .format('YYYY MMM DD hh:mm:ss');
    temp = {
      created_at: date,
      id: uuidV4(),
      sender: userInfo.id,
      room_id: room_id,
      img: '',
      video: '',
      video_thumbnail: '',
      receiver: receiver_info.id,
      message: message,
      has_read: true,
      is_success_for_sending: false,
      is_fail_for_sending: false,
    };
    chatMessageBetweenUsers(temp);
    // console.log("Hello hi");
    sendMessageBetweenUsers(
      userInfo.id,
      receiver_info.id,
      '',
      message,
      room_id,
      '',
      '',
      temp.id,
    );

    this.setState({
      message: '',
      image: null,
    });

    console.log('sender name >> '+ userInfo.name);

    this.props.readCommsAllMessage(
      room_id,
      userInfo.id,
    );
  };

  onSendFileToReceiver = async (fileType, thumbnail) => {
    const {
      room_id,
      userInfo,
      chatMessageBetweenUsers,
      sendMessageBetweenUsers,
    } = this.props;
    const { receiver_info } = this.props.route.params;
    var temp = null;
    const { message, image } = this.state;

    if (fileType) {
      var date = moment()
      .utcOffset('+08:00')
      .format('YYYY MMM DD hh:mm:ss');
      temp = {
        created_at: date,
        id: uuidV4(),
        sender: userInfo.id,
        room_id: room_id,
        img: '',
        video: image,
        video_thumbnail: thumbnail,
        receiver: receiver_info.id,
        message: message,
        has_read: true,
        is_success_for_sending: false,
        is_fail_for_sending: false,
      };
      chatMessageBetweenUsers(temp);
      const tempArray = image.uri.split('/');
      var fileName = tempArray[tempArray.length - 1];
      var i = fileName.indexOf('.');
      var ciperText = base64.encode(fileName.substring(0, parseInt(i)));
      const imagefile = {
        name: `${ciperText}` + fileName.substring(parseInt(i), fileName.length),
        type: image.mime,
        uri: image.uri,
      };
      var thumbnailFileName = thumbnail.name;
      var thumbnailCiperText = base64.encode(thumbnailFileName);
      const thumbnailFile = {
        name: `${thumbnailCiperText}` + '.mp4',
        type: thumbnail.type,
        uri: thumbnail.uri,
      };
      const options = {
        acl: configs.constant.S3_KEYS.AWS_ACL,
        keyPrefix: configs.constant.S3_KEYS.AWS_KEY_PREFIX,
        bucket: configs.constant.S3_KEYS.AWS_BUCKET_NAME,
        region: configs.constant.S3_KEYS.AWS_REGION,
        accessKey: configs.constant.S3_KEYS.AWS_ACCESS_KEY,
        secretKey: configs.constant.S3_KEYS.AWS_SECRET_KEY,
        successActionStatus: 201,
      };
      try {
        var video = '';
        var video_thumbnail = '';
        await RNS3.put(imagefile, options).then(async (response) => {
          video = response.body.postResponse.key;
          await RNS3.put(thumbnailFile, options).then((res) => {
            video_thumbnail = res.body.postResponse.key;
            sendMessageBetweenUsers(
              userInfo.id,
              receiver_info.id,
              '',
              message,
              room_id,
              video,
              video_thumbnail,
              temp.id,
            );

            this.props.readCommsAllMessage(
              room_id,
              userInfo.id,
            );
          });
        });
      } catch (error) {
        console.log('ERROR 1');
        Alert.alert('Server Errors', 'Server request time out');
        console.log(error);
      }
    } else {
      var date = moment()
      .utcOffset('+08:00')
      .format('YYYY MMM DD hh:mm:ss');
      temp = {
        created_at: date,
        id: uuidV4(),
        sender: userInfo.id,
        room_id: room_id,
        img: image,
        video: '',
        video_thumbnail: '',
        receiver: receiver_info.id,
        message: message,
        has_read: true,
        is_success_for_sending: false,
        is_fail_for_sending: false,
      };
      chatMessageBetweenUsers(temp);
      sendMessageBetweenUsers(
        userInfo.id,
        receiver_info.id,
        this.state.image,
        message,
        room_id,
        '',
        '',
        temp.id,
      );

      this.props.readCommsAllMessage(
        room_id,
        userInfo.id,
      );
    }

    this.setState({
      message: '',
    });
  };

  renderImages = (typeImage, item) => {
    return typeImage == 'object' ? (
      <TouchableOpacity
        onPress={() => {
          item?.img && this.setState({
            selectToShowImage: [
              {
                url: item.img,
              },
            ],
            isSelectedToShowImage: true,
          });
        }}>
        <View
          style={{
            height: 'auto',
            width: configs.width / 2 + 5,
            borderRadius: 5,
            backgroundColor: '#E8EDFC',
            padding: 3,
          }}>
          <Image
            source={item.img}
            style={{
              height: 200,
              width: configs.width / 2,
              resizeMode: 'cover',
              borderRadius: 3,
            }}
          />
          {item.message != '' ? (
            <Text style={{ paddingHorizontal: 10, paddingVertical: 2 }}>
              {item.message}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={() => {
          item?.img && this.setState({
            selectToShowImage: [
              {
                url: item.img,
              },
            ],
            isSelectedToShowImage: true,
          });
        }}>
        <View
          style={{
            height: 'auto',
            width: configs.width / 2 + 5,
            borderRadius: 5,
            backgroundColor: '#E8EDFC',
            padding: 3,
          }}>
          <Image
            source={{ uri: item.img }}
            style={{
              height: 200,
              width: configs.width / 2,
              resizeMode: 'cover',
              borderRadius: 3,
            }}
          />
          {/* {this.checkIsSuccess(item)} */}
        </View>
      </TouchableOpacity>
    );
  };

  translateMessage = () => {
    const { setTranslateMessage,userSetting } = this.props;
    let target =
      userSetting !== undefined
        ? getLauguageNameShort(userSetting.preferred_language)
        : '';
    setTranslateMessage(this.state.selectedMessage.id,target,this.state.selectedMessage.message,(value)=>console.log(value, "Hello"));
    this.RBSheet.close();
  }

  _renderNewLine =()=>{
    return (
      <View style={{marginHorizontal: 24,}}>
        <View style= {{
          position: 'absolute',
          width: '100%', 
          height: 1,
          backgroundColor: '#F66460',
          paddingHorizontal: 20,
          marginTop: 5,
          marginBottom: 5}}/> 
          <Text style={{
            color:'#F66460', 
            fontSize:16,
            textAlign: 'center',
            lineHeight: 22,
            fontFamily:configs.fontFamily.OPS700, 
            marginTop: 8,}}>
              New
          </Text>
      </View>
    );

  }

  renderText = (item) => {
    return item.sender == this.props.userInfo.id ? (
      <TouchableOpacity
        onLongPress={()=> {
          this.RBSheet.open();
          this.setState({
            selectedMessage:item,
          })
        }}
        style={{
          marginLeft: 10,
          paddingHorizontal: 15,
          paddingVertical: 10,
          alignItems: 'center',
          backgroundColor: '#E8EDFC',
          flexDirection: 'row',
          borderRadius: 8,
          maxWidth: configs.width - 100,
        }}>
        <View style={styles.Triangle1}></View>
          {/* <Image source={require('../../assets/images/Smile.png')}  style={{ width: 80, height: 16 }}   /> */}
          <View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: configs.fontFamily.OPS600,
              color: '#00000090',
            }}>
            {item.message}
          </Text>
          <Space height={5}/>
          <View >
          {
            item.is_translate != undefined && item.is_translate == true &&
            <>
              <View style={{height:0.5,width:'100%',backgroundColor:configs.colors.primaryColor,marginBottom:5,}}/>
              <Text style={{fontSize:13,color:configs.colors.primaryColor}}>
                {item.translate}
              </Text>
              <Space height={5}/>
              <View style={{flexDirection:'row',alignItems:'center',borderRadius:4,paddingHorizontal:4,borderWidth:0.5,borderColor:configs.colors.primaryColor,marginBottom:5,alignSelf:'flex-start'}}>
              <Ionicons
                          size={16}
                          style={{marginRight: 4}}
                          color={configs.colors.primaryColor}
                          name="checkmark-outline"
                        />
                <Text style={{fontSize:13,color:configs.colors.primaryColor}}>Translate</Text>
              </View>
            </>
          }
          </View>
          
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onLongPress={()=> {
          this.RBSheet.open();
          this.setState({
            selectedMessage:item,
          })
        }}
        style={{
          marginLeft: 10,
          paddingHorizontal: 15,
          paddingVertical: 10,
          alignItems: 'center',
          backgroundColor: configs.colors.primaryColor,
          flexDirection: 'row',
          borderRadius: 8,
          maxWidth: configs.width - 100,
        }}>
        <View style={styles.Triangle}></View>
        <View>
        <Text
          style={{
            fontSize: 16,
            fontFamily: configs.fontFamily.OPS600,
            color: '#fff',
          }}>
          {item.message}
        </Text>
        <Space height={5}/>
        <View>
        {
          item.is_translate != undefined && item.is_translate == true &&
          <>
            <View style={{height:0.5,width:'100%',backgroundColor:'white',marginBottom:5,}}/>
              <Text style={{fontSize:13,color:'white'}}>
                {item.translate}
              </Text>
              <Space height={5}/>
              <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',paddingHorizontal:5,borderRadius:4,alignSelf:'flex-start'}}>
              <Ionicons
                          size={16}
                          style={{marginRight: 4}}
                          color={configs.colors.primaryColor}
                          name="checkmark-outline"
                        />
                <Text style={{fontSize:13,color:configs.colors.primaryColor}}>Translate</Text>
              </View>
          </>
        }
        </View>
        
        </View>
      </TouchableOpacity>
    );
  };

  renderVideo = (video, thumbnail, item) => {
    return (
      <View
        style={{
          height: 'auto',
          width: configs.width / 2 + 5,
          borderRadius: 5,
          backgroundColor: '#E8EDFC',
          padding: 3,
        }}>
        {/* {item.is_success_for_sending == true ||
        item.is_success_for_sending == undefined ? null : (
          <View
            style={{
              height: 204,
              width: configs.width / 2 + 5,
              borderRadius: 5,
              position: 'absolute',
              backgroundColor: '#00000040',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {
                item.is_fail_for_sending ? <View>
                  <Text style={{color:'white'}}>Retry</Text>
                  <Ionicons name="refresh-outline" size={25} color="white" onPress={()=>this.onSendFileToReceiver(this.state.fileType,this.state.thumbnail)}/>
                </View> : <ActivityIndicator size={30} color={'white'} />
              }
            
          </View>
        )} */}
        <VideoPlayer
          video={{ uri: video }}
          resizeMode="cover"
          thumbnail={{ uri: thumbnail }}
          style={{
            height: 200,
            width: configs.width / 2 - 2,
            borderRadius: 5,
          }}
        />
      </View>
    );
  };

  render() {
    const { receiver_info } = this.props.route.params;
    const { userInfo } = this.props;

    let data = this.generateItems(this.props.all_messages_between_users);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <StatusBar
            translucent={true}
            backgroundColor={this.state.isPreview ? '#000000' : 'transparent'}
            barStyle="dark-content"
          />
          <Modal visible={this.state.isPreview} transparent={false} statusBarTranslucent={true}>
            <FilePreviews
              image={this.state.image}
              receivername={receiver_info.name}
              message={this.state.message}
              onChangeMessage={(value) => this.setState({ message: value })}
              onClickBack={() => this.setState({ isPreview: false })}
              pickLibrary={() => {
                this.pickSingle(false);
                this.setState({ isPreview: false });
              }}
              onSendingAction={(fileType, thumbnail) => {
                this.setState({ isPreview: false, fileType: fileType, thumbnail: thumbnail });
                this.onSendFileToReceiver(fileType, thumbnail);
              }}
            />
          </Modal>
          <IconButton
            icon={
              <Ionicons
                name="chevron-back-outline"
                size={24}
                color={configs.colors.primaryColor}
              />
            }
            onPress={() => this.props.navigation.pop()}
          />
          <Space width={10} />

          <Text style={{ fontSize: 16, fontFamily: configs.fontFamily.OPS700 }}>
            {receiver_info.name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: configs.fontFamily.OPS700,
              color: configs.colors.grey,
            }}>
            ・{receiver_info.role}
          </Text>
        </View>
        <Modal
          transparent={true}
          animationType={'fade'}
          statusBarTranslucent={true}
          visible={this.state.isSelectedToShowImage}>
          <View
            style={{
              backgroundColor: '#000000',
              width: configs.width,
              height: configs.height,
              paddingTop: 40,
            }}>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                marginHorizontal: 10,
                marginTop: 5,
                marginBottom: 10,
                backgroundColor: '#769CFF',
                borderRadius: 30,
                height: 30,
                width: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.setState({ isSelectedToShowImage: false })
              }}>
              <Ionicons name="close-outline" color={'black'} size={18} />
            </TouchableOpacity>
            <ImageViewer imageUrls={this.state.selectToShowImage} />
          </View>
        </Modal>

        {this.props.messages_between_users_loading || this.props.isFetching ? (
          <View
            style={{
              height: '80%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: 'grey' }}>Loading...</Text>
          </View>
        ) : (
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            extraHeight={300}
            style={{
              height: configs.height - (getStatusBarHeight() + 59),
            }}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'column', backgroundColor: configs.colors.backgroundColor }}>
              <View
                style={{
                  height: configs.height - (getStatusBarHeight() + 40 + 45) - (isIOS() ? hasNotch() ? 70 : 35 : 35),
                }}>
                <FlatList
                  data={data}
                  showsVerticalScrollIndicator={false}
                  onEndReached={() => this.LoadMoreMessage()}
                  inverted
                  renderItem={({ item, index }) => {
                    var typeImage = typeof item.img;
                    typeImage = typeImage.toString();
                    var typeVideo = typeof item.video;
                    typeVideo = typeVideo.toString();
                    console.log('Comms Message Item');
                    console.log(item);
                    return (
                      <View>
                        {data.length - 1 == index && this.state.isLoadMore ? (
                          <View
                            style={{
                              width: '100%',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <ActivityIndicator
                              size={20}
                              color={configs.colors.primaryColor}
                            />
                          </View>
                        ) : null}
                        <View>
                          {item.date != undefined ? (
                            <View style={{ alignItems: 'center' }}>
                              <View style={styles.Day}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    fontFamily: configs.fontFamily.OPS600,
                                    color: configs.colors.primaryColor,
                                  }}>
                                  {moment(item.date, 'YYYY-MM-DD').format(
                                    'MMM DD, yyyy',
                                  )}
                                </Text>
                              </View>
                            </View>
                          ) : item.sender == userInfo.id ? (
                            <View
                              key={index}
                              style={{
                                flexDirection: 'row',
                                marginTop: 10,
                                marginBottom: 10,
                                justifyContent: 'flex-end',
                                marginRight: 10,
                              }}>
                                <View
                                  style={{
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                }}>
                                <Text
                                  style={{
                                    fontSize: 10,
                                    color: '#939494',
                                    fontFamily: configs.fontFamily.OPS600,
                                    marginBottom: 10,
                                  }}>
                                  {moment(
                                    item.created_at,
                                    'YYYY MMM DD h:mm:ss',
                                  ).format('MMM DD h:mm a')}
                                </Text>
                                {/* <View style={{width:configs.width,alignSelf:'flex-end',flexDirection:'row',}}> */}
                                {item.img != ''
                                  ? this.renderImages(typeImage, item)
                                  : item.video != ''
                                    ? typeVideo == 'object'
                                      ? this.renderVideo(
                                        item.video.uri,
                                        item.video_thumbnail.uri,
                                        item,
                                      )
                                      : this.renderVideo(
                                        item.video,
                                        item.video_thumbnail,
                                        item,
                                      )
                                    : this.renderText(item)}
                                {
                                  item.is_fail_for_sending ? <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignSelf: 'flex-end' }}>
                                    <Text style={{ color: 'red' }}>fail</Text>
                                    <Ionicons name="refresh-outline" color="red" size={18} />
                                  </View> : item.is_success_for_sending == false && item.is_fail_for_sending == false ? <ActivityIndicator size={10} animating color="blue" /> : null
                                }
                                {/* </View> */}
                              </View>
                            </View>
                          ) : (
                            <View> 

                              <View
                                key={index}
                                style={{
                                  flexDirection: 'row',
                                  margin: 10
                              }}>

                              <View
                                style={{
                                  height: 42,
                                  width: 42,
                                  backgroundColor: configs.colors.primaryColor,
                                  borderRadius: 42,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginRight: 8,
                                }}>
                                <ImageLoad
                                  style={{
                                    width: 40,
                                    height: 40,
                                  }}
                                  loadingStyle={{ size: 'small', color: 'white' }}
                                  borderRadius={40}
                                  placeholderStyle={{
                                    width: 40,
                                    height: 40,
                                  }}
                                  source={{
                                    uri: receiver_info.img,
                                    cache: 'force-cache',
                                  }}
                                  placeholderSource={require('../../assets/icons/ic_account.png')}
                                />
                              </View>
                              
                              <View style={{ flexDirection: 'column' }}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: '#939494',
                                    fontFamily: configs.fontFamily.OPS600,
                                    marginBottom: 10,
                                  }}>
                                  {moment(
                                    item.created_at,
                                    'YYYY MMM DD h:mm:ss',
                                  ).format('MMM DD h:mm a')}
                                </Text>
                                {/* <View style={{width:configs.width,alignSelf:'flex-start'}}> */}
                                {item.img != ''
                                  ? this.renderImages(typeImage, item)
                                  : item.video != ''
                                    ? typeVideo == 'object'
                                      ? this.renderVideo(
                                        item.video.uri,
                                        item.video_thumbnail.uri,
                                        item,
                                      )
                                      : this.renderVideo(
                                        item.video,
                                        item.video_thumbnail,
                                        item,
                                      )
                                    : this.renderText(item)}
                                {
                                  item.is_fail_for_sending ? <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignSelf: 'flex-end' }}>
                                    <Text style={{ color: 'red' }}>fail</Text>
                                    <Ionicons name="refresh-outline" color="red" size={18} />
                                  </View> : item.is_success_for_sending == false && item.is_fail_for_sending == false ? <ActivityIndicator size={18} animating /> : null
                                }
                                {/* </View> */}
                              </View>
                            </View>
                              {(item.isNew && index !=0) ? this._renderNewLine(): null }
                            </View>
                          )}
                        </View>
                      </View>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                />
                {/* <Space height={this.state.sendContainerHeight} /> */}
              </View>

              <View style={styles.BottomIput}>
                <TouchableOpacity onPress={() => this.pickSingle()}>
                  <Image
                    source={require('../../assets/icons/Union.png')}
                    style={{ width: 24, height: 24, resizeMode: 'contain' }}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    width: configs.width - 100,
                    height: Math.max(35, this.state.textInputHeight),
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: '#DADADA',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <TextInput
                      onContentSizeChange={(event) => {
                        this.setState({
                          textInputHeight: event.nativeEvent.contentSize.height,
                        });
                      }}
                      style={{
                        height: 'auto',
                        flex: 10,
                        fontSize: 14,
                        fontFamily: configs.fontFamily.OPS600,
                        paddingHorizontal: 15,
                        paddingVertical: 7,
                      }}
                      placeholder="Type something"
                      placeholderTextColor="#DADADA"
                      value={this.state.message}
                      multiline
                      onChangeText={(value) =>
                        this.setState({
                          message: value,
                        })
                      }
                    />

                    <TouchableOpacity
                      style={{
                        marginRight: 15,
                        paddingVertical: 10,
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                      }}
                      activeOpacity={0.6}
                      onPress={() => this.pickSingleWithCamera(false)}>
                      <Image
                        source={require('../../assets/icons/ic_video_camera.png')}
                        style={{ width: 25, height: 16}}/>
                      
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  disabled={this.state.message == ''}
                  onPress={this.onSendMessageToReceiver}>
                  <Image
                    source={require('../../assets/icons/SendMessage.png')}
                    style={{ width: 37, height: 37}}
                  />
                </TouchableOpacity>
              </View>
              {/* </KeyboardAvoidingView> */}
            </View>
          </KeyboardAwareScrollView>
        )}
        {/* Body */}
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
                <TouchableOpacity style={styles.bottom_sheet_item}
                  onPress={()=>{
                    Clipboard.setString(this.state.selectedMessage.message);
                    this.RBSheet.close();
                    Toast.show('Copied successfully');
                  }}
                >
                  <Text>Copy Message</Text>
                </TouchableOpacity>
                {
                  this.props.userInfo.user_type == "parent" &&  <TouchableOpacity style={styles.bottom_sheet_item}
                    onPress={
                        this.translateMessage
                    }
                  >
                    <Text>Translate</Text>
                  </TouchableOpacity>
                }
              </View>
            </RBSheet>
      </SafeAreaView>
    );
  }
}
const bindDispatch = (dispatch) => {
  return {
    fetchMessageBetweenUsers: (
      receiver,
      sender,
      size,
      isNext,
      isLoading,
      nextUrl,
      handleCallback,
    ) =>
      dispatch(
        homeAction.fetchMessageBetweenUsers(
          receiver,
          sender,
          size,
          isNext,
          isLoading,
          nextUrl,
          handleCallback,
        ),
      ),
    sendMessageBetweenUsers: (
      sender,
      receiver,
      img,
      message,
      room_id,
      video,
      thumbnail,
      id,
    ) =>
      dispatch(
        homeAction.sendMessageBetweenUsers(
          sender,
          receiver,
          img,
          message,
          room_id,
          video,
          thumbnail,
          id,
        ),
      ),
    getRoomList: (sender) => dispatch(homeAction.getRoomList(sender)),
    chatMessageBetweenUsers: (data) =>
      dispatch(homeAction.chatMessageBetweenUsers(data)),
    readCommsAllMessage: (room_id, sender) =>
      dispatch(homeAction.readCommsAllMessage(room_id, sender)),

    setTranslateMessage : (id,target,text,handleCallback) => dispatch( homeAction.setTraslateMessages(id,target,text,handleCallback)),
  };
};
const bindState = (state) => {
  return {
    userSetting: state.userState.userSetting,
    messages_between_users: state.homeState.messages_between_users,
    messages_between_users_loading:
      state.homeState.messages_between_users_loading,
    send_messages_between_users_loading:
      state.homeState.send_messages_between_users_loading,
    userInfo: state.authState.userInfo,
    room_id: state.homeState.room_id,
    all_messages_between_users: state.homeState.all_messages_between_users,
    get_message_next_url: state.homeState.get_message_next_url,
  };
};

export default connect(bindState, bindDispatch)(chatRoom);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: configs.colors.white,
    height: configs.height,
    width: configs.width,
  },
  header: {
    height: 59,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: Platform.OS == 'ios' ?  0 : StatusBar.currentHeight,
  },
  BottomIput: {
    width: '100%',
   // position: Platform.OS == 'ios' ? 'relative': 'absolute',
    height: 64,
    backgroundColor: '#fff',
  //  bottom: 0,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemList: {
    width: '100%',
    backgroundColor: '#00000030',
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginBottom: 5,
  },
  Day: {
    marginTop: 13,
    backgroundColor: '#E9F0FD',
    paddingHorizontal: 11,
    paddingVertical: 3,
    borderRadius: 4,
    height: 20,
  },
  Triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: configs.colors.primaryColor,
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    top: -3,
    left: -12,
  },
  Triangle1: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 25,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#E8EDFC',
    transform: [{ rotate: '180deg' }],
    position: 'absolute',
    top: 0,
    right: -15,
  },
  bottom_sheet_item: {
    padding: 10,
    width: '100%',
    // backgroundColor:'blue',
    height: 50,
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
