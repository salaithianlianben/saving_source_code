import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import configs from '../utils/configs';
import ImageLoad from './ImageLoad';

const getTimeFormat =( time ) => {
  var tempArray = time.split(" ");
  var data = tempArray[tempArray.length - 1].split(":");
  var hours = parseInt(data[0]);
  var min = data[1];
  // var sec = data[2];
  var output = "";
  if(hours < 12){
    if(hours < 10)
      output = "0"+hours;
    else output  = hours;

    let minute = parseInt(min);
    if(minute < 10){
      output += ":0"+minute+" AM";
    }else{
      output += ":"+minute+" AM";
    }
  }else{
    if( hours === 12){
      output = hours +":"+min+" PM";
    }else{
      let h = hours - 12;
      if(h < 10){
        output = "0"+h;
      }else{
        output = h;
      }
      let mm = parseInt(min);
      if(mm < 10){
        output += ":0"+mm+" PM";
      }else{
        output += ":"+mm+" PM";
      }
    }
  }
  return output;
}

const HomeActivity = ({data,color}) => {
  //console.log(data);
  return (
    <View style={styles.container}>
      <View style={[styles.leftContainer,{backgroundColor:color != undefined || color != "" ? color : "#000000"}]}>
        
        {
          data.icon_img ?
          data.icon_img != "" || data.icon_img != null ?
          <ImageLoad
            style={{height: 21, width: 21,}}
            loadingStyle={{ size: "small", color: "white" }}
            placeholderStyle={{
              height: 21, width: 21,
            }}
            resizeMode="contain"
            source={{ uri:data.icon_img, cache: 'force-cache' }}
            placeholderSource={require("../assets/images/placeholder_image.png")}
            imageStyle={{tintColor: 'rgba(255,255,255,1)'}}
          /> 
          : <Image
              source={require("../assets/images/placeholder_image.png")}
              style={{height: 21, width: 21,resizeMode:"contain"}}
              /> 
          : <Image
              source={require("../assets/images/placeholder_image.png")}
              style={{height: 21, width: 21,resizeMode:"contain"}}
              /> 
        }
      </View>
      <View style={[
        {
          flex: 1,
          alignSelf:'center',
          paddingLeft:10,
          marginRight: 8,
        }
      ]}>
        <Text style={{fontSize:14, fontWeight:"600"}} numberOfLines={1}>{data.title}</Text>
      </View>

      {data.extra_ts !== undefined && data.extra_val !== undefined && data.extra_val !== "" && data.extra_val !== null ?
        <View style={{ 
          marginRight: 7, paddingVertical:2,paddingHorizontal:5,backgroundColor:'#E9F0FD',borderRadius:5,alignSelf:'center',
        }}>
          <Text style={{color:configs.colors.primaryColor,fontSize:12,fontWeight:'bold'}}>{data.extra_val}</Text>
        </View> : null }

      {data.extra_ts !== undefined && data.extra_val !== undefined && data.extra_ts !== "" && data.extra_ts !== "Pending"?
        <View style={{alignSelf:'center', paddingRight:15}}>
          <Text style={{fontSize:12, color: configs.colors.grey}}>{data.extra_ts}</Text>
        </View>
      : data.extra_ts !== undefined && data.extra_val !== undefined && data.extra_ts !== "" && data.extra_ts === "Pending"?
        <View style={{
          alignSelf:'center',marginRight:15,paddingVertical:3, paddingHorizontal:5, backgroundColor: configs.colors.grey, borderRadius: 8
        }}>
          <Text style={{fontSize:12, color: '#ffffff'}}>{data.extra_ts}</Text>
        </View>
      : <View style={[{
          alignSelf:'center',
          alignItems:'flex-end',
          paddingRight:15,
        }]}>
          <Text style={{fontSize:12, color:configs.colors.grey}}>
            {getTimeFormat(data.from_time)}</Text>
        </View>
      }
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderColor: 'white',
    // borderRadius: 8,
    borderTopLeftRadius:8,
    borderBottomLeftRadius:8,
    borderBottomRightRadius:15,
    borderTopRightRadius:15,
    height: 48,
    borderWidth: 1,
    backgroundColor:'white',
  },
  centerContainer:{
      flex:4,
      alignSelf:'center',
      paddingLeft:10,
  },
  leftContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal:15,
    height:'100%',
    borderTopLeftRadius:8,
    borderBottomLeftRadius:8,
  },
  rightContainer:{
      flex:2,
      alignSelf:'center',
      alignItems:'flex-end',
      paddingRight:15,
  }
});

export default HomeActivity;