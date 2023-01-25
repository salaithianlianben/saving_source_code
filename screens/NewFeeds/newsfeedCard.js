import React, {useState, useRef, Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator,
  TouchableNativeFeedback,
  StatusBar,
  Slider,
} from 'react-native';
import configs from '../../utils/configs';
import {connect} from 'react-redux';
import moment from 'moment';
import utilities from '../../utils/utilities';
import ImageLoad from '../../components/ImageLoad';
// import VideoPlayer from 'react-native-video-player';
import VideoPlayer from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import ImageViewer from 'react-native-image-zoom-viewer';
import ReadMore from '@fawazahmed/react-native-read-more';

const {width} = Dimensions.get('window');

class NewsfeedCard extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    selectToShowImage: null,
    isSelectedToShowImage: false,
    currentTime: 0,
    duration: 0.1,
    paused: true,
    overlay: false,
    isVideoPlayer: false,
  };

  checkingFile = (url) => {
    if (url == null) {
      return null;
    }
    let tempArray = url.split('.');
    return tempArray[tempArray.length - 1].toString();
  };
  lastTap = null;
  handleDoubleTap = (doubleTapCallback, singleTapCallback) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (this.lastTap && now - this.lastTap < DOUBLE_PRESS_DELAY) {
      clearTimeout(this.timer);
      doubleTapCallback();
    } else {
      this.lastTap = now;
      this.timer = setTimeout(() => {
        singleTapCallback();
      }, DOUBLE_PRESS_DELAY);
    }
  };

  videoSeekLeft = () => {
    const {currentTime} = this.state;
    this.handleDoubleTap(
      () => {
        this.video.seek(currentTime - 5);
      },
      () => {
        this.setState({overlay: false});
        this.overlayTimer = setTimeout(
          () => this.setState({overlay: true}),
          3000,
        );
      },
    );
  };
  videoSeekRight = () => {
    const {currentTime} = this.state;
    this.handleDoubleTap(
      () => {
        this.video.seek(currentTime + 5);
      },
      () => {
        this.setState({overlay: false});
        this.overlayTimer = setTimeout(
          () => this.setState({overlay: true}),
          3000,
        );
      },
    );
  };

  load = ({duration}) => this.setState({duration, isVideoPlayer: false});

  progress = ({currentTime}) =>
    this.setState({currentTime, isVideoPlayer: false});

  onSlide = (slide) => {
    this.video.seek(slide * this.state.duration);
    clearTimeout(this.overlayTimer);
    this.overlayTimer = setTimeout(() => this.setState({overlay: true}), 3000);
  };

  backwardPlay = () => {
    this.video.seek(this.state.currentTime - 5);
    clearTimeout(this.overlayTimer);
    this.overlayTimer = setTimeout(() => this.setState({overlay: true}), 3000);
  };
  forwardPlay = () => {
    this.video.seek(this.state.currentTime + 5);
    clearTimeout(this.overlayTimer);
    this.overlayTimer = setTimeout(() => this.setState({overlay: true}), 3000);
  };

  getTime = (t) => {
    const digit = (n) => (n < 10 ? `0${n}` : `${n}`);
    const sec = digit(Math.floor(t % 60));
    const min = digit(Math.floor((t / 60) % 60));
    const hr = digit(Math.floor((t / 3600) % 60));
    return hr + ':' + min + ':' + sec;
  };

  render() {
    console.log("Newsfeed Card :");
    console.log(this.props.data);
    return (
      <View style={styles.Card_Container}>
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
                this.setState({isSelectedToShowImage: false});
                this.props.onShowImageView(false);
              }}>
              <Ionicons name="close-outline" color={'black'} size={18} />
            </TouchableOpacity>
            <ImageViewer imageUrls={this.state.selectToShowImage} />
          </View>
        </Modal>

        {/* <Image source={{ uri:data.img_url}} style={styles.CoverPhoto} /> */}
        {/* <View> */}
        {(this.props.data.img_url == '' ||
          this.props.data.img_url == null ||
          this.props.data.img_url == undefined) &&
        (this.props.data.video_url != '' ||
          this.props.data.video_url != 'https://') ? (
          <View
            style={{
              width: '100%',
              height: configs.height / 3.8,
              backgroundColor: 'black',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              marginBottom: 15,
            }}>
            <VideoPlayer
              paused={this.state.paused}
              ref={(ref) => (this.video = ref)}
              source={{uri: this.props.data.video_url}}
              style={[
                {...StyleSheet.absoluteFill},
                {borderTopLeftRadius: 20, borderTopRightRadius: 20},
              ]}
              poster={this.props.data.thumbnail_url}
              posterResizeMode="cover"
              resizeMode="contain"
              onLoad={this.load}
              onProgress={this.progress}
            />
            <View style={styles.overlay}>
              {this.state.isVideoPlayer ? (
                <View
                  style={{
                    ...styles.overlaySet,
                    backgroundColor: '#0006',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator animating size="large" color="#DADADA" />
                </View>
              ) : this.state.overlay ? (
                <View style={styles.overlaySet}>
                  <TouchableNativeFeedback onPress={this.videoSeekLeft}>
                    <View style={{flex: 1}}></View>
                  </TouchableNativeFeedback>
                  <TouchableNativeFeedback onPress={this.videoSeekRight}>
                    <View style={{flex: 1}}></View>
                  </TouchableNativeFeedback>
                </View>
              ) : (
                <View
                  style={{
                    ...styles.overlaySet,
                    backgroundColor: '#0006',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  }}>
                  <Ionicons
                    name="play-back-outline"
                    style={{...styles.icon, opacity: 0}}
                    onPress={this.backwardPlay}
                  />
                  {this.state.paused ? (
                    <EvilIcons
                      name={'play'}
                      style={styles.icon}
                      size={70}
                      onPress={() => {
                        this.setState({
                          paused: !this.state.paused,
                          overlay: true,
                          isVideoPlayer: true,
                        });
                        setTimeout(() => this.setState({overlay: false}), 3000);
                      }}
                    />
                  ) : (
                    <Ionicons
                      name={'pause-outline'}
                      style={styles.icon}
                      size={50}
                      onPress={() => {
                        this.setState({
                          paused: !this.state.paused,
                          overlay: true,
                          isVideoPlayer: true,
                        });
                        setTimeout(() => this.setState({overlay: false}), 3000);
                      }}
                    />
                  )}
                  <Ionicons
                    name="play-forward-outline"
                    style={{...styles.icon, opacity: 0}}
                    onPress={this.forwardPlay}
                  />
                  {!this.state.paused && (
                    <View style={styles.sliderCont}>
                      <View style={styles.timer}>
                        <Text style={{color: 'white', fontSize: 13}}>
                          {this.getTime(this.state.currentTime)} /{' '}
                          {this.getTime(this.state.duration)}
                        </Text>
                        <TouchableOpacity
                          style={{marginRight: 10}}
                          onPress={() => {
                            this.setState({paused: !this.state.paused});
                            this.props.navigation.navigate('VideoFullscreen', {
                              video_url: this.props.data.video_url,
                              navigation: this.props.navigation,
                            });
                          }}>
                          <Text style={{color: 'white'}}>
                            <Ionicons name="expand-outline" size={18} />
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <Slider
                        maximumTrackTintColor="white"
                        minimumTrackTintColor="white"
                        thumbTintColor="white"
                        value={this.state.currentTime / this.state.duration}
                        onValueChange={this.onSlide}
                      />
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        ) : this.props.data.img_url == null ||
          this.props.data.img_url == '' ||
          this.props.data.img_url == undefined ? (
          <Image
            source={require('../../assets/images/placeholder_image.png')}
            style={styles.CoverPhoto}
          />
        ) : this.props.data.img_url != null ||
          this.props.data.img_url != '' ||
          this.props.data.img_url != undefined ? (
          <TouchableOpacity
            onPress={() => {
              this.setState({
                selectToShowImage: [
                  {
                    url: this.props.data.img_url,
                  },
                ],
                isSelectedToShowImage: true,
              });
              this.props.onShowImageView(true);
            }}>
            <ImageLoad
              style={styles.CoverPhoto}
              borderTopLeftRadius={20}
              borderTopRightRadius={20}
              placeholderStyle={styles.CoverPhoto}
              loadingStyle={{size: 'small', color: 'white'}}
              source={{uri: this.props.data.img_url, cache: 'force-cache'}}
              placeholderSource={require('../../assets/images/placeholder_image.png')}
            />
          </TouchableOpacity>
        ) : (
          <Image
            source={require('../../assets/images/placeholder_image.png')}
            style={styles.CoverPhoto}
          />
        )}
        {/* </View> */}
        <View style={{width: '100%', paddingHorizontal: 16, paddingBottom: 16}}>
        <View style={styles.TitleBox}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 32,
                marginRight: 7,
                alignSelf:'center',
                alignItems:'center',
                justifyContent:'center',
              }}>

              {this.props.data.profile_img != undefined && this.props.data.profile_img != "" && this.props.data.profile_img!= null ? (
                <ImageLoad
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius:32,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf:'center',
                    resizeMode: 'cover',
                  }}
                  placeholderStyle={{
                    width: 32,
                    height: 32,
                    justifyContent: 'center',
                    borderRadius:32,
                    alignItems: 'center',
                    alignSelf:'center',
                    resizeMode: 'cover',
                  }}
                  borderRadius={32}
                  resizeMode="cover"
                  loadingStyle={{size: 'small', color: 'white'}}
                  source={{
                    uri: this.props.data.profile_img,
                    cache: 'force-cache',
                  }}
                  placeholderSource={require('../../assets/images/placeholder_image.png')}
                />
              ) : (
                <Image
                  source={require('../../assets/icons/ic_morningstar.png')}
                  style={{
                    width: 32,
                    height: 32,
                    justifyContent: 'center',
                    alignItems: 'center',
                    resizeMode: 'contain',
                    backgroundColor: 'white',
                  }}
                />
              )}
            </View>
            <View style={styles.TextTitle}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: configs.fontFamily.OPS600,
                }}>
                  {this.props.data.post_owner}
                {/* {this.props.data.schdule_val.title} */}
              </Text>
              {/* <Text
                style={{
                  fontSize: 12,
                  fontFamily: configs.fontFamily.OPS600,
                  color: configs.colors.grey,
                }}>
                {this.props.data.user_type === "hq_admin" ? "HQ Admin" : "Center Admin"}
              </Text> */}
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: configs.fontFamily.OPS600,
                  color: configs.colors.grey,
                }}>
                {moment().diff(
                  moment(
                    utilities.ChangeStringToDateTime(
                      this.props.data.created_ts,
                    ),
                  ),
                  'days',
                ) >
                  7 ===
                true
                  ? moment(
                      utilities.ChangeStringToDateTime(
                        this.props.data.created_ts,
                      ),
                    ).format('DD MMM YYYY')
                  : moment(
                      utilities.ChangeStringToDateTime(
                        this.props.data.created_ts,
                      ),
                      'YYYY-MM-DD h:mm:ss',
                    ).fromNow()}
              </Text>
            </View>

            {this.props.data.high_priority != undefined && this.props.data.high_priority != "" && this.props.data.high_priority!= null && this.props.data.high_priority === 1 ?
              <View style={styles.priorityBox}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: configs.fontFamily.OPS600,
                    color: configs.colors.white,
                  }}>
                    High priority
                </Text>
              </View> : null
            }
          </View>
          { this.props.userInfo.user_type == "facilitator" && <Ionicons name="ellipsis-vertical" color={configs.colors.lightgrey} size={18} style={{position:'absolute',right:5,top:10}} onPress={()=>this.props.onOpen(this.props.data.id)}/>}
          <Text
            selectable
            numberOfLines={2}
            style={{
              fontSize: 14,
              fontFamily: configs.fontFamily.OPS700,
              lineHeight: 19,
              marginBottom: 8,
            }}>
            {this.props.data.title}
          </Text>
          <ReadMore
            numberOfLines={3} 
            style={{fontSize: 14, fontFamily: configs.fontFamily.OPS400}}
            seeMoreStyle={{fontSize: 14, color: configs.colors.primaryColor, fontFamily: configs.fontFamily.OPS700}}
            seeLessStyle={{fontSize: 14, color: configs.colors.primaryColor, fontFamily: configs.fontFamily.OPS600}}>
            {this.props.data.description.replace(/\n/g, ' \n')}
            
        </ReadMore>
        </View>
      </View>
    );
  }
}

export default NewsfeedCard;
const styles = StyleSheet.create({
  Card_Container: {
    shadowColor: '#9DA5F150',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    elevation: 1,
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 20,
  },
  TitleBox: {
    flexDirection: 'row',
    marginBottom: 8,
    marginTop: 16,
  },
  Image_Title: {
    width: 32,
    height: 32,
    marginRight: 7,
  },
  TextTitle: {
    flexDirection: 'column',
  },
  CoverPhoto: {
    width: '100%',
    height: ((configs.width - 40) * 9) / 16,
    borderRadius: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    // resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  overlaySet: {
    flex: 1,
    flexDirection: 'row',
  },
  icon: {
    color: 'white',
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
  },
  sliderCont: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  timer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  priorityBox: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: configs.colors.primaryColor,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginLeft: 14,
  },
});
