import React, {Component} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  TouchableHighlight,
  Alert,
  StatusBar, 
  ScrollView
} from 'react-native';
import configs from '../../../utils/configs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import userAction from '../../../actions/userAction';
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';
import Loading from '../../../components/Loading';
import { Space } from '../../../components/space';


import { convertToObject } from 'typescript';
const {width} = Dimensions.get('window');


class ChangePassword extends Component {
  constructor(props) {
    super(props);
  }  
  state = {
    current_password: '',
    current_password_secure: true,
    new_password: '',
    new_password_secure: true,
    type_new_password: '',
    type_new_password_secure: true,
    modalVisible: false,
  };
 
  // componentDidMount() {
  //   console.log(this.props.password);
  // }
  handlePaymentStatus =  ( status ) =>{
    
    if(status) {

      this.setState({ modalVisible: true});
      
         
         
      setTimeout(  async  () => {

         
        await AsyncStorage.setItem(configs.constant.AS_KEY.ACTIVE_STUDENT_ID, '');
        await AsyncStorage.setItem(configs.constant.AS_KEY.UID, '');
        auth().signOut();           
                     
    }, 3000);   
     

      

   
    
    }
  }
  
 

  render() {
    return (
      <ScrollView style={styles.container}>
        <StatusBar translucent={true} backgroundColor={this.props.is_password_update_loading == true  ?'#00000020': 'white'}/>
        { 
            this.props.is_password_update_loading &&
            <Loading />
        }
        <View style={styles.formContainer}>
          
          <View style={{marginBottom: 20}}>
            <Text style={styles.title}>Current password</Text>
            <View style={styles.input}>
                  <Ionicons name="md-lock-closed-outline" size={20} style={{flex:0.1}}/>
                  <TextInput
                    autoCapitalize="none"
                    value={this.state.current_password}
                    onChangeText={(val) => this.setState({current_password: val})}
                    secureTextEntry={this.state.current_password_secure}
                    style={{
                      flex:0.8
                    }}
                  />
                  {
                    this.state.current_password_secure === true ? 
                    <TouchableOpacity onPress={()=>this.setState({
                      current_password_secure:false,
                    })} style={{paddingVertical:2,paddingHorizontal:2,borderRadius:30,flex:0.1,justifyContent:'center',alignItems:'center'}}>
                      <Ionicons name="eye" size={20} color={configs.colors.primaryColor} />
                    </TouchableOpacity>
                     : <TouchableOpacity style={{paddingVertical:2,paddingHorizontal:2,borderRadius:30,flex:0.1,justifyContent:'center',alignItems:'center'}} onPress={()=>this.setState({
                      current_password_secure:true,
                    })}>
                        <Ionicons name="eye-off" size={20} color={configs.colors.primaryColor} />
                    </TouchableOpacity>
                  }
                </View>
          </View>
          <View style={{marginBottom: 20}}>
            <Text style={styles.title}>New password</Text>
            <View style={styles.input}>
                  <Ionicons name="md-lock-closed-outline" size={20} style={{flex:0.1}}/>
                  <TextInput
                    autoCapitalize="none"
                    secureTextEntry={this.state.new_password_secure}
                    value={this.state.new_password}
                    onChangeText={(val) => this.setState({new_password: val})}
                    style={{
                      flex:0.8
                    }}
                  />
                  {
                    this.state.new_password_secure === true ? 
                    <TouchableOpacity onPress={()=>this.setState({
                      new_password_secure:false,
                    })} style={{paddingVertical:2,paddingHorizontal:2,borderRadius:30,flex:0.1,justifyContent:'center',alignItems:'center'}}>
                      <Ionicons name="eye" size={20} color={configs.colors.primaryColor} />
                    </TouchableOpacity>
                     : <TouchableOpacity style={{paddingVertical:2,paddingHorizontal:2,borderRadius:30,flex:0.1,justifyContent:'center',alignItems:'center'}} onPress={()=>this.setState({
                      new_password_secure:true,
                    })}>
                        <Ionicons name="eye-off" size={20} color={configs.colors.primaryColor} />
                    </TouchableOpacity>
                  }
                </View>
          </View>
          <View style={{marginBottom: 40}}>
            <Text style={styles.title}>Retype new password</Text>
            <View style={styles.input}>
                  <Ionicons name="md-lock-closed-outline" size={20} style={{flex:0.1}}/>
                  <TextInput
                    autoCapitalize="none"
                    secureTextEntry={this.state.type_new_password_secure}
                value={this.state.type_new_password}
                onChangeText={(val) => this.setState({type_new_password: val})}
                    style={{
                      flex:0.8
                    }}
                  />
                  {
                    this.state.type_new_password_secure === true ? 
                    <TouchableOpacity onPress={()=>this.setState({
                      type_new_password_secure:false,
                    })} style={{paddingVertical:2,paddingHorizontal:2,borderRadius:30,flex:0.1,justifyContent:'center',alignItems:'center'}}>
                      <Ionicons name="eye" size={20} color={configs.colors.primaryColor} />
                    </TouchableOpacity>
                     : <TouchableOpacity style={{paddingVertical:2,paddingHorizontal:2,borderRadius:30,flex:0.1,justifyContent:'center',alignItems:'center'}} onPress={()=>this.setState({
                      type_new_password_secure:true,
                    })}>
                        <Ionicons name="eye-off" size={20} color={configs.colors.primaryColor} />
                    </TouchableOpacity>
                  }
                </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 33}}>
              <TouchableOpacity onPress={()=>this.props.navigation.goBack()} style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 39, paddingVertical: 15, height: 48, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#4075FF'}}>
                <Text style={{ fontSize: 14, color: configs.colors.primaryColor, fontFamily: configs.fontFamily.OPS700}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
              style={{ justifyContent: 'center', alignItems: 'center',  paddingHorizontal: 10,  paddingVertical: 15,height: 48, backgroundColor: configs.colors.primaryColor, borderRadius: 20}}
              onPress={() => {  
                  //this.setState({ modalVisible: true});
                  if(this.state.current_password == '' || this.state.current_password.length == 0) {
                    Alert.alert('Errors', 'Please fill the current password.');
                  } else if (this.state.new_password == '' || this.state.new_password.length == 0) {
                    Alert.alert('Errors', 'Please fill the new password.');
                  } else if (this.state.type_new_password == '' || this.state.type_new_password == 0) {
                    Alert.alert('Errors', 'Please fill all the fields.');
                  } else if (this.state.new_password !== this.state.type_new_password) {
                    Alert.alert('Errors', 'The passwords do not match.');
                  } else if (this.state.current_password !== this.props.password) {
                    Alert.alert('Errors', 'The old password you have entered is incorrect.' );
                  } else {
                    this.props.updatePassword(this.props.email, this.state.new_password, this.handlePaymentStatus); 
                  }
                 
               }} >
                <Text style={{ fontSize: 14, color: '#fff', fontFamily: configs.fontFamily.OPS700}}>Update password</Text>
              </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'center'}}>
            <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate('ForgotPasswordScreen');
                  }}>
             <Text  style={{ textDecorationLine: 'underline', fontSize: 14, fontFamily: configs.fontFamily.OPS600, color: configs.colors.primaryColor}}>Forgot Password?</Text>  
            </TouchableOpacity>  
          </View>
    
          <View style={styles.centeredView}>
            <Modal
              hasBackdrop={true}
              backdropColor={'#000000'}
              backdropOpacity={0.5}
              transparent={true}
              statusBarTranslucent={true}
              isVisible={this.state.modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.'); //temporary behavior, retest on physical device
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Ionicons size={130} name="checkmark-circle-outline" color={configs.colors.lightgreen}/>
                  <Text style={styles.modalText}>Success</Text>

                  <Space height={5} />
                  <View style={{width:'100%',alignItems:'center',justifyContent:'center',alignSelf:'center'}}>
                    <Text>Your new password has been </Text>
                    <Text>successfully saved.</Text>
                  </View>

                  <Space height={15} />

                  <TouchableHighlight
                    style={styles.openButton}
                    onPress={() => {
                        this.setState({ modalVisible: false});
                    //   this.props.navigation.navigate('MerchandiseParentScreen');
                    }}>
                    <Text style={styles.textStyle}>Log in</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.authState.userInfo,
        password: state.authState.password,
        email: state.authState.email,
        is_password_update_loading: state.userState.is_password_update_loading,

    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        updatePassword: (email, password, handleCallback) => dispatch(userAction.updatePassword(email, password, handleCallback))     
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: configs.colors.backgroundColor,
  },
  formContainer: {
    height: configs.height - 200,
    backgroundColor: '#fff',
    width: width / 1.1,
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 15,
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: '600',
  },
  drop: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 999999,
    height: 44,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btn: {
    borderColor: '#4075FF',
    borderWidth: 1,
    width: width / 2.6,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    borderRadius: 999999,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#DADADA',
    justifyContent:'center',
    flexDirection:'column',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  openButton: {
    padding: 10,
    elevation: 2,
    width: 150,
    height: 48,
    backgroundColor: '#4075FF',
    borderRadius: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: '700',
    height: '100%',
    alignSelf: 'center',
    paddingTop: 5,
    fontSize: 14,
  },
  modalText: {
    marginVertical: 5,
    textAlign: 'center',
    fontFamily: configs.fontFamily.OPS600,
    fontSize: 18,
    color: '#000000',
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
});