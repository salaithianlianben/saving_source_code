import React, { Component } from 'react';
import { RNS3 } from 'react-native-aws3';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  Linking
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import configs from '../../utils/configs';
import base64 from 'react-native-base64';
import { createThumbnail } from 'react-native-create-thumbnail';
import PostSuccessModal from './PostSuccessModal';
import { connect } from 'react-redux';
import moment from 'moment';
import Modal from 'react-native-modal';
import homeAction from '../../actions/homeAction';
import HomeActivity from '../../components/home_activity';
import ImagePicker from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import VideoPlayer from 'react-native-video-player';
import LoadingModal from '../../components/Loading';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Space } from '../../components/space';
const rangeSize = 10485760;

class NewPost extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    title: '',
    description: '',
    response: null,
    visible: false,
    schedule_select_index: 0,
    schedule_visible: false,
    image: null,
    images: null,
    isFetching: false,
    validation: {
      title: false,
      description: false,
      image: false,
    },
    thumbnail: null,
    isPosting: false,
    isSuccess:false,
    isSuccessVisible:false,

  };

  getScheduleColorsByIndex = (index) => {
    const { schedule_colors } = this.props;
    if (schedule_colors == undefined) {
      return 'white';
    }
    var i = index % schedule_colors.length;
    console.log(index, schedule_colors.length, i + 1);

    let data = schedule_colors.filter((x) => x.serial_number == i + 1)[0];
    return data ? data.hex_color_code : 'white';
  };

  pickSingleWithCamera(cropping, mediaType = 'photo') {
    ImagePicker.openCamera({
      cropping: cropping,
      width: 500,
      height: 500,
      includeExif: true,
      mediaType,
    })
      .then((image) => {
        this.setState({
          image: {
            uri: image.path,
            width: image.width,
            height: image.height,
            mime: image.mime,
            size: image.size,
          },
          images: null,
        });
      })
      .catch((e) => {
        this.setState({
          image: null,
        });
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

  openModal = () => {
    this.setState({ visible: true });
  };

  closeModal = () => {
    this.setState({ visible: false });
    this.props.navigation.goBack();
  };

  changeTitle = (text) => {
    this.setState({ title: text });
  };

  changeDescription = (text) => {
    this.setState({ description: text });
  };

  componentDidMount() {
    // console.log("________________________________");
    // console.log(this.props.selectedDate);
    // console.log("________________________________");
    const { userInfo } = this.props;
    if (this.props.route.params == null) {
      // const centre_id =
      //   userInfo.user_type === 'parent'
      //     ? this.props.studentInfo.centre_id[0]
      //     : userInfo.centre_id[0];
      // const class_id =
      //   userInfo.user_type === 'parent'
      //     ? this.props.studentInfo.class_id[0]
      //     : userInfo.class_id[0];
      // this.props.fetchCalendarViewOfEventsOrSchedule(
      //   moment(this.props.selectedDate).format('YYYY-MM-DD'),
      //   moment(this.props.selectedDate).format('YYYY-MM-DD'),
      //   centre_id,
      //   class_id,
      //   'schedule_only',
      //   1,
      // );
      this.props.getScheduleColors();
    }
    // console.log("schedule id "+ JSON.stringify(this.props.calendar_view_of_events_or_schedules));
  }

  renderVideo(video, isValid) {
    console.log(this.state.thumbnail);
    return (
      <View
        style={[
          styles.ImageContainer,
          isValid ? { borderWidth: 1, borderColor: 'red' } : null,
        ]}>
        {this.state.thumbnail != null ? (
          <VideoPlayer
            video={{ uri: video.uri, type: video.mime }}
            resizeMode="cover"
            style={{
              borderRadius: 8,
              // marginTop: 20,
            }}
            customStyles={{
              wrapper: { width: '100%', height: '100%' },
              controls: { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
            }}
            // autoplay={true}
            thumbnail={{ uri: this.state.thumbnail.uri }}
          />
        ) : (
          <VideoPlayer
            video={{ uri: video.uri, type: video.mime }}
            resizeMode="cover"
            style={{
              borderRadius: 8,
              // marginTop: 20,
            }}
            customStyles={{
              wrapper: { width: '100%', height: '100%' },
              controls: { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
            }}
          // autoplay={true}
          // thumbnail={{ uri: this.state.thumbnail != null ? this.state.thumbnail.uri :""  }}
          />
        )}
        <TouchableOpacity
          style={{
            backgroundColor: configs.colors.primaryColor,
            width: 40,
            height: 40,
            borderTopRightRadius: 8,
            right: 0,
            top: 0,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() =>
            this.setState({
              image: null,
            })
          }>
          <Image
            source={require('../../assets/icons/DeleteImage.png')}
            style={{ width: 20, height: 18 }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  cleanupSingleImage() {
    let image =
      this.state.image ||
      (this.state.images && this.state.images.length
        ? this.state.images[0]
        : null);
    console.log('will cleanup image', image);

    ImagePicker.cleanSingle(image ? image.uri : null)
      .then(() => {
        console.log(`removed tmp image ${image.uri} from tmp directory`);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  renderImage(image, isValid) {
    return (
      <View
        style={[
          styles.ImageContainer,
          isValid ? { borderColor: 'red', borderWidth: 1 } : null,
        ]}>
        <Image
          style={{
            flex: 1,
            borderRadius: 8,
            width: undefined,
            height: configs.height * 0.85,
          }}
          source={image}
        />
        <TouchableOpacity
          style={{
            backgroundColor: configs.colors.primaryColor,
            width: 40,
            height: 40,
            borderTopRightRadius: 8,
            right: 0,
            top: 0,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() =>
            this.setState({
              image: null,
            })
          }>
          <Image
            source={require('../../assets/icons/DeleteImage.png')}
            style={{ width: 20, height: 18 }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderAsset(image, isValid) {
    if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(image, isValid);
    }

    return this.renderImage(image, isValid);
  }

  generateThumbnail = async (image) => {
    console.log(image);
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
        this.setState({
          thumbnail: thumbnail_url,
        });
      })
      .catch((err) => {
        console.log({ err });
        Alert.alert('Fail to create thumbnail url of video');
      });
  };

  pickSingle(cropit, circular = false, mediaType) {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: cropit,
      cropperCircleOverlay: circular,
      sortOrder: 'none',
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
      cropperStatusBarColor: 'white',
      cropperToolbarColor: 'white',
      cropperActiveWidgetColor: 'white',
      cropperToolbarWidgetColor: '#3498DB',
    })
      .then((image) => {
        console.log(image);
        if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
          this.generateThumbnail(image);
        }

        this.setState({
          image: {
            uri: image.path,
            width: image.width,
            height: image.height,
            mime: image.mime,
            size: image.size,
          },
          images: null,
        });
      })
      .catch((e) => {
        console.log(e);
        this.setState({
          image: null,
        })
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



  render() {
    return (
      <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      extraHeight={600}
      style={{
        height: configs.height - (getStatusBarHeight() + 59),
      }}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      >
        <ScrollView
         bounces={false}
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: '#F2F2F2',
            paddingTop: 18,
            paddingHorizontal: 16,
          }}>
             
          <PostSuccessModal
            isSuccessVisible={this.state.isSuccessVisible}
            isSuccess={this.state.isSuccess}
            GoToSeeHandler={() => {
              if(this.state.isSuccess == true){
                this.props.navigation.goBack()
                this.setState({
                  isFetching: true,
                  page: 0,
                });
                this.props.setChangeisSuccesfuleNewFeed();
                this.props.getAllNewsfeeds(0, 10, false, () =>
                  this.setState(
                    {
                      isFetching: false,
                      visible: false,
                    }
                  ),
                );
              }
              this.setState({
                isSuccessVisible:false,
                isSuccess:false,
              })
            }}
          />
          <StatusBar
            barStyle="dark-content"
            translucent={true}
            backgroundColor={
              this.props.is_Loading_For_NewsFeedPost || this.state.isSuccessVisible
                ? '#00000020'
                : 'transparent'
            }
          />
          {this.props.is_Loading_For_NewsFeedPost == true ?
            (<LoadingModal />) : null}
        
          <View style={styles.ContentContainer}>
            <View style={{ flexDirection: 'row', marginBottom: 22 }}>
              <View style={styles.Active}></View>
              <Text style={styles.ContentTitle}>Class activities post</Text>
            </View>
            
            <View>
              <Text>For your image/video to fit perfectly in the landscape ratio, we recommend uploading it in 16:9 ratio (1920x1080p).</Text>
            </View>
            <Space height={15}/>
            {this.state.image ? (
              this.renderAsset(this.state.image, this.state.validation.image)
            ) : (
              <TouchableOpacity
                style={[
                  styles.ImagePicker,
                  this.state.validation.image ? { borderColor: 'red' } : null,
                ]}
                onPress={() => this.RBSheet.open()}>
                <Image
                  source={require('../../assets/icons/ic_image.png')}
                  style={{ width: 47, height: 48 }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: configs.fontFamily.OPS700,
                    color: configs.colors.primaryColor,
                  }}>
                  Upload Image
                </Text>
              </TouchableOpacity>
            )}

            <Text
              style={[
                styles.InputTitle,
                this.state.validation.title ? { color: 'red' } : null,
              ]}>
              Title
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: this.state.validation.title ? 'red' : '#DADADA',
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingTop: 12,
                height: 44,
                marginBottom: 22,
                marginTop: 2,
                fontSize: 14,
                fontFamily: configs.fontFamily.OPS400,
              }}
              value={this.state.title}
              onChangeText={this.changeTitle}
            />
            <Text
              style={[
                styles.InputTitle,
                this.state.validation.description ? { color: 'red' } : null,
              ]}>
              Description
            </Text>
            <TextInput
              style={{
                textAlignVertical: 'top',
                borderWidth: 1,
                borderColor: this.state.validation.description
                  ? 'red'
                  : '#DADADA',
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingTop: 12,
                marginBottom: 22,
                marginTop: 2,
                fontSize: 14,
                fontFamily: configs.fontFamily.OPS400,
                minHeight: 120,
              }}
              multiline
              numberOfLines={10}
              value={this.state.description}
              onChangeText={this.changeDescription}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 24,
              }}>
              <TouchableOpacity
                style={styles.Cancel}
                onPress={() => this.props.navigation.goBack()}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: configs.fontFamily.OPS700,
                    color: configs.colors.primaryColor,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.Post, { backgroundColor: this._getBackgroundColor() }]}
                disabled={this.state.image == null ||
                  this.state.title == '' ||
                  this.state.description == ''}
                onPress={async () => {
                  this.setState({
                    isPosting: true,
                  });
                  if (
                    this.state.image != null &&
                    this.state.title != '' &&
                    this.state.description != ''
                  ) {
                    if (
                      this.state.image.mime &&
                      this.state.image.mime.toLowerCase().indexOf('video/') !==
                      -1
                    ) {
                      const { image, thumbnail } = this.state;

                      const tempArray = image.uri.split('/');
                      var fileName = tempArray[tempArray.length - 1];
                      var i = fileName.indexOf('.');
                      var ciperText = base64.encode(fileName.substring(0, parseInt(i)));
                      const imagefile = {
                        name:
                          `${ciperText}` +
                          fileName.substring(parseInt(i), fileName.length),
                        type: image.mime,
                        uri: image.uri,
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
                        await RNS3.put(imagefile, options).then((response) => {
                          if (response.status !== 201) {
                            throw new Error('Failed to upload image to S3');
                          } else {
                            console.log(response.body.postResponse);
                            var video_url = response.body.postResponse.key;
                            setTimeout(() => {
                              thumbnail != null
                                ? this.props.postNewsfeed(
                                  this.state.title,
                                  this.state.description,
                                  this.props.userInfo.id,
                                  null,
                                  video_url,
                                  thumbnail,
                                  (status)=> {
                                    this.setState({
                                      isSuccessVisible:true,
                                      isSuccess:status,
                                      isPosting:false,
                                    });
                                  }
                                )
                                : Alert.alert('Thumbnail null');
                            }, 1000);
                          }
                        });
                      } catch (error) {
                        console.log('ERROR 1');
                        Alert.alert('Server Errors', 'Server request time out');
                        console.log(error);
                        this.setState({
                          isPosting: false,
                        });
                      }
                    } else {
                      if (this.state.image.size <= rangeSize) {
                        this.props.postNewsfeed(
                          this.state.title,
                          this.state.description,
                          this.props.userInfo.id,
                          this.state.image,
                          null,
                          null,
                          (status)=> {
                            this.setState({
                              isSuccessVisible:true,
                              isSuccess:status,
                              isPosting:false,
                            });
                          }
                        );
                      } else {
                        this.setState({
                          isPosting: false,
                        });
                        Alert.alert("Validation Fails", "Please, upload image less than 10 MB!")
                      }
                    }
                  } else {
                    Alert.alert("Validation Fails", "Please, fill all items!");
                  }
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 14,
                    fontFamily: configs.fontFamily.OPS700,
                  }}>
                  Post
                </Text>
              </TouchableOpacity>
            </View>
            {/* <View>
                                    <TouchableOpacity onPress={()=>this.pickSingle(false)}>
                                        <Text>Upload</Text>
                                    </TouchableOpacity>
                                </View> */}
          </View>
        
          <Modal
            isVisible={this.state.schedule_visible}
            // deviceHeight={100}
            statusBarTranslucent={true}
            onBackdropPress={() =>
              this.setState({
                schedule_visible: false,
              })
            }>
            <View
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <View
                style={{
                  height: 'auto',
                  backgroundColor: 'white',
                  width: configs.width - 30,
                  borderRadius: 20,
                  paddingBottom: 20,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    paddingLeft: 20,
                    paddingVertical: 10,
                    fontSize: 18,
                  }}>
                  Activities
                </Text>
                {this.props.calendar_view_of_events_or_schedules != null
                  ? this.props.calendar_view_of_events_or_schedules[0].schedules
                    .length > 0 &&
                  this.props.calendar_view_of_events_or_schedules[0].schedules.map(
                    (activity, index) => (
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            schedule_select_index: index,
                            schedule_visible: false,
                          })
                        }
                        key={index}
                        style={[
                          { marginVertical: 3, height: 48, margin: 20 },
                          this.state.schedule_select_index == index &&
                          styles.selected,
                        ]}>
                        <HomeActivity
                          data={activity}
                          color={this.getScheduleColorsByIndex(index)}
                        />
                      </TouchableOpacity>
                    ),
                  )
                  : null}
              </View>
            </View>
          </Modal>
          <RBSheet
            closeOnPressBack
            ref={(ref) => {
              this.RBSheet = ref;
            }}
            dragFromTopOnly={true}
            // height="auto"
            // height={this.state.bottomSheetHeight}
            openDuration={250}
            customStyles={{
              container: styles.bottomSheetContainer,
            }}
            closeOnDragDown>
            <View style={{ padding: 20 }}>
              {/* <View style={{borderBottomColor:'#d2d2d2',borderBottomWidth:1}}></View> */}
              <TouchableOpacity
                style={styles.bottom_sheet_item}
                onPress={() => {
                  //this.RBSheet.close();
                  this.pickSingleWithCamera(true);
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    justifyContent: 'center',
                  }}>
                  Camera
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  borderBottomColor: '#d2d2d2',
                  borderBottomWidth: 1,
                }}></View>
              <TouchableOpacity
                style={styles.bottom_sheet_item}
                onPress={() => {
                  //this.RBSheet.close();
                  this.pickSingle(false);
                }}>
                <Text style={{ fontSize: 16, fontWeight: '700' }}>Library</Text>
              </TouchableOpacity>
              <View
                style={{
                  borderBottomColor: '#d2d2d2',
                  borderBottomWidth: 1,
                }}></View>
              <TouchableOpacity
                style={styles.bottom_sheet_item}
                onPress={() => this.RBSheet.close()}>
                <Text style={{ fontSize: 16, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
              {/* <View style={{borderBottomColor:'#d2d2d2',borderBottomWidth:1}}></View> */}
            </View>
          </RBSheet>
              
        </ScrollView>
        </KeyboardAwareScrollView> 
    );
  }

  _getBackgroundColor = () => {
    if (this.state.image == null ||
      this.state.title == '' ||
      this.state.description == '' ) {
      return "grey";
    } else {
      return configs.colors.primaryColor;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    studentInfo: state.authState.studentInfo,
    userInfo: state.authState.userInfo,
    calendar_view_of_events_or_schedules:
      state.homeState.calendar_view_of_events_or_schedules,
    isSuccessNewsFeed: state.homeState.isSuccessNewsFeed,
    is_Loading_For_NewsFeedPost: state.homeState.is_Loading_For_NewsFeedPost,
    schedule_colors: state.homeState.schedule_colors,
    selectedDate: state.homeState.selectedDate,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCalendarViewOfEventsOrSchedule: (
      from_date,
      to_date,
      centre_id,
      class_id,
      search_type,
      scfa,
    ) =>
      dispatch(
        homeAction.fetchCalendarViewOfEventsOrSchedule(
          from_date,
          to_date,
          centre_id,
          class_id,
          search_type,
          scfa,
        ),
      ),
    getScheduleColors: () => dispatch(homeAction.getScheduleColors()),
    getAllNewsfeeds: (page, pagesize, checkNewPost, handleCallback) =>
      dispatch(homeAction.getAllNewsfeeds(page, pagesize, checkNewPost, handleCallback)),
    postNewsfeed: (
      title,
      description,
      facilitator_id,
      img_url,
      video_url,
      thumbnail_url,
      handleCallback,
    ) =>
      dispatch(
        homeAction.postNewsfeed(
          title,
          description,
          facilitator_id,
          img_url,
          video_url,
          thumbnail_url,
          handleCallback,
        ),
      ),
    setChangeisSuccesfuleNewFeed: () =>
      dispatch(homeAction.setChangeisSuccesfuleNewFeed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewPost);

const styles = StyleSheet.create({
  bottomSheetContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 'auto',
  },
  Active: {
    backgroundColor: configs.colors.primaryColor,
    width: 12,
    height: 12,
    borderRadius: 12,
    marginRight: 9,
    marginTop: 5,
  },
  bottom_sheet_item: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
    // backgroundColor:'blue',
    height: 50,
  },
  selected: {
    borderWidth: 1,
    borderColor: configs.colors.primaryColor,
    borderRadius: 10,
  },
  TitleContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 48,
    width: '100%',
    marginBottom: 16,
  },
  TitleNameWithTime: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#DADADA',
    width: configs.width - 115,
    flexDirection: 'row',
    paddingHorizontal: 11,
    paddingTop: 13,
    justifyContent: 'space-between',
  },
  TitleImageContainer: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: '#C697DF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 49,
  },
  ContentContainer: {
    marginBottom: 35,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 19,
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
  ContentTitle: {
    fontSize: 16,
    fontFamily: configs.fontFamily.OPS700,
    lineHeight: 22,
  },
  ImagePicker: {
    height: configs.height / 4,
    backgroundColor: '#E5FAFF',
    borderColor: configs.colors.primaryColor,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  InputTitle: {
    fontFamily: configs.fontFamily.OPS600,
    fontSize: 14,
    marginBottom: 8,
  },
  Cancel: {
    borderColor: configs.colors.primaryColor,
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
    width: configs.width / 2.5,
  },
  Post: {
    backgroundColor: configs.colors.primaryColor,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
    width: configs.width / 2.5,
  },
  ImageContainer: {
    //  width: configs.width,
    height: configs.height / 4,
    borderRadius: 8,
    marginBottom: 16,
  },
});
