import React, {Component} from 'react';

import {
  View,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
import auth from "@react-native-firebase/auth";
import { connect } from "react-redux";
import {reset} from '../navigation/rootNavigator';

import AsyncStorage from '@react-native-community/async-storage';
import configs from '../utils/configs';
import authAction from '../actions/authAction';
import userAction from '../actions/userAction';
import NetInfo from "@react-native-community/netinfo";
import { isConstructorDeclaration } from 'typescript';
import { ImageAnimatedLoader } from '../components/ImageAnimatedLoader';

class SplashScreen extends Component {

  NetInfoSubscribtion = null;

  constructor(props) {
    super(props);
    this.state = {
      isConnected: false
    }
  }

  _checkYourNetworkConnection = async () => {
    await NetInfo.fetch().then(connectionInfo => {
      console.log("Connection Type", connectionInfo.type)
      console.log("Is connected?", connectionInfo.isConnected)
      this.setState({ isConnected : connectionInfo.isConnected});
     })
    //  NetInfo.addEventListener(connectionInfo => {
    //   console.log("Changed Connection Type", connectionInfo.type)
    //   console.log("Is connected?", connectionInfo.isConnected)
    //   this.setState({ isConnected : connectionInfo.isConnected});
    //  })
  }
  componentWillUnmount(){
    this.NetInfoSubscribtion && this.NetInfoSubscribtion();
  }
  
  detectCurrentUser = async () => {

    let { saveUserToken,checkUserInfo,logout } = this.props;
    
    auth().onAuthStateChanged(function(user) {
      if (user) {
        auth()
        .currentUser.getIdTokenResult()
        .then((tokenResult) => {
          AsyncStorage.setItem(
            configs.constant.AS_KEY.TOKEN,
            tokenResxult.token
          );
          saveUserToken(tokenResult.token);
        });
      } else {
        setTimeout(() => {
          console.log('LOGOUTTTTTTT ....... success on splash screen 2');
          AsyncStorage.setItem(configs.constant.AS_KEY.UID, "");
          AsyncStorage.setItem(configs.constant.AS_KEY.TOKEN, "");
          AsyncStorage.setItem(configs.constant.AS_KEY.ACTIVE_STUDENT_ID,"");
          saveUserToken("");
          logout();
          reset('Auth');
        }, 1000);
        
      }
    });
  
    if(this.state.isConnected) {
      var user = await auth().currentUser;
      if (user) {
        const idTokenResult = await auth().currentUser.getIdTokenResult();
        AsyncStorage.setItem(configs.constant.AS_KEY.TOKEN, idTokenResult.token);
        saveUserToken(idTokenResult.token);
  
        AsyncStorage.getItem(configs.constant.AS_KEY.UID, (err, UID) => {
          if (UID != null && UID != "") {
            AsyncStorage.getItem(configs.constant.AS_KEY.TOKEN, (err, TOKEN) => {
              console.log("TOKEN", TOKEN);
              if (TOKEN != null && TOKEN != "") {
                saveUserToken(TOKEN);
                checkUserInfo(UID);
              } else {
                this.Logout();
              }
            });
          } else {
            this.Logout();
          }
        });
  
        AsyncStorage.getItem(configs.constant.AS_KEY.ACTIVE_STUDENT_ID, (err, STUDENT_ID) => {
          if (STUDENT_ID != null && STUDENT_ID != "") {
            // console.log(STUDENT_ID+ " -------------------------------------------"+this.props.userInfo.children[0])
            this.props.setStudentInfo(STUDENT_ID);
          } else {
            // console.log(this.props.userInfo.children[0].id);
            if(this.props.userInfo.user_type === "parent"){
              this.props.setStudentInfo(this.props.userInfo.children[0].id);
              AsyncStorage.setItem(configs.constant.AS_KEY.ACTIVE_STUDENT_ID,this.props.userInfo.children[0].id);
            }
            
          }
        });
  
      }     
      
    } else {
      
      Alert.alert("Network Errors","Check your internet connection!");
    }
   
    
   

  };

  Logout () {
    console.log('LOGOUTTTTTTT ....... success on splash screen');
    let {saveUserToken, logout} = this.props;
    AsyncStorage.setItem(configs.constant.AS_KEY.UID, "");
    AsyncStorage.setItem(configs.constant.AS_KEY.TOKEN, "");
    AsyncStorage.setItem(configs.constant.AS_KEY.ACTIVE_STUDENT_ID,"");
    saveUserToken("");

    logout();
    reset('Auth');
  }

  async componentDidMount() {
 
    await  this._checkYourNetworkConnection();
    this.detectCurrentUser();
    
    console.log(" Connection on splash "+ this.state.isConnected);
    
  }

   render(){
       return (
                <View style={styles.container}>

                  <ImageAnimatedLoader
                    //onLoad={this.onLoad}
                    source={require('../assets/images/ms_logo.png')}
                    style={{
                      height:200,
                      width:158,
                      resizeMode:'cover',
                    }}
                  />

                  <Text style={{color:'white',fontSize:20}}>Morning Star</Text>
                  <Text style={{color:'white',fontSize:13}}>COMMUNITY SERVICES</Text>

                </View>
        );
  }

}

const bindState = state => {
  return {
    userInfo : state.authState.userInfo,
  }
}

const bindDispatch = dispatch => {
  return {
    logout: () => dispatch(authAction.logout()),
    saveUserToken: token => dispatch(authAction.saveUserToken(token)),
    checkUserInfo: uid => dispatch(authAction.checkUserInfo(uid)),
    setStudentInfo: student_id => dispatch( userAction.setStudentInfo(student_id)),
  };
};

export default connect(
  bindState,
  bindDispatch
)(SplashScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});