import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableNativeFeedback,
  TouchableOpacity,
  Slider,
  Dimensions,
} from 'react-native';
import configs from '../../utils/configs';
import VideoPlayer from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';

class VideoScreen extends Component {
  state = {
    currentTime: 0,
    duration: 0.1,
    paused: true,
    overlay: false,
    isVideoPlayer: false,
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
    return (
      <View>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
          }}>
          <View
            style={{
              marginTop: 200,
            }}>
            <VideoPlayer
              paused={this.state.paused}
              ref={(ref) => (this.video = ref)}
              source={{uri: this.props.route.params.video_url}}
              style={{
                ...StyleSheet.absoluteFill,
                width: '100%',
                height: 200,
              }}
              posterResizeMode="cover"
              resizeMode="contain"
              onLoad={this.load}
              onProgress={this.progress}
            />
          </View>

          <View style={styles.overlay}>
            {this.state.isVideoPlayer ? (
              <>
                <View
                  style={{
                    position: 'absolute',
                    top: '45%',
                    left: '45%',

                    zIndex: 1,
                  }}>
                  <ActivityIndicator animating size="large" color="#fff" />
                </View>
                <View
                  style={{
                    ...styles.overlaySet,
                    backgroundColor: '#0006',
                    zIndex: 1,
                  }}>
                  <Ionicons
                    name="play-back-outline"
                    style={{...styles.icon, opacity: 0}}
                    onPress={this.backwardPlay}
                  />
                  <Ionicons
                    name={this.state.paused ? 'play-outline' : 'pause-outline'}
                    style={styles.icon}
                    onPress={() => {
                      this.setState({
                        paused: !this.state.paused,
                        overlay: true,
                        isVideoPlayer: true,
                      });
                      setTimeout(() => this.setState({overlay: false}), 3000);
                    }}
                  />
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
                            this.props.navigation.navigate('FullScreen', {
                              video_url: this.props.route.params.video_url,
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
              </>
            ) : this.state.overlay ? (
              <View style={{...styles.overlaySet}}>
                <TouchableNativeFeedback onPress={this.videoSeekLeft}>
                  <View style={{flex: 1}}></View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this.videoSeekRight}>
                  <View style={{flex: 1}}></View>
                </TouchableNativeFeedback>
              </View>
            ) : (
              <View style={{...styles.overlaySet, backgroundColor: '#0006'}}>
                <Ionicons
                  name="play-back-outline"
                  style={{...styles.icon, opacity: 0}}
                  onPress={this.backwardPlay}
                />
                <Ionicons
                  name={this.state.paused ? 'play-outline' : 'pause-outline'}
                  style={styles.icon}
                  onPress={() => {
                    this.setState({
                      paused: !this.state.paused,
                      overlay: true,
                      isVideoPlayer: true,
                    });
                    setTimeout(() => this.setState({overlay: false}), 3000);
                  }}
                />
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
                          this.props.navigation.navigate('FullScreen', {
                            video_url: this.props.route.params.video_url,
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
      </View>
    );
  }
}

export default VideoScreen;

const styles = StyleSheet.create({
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
});
