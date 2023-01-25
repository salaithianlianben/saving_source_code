import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";

import configs from '../utils/configs';


const ButtonBlue = (props)=>{
    return(
    <TouchableOpacity  activeOpacity={0.5} onPress={props.onPress}>
        <View  style={styles.container} >        
            <View style={styles.buttonContainer} >
        <Image
          {...props}
          style={styles.ImageIconStyle}
        />
        <Text style={styles.TextStyle}>{props.title}</Text>
        </View>

        </View>
    </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    container: {
      padding: 14,    
      alignItems: 'center',
      alignContent:'center',
      backgroundColor: configs.colors.primaryColor,
      color: configs.colors.white,
      borderColor: configs.colors.primaryColor,
      borderWidth: 1,
      borderRadius: 8,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    TextStyle: {
      color: configs.colors.white,
      fontSize: 14,
      fontWeight: '700',
      marginLeft : 8
    },
    ImageIconStyle: {
      width: 18,
      height: 18,
      resizeMode: 'stretch',

    },
  });
export default ButtonBlue;