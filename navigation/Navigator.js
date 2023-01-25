import * as React from 'react';
import {useEffect} from 'react';
import {Text, View, Image, TouchableOpacity, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import NewFeedsScreen from '../screens/NewFeeds/index';
// import CalendarScreen from '../screens/Calendar/mockupIndex';
import CalendarsScreen from '../screens/Calendar';
import TakeALeaveScreen from '../screens/Calendar/takeLeave';
import CommsScreen from '../screens/Comms';
import Classes from '../screens/Classes';
import MoreScreen from '../screens/More';
import configs from '../utils/configs';
import {connect} from 'react-redux';
import MerchandiseFacilitatorScreen from '../screens/More/Merchandise/Facilitators';
import ChildrenProfile from '../screens/More/ChildrenProfile/index';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EventsScreen from '../screens/More/Events';
import DigitalForms from '../screens/More/DigitalForms';
import DigitalFormsDetails from '../screens/More/DigitalForms/detials';
import Profile from '../screens/More/Profile';
import SettingsFacilitator from '../screens/More/Settings/Facilitator';
import SettingsParent from '../screens/More/Settings/Parent';
import MerchandiseParentScreen from '../screens/More/Merchandise/Parents';
import Details_Item from '../screens/More/Merchandise/Parents/details_item';
import Cart from '../screens/More/Merchandise/Parents/cart';
import PaymentScreen from '../screens/More/Merchandise/Parents/Payments';
import OrderLists from '../screens/More/OrderLists';
import DonationScreen from '../screens/Donation';
import WebViewComponent from '../screens/WebView/index';
import DonationPayments from '../screens/Donation/dotation_payment';
import PayNowQRScreen from '../screens/Donation/paynowQR';
import Notification from '../screens/Notification';
import IconButton from '../components/icon_button';
import utilities from '../utils/utilities';
import FundraisingScreen from '../screens/Fundraising';
import NewPost from '../screens/NewFeeds/NewPost';
import VideoFullscreen from '../screens/NewFeeds/VideoFullscreen';
import {CACHES} from 'react-native-sound';
import BackImage from '../assets//icons/Back.png';
import ChatRoom from '../screens/Comms/ChatRoom';
import VideoScreen from '../screens/Fundraising/VideoScreen';
import FullScreen from '../screens/Fundraising/FullScreen';
import PaymentQR from '../screens/More/Merchandise/Parents/Payments/paymentQR';
import MerchandisePayNowQR from '../screens/More/Merchandise/Parents/Payments/MerchandisePayNowQR';
import TermsAndCondition from '../screens/More/TermsAndCondition';
import PrivacyPolicy from '../screens/More/PrivacyPolicy';
import PaymentSuccess from '../screens/More/Merchandise/Parents/Payments/paymentSuccess';
import DonationPaymentSuccess from '../screens/Donation/payment_success';
import DonationPaymentFails from '../screens/Donation/payment_fail';
import ChangePassword from '../screens/More/ChangePassword/changePassword';
import ForgotPasswordScreen from '../screens/Login/forgotPassword';
import MaintenanceScreen from '../screens/MaintenanceScreen';
import firestore from '@react-native-firebase/firestore';
import homeAction from '../actions/homeAction';
import FreeUpStorage from '../screens/Comms/FreeUpStorage';
import { CardStyleInterpolators } from '@react-navigation/stack';
import DonationWeb from '../screens/Donation/donation_web';

const Tab = createBottomTabNavigator();

const BottomTabIcon = (props) => {
  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        borderTopWidth: 4,
        borderTopColor: props.focus ? configs.colors.primaryColor : 'white',
      }}>
      <Image
        source={props.imageURL}
        style={{width: 22, height: 20, resizeMode: 'contain', marginTop: 6}}
      />
      {
        props.hasUnread && props.hasUnread == true && 
        (<View style={{ 
          position: 'absolute', 
          width: 22, 
          height: 20,}}>

          <View style={{
            height: 8,
            width: 8,
            borderRadius: 8,
            backgroundColor: '#F66460',
            alignSelf: 'flex-end',
            marginRight: -3,
            marginTop: 3}}/>

        </View>)
      }
    </View>
  );
};

// More Stacks

const MoreSN = createStackNavigator();

const MoreStack = ({navigation,route}) => {
  const userInfo = utilities.getUserInfo();
  const count_of_cart_items = utilities.getCountOfCartItems();
  if (route.state != undefined) {
    if (route.state.index === 0) {
      navigation.setOptions({tabBarVisible: true});
    } else {
      navigation.setOptions({tabBarVisible: false});
    }
  }

  return (
    <MoreSN.Navigator>
      <MoreSN.Screen
        component={MoreScreen}
        name="More"
        options={{headerShown: false}}
      />
       <MoreSN.Screen
        component={ForgotPasswordScreen}
        name="ForgotPasswordScreen"
        options={{headerShown: false}}
      />
      <MoreSN.Screen
        component={CalendarStack}
        name="CalendarScreen"
        options={{
          headerShown: false,
        }}
      />
       <MoreSN.Screen
        component={ChangePassword}
        name="ChangePassword"
        options={{
          headerTitle: 'Change password',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
       />
      <MoreSN.Screen
        component={MerchandiseFacilitatorScreen}
        name="MerchandiseFacilitatorScreen"
        options={{
          headerTitle: 'Merchandise',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />

      <MoreSN.Screen
        component={PrivacyPolicy}
        name="PrivacyPolicy"
        options={{
          headerTitle: 'Privacy Policy',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />

      <MoreSN.Screen
        component={TermsAndCondition}
        name="TermsAndCondition"
        options={{
          headerTitle: 'Terms and condition',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />

      <MoreSN.Screen
        component={ChildrenProfile}
        name="ChildrenProfile"
        options={{
          headerTitle: 'Children’s profile',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />

      {/* <MoreSN.Screen
        component={EventsScreen}
        name="Events"
        options={{
          headerTitle: 'Events',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      /> */}

      <MoreSN.Screen
        component={DigitalForms}
        name="DigitalForms"
        options={{
          headerTitle: 'Digital forms',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />

      <MoreSN.Screen
        name="DigitalFormsDetail"
        component={DigitalFormsDetails}
        options={{
          headerShown: false,
          headerTitle: 'Digital forms',
        }}
      />

      <MoreSN.Screen
        component={WebViewComponent}
        name="HandbooksScreen"
        options={{
          headerTitle: 'Handbook',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />
      <MoreSN.Screen
        component={Profile}
        name="Profile"
        options={{
          headerTitle: 'My profile',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />
      <MoreSN.Screen
        component={SettingsFacilitator}
        name="SettingsFacilitator"
        options={{
          headerTitle: 'Settings',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />
      <MoreSN.Screen
        component={SettingsParent}
        name="SettingsParent"
        options={{
          headerTitle: 'Settings',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />

      <MoreSN.Screen
        component={MerchandiseParentScreen}
        name="MerchandiseParentScreen"
        options={{
          headerShown: false,
        }}
      />
      <MoreSN.Screen
        component={Details_Item}
        name="Item Details"
        initialParams={{id: null}}
        options={{
          headerShown: false,
        }}
      />

      <MoreSN.Screen
        component={Cart}
        name="Cart"
        options={{
          headerTitle: 'Cart',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
          // headerRight:()=><AntDesign name="shoppingcart" size={24} color={configs.colors.primaryColor} style={{paddingRight:10}} onPress={()=>navigation.pop()}/>,
        }}
      />

      <MoreSN.Screen
        component={PaymentScreen}
        name="Payment Screen"
        options={{
          headerTitle: 'Payment',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />

      <MoreSN.Screen
        component={OrderLists}
        name="Order Lists"
        options={{
          headerTitle: 'Order List',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />
       <MoreSN.Screen
          component={WebViewComponent}
          name="Web View Component"
          options={{
            headerTitle: '',//no title for webview
            headerTitleAlign: 'center',
            headerStyle: {
              elevation: 0, // remove shadow on Android
              shadowOpacity: 0, // remove shadow on iOS
            },
            headerLeft: () => (
              <IconButton
                icon={
                  <Ionicons
                    name="chevron-back-outline"
                    size={24}
                    color={configs.colors.primaryColor}
                  />
                }
                onPress={() => navigation.pop()}
              />
            ),
          }}
        />
       
       <MoreSN.Screen
          component={PaymentQR}
          name="merchandise payment QR"
          options={{
            headerTitle: 'Payment',
            headerTitleAlign: 'center',
            headerStyle: {
              elevation: 0, // remove shadow on Android
              shadowOpacity: 0, // remove shadow on iOS
            },
            headerLeft: () => null,
          }}
        />

        <MoreSN.Screen
          component={MerchandisePayNowQR}
          name="merchandise PayNow QR"
          options={{
            headerTitle: 'Payment',
            headerTitleAlign: 'center',
            headerStyle: {
              elevation: 0, // remove shadow on Android
              shadowOpacity: 0, // remove shadow on iOS
            },
            headerLeft: () => (
              <IconButton
                icon={
                  <Ionicons
                    name="chevron-back-outline"
                    size={24}
                    color={configs.colors.primaryColor}
                  />
                }
                onPress={() => navigation.pop()}
              />
            ),
          }}
        />
      <MoreSN.Screen
        component={PayNowQRScreen}
        name="PayNowQRScreen"
        options={{
          headerTitle:"",
          headerStyle: {
            backgroundColor:'black',
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={"white"}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />

      <MoreSN.Screen
        component={PaymentSuccess}
        name="PaymentSuccess"
        options={{
          headerShown: false,
        }}
      />    
    </MoreSN.Navigator>
  );
};

// Home Stacks

const HomeSN = createStackNavigator();

const HomeStack = ({navigation, route}) => {
  // console.log(route);
  if (route.state != undefined) {
    if (route.state.index === 0) {
      navigation.setOptions({tabBarVisible: true});
    } else {
      navigation.setOptions({tabBarVisible: false});
    }
  }
  const userInfo = utilities.getUserInfo();
  const count_of_cart_items = utilities.getCountOfCartItems();
  return (
    <HomeSN.Navigator initialRouteName="HomeScreen">
      <HomeSN.Screen
        component={HomeScreen}
        name="HomeScreen"
        options={{
          headerShown: false,
        }}
      />
      <HomeSN.Screen
        component={EventsScreen}
        name="Events"
        options={{
          headerTitle: 'Calendar',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />
      <HomeSN.Screen
        component={Profile}
        name="Profile"
        options={{
          headerTitle: 'My profile',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />
      <HomeSN.Screen
        name="NewPostHome"
        component={NewPost}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: 'Post',
          headerStyle: {elevation: 0},
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: configs.fontFamily.OPS700,
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />
      <HomeSN.Screen
        component={NotificationStack}
        name="NotificationStack"
        options={{
          headerShown: false,
        }}
      />
      <HomeSN.Screen
        component={CalendarStack}
        name="CalendarScreen"
        options={{
          headerShown: false,
        }}
      />

      <HomeSN.Screen
        component={FundraisingScreen}
        name="FundraisingScreen"
        options={{
          headerTitle: 'Fundraising event',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />
      <HomeSN.Screen
        component={VideoScreen}
        name="VideoScreen"
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
      />
      <HomeSN.Screen
        component={FullScreen}
        name="FullScreen"
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
      />
      <HomeSN.Screen
        component={DonationPayments}
        name="Donation Payments"
        options={{
          headerTitle: 'Donation',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />

      <HomeSN.Screen
        component={PayNowQRScreen}
        name="PayNowQRScreen"
        options={{
          headerTitle: 'Payment',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />

      <HomeSN.Screen
        component={WebViewComponent}
        name="Web View Component"
        options={{
          headerTitle: '',//no title for webview
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />

      <HomeSN.Screen
        component={DonationPayments}
        name="Fundraising Payment"
        options={{
          headerTitle: 'Donation',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />
    </HomeSN.Navigator>
  );
};

const NotificationSN = createStackNavigator();

const NotificationStack = () => {
  return (
    <NotificationSN.Navigator initialRouteName="Notification">
      <NotificationSN.Screen component={Notification}
        name="Notification"
        options={{
          headerShown: false,
        }} />
        <NotificationSN.Screen component={DigitalFormsDetails} name="DigitalFormsDetails" options={{
          headerShown: false,
          headerTitle: 'Digital forms',
        }}/>
    </NotificationSN.Navigator>
  )
}

// Newsfeed Stacks
const NewsfeedSN = createStackNavigator();

const NewsfeedStack = ({navigation, route}) => {
  if (route.state != undefined) {
    if (route.state.index === 0) {
      navigation.setOptions({tabBarVisible: true});
    } else {
      navigation.setOptions({tabBarVisible: false});
    }
  }
  return (
    <NewsfeedSN.Navigator initialRouteName="NewsFeed">
      <NewsfeedSN.Screen
        component={NewFeedsScreen}
        name="Newsfeed"
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
      />

      <NewsfeedSN.Screen
        name="NewPost"
        component={NewPost}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: 'Post',
          headerStyle: {elevation: 0},
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: configs.fontFamily.OPS700,
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />

      <NewsfeedSN.Screen
        component={VideoFullscreen}
        name="VideoFullscreen"
        options={{
          headerShown: false,
        }}
      />
    </NewsfeedSN.Navigator>
  );
};

// Calendar Stacks
const CalendarSN = createStackNavigator();

const CalendarStack = ({navigation, route }) => {
  if (route.state != undefined) {
    if (route.state.index === 3) {
      navigation.setOptions({tabBarVisible: false});
    } else {
      navigation.setOptions({tabBarVisible: true});
    }
  }
  const userInfo = utilities.getUserInfo();
  return (
    <CalendarSN.Navigator initialRouteName="CalendarMainScreen">
      <CalendarSN.Screen
        component={CalendarsScreen}
        name="CalendarMainScreen"
        options={{
          headerTitle: userInfo.user_type === "parent" ? 'Calendar' : "Events",
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerTitleAlign: 'center',
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />
      <CalendarSN.Screen
        component={TakeALeaveScreen}
        name="LeaveScreen"
        options={{
          headerTitle: 'Take a Leave',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.replace('CalendarScreen')}
            />
          ),
        }}
      />
      <CalendarSN.Screen
        component={FundraisingScreen}
        name="FundraisingScreen"
        options={{
          headerTitle: 'Fundraising event',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />
      <CalendarSN.Screen
        component={DonationPayments}
        name="Donation Payments"
        options={{
          headerTitle: 'Donation',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />

      <CalendarSN.Screen
        component={WebViewComponent}
        name="Web View Component"
        options={{
          headerTitle: '',//no title for webview
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />
    </CalendarSN.Navigator>
  );
};

// Comms Stacks
const CommsSN = createStackNavigator();

const CommsStack = ({navigation, route}) => {
  if (route.state != undefined) {
    if (route.state.index === 0) {
      navigation.setOptions({tabBarVisible: true});
    } else {
      navigation.setOptions({tabBarVisible: false});
    }
  }

  return (
    <CommsSN.Navigator initialRouteName="Comms">
      <CommsSN.Screen
        name="Comms"
        component={CommsScreen}
        options={{
          headerShown: false,
        }}
      />
      <CommsSN.Screen
        name="ChatRoom"
        initialParams={{receiver_info: null}}
        component={ChatRoom}
        options={{
          headerShown: false,
        }}
      />
      <CommsSN.Screen
        name="FreeUpStorage"
        initialParams={{receiver_info: null}}
        component={FreeUpStorage}
        options={{
          headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
      />
    </CommsSN.Navigator>
  );
};

const DonationSN = createStackNavigator();

const DonationStack = ({navigation, route}) => {
  if (route.state != undefined) {
    if (route.state.index === 2) {
      navigation.setOptions({tabBarVisible: false});
    } else {
      navigation.setOptions({tabBarVisible: true});
    }
  }
  return (
    <DonationSN.Navigator>
      {Platform.OS == 'android' ? (
        <DonationSN.Screen
          component={DonationScreen}
          name="Donation Screen"
          options={{
            headerShown: false,
          }}
        />
      ):(
        <DonationSN.Screen
          component={DonationWeb}
          name="Donation Web Screen"
          options={{
            headerShown: false,
          }}
        />
      )}
      <DonationSN.Screen
        component={DonationPayments}
        name="Donation Payments"
        options={{
          headerTitle: 'Donation',
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />

      <DonationSN.Screen
        component={PayNowQRScreen}
        name="PayNowQRScreen"
        options={{
          headerTitle: 'Payment',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />

      <DonationSN.Screen 
        component={DonationPaymentSuccess}
        name="DonationPaymentSuccess"
        options={{
          headerShown:false,
        }}
      />

      <DonationSN.Screen 
        component={DonationPaymentFails}
        name="DonationPaymentFail"
        options={{
          headerShown:false,
        }}
      />

      <DonationSN.Screen
        component={WebViewComponent}
        name="Web View Component"
        options={{
          headerTitle: '',//no title for webview
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (
            <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => navigation.pop()}
            />
          ),
        }}
      />
    </DonationSN.Navigator>
  );
};



const Navigator = (props) => {
  let {userInfo,roomList,maintenance_mode} = props;

  useEffect(() => {
    const maintenanceSubscriber = firestore()
    .collection('general_config')
    .onSnapshot(querySnapshot => {      
      if(querySnapshot){
        querySnapshot.forEach(documentSnapshot => {
          if(documentSnapshot.data() && documentSnapshot.data().maintenance_mode){
            
            var mode = documentSnapshot.data().maintenance_mode;
            props.saveMaintenanceMode(mode);
  
            if(mode.toString().toLowerCase() === 'on'){
              console.log('MAINTENANcE MODE: SHOW Maintenance screen here.');
              //reset('MaintenanceScreen');
            }else{
              console.log('MAINTENANcE MODE: NOT SHOW Maintenance screen here.');
              //reset('Auth');
            }
          }
          
        });
      }
    });

    return () => {
      maintenanceSubscriber();
    }
  }, []);

  return (
    maintenance_mode === 'ON' 
    ? <MaintenanceScreen/>
    :<Tab.Navigator
      initialRouteName="Home"
      
      tabBarOptions={{
        keyboardHidesTabBar: true,
        style: {height: (configs.height * 1) / 10},
        tabStyle: {
          paddingBottom: 8,
        },
        activeTintColor: configs.colors.primaryColor,
        inactiveTintColor: configs.colors.grey,
        labelStyle: {
          fontSize: 12,
          fontFamily: configs.fontFamily.OPS600,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({focused, activeTintColor}) => {
            const image = focused
              ? require('../assets/icons/ic_home_blue.png')
              : require('../assets/icons/ic_home.png');
            return <BottomTabIcon imageURL={image} focus={focused} />;
          },
        }}
      />

      <Tab.Screen
        name="Newsfeed"
        component={NewsfeedStack}
        options={{
          tabBarIcon: ({focused, activeTintColor}) => {
            const image = focused
              ? require('../assets/icons/ic_newfeeds_blue.png')
              : require('../assets/icons/ic_newfeeds.png');
            return <BottomTabIcon imageURL={image} focus={focused} />;
          },
        }}
      />

      <Tab.Screen
        name="Comms"
        component={CommsStack}
        options={{
          tabBarIcon: ({focused, activeTintColor}) => {
            const image = focused
              ? require('../assets/icons/ic_comms_blue.png')
              : require('../assets/icons/ic_comms.png');
            return <BottomTabIcon imageURL={image} focus={focused} hasUnread={hasUnreadCommsMessage(roomList)}/>;
          },
        }}
      />

      {/* {userInfo !== undefined &&
        userInfo.length !== 0 &&
        (userInfo.user_type === 'facilitator' ? (
          <Tab.Screen
            name="More"
            component={MoreStack}
            options={{
              tabBarIcon: ({focused, activeTintColor}) => {
                const image = focused
                  ? require('../assets/icons/ic_more_blue.png')
                  : require('../assets/icons/ic_more.png');
                return <BottomTabIcon imageURL={image} focus={focused} />;
              },
            }}
          />
        ) : (
          <Tab.Screen
            name="Donation"
            component={DonationStack}
            options={{
              tabBarIcon: ({focused, activeTintColor}) => {
                const image = focused
                  ? require('../assets/icons/ic_active_donation.png')
                  : require('../assets/icons/ic_inactive_donation.png');
                return <BottomTabIcon imageURL={image} focus={focused} />;
              },
            }}
          />
        ))} */}
      {userInfo !== undefined &&
        userInfo.length !== 0 &&
        (userInfo.user_type === 'facilitator' ? (
          <>
            <Tab.Screen
              name="Classes"
              component={Classes}
              options={{
                tabBarIcon: ({focused, activeTintColor}) => {
                  const image = focused
                    ? require('../assets/icons/ic_class_blue.png')
                    : require('../assets/icons/ic_class.png');
                  return <BottomTabIcon imageURL={image} focus={focused} />;
                },
              }}
            />
            <Tab.Screen
              name="More"
              component={MoreStack}
              options={{
                tabBarIcon: ({focused, activeTintColor}) => {
                  const image = focused
                    ? require('../assets/icons/ic_more_blue.png')
                    : require('../assets/icons/ic_more.png');
                  return <BottomTabIcon imageURL={image} focus={focused} />;
                },
              }}
            />
          </>
        ) : (
          <>
            <Tab.Screen
              name="Donation"
              component={DonationStack}
              options={{
                tabBarIcon: ({focused, activeTintColor}) => {
                  const image = focused
                    ? require('../assets/icons/ic_active_donation.png')
                    : require('../assets/icons/ic_inactive_donation.png');
                  return <BottomTabIcon imageURL={image} focus={focused} />;
                },
              }}
            />
            <Tab.Screen
              name="More"
              component={MoreStack}
              // component={CalendarStack}
              options={{
                tabBarIcon: ({focused, activeTintColor}) => {
                  const image = focused
                    ? require('../assets/icons/ic_more_blue.png')
                    : require('../assets/icons/ic_more.png');
                  return <BottomTabIcon imageURL={image} focus={focused} />;
                },
              }}
            />
          </>
        ))}
    </Tab.Navigator>
  );
};

const hasUnreadCommsMessage = (data = []) =>{
  
  let index = data.findIndex((d)=> d.last_message_has_read == false && d.last_message != '');
  
  return index != -1;
  //return false;
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveMaintenanceMode: (value) => dispatch(homeAction.saveMaintenanceMode(value)),
  };
};

const bindState = (state) => {
  return {
    userInfo: state.authState.userInfo,
    roomList: state.homeState.room_list,
    maintenance_mode: state.homeState.maintenance_mode,
  };
};

export default connect(bindState, mapDispatchToProps)(Navigator);