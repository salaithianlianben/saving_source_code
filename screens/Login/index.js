import React, {Component, useRef} from 'react';
import {
  Text,
  StatusBar,
  View,
  TextInput,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import configs from '../../utils/configs';
import ButtonBlue from '../../components/buttonBlue';
import authAction from '../../actions/authAction';
import Loading from '../../components/Loading';
import userAction from '../../actions/userAction';
import homeAction from '../../actions/homeAction';
import NetInfo from '@react-native-community/netinfo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

class Login extends Component {
  NetInfoSubscribtion = null;

  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
      email: '',
      password: '',
      isInitializing: false,
      isConnected: false,
      is_secret_password:true,
    };
  }
  validate = async () => {
    let email = this.state.email.trim();
    let password = this.state.password;

    if (email === '' && password === '') {
      Alert.alert('Errors ', 'Email and Password are required.');
    } else if (email === '') {
      Alert.alert('Errors ', 'Email is required.');
    } else if (password === '') {
      Alert.alert('Errors ', 'Password is required.');
    } else {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(email) === false) {
        Alert.alert('Invalid Email ', 'Please enter valid email.');
      } else {
        let {login} = this.props;
        var isConnected = this._checkYourNetworkConnection();
        await AsyncStorage.getItem("is_change_password").then((d)=>{
          if(d !== undefined && d!== "0" && d === "1"){
            if (isConnected) {
                this.props.checkUser(email, password,true);
            } else {
              Alert.alert('Network Errors', 'Check your internet connection!');
            }
          }else{
            if (isConnected) {
              this.props.checkUser(email, password,false);
            } else {
              Alert.alert('Network Errors', 'Check your internet connection!');
            }
          }
        });
        
      }
    }
  };

  _checkYourNetworkConnection = async () => {
    var isConnected = false;
    this.NetInfoSubscribtion = await NetInfo.addEventListener((state) => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      isConnected = state.isConnected;
    });
    return isConnected;
  };

  componentWillUnmount() {
    this.NetInfoSubscribtion && this.NetInfoSubscribtion();
  }

  render() {
    // console.log(this.props.is_loading);
    return (
      <View style={{flex: 1, backgroundColor: configs.colors.loginColor}}>
        {this.props.is_loading_user || (this.props.is_loading && <Loading />)}
        <StatusBar
          translucent={true}
          backgroundColor={ 'transparent' }
          barStyle="dark-content"
        />
        <ImageBackground
          source={require('../../assets/images/login_bg.png')}
          style={styles.backgroundImage}></ImageBackground>

        <ScrollView>
          <View style={{
            width: configs.width,
            height: configs.height,
            flexDirection: 'column',
          }}>
          <View
              style={{paddingLeft: 35, paddingTop: configs.height / 13}}>
            <Image
              style={{height: 45, width: 138,resizeMode:'contain'}}
              source={require('../../assets/images/logo.png')}
            />
            </View>

          <View
            style={{
              flex: 1,
              marginLeft: 32,
              marginRight: 31,
              marginBottom: 13,
              justifyContent: 'center',
            }}>
            
            <View style={{marginTop: -150}}>
              <Text style={{fontFamily: configs.fontFamily.OPS600, fontSize: 36,color:configs.colors.primaryColor}}>
                Login
              </Text>
            </View>
            <View style={styles.inputView}>
                <Text style={styles.inputTitle}>Email</Text>
                <View style={styles.input}>
                  <Ionicons name="person-outline" size={20} style={{flex:0.1}}/>
                  <TextInput
                    autoCapitalize="none"
                    value={this.state.email}
                    onChangeText={(text) => {
                      this.setState({email: text});
                    }}
                    style={{
                      flex:0.9
                    }}
                  />
                </View>
              </View>
              <View style={styles.inputView}>
                <Text style={styles.inputTitle}>Password</Text>
                <View style={styles.input}>
                  <Ionicons name="md-lock-closed-outline" size={20} style={{flex:0.1}}/>
                  <TextInput
                    autoCapitalize="none"
                    value={this.state.password}
                    onChangeText={(text) => {
                      this.setState({password: text});
                    }}
                    secureTextEntry={this.state.is_secret_password}
                    style={{
                      flex:0.8
                    }}
                  />
                  {
                    this.state.is_secret_password === true ? 
                    <TouchableOpacity onPress={()=>this.setState({
                      is_secret_password:false,
                    })} style={{paddingVertical:2,paddingHorizontal:2,borderRadius:30,flex:0.1,justifyContent:'center',alignItems:'center'}}>
                      <Ionicons name="eye" size={20} color={configs.colors.primaryColor} />
                    </TouchableOpacity>
                     : <TouchableOpacity style={{paddingVertical:2,paddingHorizontal:2,borderRadius:30,flex:0.1,justifyContent:'center',alignItems:'center'}} onPress={()=>this.setState({
                      is_secret_password:true,
                    })}>
                        <Ionicons name="eye-off" size={20} color={configs.colors.primaryColor} />
                    </TouchableOpacity>
                  }
                </View>

              </View>
              <View style={styles.inputView}>
                <ButtonBlue
                  onPress={() => {
                    this.validate();
                  }}
                  title="Login"
                />
              </View>


            {/* <View
              style={{
                flex:1,
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}>
              <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                
                <Text
                  style={styles.bottomText}
                  onPress={() => {
                    this.props.navigation.navigate('ForgotPasswordScreen');
                  }}>
                 Forgot password?
                </Text>
              </View>
            </View> */}
                <Text
                  style={styles.bottomText}
                  onPress={() => {
                    this.props.navigation.navigate('ForgotPasswordScreen');
                  }}>
                 Forgot password?
                </Text>
          </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: configs.width,
    height: configs.heightWithStatusBar,
    flex: 1,
    resizeMode: 'cover',
    zIndex: -1,
    backgroundColor: configs.colors.loginColor,
  },
  input: {
    flexDirection:'row',
    backgroundColor: configs.colors.white,
    borderRadius: 20,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    height: 48,
    alignItems:'center',
    paddingHorizontal: 13,
  },
  inputTitle: {
    fontFamily: configs.fontFamily.OPS700,
    fontSize: 16,
  },
  inputView: {
    marginTop: 35,
  },
  bottomText: {
    fontFamily: configs.fontFamily.OPS600,
    textDecorationLine: 'underline',
    fontSize: 14,
    color:configs.colors.primaryColor,
    position:'absolute',
    bottom:50,
    // left:3,
  },
});
const bindState = (state) => {
  return {
    is_loading: state.authState.is_loading,
    isLoading: state.authState.isLoading,
    userInfo: state.authState.userInfo,
    is_change_password: state.authState.is_change_password,
    studentInfo: state.userState.studentInfo,
    is_loading_user: state.userState.is_loading_user,
    message: state.userState.message,
    should_login: state.userState.should_login,
    is_success: state.userState.is_success,
  };
};

const bindDispatch = (dispatch) => {
  return {
    login: (email, password) => dispatch(authAction.login(email, password)),
    setStudentInfo: (student_id) =>
      dispatch(userAction.setStudentInfo(student_id)),
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
    checkUser: (email, password,is_change_password) =>
      dispatch(userAction.checkUser(email, password,is_change_password)),
  };
};

export default connect(bindState, bindDispatch)(Login);
