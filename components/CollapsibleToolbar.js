import React, {Component} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  RefreshControl,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import configs from '../utils/configs';
import SafeArea from './SafeArea';
import { Space } from './space';
import ImageLoad from './ImageLoad';
import {connect} from 'react-redux';
import { hasNotch, isIOS } from '../utils/screen';

const HEADER_EXPANDED_HEIGHT = configs.height / 3.5;
var APP_BAR_HEIGHT = 65;
var HEADER_COLLAPSED_HEIGHT = APP_BAR_HEIGHT + getStatusBarHeight();
var PADDING_TOP = HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT;

const TITLE_EXPANDED_HEIGHT = 18;
const TITLE_COLLAPSED_HEIGHT = 18;
const {width: SCREEN_WIDTH} = Dimensions.get('screen');

class CollapsibleToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      open: true,
    };
    
  }

  render() {

    APP_BAR_HEIGHT = this.props.appBarHeight;
    HEADER_COLLAPSED_HEIGHT = APP_BAR_HEIGHT + getStatusBarHeight();
    PADDING_TOP = HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT;
      
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
      outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
      extrapolate: 'clamp',
    });

    const headerSlide = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
      outputRange: [0, 32],
      extrapolate: 'clamp',
    });

    const headerTitleSize = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
      outputRange: [TITLE_EXPANDED_HEIGHT, TITLE_COLLAPSED_HEIGHT],
      extrapolate: 'clamp',
    });

    const headerTitleOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const appBarOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <SafeArea
        statusBarColor={
          this.state.open ? this.props.headerColor : this.props.headerColorDark
        }
        bottomBarColor={
          this.props.bottomBarColor ? this.props.bottomBarColor : configs.colors.white
        }
        statusBarStyle={this.state.open ? 'dark-content' : 'light-content'}>
        <View style={styles.container}>
          <Animated.View
            onLayout={event => this.onLayout(event)}
            style={[
              styles.header,
              {
                height: headerHeight,
                backgroundColor: this.props.headerColor
                  ? this.props.headerColor
                  : configs.colors.primaryColor,
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20,
              },
            ]}>

            {/* <Animated.Text
              style={[
                styles.headerTitle,
                styles.maxHeader,
                {
                  color: configs.colors.white,
                  paddingLeft: headerSlide,
                  fontSize: headerTitleSize,
                  opacity: headerTitleOpacity,
                  fontFamily: configs.fontFamily.OPS700,
                },
              ]}>
              {this.props.title ? this.props.title : ''}
            </Animated.Text> */}

            <Animated.Image
              style={[
                styles.imageStyle, 
                {opacity: imageOpacity},]}
              source={this.props.image}
            />

            <Animated.View 
              style={[styles.CollapedAppBar, 
              {opacity: appBarOpacity, height: HEADER_COLLAPSED_HEIGHT},]} />
            
          </Animated.View>

          <View style={[styles.appBar, {height: HEADER_COLLAPSED_HEIGHT}]}>
              {/* Back Button */}
              {/* <TouchableOpacity onPress={() => this.props.backPress()}>
                <Image
                  style={styles.backIcon}
                  source={require('../assets/icons/Back.png')}
                  resizeMode={'contain'}
                />
              </TouchableOpacity> */}
              {/* to check collaped or not */}
              {/* {!this.state.open && (  */}
                <View style={{backgroundColor:'transparent'}}>
                  <Text style={styles.minHeader}>
                    {this.props.title ? this.props.title : ''}
                  </Text>
                  {this.props.type === configs.HEADER_TYPE.HOME_PAGE 
                  && (
                  <Text style={styles.nameStyle}>
                    {this.props.userName}
                  </Text>)}
                </View>
              {/* )} */}

              {/* For Home Page */}
                
              {
                this.props.type === configs.HEADER_TYPE.HOME_PAGE 
                && (
                <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 16}}>
                  <TouchableOpacity
                    onPress={() =>this.props.navigation.navigate('NotificationStack')}>
                    <Image
                      source={require('../assets/icons/ic_notify.png')}
                      style={{width: 21, height: 24, resizeMode: 'contain'}}
                    />
                    <View
                      style={[this.props.data.has_read ? styles.activeNoti : {},
                      {right: 0}, ]}/>
                  </TouchableOpacity>
                  <Space width={10} />
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate(this.props.data.userInfo.user_type === "parent"? 'CalendarScreen' : "Events")}>
                    <Image
                      source={require('../assets/icons/ic_calendar_white.png')}
                      style={{height: 23,width: 40,resizeMode: 'contain',}}/>
                  </TouchableOpacity>
                  
                    {this.props.data.userInfo !== null ? 
                    
                      <>
                      <Space width={10} />
                        <TouchableOpacity style={{height: 40, width: 40,borderRadius: 40,}} onPress={()=>this.props.navigation.navigate("Profile")}>
                          <ImageLoad
                            style={{height: 40, width: 40}}
                            loadingStyle={{size: 'small', color: 'white'}}
                            borderRadius={40}
                            placeholderStyle={{
                            borderRadius: 40,
                            height: 40,
                            width: 40,}}
                            isProfile={true}
                            source={{uri: this.props.data.userInfo.img, cache: 'force-cache'}}
                            placeholderSource={require('../assets/icons/ic_account.png')}
                          />
                        </TouchableOpacity>
                  </>: null}
              </View>
              )}

              {/* For Newsfeed Page */}
              {/* {
                this.props.type === configs.HEADER_TYPE.NEWSFEED_PAGE 
                && this.props.data.userInfo.user_type !== 'parent'
                && (
                <View style={{backgroundColor:'transparent'}}>
                  <TouchableOpacity
                    style={styles.addNew}
                    onPress={() => this.props.navigation.navigate('NewPost')}>
                    <Ionicons name="add" size={24} color={"white"} />
                  <Text
                    style={styles.addNewText}>
                    Add New
                  </Text>
                  </TouchableOpacity>
                  </View>
                )
              } */}
          </View>

          {/* New Post Button */}
          {this.props.type === configs.HEADER_TYPE.NEWSFEED_PAGE 
          && this.props.foundNewPost == true &&
          
          <Animated.View style={[styles.newPost, {paddingTop: headerHeight}]}>
            <TouchableOpacity 
              style={styles.newPostContainer}
              onPress={this.props.onClickNewPost}>
              <View>
                <Text style={{
                  color: configs.colors.primaryColor,
                  fontSize: 14,
                  fontFamily: configs.fontFamily.OPS700,
                }}>
                  New post
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>}

               
        <ScrollView 
            style={{...(Platform.OS !== 'android' && {
              zIndex: 99,
            }),}}
            ref={this.props.scrollRef}
            contentContainerStyle={
              {paddingTop: this.props.type == configs.HEADER_TYPE.MORE_PAGE 
                ? PADDING_TOP 
                : this.props.type == configs.HEADER_TYPE.DONATION_PAGE 
                ? PADDING_TOP
                : this.props.type == configs.HEADER_TYPE.HOME_PAGE 
                ? PADDING_TOP - (isIOS() ? hasNotch() ? 130 : 110 : 130)
                : PADDING_TOP,}
            }
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event([
              {
                nativeEvent: {
                  contentOffset: {
                    y: this.state.scrollY,
                  },
                },
              },
              
            ])}
            scrollEventThrottle={16}
            refreshControl={
              (this.props.type === configs.HEADER_TYPE.HOME_PAGE
                || this.props.type === configs.HEADER_TYPE.NEWSFEED_PAGE
                || this.props.type === configs.HEADER_TYPE.CLASS)?
              <RefreshControl
                colors={['#9Bd35A', '#689F38']}
                refreshing={this.props.refreshState}
                onRefresh={this.props.refreshing}/> : null
            }
          > 
          <View style={{
            ...(this.props.type != configs.HEADER_TYPE.HOME_PAGE && {backgroundColor: configs.colors.backgroundColor})}}>
            
            {this.props.children}
            
          </View>
            
          </ScrollView>
        </View>
      </SafeArea>
    );
  }

  onLayout(event) {
    const {x, y, height, width} = event.nativeEvent.layout;
    this.setState({open: height === HEADER_COLLAPSED_HEIGHT ? false : true});
  }
}

const mapStateToProps = (state) => {
  return {
    has_read: state.homeState.has_read,
  };
};

export default connect(mapStateToProps, null)(CollapsibleToolbar);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: configs.colors.backgroundColor,
  },
  header: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    top: 0,
    left: 0,
    ...(Platform.OS !== 'android' && {
      zIndex: 2,
    }),
  },
  title: {
    marginVertical: 16,
    fontWeight: 'bold',
    fontSize: 24,
  },
  headerTitle: {
    letterSpacing: 0,
    textAlign: 'center',
    position: 'absolute',
    top: getStatusBarHeight() + 25,
    ...(Platform.OS !== 'android' && {
      zIndex: 99,
    }),
  },
  maxHeader: {
    fontSize: 18,
    left: 24,
    fontFamily: configs.fontFamily.OPS700,
  },
  minHeader: {
    fontSize: 18,
    paddingLeft: 24,
    color: configs.colors.white,
    fontFamily: configs.fontFamily.OPS700,
  },
  nameStyle: {
    color: 'white', 
    fontWeight: '700',
    fontSize: 18, 
    paddingLeft: 24,
  },
  backIcon: {
    ...(Platform.OS !== 'android' && {
      zIndex: 99,
    }),
    height: 20,
    width: 20,
  },
  image: {
    resizeMode: 'contain',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  imageStyle: {
    position: 'absolute',
    height: HEADER_EXPANDED_HEIGHT,//configs.height / 3.5
    width: '100%',
    resizeMode: 'stretch',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  appBar: {
    height: HEADER_COLLAPSED_HEIGHT,
    flexDirection: 'row',
    paddingTop: getStatusBarHeight(),
    ...(Platform.OS == 'ios' && {
      zIndex: 100,
    }),
    backgroundColor: configs.colors.transparent,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  CollapedAppBar: {
    height: HEADER_COLLAPSED_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: getStatusBarHeight(),
    ...(Platform.OS !== 'android' && {
      zIndex: 100,
    }),
    backgroundColor: configs.colors.primaryColor,
  },
  addNew: {
    backgroundColor: '#F6D102',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical:5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    marginRight: 20,
  },
  addNewText: {
    fontSize: 12,
    fontFamily: configs.fontFamily.OPS700,
    color: '#fff',
    marginRight: 6,
  },
  newPost: {  
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 48/2,
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 5},
    shadowRadius: 10,
    alignItems: 'center',
    marginTop: - (48/2),
    zIndex: 110,
  },
  newPostContainer: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: configs.colors.white,
    borderRadius: 48/2,
    paddingHorizontal: 16,
  },
  activeNoti: {
    position: 'absolute',
    backgroundColor: configs.colors.active_noti,
    height: 8,
    width: 8,
    borderRadius: 10,
  },
});