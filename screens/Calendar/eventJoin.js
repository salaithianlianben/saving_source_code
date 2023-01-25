import React, { Component ,createRef} from "react";
import {
  StyleSheet,
  View,
  Text,
  Linking,
  Image,
  TouchableWithoutFeedback 
} from "react-native";
import { connect } from "react-redux";
import RBSheet from "react-native-raw-bottom-sheet";

import configs from '../../utils/configs';
import ButtonBlue from '../../components/buttonBlue';

import ButtonBorderBlue from '../../components/buttonBorderBlue';
import { ScrollView } from "react-native-gesture-handler";
import moment from 'moment';
import homeAction from '../../actions/homeAction';
import utilities from '../../utils/utilities';

class EventJoin extends Component {

    constructor(props) {
      super(props);
      this.state={
        texts:"",
        reason:"",
        isLoad:""
      }
    }

    render(){
      let {refRBSheet,onCancels,eventData,onAttend,attendStatus,toSetState,isLoad, selectedEventId} = this.props;
      console.log("EVENTDATA. ",eventData);
      console.log("Selected EVENTDATA. ",selectedEventId);
      const SelectedEventData = eventData.find(f => f.event_id == selectedEventId);
      console.log("Selected EVENTDATA. ",SelectedEventData);
      return(
        <View>
 
      <RBSheet
        ref={refRBSheet}
        dragFromTopOnly={true}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={571}

        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          draggableIcon: {
            width:40,
            height:5,
            marginTop:18,
            backgroundColor: configs.colors.lightgrey          },
            container: {borderTopLeftRadius:8,borderTopEndRadius:8}

        }}
      >        
      <View style={{marginLeft:24,marginRight:24}}>
      {SelectedEventData!==undefined &&  
          <>
          <TouchableWithoutFeedback onPress={onCancels}>
            <View  style={{position:'absolute',right:0}}>
              <Image style={{width:24,height:24,resizeMode:'contain'}} 
              source={require('../../assets/icons/ic_button_cross_dark.png')}
              />
            </View>
          </TouchableWithoutFeedback>
           <View style={{flexDirection:'row', alignItems:'center',marginTop:23,marginBottom:19}}>
                <Image style={{height:12,width:12}} 
                source={require('../../assets/icons/ic_circle_blue.png')}
                />
                <Text style={{marginLeft:9,fontSize:16,
                  fontFamily:configs.fontFamily.OPS700}}>Event</Text>
            </View>
            <View  style={{overflow:'hidden',borderWidth:1,borderRadius:8,borderColor:configs.colors.lightgrey}}>
           
           <Image style={{height:166,width:'100%'}} 
            key={isLoad}
            
            source={isLoad && SelectedEventData.img!=="" && SelectedEventData.img !==undefined? {uri:SelectedEventData.img} : require('../../assets/images/Event_bg.png')}
            onError={
                (ev)=>{
                  toSetState(false);
                }
            }
            />
          
            
            <View style={{padding:16,borderTopWidth:1,borderTopColor:configs.colors.lightgrey,height:213}}>
                  <ScrollView 
                >
                 <Text  style={styles.dateText} >{/*2020 Aug 18 Fri 19:00 ~ 20:30*/}{moment(SelectedEventData.reg_to_date).format("YYYY MMM DD dddd")}</Text>
                
                  <Text style={styles.title}>{SelectedEventData.title}</Text>
              
                  <Text style={styles.description}>{SelectedEventData.description}</Text>
                </ScrollView>
            </View>
            </View>
            {SelectedEventData.reg_to_date >= moment().format("YYYY-MM-DD") &&
            <View style={{flexDirection:'row'}}>
              {SelectedEventData.register_link ==="" && 
                   <>
                   {attendStatus === "active"
                   &&
                     <View style={{marginTop:25,marginBottom:25,flex:1,marginRight:8,marginLeft:8}}>
                         <ButtonBorderBlue title='Absent'
                          onPress={()=>{ 
                           onAttend("inactive")}}
                         />
                    </View>
                   }
                   
                   {(attendStatus === "inactive" || attendStatus === "new")
                   &&
                    <View style={{marginTop:25,flex:1,marginBottom:25,marginRight:8,marginLeft:8}}>
                         <ButtonBlue title='Signup'
                          onPress={()=>{ 
                            onAttend("active")}}/>
                    </View>
                   }
                    </>
              }
               { 
                   <>
                     <View style={{marginTop:25,marginBottom:25,flex:1,marginRight:8,marginLeft:8}}>
                         <ButtonBlue title='For info / Signup'
                           onPress={ ()=>{
                             
                            if(SelectedEventData.register_link !=="") {
                            Linking.openURL(SelectedEventData.register_link)
                            } else {
                              utilities.showToastMessage(" No register link", 'danger');
                            }
                          
                          }}
                         />
                    </View>
                    
                    </>
                }
                </View>
            }
      </>}
        </View>
      </RBSheet>
    </View>
              );
    }

}


const styles = StyleSheet.create({
 
    dateText:{
        fontSize:14,
        color:configs.colors.grey,
        fontFamily:configs.fontFamily.OPS600
    },
    title:{
      fontSize:18,
      marginTop:2,
      color:configs.colors.black,
      fontFamily:configs.fontFamily.OPS600
  },
  description:{
    fontSize:14,
    marginBottom:10,
    marginTop:11,
    color:configs.colors.black,
    fontFamily:configs.fontFamily.OPS600
}
  },
    );

  const bindState = state => {
    return {
      eventData : state.homeState.eventData,
      isLoading : state.homeState.isLoading,
    };
  };
  const bindDispatch = dispatch => {
    return {

    };
  };
  
  export default connect(
    bindState,
    bindDispatch
  )(EventJoin);
  