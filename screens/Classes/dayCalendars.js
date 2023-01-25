import React from "react";
import moment from "moment";
import {
    View,
    Text,
    Button,
    Image,
    TouchableWithoutFeedback
  } from "react-native";
import configs from "../../utils/configs";
import IconButton from '../../components/icon_button';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class DayCalendars extends React.Component {

  render() {
    // console.log(this.state.selectedDate);
    return (
      <View style={{ flex: 1,flexDirection:'row',}}>

        <View style={{flex:0.5,alignItems:'flex-start',alignSelf:'center'}}>
            <IconButton 
                icon={
                    <Ionicons
                        name="chevron-back-outline"
                        size={24}
                        color={configs.colors.primaryColor}
                        />
                }
                onPress={this.props.onClickPrevious}
                disabled={this.props.disableLeft}
            />
            {/* <Text>a</Text> */}
          </View>
          <View style={{flex:3,alignSelf:'center',alignItems:'center'}}>
         <Text style={{fontSize:16,fontFamily:configs.fontFamily.OPS700,color:configs.colors.primaryColor}}>
            {moment(this.props.selectedDate,"YYYY-MM-D").calendar().split(" at ")[0]} {", "}
            {moment(this.props.selectedDate,"YYYY-MM-D").format("DD MMM YYYY")}</Text>
        </View>
        <View style={{flex:0.5,alignSelf:'center',alignItems:'flex-end'}}>
            <IconButton 
                icon={
                    <Ionicons
                        name="chevron-forward-outline"
                        size={24}
                        color={configs.colors.primaryColor}
                        />
                }
                onPress={this.props.onClickNext}
                disabled={this.props.disableRight}
            />
        </View>
      </View>
    );
  }
}
