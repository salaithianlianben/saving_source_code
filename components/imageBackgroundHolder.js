import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
} from "react-native";

import configs from '../utils/configs';


const ImageBackgroundHolder = (props)=>{
  console.log(configs.statusBarHeight);
    return(
                <View style={styles.imageContainer}>
                <ImageBackground 
                      style={styles.backgroundImage}
                      {...props}>
                    <View style={styles.titleClassContainer}>
                      <Text style={styles.titleClass}>{props.title} </Text>
                    </View>
                </ImageBackground>
                </View>
              );
    }


const styles = StyleSheet.create({
    backgroundImage: {
      height:"100%",
      width:null,
      alignSelf:'stretch',
    },
    imageContainer: {
      height:configs.heightWithStatusBar/3.5,
      width:configs.width,
      backgroundColor: configs.colors.white,
    },
    titleClass:{
        color: configs.colors.white,
        fontSize: 18,
        fontFamily:configs.fontFamily.OPS700
    },
    titleClassContainer:{
        left: 32,
        top: 50,
    }
  },
    );

export default ImageBackgroundHolder;