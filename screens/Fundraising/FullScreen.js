import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Slider,
  TouchableNativeFeedback,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import VideoPlayer from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Orientation from 'react-native-orientation-locker';

const {width} = Dimensions.get('window');

export default class FullScreen extends Component {
  state = {
    currentTime: 0,
    duration: 0.1,
    paused: false,
    overlay: false,
    fullscreen: true,
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

  getTime = (t) => {
    const digit = (n) => (n < 10 ? `0${n}` : `${n}`);
    // const t = Math.round(time);
    const sec = digit(Math.floor(t % 60));
    const min = digit(Math.floor((t / 60) % 60));
    const hr = digit(Math.floor((t / 3600) % 60));
    return hr + ':' + min + ':' + sec; // this will convert sec to timer string
    // 33 -> 00:00:33
    // this is done here
    // ok now the theme is good to look
  };

  load = ({duration}) => this.setState({duration}); // now here the duration is update on load video
  progress = ({currentTime}) => this.setState({currentTime}); // here the current time is upated

  backwardPlay = () => {
    this.video.seek(this.state.currentTime - 5);
    clearTimeout(this.overlayTimer);
    this.overlayTimer = setTimeout(() => this.setState({overlay: false}), 3000);
  };
  forwardPlay = () => {
    this.video.seek(this.state.currentTime + 5);
    clearTimeout(this.overlayTimer);
    this.overlayTimer = setTimeout(() => this.setState({overlay: false}), 3000);
  };

  onslide = (slide) => {
    this.video.seek(slide * this.state.duration); // here the upation is maked for video seeking
    clearTimeout(this.overlayTimer);
    this.overlayTimer = setTimeout(() => this.setState({overlay: false}), 3000);
  };

  youtubeSeekLeft = () => {
    const {currentTime} = this.state;
    this.handleDoubleTap(
      () => {
        this.video.seek(currentTime - 5);
      },
      () => {
        this.setState({overlay: true});
        this.overlayTimer = setTimeout(
          () => this.setState({overlay: false}),
          3000,
        );
      },
    );
  };
  youtubeSeekRight = () => {
    const {currentTime} = this.state;
    this.handleDoubleTap(
      () => {
        // this fn is used to detect the double tap first callback
        this.video.seek(currentTime + 5);
      },
      () => {
        this.setState({overlay: true});
        this.overlayTimer = setTimeout(
          () => this.setState({overlay: false}),
          3000,
        );
      },
    );
  };

  fullscreen = () => {
    const {fullscreen} = this.state;
    if (fullscreen) {
      Orientation.lockToLandscapeLeft();
    }
  };
  componentDidMount() {
    if (this.state.fullscreen) {
      Orientation.lockToLandscapeLeft();
    }
  }

  backnewsFeedCard = () => {
    Orientation.lockToPortrait();
    this.props.navigation.goBack();
  };

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backnewsFeedCard);
  }

  render = () => {
    const {currentTime, duration, paused, overlay, fullscreen} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.fullscreenVideo}>
          <VideoPlayer
            paused={this.state.paused}
            ref={(ref) => (this.video = ref)}
            source={{uri: this.props.route.params.video_url}}
            style={{...StyleSheet.absoluteFill}}
            resizeMode="contain"
            onLoad={this.load}
            onProgress={this.progress}
          />
          <View style={styles.overlay}>
            {overlay ? (
              <View style={{...styles.overlaySet, backgroundColor: '#0006'}}>
                <Ionicons
                  name="play-back-outline"
                  style={styles.icon}
                  onPress={this.backwardPlay}
                />
                <Ionicons
                  name={this.state.paused ? 'play-outline' : 'pause-outline'}
                  style={styles.icon}
                  onPress={() => this.setState({paused: !this.state.paused})}
                />
                <Ionicons
                  name="play-forward-outline"
                  style={styles.icon}
                  onPress={this.forwardPlay}
                />
                <View style={styles.sliderCont}>
                  <View style={styles.timer}>
                    <Text style={{color: 'white'}}>
                      {this.getTime(this.state.currentTime)} /{' '}
                      {this.getTime(this.state.duration)}
                    </Text>
                    <TouchableOpacity
                      style={{marginRight: 10}}
                      onPress={this.backnewsFeedCard}>
                      <Text style={{color: 'white'}}>
                        <Ionicons name="contract-outline" size={25} />
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Slider
                    // we want to add some param here
                    maximumTrackTintColor="white"
                    minimumTrackTintColor="white"
                    thumbTintColor="white" // now the slider and the time will work
                    value={currentTime / duration} // slier input is 0 - 1 only so we want to convert sec to 0 - 1
                    onValueChange={this.onslide}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.overlaySet}>
                <TouchableNativeFeedback onPress={this.youtubeSeekLeft}>
                  <View style={{flex: 1}} />
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this.youtubeSeekRight}>
                  <View style={{flex: 1}} />
                </TouchableNativeFeedback>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
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
    fontSize: 25,
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
  fullscreenVideo: {
    backgroundColor: 'black',
    ...StyleSheet.absoluteFillObject,
    elevation: 1,
    width: '100%',
    height: '100%',
    zIndex: 99999,
  },
});
