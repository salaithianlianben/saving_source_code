import React, { Component ,useRef} from "react";
import {Text,View,TextInput,ScrollView,StyleSheet, Image, ToastAndroid, TouchableOpacity, } from 'react-native';
import { connect } from "react-redux";
import configs from "../../utils/configs";
import ButtonBlue from '../../components/buttonBlue';
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import authAction from "../../actions/authAction";
import Toast from 'react-native-simple-toast';
import Loading from '../../components/Loading';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            new_password:'',
            existing_password:'',
            confirm_password:'',
            new_password_secure:true,
            existing_password_secure:true,
            confirm_password_secure:true,
        };
  
      }

  
      render(){
        return(
            <View style={{flex:1,backgroundColor:configs.colors.loginColor}}>
                {
                    this.props.is_changing_password && <Loading/> 
                }
                <View style={{paddingLeft:35,paddingTop:configs.height/13,paddingBottom:21}}>
                    <TouchableWithoutFeedback onPress={()=>{this.props.navigation.goBack()}}>
                    <Image style={{height:16,width:8,resizeMode:'stretch' }}source={require('../../assets/icons/ic_arrow_left_blue_thick.png')}/>
                    </TouchableWithoutFeedback>
                </View>
                <ScrollView style={{ flex: 1}}>

                <View style={{marginLeft:32,marginRight:31,marginBottom:53}}>
                    <Text style={{fontFamily: configs.fontFamily.OPS600,fontSize:36}}>
                        Change Password
                    </Text>
                    <View style={styles.inputView}>
                    <Text style={styles.inputTitle}>Existing Password</Text>
                    <View style={[styles.input]}>
                        <TextInput secureTextEntry={this.state.existing_password_secure} style={{marginRight:20,}} onChangeText={(value)=>this.setState({
                            existing_password:value,
                        })}/>
                        <TouchableOpacity style={{
                            alignItems:'center',
                            justifyContent:'center',
                            paddingHorizontal:5,
                            paddingVertical:3,
                            borderRadius:30,
                            position:'absolute',
                            right:4,
                            marginVertical:10,
                            // backgroundColor:'red'
                        }}
                            onPress={()=>{
                                const existing_password_secure = this.state.existing_password_secure;
                                this.setState({
                                    existing_password_secure: !existing_password_secure,
                                })
                            }}
                        >
                            <Ionicons name={this.state.existing_password_secure == false ? "eye-off":"eye"} size={20} color={configs.colors.primaryColor} />
                        </TouchableOpacity>
                    </View>
                    </View>
                    
                    <View style={styles.inputView}>
                    <Text style={styles.inputTitle}>New Password</Text>
                    <View style={[styles.input]}>
                        <TextInput secureTextEntry={this.state.new_password_secure} style={{marginRight:20,}} onChangeText={(value)=>this.setState({
                            new_password:value,
                        })}/>
                        <TouchableOpacity style={{
                            alignItems:'center',
                            justifyContent:'center',
                            paddingHorizontal:5,
                            paddingVertical:3,
                            borderRadius:30,
                            position:'absolute',
                            right:4,
                            marginVertical:10,
                            // backgroundColor:'red'
                        }}
                            onPress={()=>{
                                const new_password_secure = this.state.new_password_secure;
                                this.setState({
                                    new_password_secure: !new_password_secure,
                                })
                            }}
                        >
                            <Ionicons name={this.state.new_password_secure == false ? "eye-off":"eye"} size={20} color={configs.colors.primaryColor} />
                        </TouchableOpacity>
                    </View>
                    </View>

                    <View style={styles.inputView}>
                    <Text style={styles.inputTitle}>Confirm Password</Text>
                    <View style={[styles.input]}>
                        <TextInput secureTextEntry={this.state.confirm_password_secure} style={{marginRight:20,}} onChangeText={(value)=>this.setState({
                            confirm_password:value,
                        })}/>
                        <TouchableOpacity style={{
                            alignItems:'center',
                            justifyContent:'center',
                            paddingHorizontal:5,
                            paddingVertical:3,
                            borderRadius:30,
                            marginVertical:10,
                            position:'absolute',
                            right:4,
                            // backgroundColor:'red'
                        }}
                            onPress={()=>{
                                const confirm_password_secure = this.state.confirm_password_secure;
                                this.setState({
                                    confirm_password_secure: !confirm_password_secure,
                                })
                            }}
                        >
                            <Ionicons name={this.state.confirm_password_secure == false ? "eye-off":"eye"} size={20} color={configs.colors.primaryColor} />
                        </TouchableOpacity>
                    </View>
                    </View>
 
                    <View style={styles.inputView}>
                    <ButtonBlue title='Change Password' onPress={()=>this._changePassword()}/>
                    </View>
                </View>
                </ScrollView>
              </View>
        )
    }

    _changePassword = () =>{
        const { email ,userInfo} = this.props;
        const { new_password,existing_password,confirm_password } = this.state;
        const old_password = this.props.password;
        console.log(old_password);
        console.log(existing_password);
        if(old_password === existing_password){
            if(new_password === confirm_password){
                // Toast.show("Successful");
                this.props.onChangePassword(email,new_password,userInfo);
            }else{
                Toast.show("New password and confirm password didn't match! ");
            }
        }else{
            Toast.show("Existing password is not correct! ");
        }

        // this.props.onChangePassword(email,new_password,userInfo);
    }


}
const  styles = StyleSheet.create({
    backgroundImage: {
        position:'absolute',
        top:0,
        left:0,
        width: configs.width, 
        height: configs.height,
        resizeMode:'cover',
        backgroundColor: configs.colors.loginColor
    },
    input:{
        backgroundColor:configs.colors.white,
        borderRadius: 20,
        marginTop:8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1, 
        height:48,
        paddingHorizontal: 15,
        justifyContent: 'center'
    },
    inputTitle:{
        fontFamily:configs.fontFamily.OPS700,
        fontSize:16
    },
    inputView:{
        marginTop:35
    },
    bottomText:{
        fontFamily:configs.fontFamily.OPS600,
        textDecorationLine:'underline',
        fontSize:14
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems:'center'
      },
      checkbox: {
        alignItems:"center",
        alignSelf: "center",
        height:24,
        width:24,
        borderRadius:8,
        borderWidth:1,
        marginRight:9,
        borderColor:configs.colors.primaryColor
      },
      label: {
        textDecorationLine:'underline',
        color:configs.colors.primaryColor,
        fontFamily:configs.fontFamily.OPS600,
        fontSize:14
       },
       
    
  });

  const mapStateToProps = state => {
      return {
          password : state.authState.password,
          userInfo: state.authState.userInfo,
          email: state.authState.email,
          is_changing_password: state.authState.is_changing_password,
      }
  }
  const mapDispatchToProps = dispatch => {
      return {
        onChangePassword: (email,password,userInfo) => dispatch( authAction.onChangePassword(email,password,userInfo))
      }
  }

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChangePassword);