import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";

import configs from '../utils/configs';


const ButtonBlue = (props)=>{
    return(
    <TouchableOpacity onPress={props.onPress} style={props.styleContainer} activeOpacity={0.5}>
        <View  style={styles.container} >        
            <Text style={[styles.TextStyle,props.styleText]}>{props.title}</Text>
        </View>
    </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    container: {
      padding: 13,    
      alignContent:'center',
      alignItems:'center',
      backgroundColor: configs.colors.primaryColor,
      color: configs.colors.white,
      borderRadius: 20,
      height:48
    },
    TextStyle: {
      color: configs.colors.white,
      fontSize: 16,
      fontFamily:configs.fontFamily.OPS700,
    },
  });
export default ButtonBlue;