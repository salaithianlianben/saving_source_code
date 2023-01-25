import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  Text,
  Image,
  Platform,
  NativeModules,
  KeyboardAvoidingView,Keyboard
} from "react-native";

import configs from '../utils/configs';


const ButtonBorderBlue = (props)=>{
    return(
    <TouchableOpacity {...props}  activeOpacity={0.5}>
        <View  style={styles.container} >        
            <Text style={styles.TextStyle}>{props.title}</Text>
        </View>
    </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    container: {
      padding: 13,    
      alignItems: 'center',
      alignContent:'center',
      backgroundColor: configs.colors.white,
      color: configs.colors.primaryColor,
      borderColor: configs.colors.primaryColor,
      borderWidth: 1,
      borderRadius: 20,
      height:48
    },
    TextStyle: {
      color: configs.colors.primaryColor,
      fontSize: 14,
      fontFamily:configs.fontFamily.OPS700,
    },
  });
export default ButtonBorderBlue;