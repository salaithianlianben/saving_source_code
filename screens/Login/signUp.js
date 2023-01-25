import React, { Component ,useRef} from "react";
import {Text,View,TextInput,ScrollView,StyleSheet, Image} from 'react-native';
import { connect } from "react-redux";
import configs from "../../utils/configs";
import ButtonBlue from '../../components/buttonBlue';
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isShowModal: false,
          isSelectedPD: false,
          isSelectedPP: false,
        };
  
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

                <View style={{marginLeft:32,marginRight:31,marginBottom:53}}>
                    <Text style={{fontFamily: configs.fontFamily.OPS600,fontSize:36}}>
                        Signup
                    </Text>
                    <View style={styles.inputView}>
                    <Text style={styles.inputTitle}>Email</Text>
                    <TextInput style={styles.input} keyboardType='email-address'/>
                    </View>
                    
                    <View style={styles.inputView}>
                    <Text style={styles.inputTitle}>Password</Text>
                    <TextInput secureTextEntry={true} style={styles.input}/>
                    </View>

                    <View style={styles.inputView}>
                    <Text style={styles.inputTitle}>Confirm Password</Text>
                    <TextInput secureTextEntry={true} style={styles.input}/>
                    </View>

                    <View style={{marginTop:32,borderWidth:1,borderColor:configs.colors.primaryColor,borderRadius:20,paddingTop:17,paddingBottom:11,paddingLeft:20,paddingRight:20}}>
                   
                    <View style={styles.checkboxContainer}>

                    <TouchableWithoutFeedback  onPress={()=>{
                        this.setState({isSelectedPD: !this.state.isSelectedPD})}}>
                    <View style={[styles.checkbox,{backgroundColor:this.state.isSelectedPD === false?'white':configs.colors.primaryColor}]}>
                        <Ionicons name="checkmark-sharp" size={20} color='white'/>
                    </View>

                    </TouchableWithoutFeedback>
                    <Text style={styles.label}>PDPA Consent</Text>
                    </View>
                    <View style={[styles.checkboxContainer,{marginTop:5}]}>
                            
                    <TouchableWithoutFeedback  onPress={()=>{
                        this.setState({isSelectedPP: !this.state.isSelectedPP})}}>
                    <View style={[styles.checkbox,{backgroundColor:this.state.isSelectedPP === false?'white':configs.colors.primaryColor}]}>
                        <Ionicons name="checkmark-sharp" size={20} color='white'/>
                    </View>
                    </TouchableWithoutFeedback>
                    <Text style={styles.label}>Privacy and Policy</Text>
                     </View>
                    </View>

                    <View style={styles.inputView}>
                    <ButtonBlue title='Signup'/>
                    </View>
                </View>
                </ScrollView>
              </View>
        )
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
        paddingHorizontal: 15,
        paddingVertical: 11
                
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

export default connect(
    null,
    null
  )(SignUp);