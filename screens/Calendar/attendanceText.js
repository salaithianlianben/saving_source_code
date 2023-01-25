import React from "react";
import {
  StyleSheet,
  View,
  Text,
} from "react-native";
import configs from "../../utils/configs";



const AttendanceText = (props)=>{
    return(
        <View>
            <View  style={styles.container} >        
                <Text style={{ ...styles.TextStyle, ...{ color: props.color } }}>{props.amount}</Text>
            </View>
            <View  style={styles.container} >        
                <Text style={styles.title}>{props.title}</Text>
            </View>
        </View>
        
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection:'column',
        alignSelf:'center',
        alignItems:'center'
    },
    TextStyle: {
      fontSize: 24,
      fontFamily: configs.fontFamily.OPS700,
      textAlign:'center'

    },
    title:{
      fontSize: 10,
      fontFamily: configs.fontFamily.OPS800,
      textAlign:'center'
    }
  });
export default AttendanceText;