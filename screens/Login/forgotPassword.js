import React, { Component ,useRef} from "react";
import {Text,View,TextInput,StyleSheet,ScrollView, Image,Alert,} from 'react-native';
import { connect } from "react-redux";
import configs from "../../utils/configs";
import ButtonBlue from '../../components/buttonBlue';
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import authAction from "../../actions/authAction";

import Ionicons from 'react-native-vector-icons/Ionicons';
class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
          email:'',
        };
  
      }

      _forgotPassword = ()=>{
        //   console.log(this.state.email);
        const { email } = this.state;
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) === false) {
            Alert.alert("Invalid Email ","Please enter valid email.");
            
        }else{
            this.props.onUserForgotpassword(email);
            this.setState({
                email:'',
            })
        }
      }
  
      render(){
        return(
            <View style={{flex:1,backgroundColor:configs.colors.loginColor}}>
                
                <View style={{paddingLeft:35,paddingTop:configs.height/13,paddingBottom:21}}>
                    <TouchableWithoutFeedback onPress={()=>{this.props.navigation.goBack()}}>
                    <Image style={{height:16,width:8,resizeMode:'stretch' }}source={require('../../assets/icons/ic_arrow_left_blue_thick.png')}/>
                    </TouchableWithoutFeedback>
                </View>
                <ScrollView style={{ flex: 1}}>

                <View style={{marginLeft:32,marginRight:31,marginTop:10,height:configs.height * 0.9,}}>
                    {/* <Text style={{fontFamily: configs.fontFamily.OPS600,fontSize:36}}>
                        Forgot{'\n'}password
                    </Text> */}

                    <Image source={require("../../assets/images/forgot_password.png")}  style={{
                        height:configs.width * 0.3,width:configs.width * 0.3,resizeMode:'contain',alignSelf:'center'
                    }}/>
                    <View style={{height:25}}/>
                    <Text style={{fontFamily: configs.fontFamily.OPS600,fontSize:24,color:configs.colors.primaryColor,alignSelf:'center'}}>
                        Forgot password
                    </Text>
                    <View style={{height:20}}/>
                    <Text style={{fontFamily: configs.fontFamily.OPS600,fontSize:14,alignSelf:'center',marginHorizontal:10,}}>Please enter your email address below. You will receive a link to reset your password.</Text>

                    <View style={styles.inputView}>
                        <Text style={styles.inputTitle}>Email</Text>
                        <View style={styles.input}>
                            <Ionicons name="mail-outline" size={20} style={{flex:0.1}}/>
                            <TextInput 
                                style={{flex:0.9}}
                                value={this.state.email}
                                keyboardType='email-address'
                                onChangeText={(value)=>this.setState({
                                    email:value
                                })}
                            />
                        </View>
                    </View>
                    
                    <View style={styles.inputView}>
                    <ButtonBlue title='Submit' onPress={()=>this._forgotPassword()}/>
                    </View>
                </View>
                </ScrollView>
              </View>
        )
    }


}
const styles = StyleSheet.create({
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
        flexDirection:'row',
        height:48,
        alignItems:'center',
        paddingHorizontal:10,
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
        alignSelf: "center",
      },
      label: {
        textDecorationLine:'underline',
        color:configs.colors.primaryColor,
        fontFamily:configs.fontFamily.OPS600,
        fontSize:14
       },
    
  });

  const blindDispatch = dispatch => {
      return {
        onUserForgotpassword: (email)=> dispatch(authAction.onUserForgotpassword(email)),
      }
  }

export default connect(
    null,
    blindDispatch
  )(ForgotPassword);