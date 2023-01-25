import React, { Component ,createRef} from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Keyboard,
  ScrollView,
  
} from "react-native";

import { connect } from "react-redux";
import RBSheet from "react-native-raw-bottom-sheet";
import DropDownPicker from 'react-native-dropdown-picker';

import configs from '../../utils/configs';
import ButtonBlue from '../../components/buttonBlue';

import ButtonBorderBlue from '../../components/buttonBorderBlue';
import homeAction from "../../actions/homeAction";


class AbsenceAttendance extends Component {

    constructor(props) {
      super(props);
      this.state= {
        details:"",
        reason:"",
        leaveType: [],
        reasonLabel: "",
      }
    }

    handleCallbackFromLeaveType = ()=> {
      this.props.leave_types.map(leave => 
        this.state.leaveType.push({label: leave.name, value: leave.id})
      )
    }

    componentDidMount() {
       this.props.fetchLeaveType(this.handleCallbackFromLeaveType);
       this.setState({leaveType:[]})
    }
    render(){

      let {refRBSheet,change,changeLabel,onCancels, makeAttendanceAlert,handleCallbackFromMakeAttendance,date,details,reason,reasonLabel} = this.props;
      
      return(
        <View>
          
        <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        dragFromTopOnly={true}
        height={351}
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
      <ScrollView
      keyboardShouldPersistTaps='always'
      keyboardDismissMode='on-drag'
      showsVerticalScrollIndicator={false}
      style={{marginLeft:24,marginRight:24}}>

            <View style={{flexDirection:'row', alignItems:'center',marginTop:23,marginBottom:23}}>
                <Image style={{height:12,width:12}}
                source={require('../../assets/icons/ic_circle_blue.png')}
                />
                <Text style={{marginLeft:9,fontSize:16,
        fontFamily:configs.fontFamily.OPS700}}>Absence</Text>
            </View>
            <DropDownPicker
              items={this.state.leaveType}
              defaultValue={reason}
              containerStyle={{height: 44}}
              style={{
              borderWidth:1,
              borderRadius:8
              ,borderColor:configs.colors.lightgrey
              }}  
              itemStyle={{
                  justifyContent: 'flex-start',
              }}
              arrowColor = {configs.colors.primaryColor}
              onChangeItem={item => {
               
                changeLabel(item.label);
                reason = item.value;
              }}
            />
            <View  style={{borderWidth:1,borderRadius:8,borderColor:configs.colors.lightgrey,marginTop:14}}>
            <TextInput
                
                 style={{textAlignVertical: 'top', paddingHorizontal: 12}}
                 multiline={true}
                 numberOfLines={4}
                 onChangeText={(te)=>{
                   change(te)
                 
                 }}
                value={details}/>
            </View>

            <View style={{flexDirection:'row',marginTop:24,marginBottom:35}}>
                    <View style={{flex:1,marginRight:8}}>
                         <ButtonBorderBlue title='Cancel'
                             onPress={onCancels}
                         />
                    </View>
                    <View style={{flex:1,marginLeft:8}}>
                         <ButtonBlue title='Send'  onPress={() => {
                              Keyboard.dismiss();
                              let {userInfo,futureAttendanceDetail,studentInfo} = this.props;
                              console.log("studentInfo.class_id[0]", studentInfo);
                              if(reasonLabel===""){
                                alert("Reason is required.");

                              } else if(details === "") {
                                alert("Details is required.");
                              }
                              else {

                                 if(futureAttendanceDetail.length === 0  || futureAttendanceDetail===undefined || futureAttendanceDetail[0].id===undefined ){
                                    //console.log("NEW UPDATE"+userInfo.children_id[0] +" : "+ userInfo.class_id[0] +" : "+  userInfo.centre_id[0] +" : "+  reasonLabel +" : "+   details +" : "+  userInfo.id +" : "+ date )
                                    this.props.makeAttendanceAlert(studentInfo.id, studentInfo.class_id[0], studentInfo.centre_id[0], reasonLabel,  details, userInfo.id, "0",handleCallbackFromMakeAttendance,date)
                                }else{
                                    //console.log("OLD UPDATE"+ futureAttendanceDetail[0].id+" : "+reasonLabel+" : "+ details+" : "+userInfo.id+" : "+ "0",)
                                    this.props.makeAttendanceAlertUpdate( futureAttendanceDetail[0].id,reasonLabel, details, userInfo.id, "0", handleCallbackFromMakeAttendance)
                                }

                              }
                            }
                            } 
                         />
                    </View>
                </View>

        </ScrollView>
      </RBSheet>
    </View>
              );
    }

}


const styles = StyleSheet.create({
    buttonCheck: {
      flex:1,
      margin:8,
    },
    arriveContainer:{
        alignContent:'center',
        alignItems:'center',
        backgroundColor : configs.colors.orange,
        paddingBottom: 13,
        paddingTop: 13,
        height: 48
    },
    arriveContainerText:{

        flexDirection:'row',
        alignContent:'center',
        alignItems:'center',
    },
    arriveAmountText:{
        fontSize:16,
        fontFamily:configs.fontFamily.OPS700,
        color:configs.colors.white
    },
    arriveTitle:{
        fontSize:14,
        fontFamily:configs.fontFamily.OPS600,
        color:configs.colors.white
    },

    listContainer:{
        marginTop:20,
        marginBottom:20,
        marginLeft:16,
        marginRight:16
    },
    listItem:{
        flexDirection:'row',
        borderWidth:2,
        padding:10,
        borderRadius:8,
        marginBottom:10,
        borderColor:configs.colors.lightgrey               
    },
    listItemText:{
        fontSize:14,
        fontFamily:configs.fontFamily.OPS400,
        color: configs.colors.black
    },
    dateText:{
        fontSize:16,
        color:configs.colors.primaryColor,
        fontFamily:configs.fontFamily.OPS700
    }
  },
    );

  const bindState = state => {
    return {
      leave_types: state.homeState.leave_types,
      userInfo : state.authState.userInfo,
      studentInfo: state.userState.studentInfo,
      futureAttendanceDetail : state.homeState.futureAttendanceDetail,
    };
  };
  const bindDispatch = dispatch => {
    return {
      fetchLeaveType: (handleCallback) => dispatch(homeAction.fetchLeaveType(handleCallback)),
      makeAttendanceAlert: (student_id, class_id, centre_id, reason, details, parent_id, will_attend,handleCallback,date) => dispatch(homeAction.makeAttendanceAlert(student_id, class_id, centre_id, reason, details, parent_id, will_attend,handleCallback,date)),
      makeAttendanceAlertUpdate: ( id, reason, details, parent_id, will_attend, handleCallback)=> dispatch( homeAction.makeAttendanceAlertUpdate( id, reason, details, parent_id, will_attend, handleCallback)) ,

    };
  };
  
  export default connect(
    bindState,
    bindDispatch
  )(AbsenceAttendance);
  