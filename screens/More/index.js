import React, {Component} from 'react';
import {
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  Alert
} from 'react-native';
import {Space} from '../../components/space';
import Divider from '../../components/divider';
import AsyncStorage from '@react-native-community/async-storage';
import configs from '../../utils/configs';
import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth';
import homeAction from '../../actions/homeAction';
import authAction from '../../actions/authAction';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Dialog from "react-native-dialog";
import * as constants from '../../utils/constants';
import CollapsibleToolbar from '../../components/CollapsibleToolbar';
import Loading from '../../components/Loading';

// const isParent = true;
const {width} = Dimensions.get('window');

class More extends Component {
  state = {
    merchandises: [],
    confirm_dialog:false,
    isLoggingOut: false,

    parentsettings: [
      {
        id: 1,
        title: 'Merchandise',
        icon: require('../../assets/icons/ic_merchandise.png'),
        navigate: 'MerchandiseParentScreen',
        color: '#7CD227',
        width: 34,
      },
      {
        id: 2,
        title: 'Order List',
        icon: require('../../assets/icons/ic_order_list.png'),
        navigate: 'Order Lists',
        color: '#F66460',
        width: 29,
      },
      {
        id: 3,
        title: 'Digital Forms',
        icon: require('../../assets/icons/ic_digital_forms.png'),
        navigate: 'DigitalForms',
        color: '#3C73DC',
        width: 24,
      },
      {
        id: 4,
        title: 'Handbook',
        icon: require('../../assets/icons/ic_handbook.png'),
        navigate: 'HandbooksScreen',
        color: '#F6D102',
        width: 29,
      },
    ],

    services: [
      {
        id: 1,
        title: 'Merchandise',
        icon: require('../../assets/icons/ic_merchandise.png'),
        navigate: 'MerchandiseFacilitatorScreen',
        color: '#7CD227',
        width: 34,
      },
      {
        id: 2,
        title: 'Events',
        icon: require('../../assets/icons/ic_event.png'),
        navigate: 'CalendarScreen',
        color: '#F66460',
        width: 34,
      },
      {
        id: 3,
        title: 'Digital Forms',
        icon: require('../../assets/icons/ic_digital_forms.png'),
        navigate: 'DigitalForms',
        color: '#3C73DC',
        width: 24,
      },
      {
        id: 4,
        title: 'Handbook',
        icon: require('../../assets/icons/ic_handbook.png'),
        navigate: 'HandbooksScreen',
        color: '#F6D102',
        width: 29,
      },
    ],
    profileAndSettingsFacilitator: [
      {
        id: 1,
        title: 'My profile',
        icon: require('../../assets/icons/ic_profile.png'),
        navigate: 'Profile',
        color: '#7CD227',
      },
      {
        id: 2,
        title: 'Settings',
        icon: require('../../assets/icons/ic_settings.png'),
        navigate: 'SettingsFacilitator',
        color: '#F66460',
      },
      {
        id: 3,
        title: 'Logout',
        icon: require('../../assets/icons/ic_logout.png'),
        navigate: 'Logout',
        color: '#3C73DC',
      },
    ],
    profileAndSettingsParent: [
      {
        id: 1,
        title: 'My profile',
        icon: require('../../assets/icons/ic_profile.png'),
        navigate: 'Profile',
        color: '#7CD227',
      },
      {
        id: 2,
        title: 'Child’s profile',
        icon: require('../../assets/icons/ic_children_profile.png'),
        navigate: 'ChildrenProfile',
        color: '#F3B329',
      },
      {
        id: 3,
        title: 'Settings',
        icon: require('../../assets/icons/ic_settings.png'),
        navigate: 'SettingsParent',
        color: '#F66460',
      },
      {
        id: 4,
        title: 'Privacy policy',
        icon: require('../../assets/icons/ic_privacy_policy.png'),
        navigate: 'PrivacyPolicy',
        color: '#C697DF',
      },
      {
        id: 5,
        title: 'Terms and conditions',
        icon: require('../../assets/icons/ic_terms_and_condition.png'),
        navigate: 'TermsAndCondition',
        color: '#8BCAFF',
      },
      {
        id: 6,
        title: 'Change password',
        icon: require('../../assets/icons/ChangePassword.png'),
        navigate: 'ChangePassword',
        color: '#5678CE',
      },
      {
        id: 7,
        title: 'Logout',
        icon: require('../../assets/icons/ic_logout.png'),
        navigate: 'Logout',
        color: '#3C73DC',
      },
      
    ],
  };

  Logout = async  () => {
    await auth().signOut();
  };

  _renderLDialog =(isVisible, onClose) =>{
    return (
      <Dialog.Container visible={isVisible}
        contentStyle={{borderRadius:10, backgroundColor: 'white'}}>
        <Dialog.Title style={{color:'black'}}>Are you sure?</Dialog.Title>
        <Dialog.Button label="Cancel" onPress={onClose}/>
        <Dialog.Button label="Logout" onPress={()=>{
          onClose();
          setTimeout(() => {
            this.setState({isLoggingOut:true});
            console.log('LOGOUTTTTTTT ....... token : ' + this.props.fcm_token);
            this.props.clearFcmToken(this.props.userInfo.id, this.props.fcm_token, (success)=>{
              if(success){
                console.log('LOGOUTTTTTTT ....... success');
              }else{
                console.log('LOGOUTTTTTTT ....... fail');
              }
              this.setState({isLoggingOut: false});
              this.Logout(); 
              
            });
          }, 300);
        }}/>
      </Dialog.Container>
    )
  }

  componentDidMount() {
    this.props.fetchMerchandiseType();
    this.setMerchandiseData();

    const {getOrderedListForParents, userInfo} = this.props;

    /*getOrderedListForParents(
      userInfo.id, 
      configs.OrderListStatusMap.All,
      10,
      false,
      '',
      (status, data) => {
        console.log("NAY CHI : All Data Received");
        console.log(data);
        getOrderedListForParents(
          userInfo.id,
          configs.OrderListStatusMap.Pending,
          10,
          false,
          '',
          (status, data) => {
            console.log("NAY CHI : Pending Data Received");
            console.log(data);
            getOrderedListForParents(
              userInfo.id,
              configs.OrderListStatusMap.Verification,
              10,
              false,
              '',
              (status, data) => {
                console.log("NAY CHI : Verification Data Received");
                console.log(data);
                getOrderedListForParents(
                  userInfo.id,
                  configs.OrderListStatusMap.Delivered,
                  10,
                  false,
                  '',
                  (status, data) => {
                    console.log("NAY CHI : Delivered Data Received");
                    console.log(data);
                    getOrderedListForParents(
                      userInfo.id,
                      configs.OrderListStatusMap.Cancelled,
                      10,
                      false,
                      '',
                      (status, data) => {
                        console.log("NAY CHI : Cancelled Data Received");
                        console.log(data);
                      },
                    );
                  },
                );
              },
            );
          },
        );
      },
    );*/
  }

  setMerchandiseData = () => {
    setTimeout(() => {
      const {merchandise_types} = this.props;
      merchandise_types &&
        merchandise_types.map((e) => {
          this.props.fetchMerchandiseDataByType(e.id, 10, '', false, () =>
            console.log('Hello'),
          );
        });
    }, 1000);
  };

  render() {
    const services =
      this.props.userInfo.user_type === 'parent'
        ? this.state.parentsettings
        : this.state.services;
    const profileSettings =
      this.props.userInfo.user_type === 'parent'
        ? this.state.profileAndSettingsParent
        : this.state.profileAndSettingsFacilitator;

    return (
      <View style={styles.container}>
        { this.state.isLoggingOut &&<Loading /> }
        <StatusBar translucent={true}  backgroundColor={this.state.confirm_dialog == true ? '#00000050':'transparent'}/>
        <CollapsibleToolbar
          title={'More'}
          headerColor={configs.colors.primaryColor}
          headerColorDark={configs.colors.primaryColor}
          image={require('../../assets/images/more_header.png')}
          backPress={this.backPress}
          type={configs.HEADER_TYPE.MORE_PAGE}
          data={this.props}
          navigation={this.props.navigation}
          appBarHeight={65}>
          <View style={{marginTop: -30}}>
            <View
              style={styles.mainContainer}>
              <FlatList
                  numColumns={2}
                  data={services}
                  keyExtractor={(item,index)=>index.toString()}
                  renderItem={({item,index})=>{
                    var image = item.icon;
                      return (
                        <TouchableOpacity
                          style={styles.item}
                          key={index}
                          onPress={() => {
                            if(item.navigate == 'HandbooksScreen'){
                              this.props.navigation.push(item.navigate,{
                                from:"handbook",
                                data:{
                                    uri:Platform.OS === 'android'
                                    ? constants.HandBookPDFLink_Android
                                    :constants.HandBookPDKLink,
                                    order_id:'',
                                },
                              })
                            } else if(item.navigate == 'Order Lists'){
                              this.props.navigation.push(item.navigate,{
                                initialPage: 0,
                              })
                            } else {
                              this.props.navigation.push(item.navigate)
                            }
                            
                          }}>
                          <View 
                            style={[
                              styles.icon,
                              {
                                backgroundColor: item.color,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: (width / 2) - 48,
                                height: 100,
                                marginLeft:
                                  item.title == 'Order List'
                                    ? 17
                                    : item.title == 'Handbook'
                                    ? 17
                                    : item.title == 'Events'
                                    ? 17
                                    : null,
                                marginBottom:
                                  item.title == 'Order List'
                                    ? 16
                                    : item.title == 'Merchandise'
                                    ? 16
                                    : item.title == 'Events'
                                    ? 16
                                    : null,
                              },
                            ]}>
                            <Image
                              source={image}
                              resizeMode="stretch"
                              style={{
                                height: 32,
                                width: item.width,
                                alignSelf: 'center',
                                marginTop: 24,
                              }}
                            />
                            <Text
                              style={{
                                fontWeight: '700',
                                color: '#fff',
                                textAlign: 'center',
                                marginTop: 8,
                                fontSize: 14,
                                marginBottom: 17,
                              }}>
                              {item.title}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                  }}
              />
            </View>
        
            <Space height={20} />

            <View style={styles.bottomContainer}>
              <Text style={styles.header}>Profile {'&'} Settings</Text>
              <Space height={10} />

              <View style={{marginTop: 10}}>
              {profileSettings.map((e, index) => {
                var image = e.icon;
                return (
                  <TouchableOpacity
                    style={{
                      ...styles.item,
                      marginVertical: 10,
                      marginHorizontal: 5,
                    }}
                    key={index}
                    onPress={() => {
                      e.title === 'Logout'
                        ? this.setState({confirm_dialog:true})
                        : this.props.navigation.push(e.navigate);
                    }}>
                    <View
                      style={[
                        styles.icon,
                        {
                          backgroundColor: e.color,
                          justifyContent: 'center',
                          borderRadius: 50,
                        },
                      ]}>
                      <Image
                        source={image}
                        resizeMode="stretch"
                        style={{height: 14, width: 14, alignSelf: 'center'}}
                      />
                    </View>

                    <Space width={10} />
                    <Text style={{fontWeight: '600'}}>{e.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            
              <Space height={50} />
              { this._renderLDialog(this.state.confirm_dialog,()=>this.setState({ confirm_dialog: false}))}
            </View>

          </View>
        </CollapsibleToolbar>
      </View>
      // without collapable view <NEED TO REMOVE AFTER CONFIRM>
      // <View style={styles.container}>
      //   <StatusBar translucent={true}  backgroundColor={this.state.confirm_dialog == true ? '#00000050':'transparent'}/>
      //   <ScrollView showsVerticalScrollIndicator={false}>
      //     <View>
      //       <Image
      //         source={require('../../assets/images/more_header.png')}
      //         style={{
      //         height: configs.height / 3.5,
      //         width: '100%',
      //         resizeMode: 'stretch',
      //         borderBottomRightRadius: 20,
      //         borderBottomLeftRadius: 20,}}/>
      //       <View style={styles.headerContainer}>
      //         <Text style={styles.headerText}>More</Text>
      //       </View>
            
      //     </View>
      //     <Space height={50} />
      //     { this._renderLDialog(this.state.confirm_dialog,()=>this.setState({ confirm_dialog: false}))}
      //   </ScrollView>
      // </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.authState.userInfo,
    merchandise_data: state.homeState.merchandise_data,
    all_merchandise_data: state.homeState.all_merchandise_data,
    merchandise_types: state.homeState.merchandise_types,
    all_merchandise_data_next_url:
      state.homeState.all_merchandise_data_next_url,
    fcm_token: state.authState.fcm_token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(authAction.logout()),
    clearFcmToken: (user_id,token,handleCallback) => dispatch(authAction.clearFcmToken(user_id,token,handleCallback)),
    fetchMerchandiseType: () => dispatch(homeAction.fetchMerchandiseType()),
    fetchMerchandiseDataByType: (
      merchandise_type_id,
      size,
      merchandise_data_by_type_next_url,
      isNext,
      handleCallback,
    ) =>
      dispatch(
        homeAction.fetchMerchandiseDataByType(
          merchandise_type_id,
          size,
          merchandise_data_by_type_next_url,
          isNext,
          handleCallback,
        ),
      ),
      getOrderedListForParents: (
        user_id,
        status,
        size,
        isNext,
        ordered_next_url,
        handleCallback,
      ) =>
        dispatch(
          homeAction.getOrderedListForParents(
            user_id,
            status,
            size,
            isNext,
            ordered_next_url,
            handleCallback,
          ),
        ),
      getCancelledOrderedListsOfParenet: (user_id,status,size,isNext,ordered_next_url,handleCallback )=> dispatch( homeAction.getCancelledOrderedListsOfParenet(user_id,status,size,isNext,ordered_next_url,handleCallback ) ),
      getPaymentVerificationOrderedListsOfParent: (user_id,status,size,isNext,ordered_next_url,handleCallback )=> dispatch( homeAction.getPaymentVerificationOrderedListsOfParent(user_id,status,size,isNext,ordered_next_url,handleCallback ) ),
      getPendingPaymenetOrderedListsOfParent: (user_id,status,size,isNext,ordered_next_url,handleCallback )=> dispatch( homeAction.getPendingPaymenetOrderedListsOfParent(user_id,status,size,isNext,ordered_next_url,handleCallback ) ),
      getDeliveredOrderedListsOfPrents: (user_id,status,size,isNext,ordered_next_url,handleCallback )=> dispatch( homeAction.getDeliveredOrderedListsOfPrents(user_id,status,size,isNext,ordered_next_url,handleCallback ) ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(More);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: configs.colors.backgroundColor,
  },
  mainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 20,
    padding: 24,
  },
  bottomContainer: {
    backgroundColor: configs.colors.white,
    flex: 1,
    height: '100%',
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 20,
    padding: 15,
  },
  header: {
    color: '#1B1A1A',
    fontSize: 16,
    fontWeight: '700',
  },
  //<NEED TO REMOVE AFTER CONFIRM>
  // headerContainer: {
  //   position: 'absolute',
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   width: '100%',
  //   paddingHorizontal: 16,
  //   marginTop: getStatusBarHeight() + 10,
  // },
  // headerText: {
  //   color: 'white',
  //   fontSize: 18,
  //   fontFamily: configs.fontFamily.OPS700,
  // },
  item: {
    flexDirection: 'row',

    alignItems: 'center',
  },
  icon: {
    height: 32,
    width: 32,
    borderRadius: 8,
  },
});