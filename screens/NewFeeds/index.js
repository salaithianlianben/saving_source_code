import React, { Component } from 'react';
import {
  Text,
  Alert,
  View,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  DotIndicator,
} from 'react-native-indicators';
// import {Text, View, ScrollView, StatusBar, ImageBackground, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import NewsfeedCard from './newsfeedCard';
import configs from '../../utils/configs';
import { connect } from 'react-redux';
import homeAction from '../../actions/homeAction';
import NetInfo from '@react-native-community/netinfo';
import utilities from '../../utils/utilities';
import { Space } from '../../components/space';
import CollapsibleToolbar from '../../components/CollapsibleToolbar';
import RBSheet from 'react-native-raw-bottom-sheet';
import firestore from '@react-native-firebase/firestore';

const { width } = Dimensions.get('window');

class NewFeeds extends Component {
  NetInfoSubscribtion = null;

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.myFlatlistRef = React.createRef();
  }

  getScheduleColorsByIndex = (index) => {
    const { schedule_colors } = this.props;
    if (schedule_colors == undefined) {
      return 'white';
    }
    var i = index % schedule_colors.length;

    let data = schedule_colors.filter((x) => x.serial_number == i + 1)[0];
    return data ? data.hex_color_code : 'white';
  };

  state = {
    selectedIndex: 0,
    page: 0,
    pagesize: 10,
    all_newsfeeds: [],
    existing_all_newsfeeds: [],
    isLoadMore: false,
    isFetching: false,
    refreshing: false,
    selectedViewImage: null,
    isSelectedViewing: false,
    isShowImageViewer: false,
    selectedNewsfeed:'',
    isSnapShotEnable: false,
    foundNewPost: false,
    newPosts: [],
  };

  handleCallback = () => {
    this.setState({
      isLoadMore: false,
    });
  };

  handleLoadMore = () => {
    if (this.props.isLoadMoreForNewfeed) {
      this.setState(
        {
          page: this.state.page + 1,
          isLoadMore: true,
        },
        () => {
          this.props.getAllNewsfeeds(
            this.state.page,
            this.state.pagesize,
            false,//checkNewPost
            this.handleCallback,
          );
        },
      );
    }
  };

  getNewsfeedBySnapShop = async() => {
    this.newsFeedSubscriber = firestore()
    .collection('newsfeed')
    .onSnapshot((querySnapshot) => {
      console.log('Newsfeed db change');
      //console.log('Total Newsfeeds : ', querySnapshot.size);

      // querySnapshot.forEach(documentSnapshot => {
      //   console.log('Newsfeeds Data : ', documentSnapshot.id, documentSnapshot.data());
      // });
      if(this.state.isSnapShotEnable){
        this.callNewsfeedAPI();
      }
    });
  }

  callNewsfeedAPI (){
    console.log('Newsfeed db change and call api');

    //11 July 2021, no need to show New Post button
    /*this.props.getAllNewsfeeds(0, 10, true, () => {
      this.setState({
        isFetching: false,
      });
      if(this.checkNewsfeedList()){
        this.props.foundNewPostForNew(this.state.newPosts);

        this.setState({
          foundNewPost: true,
          newPosts: [],
        });

      }else {
        console.log('NAY CHI : found no new post');
      }
    },
   );*/

   this.setState({
    isFetching: true,
    page: 0,
  }, () => {
    
    this.props.getAllNewsfeeds(0, 10, false, () =>
      this.setState({
        isFetching: false,
        foundNewPost: false,
        isSnapShotEnable: true,
      }),
    );
  });
  }

  async componentDidMount() {

    this.getNewsfeedBySnapShop();

    if(!this.state.isSnapShotEnable){
      this.setState({
        isFetching: true,
        page: 0,
      }, () => {
        
      this.props.getAllNewsfeeds(0, 10, false, () =>
        this.setState({
          isFetching: false,
          foundNewPost: false,
          isSnapShotEnable: true,
        }),
      );
      });
    }
    
  }

  componentWillUnmount(){

    if(this.newsFeedSubscriber)
      this.newsFeedSubscriber();
  }

  _checkYourNetworkConnection = () => {
    var isConnected = false;
    this.NetInfoSubscribtion = NetInfo.addEventListener((state) => {
      isConnected = state.isConnected;
    });
    return isConnected;
  };
  _renderLoading = () => {
    return (
      <View style={{ height: '100%', width: configs.width, }}>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item width={"100%"} borderRadius={20} margin={3} paddingHorizontal={24} paddingVertical={20}>
              
              <SkeletonPlaceholder.Item width={"100%"} height={153} borderRadius={8} marginBottom={14}></SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item flexDirection={'row'} marginBottom={8}>
                <SkeletonPlaceholder.Item width={32} height={32} borderRadius={32} marginRight={9}></SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item width={100} height={20} borderRadius={10} alignItems="center" justifyContent="center" marginTop={5}></SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item width={"50%"} height={19} borderRadius={10} marginBottom={8}></SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item width={"70%"} height={19} borderRadius={10} marginBottom={8}></SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item width={"100%"} borderRadius={20} margin={3} paddingHorizontal={24} paddingVertical={20}>
              
              <SkeletonPlaceholder.Item width={"100%"} height={153} borderRadius={8} marginBottom={14}></SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item flexDirection={'row'} marginBottom={8}>
                <SkeletonPlaceholder.Item width={32} height={32} borderRadius={32} marginRight={9}></SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item width={100} height={20} borderRadius={10} alignItems="center" justifyContent="center" marginTop={5}></SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item width={"50%"} height={19} borderRadius={10} marginBottom={8}></SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item width={"70%"} height={19} borderRadius={10} marginBottom={8}></SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>


          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </View>
    )
  }
  componentWillUnmount() {
    this.NetInfoSubscribtion && this.NetInfoSubscribtion();
  }

  renderFooter = () => {
    return (
      this.props.isLoadMoreForNewfeed &&
      <View>
        <ActivityIndicator animating size="large" color={"#DADADA"} />
      </View>
    );
  };

  componentWillMount(){
    
  }

  _onRefresh = () => {
    this.setState({
      refreshing: true,
      page: 0,
    });
    if (!this._checkYourNetworkConnection()) {
      utilities.showToastMessage('Check your internet connection');
      this.setState({
        refreshing: false,
      });
    } else {
      this.props.getAllNewsfeeds(0, 10, false, () =>
        this.setState({
          refreshing: false,
        }),
      );
    }
  };

  loadingComponent = () => {
    return (
      <View>
        <View
          style={{
            marginHorizontal: 16,
            paddingBottom: 10,
          }}>
          <View
            style={{
              backgroundColor: '#00000004',
              height: 280,
              width: '100%',
              borderRadius: 30,
            }}>
            <View style={{ flexDirection: 'row', padding: 20 }}>
              <View
                style={{
                  height: 38,
                  width: 38,
                  borderRadius: 40,
                  backgroundColor: '#00000010',
                }}></View>
              <Space width={10} />
              <View style={{ justifyContent: 'center' }}>
                <View
                  style={{
                    height: 8,
                    width: 70,
                    backgroundColor: '#00000010',
                  }}></View>
                <Space height={10} />
                <View
                  style={{
                    height: 8,
                    width: 70,
                    backgroundColor: '#00000010',
                  }}></View>
              </View>
            </View>
            <View
              style={{
                height: 130,
                width: '80%',
                backgroundColor: '#00000005',
                alignSelf: 'center',
                borderRadius: 20,
              }}></View>
            <Space height={10} />
            <View
              style={{
                marginLeft: 30,
                marginVertical: 2,
                alignSelf: 'flex-start',
                height: 8,
                width: '30%',
                backgroundColor: '#00000010',
              }}></View>
            <Space height={10} />
            <View
              style={{
                marginLeft: 30,
                marginVertical: 2,
                alignSelf: 'flex-start',
                height: 8,
                width: '30%',
                backgroundColor: '#00000010',
              }}></View>
          </View>

          <Space height={20} />

          <View
            style={{
              backgroundColor: '#00000004',
              height: 280,
              width: '100%',
              borderRadius: 30,
            }}>
            <View style={{ flexDirection: 'row', padding: 20 }}>
              <View
                style={{
                  height: 38,
                  width: 38,
                  borderRadius: 40,
                  backgroundColor: '#00000010',
                }}></View>
              <Space width={10} />
              <View style={{ justifyContent: 'center' }}>
                <View
                  style={{
                    height: 8,
                    width: 70,
                    backgroundColor: '#00000010',
                  }}></View>
                <Space height={10} />
                <View
                  style={{
                    height: 8,
                    width: 70,
                    backgroundColor: '#00000010',
                  }}></View>
              </View>
            </View>
            <View
              style={{
                height: 130,
                width: '80%',
                backgroundColor: '#00000005',
                alignSelf: 'center',
                borderRadius: 20,
              }}></View>
            <Space height={10} />
            <View
              style={{
                marginLeft: 30,
                marginVertical: 2,
                alignSelf: 'flex-start',
                height: 8,
                width: '30%',
                backgroundColor: '#00000010',
              }}></View>
            <Space height={10} />
            <View
              style={{
                marginLeft: 30,
                marginVertical: 2,
                alignSelf: 'flex-start',
                height: 8,
                width: '30%',
                backgroundColor: '#00000010',
              }}></View>
          </View>
        </View>
      </View>
    );
  };

  _renderEmptyNewsFeed = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: configs.height / 2,
        }}>
        <Image
          source={require('../../assets/icons/ic_empty_Newsfeed.png')}
          style={{ width: 87, height: 64, marginBottom: 31,resizeMode:'contain' }}
        />
        <Text
          style={{
            color: '#CAD9FC',
            fontSize: 14,
            fontWeight: '600',
            fontFamily: configs.fontFamily.OPS700,
          }}>
          No Newsfeed
        </Text>
      </View>
    )
  }

  handleOpen = (id) => {
    this.RBSheet.open();
    this.setState({
      selectedNewsfeed:id,
    })
  }

  checkNewsfeedList = () => {
    console.log('Newsfeed db change and checNewsfeed');

    if(this.props.all_newsfeeds && this.props.newpost_newsfeeds){
      var newPosts = this.props.newpost_newsfeeds.filter((o1) => {
      
        console.log('NEWO : ID '+ o1.id );
        return !this.props.all_newsfeeds.some((o2) => {
          console.log('NEWO : ID '+ o1.id + ' == '+ o2.id );
          return o1.id === o2.id;// assumes unique id
        });
      });
      console.log('NAY CHI : news post newPosts array = '+ JSON.stringify(newPosts));
      
      this.setState({
        newPosts: newPosts,
      });

      if (newPosts && newPosts.length >0)
        return true;
      else
        return false;
    }

    return false;
    
 };

 onClickNewPost = (ref) => {
   ref.current.scrollTo({ x: 0, y: 0, animated: true });
   this.setState({
    foundNewPost: false,
  });
 }

  render() {
    var newsfeedList = this.props.all_newsfeeds;
    // console.log(JSON.stringify(this.props.all_newsfeeds))
    return (
      <View style={styles.container}>
        <CollapsibleToolbar
          title={'Newsfeed'}
          headerColor={configs.colors.primaryColor}
          headerColorDark={configs.colors.primaryColor}
          image={require('../../assets/images/newsfeed_header.png')}
          backPress={this.backPress}
          type={configs.HEADER_TYPE.NEWSFEED_PAGE}
          data={this.props}
          navigation={this.props.navigation}
          appBarHeight={65}
          refreshState={this.state.refreshing}
          refreshing={this._onRefresh.bind(this)}
          scrollRef={this.myRef}
          foundNewPost={this.state.foundNewPost}
          onClickNewPost={()=>this.onClickNewPost(this.myRef)}
        >
          <View>
            <Space height={16}/>
          {
          (this.state.isFetching || this.state.refreshing) ?
          this._renderLoading() 
          : newsfeedList != undefined && newsfeedList.length > 0 ?
            <FlatList
              ref={this.myFlatlistRef}
              data={newsfeedList}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              onEndReached={this.handleLoadMore}
              //ListFooterComponent={this.renderFooter}
              style={{
                marginHorizontal: 16,
                paddingBottom: 10,
              }}
              // onEndReachedThreshold={200}
              renderItem={({ item, index }) => (
                <View>
                  <NewsfeedCard
                    onOpen={this.handleOpen}
                    data={item}
                    color={this.getScheduleColorsByIndex(index)}
                    navigation={this.props.navigation}
                    onShowImageView={(value) => {
                      this.setState({
                        isShowImageViewer: value
                      })
                    }}
                    userInfo={this.props.userInfo}
                  />
                  {index === newsfeedList.length - 1 &&
                    this.state.isLoadMore && (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 'auto',
                        }}>
                        <DotIndicator size={5} color={configs.colors.grey}/>
                      </View>
                    )}
                </View>
              )}
            /> : this._renderEmptyNewsFeed()
            }
          </View>
        </CollapsibleToolbar>
        <RBSheet
          closeOnPressBack
          dragFromTopOnly={true}f
          closeOnDragDown={true}
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          dragFromTopOnly={true}
          openDuration={250}
          customStyles={{
            container: styles.bottomSheetContainer,
          }}
          closeOnDragDown
        >
          <View style={{justifyContent:'center',alignItems:'center',marginVertical:10,marginBottom:20,}}>
            <Text style={{fontSize:16,fontWeight:'bold',alignSelf:'center'}}>Delete your post</Text>
            <Space height={10}/>
            <Text>Are you sure you want to permanently</Text>
            <Text>delete your post?</Text>
            <Space height={20}/>
            <View style={{flexDirection:'row',justifyContent:'space-around',}}>
              <TouchableOpacity style={{paddingVertical:10,width:configs.width * 0.35,borderWidth:1,borderColor:configs.colors.primaryColor,borderRadius:20}} onPress={()=>this.RBSheet.close()}>
                <Text style={{color:configs.colors.primaryColor,fontWeight:'bold',alignSelf:'center'}}>Cancel</Text>
              </TouchableOpacity>
              <Space width={10}/>
              <TouchableOpacity style={{paddingVertical:10,width:configs.width * 0.35,backgroundColor:configs.colors.primaryColor,borderRadius:20}} onPress={()=>{
                this.RBSheet.close();
                this.props.onDeleteNewsFeed(this.state.selectedNewsfeed,this.props.userInfo.id,(value,message)=>{
                  if(value == true){
                    utilities.showToastMessage(message);
                  }else{
                    utilities.showToastMessage(message,"error");
                  }
                })
              }}>
                <Text style={{color:'white',fontWeight:'bold',alignSelf:'center'}}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
      </View>
      
      // <View style={{ flex: 1, backgroundColor: configs.colors.backgroundColor }}>
      //   <StatusBar
      //     barStyle="dark-content"
      //     translucent={true}
      //     backgroundColor={
      //       this.state.isShowImageViewer == true
      //         ? '#000000'
      //         : 'transparent'} />
      //   <Image
      //     source={require('../../assets/images/Newsfeed.png')}
      //     style={{
      //       height: configs.height / 3.3,
      //       width,
      //       resizeMode: 'stretch',
      //       borderBottomRightRadius: 20,
      //       borderBottomLeftRadius: 20,
      //     }} />

      //   <View style={styles.headerContainer}>
      //     <Text style={styles.headerText}>Newsfeed</Text>
      //     {this.props.userInfo.user_type !== 'parent' &&
      //       (this.props.calendar_view_of_events_or_schedules != undefined 
      //&& this.props.calendar_view_of_events_or_schedules != null 
      //&& this.props.calendar_view_of_events_or_schedules[0] != undefined 
      //&& this.props.calendar_view_of_events_or_schedules[0].schedules.length > 0)
      //       && (
      //         <TouchableOpacity
      //           style={styles.addNew}
      //           onPress={() => this.props.navigation.navigate('NewPost')}>
      //             <Ionicons name="add" size={24} color={"white"} />
      //           <Text
      //             style={{
      //               fontSize: 12,
      //               fontFamily: configs.fontFamily.OPS700,
      //               color: '#fff',
      //               marginRight: 6,
      //             }}>
      //             Add New
      //         </Text>
      //         </TouchableOpacity>
      //       )}
      //   </View>
      //   {/* here is newsfeed list */}
      // </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    all_newsfeeds: state.homeState.all_newsfeeds,
    newpost_newsfeeds: state.homeState.newpost_newsfeeds,
    merchandise_types: state.homeState.merchandise_types,
    isLoadMoreForNewfeed: state.homeState.isLoadMoreForNewfeed,
    userInfo: state.authState.userInfo,
    is_loading_newsfeed: state.homeState.is_loading_newsfeed,
    schedule_colors: state.homeState.schedule_colors,
    calendar_view_of_events_or_schedules:
      state.homeState.calendar_view_of_events_or_schedules,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllNewsfeeds: (page, pagesize, checkNewPost, handleCallback) =>
      dispatch(homeAction.getAllNewsfeeds(page, pagesize, checkNewPost, handleCallback)),
    onDeleteNewsFeed: ( id,facilitator_id,handleCallback) => 
      dispatch(homeAction.onDeleteNewsFeed(id,facilitator_id,handleCallback)),
      foundNewPostForNew: (value) => dispatch( homeAction.foundNewPostForNew(value)),
        
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewFeeds);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: configs.colors.backgroundColor,
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
  headerContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: getStatusBarHeight() + 10,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontFamily: configs.fontFamily.OPS700,
  },
  // addNew: {
  //   backgroundColor: '#F6D102',
  //   borderRadius: 20,
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   paddingVertical:5,
  //   paddingHorizontal: 10,
  //   flexDirection: 'row',
  // },
  tabsContainerStyle: {
    height: 85,
  },
  tabStyle: {
    shadowColor: '#9DA5F150',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    elevation: 1,
    paddingHorizontal: 16,
    height: 42,
    borderWidth: 0,
    marginRight: 8,
    borderRadius: 20,
  },
  firstTabStyle: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  lastTabStyle: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    marginRight: 24,
  },
  tabTextStyle: {
    fontSize: 14,
    fontFamily: configs.fontFamily.OPS600,
    color: configs.colors.primaryColor,
  },
  activeTabStyle: {
    backgroundColor: '#F6D102',
  },
  activeTabTextStyle: {
    color: '#fff',
  },
});
