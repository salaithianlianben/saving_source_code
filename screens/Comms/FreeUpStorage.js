import React, { Component } from 'react'
import { ScrollView, StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import configs from '../../utils/configs';
import homeAction from '../../actions/homeAction';
import Ionicons from 'react-native-vector-icons/Ionicons';
import userAction from '../../actions/userAction';
import CONSTANTS from '../../utils/constants';
import { Space } from '../../components/space';
import { SafeAreaView } from 'react-native-safe-area-context';

class FreeUpStorage extends Component {
  constructor(props) {
    super(props);
    this.state = {
           
    }
  }
  componentDidMount() {
      
  }
  render() {

    return(
      <SafeAreaView style={{flex: 1, backgroundColor: configs.colors.backgroundColor2}}>
        <ScrollView style={{flex: 1}}>
          <View style={{ width:configs.width, height: '100%', backgroundColor: configs.colors.backgroundColor2}}>
          <TouchableOpacity 
            activeOpacity={0.6} 
            style={{
                width: 30,
                zIndex: 100,
                alignSelf:'flex-end',
                justifyContent:'flex-end',
                alignItems: 'flex-end',
                top:10,right:16}} 
            onPress={()=>this.props.navigation.pop()}>
           <Ionicons 
              size={24} 
              color={configs.colors.primaryColor} 
              name="close-circle-outline"/>

          </TouchableOpacity>
          
            
            <View style={{padding: 24}}>

              <Text style={styles.headerTextStyle}>
              {CONSTANTS.HOW_TO_FREE_UP_TITLE}
              </Text>

              <View style={{flexDirection: 'row', marginTop: 20,}}>

                <Text style={[styles.textStyle, {flex: 1}]}>
                  {CONSTANTS.HOW_TO_FREE_UP_DESC1}
                </Text>
                <Image
                  style={{width: 149, height: 133, marginLeft: 20}}
                  source={require('../../assets/images/img_how_to_free_up.png')} 
                  resizeMode='cover'/>

              </View>
            
            </View>

            <View style={{
                backgroundColor: configs.colors.primaryColor,
                alignItems: 'center',
                paddingHorizontal: 24,
                marginHorizontal: 24,
                borderRadius: 7,
                zIndex: 100,
                }}>
              <Text style={styles.subTitleTextStyle2}>
                {CONSTANTS.PLEASE_CONDUCT_FOLLOWING_STEPS}
              </Text>
            </View>

            <View style={{backgroundColor: configs.colors.lightblue2, padding: 24, marginTop: -16}}>

              <Image 
                style={{width: 206, height: 200, alignSelf: 'center', marginTop: 16}}
                source={require('../../assets/images/img_review_and_delete_items.png')} 
                resizeMode='cover'/>
              <Text style={styles.subTitleTextStyle}>
                {CONSTANTS.REVIEW_AND_DELETE_ITEMS}
              </Text>
              <Text style={styles.textStyle2}>
                {CONSTANTS.HOW_TO_FREE_UP_DESC2}
              </Text>

            </View>

            <View style={{backgroundColor: configs.colors.backgroundColor2, padding: 24}}>

              <Image 
                style={{width: 191, height: 200, alignSelf: 'center'}}
                source={require('../../assets/images/img_review_individual_chat_history.png')} 
                resizeMode='cover'/>
              
              <Text style={styles.subTitleTextStyle}>
                {CONSTANTS.REVIEW_INDIVIDUAL_CHAT_HISTORY}
              </Text>
              <Text style={styles.textStyle2}>
                {CONSTANTS.HOW_TO_FREE_UP_DESC3}
              </Text>
              
            </View>

            <View style={{backgroundColor: configs.colors.lightblue2, padding: 24}}>

              <Image 
                style={{width: 220, height: 222, alignSelf: 'center'}}
                source={require('../../assets/images/img_delete_individual_chat_history.png')} 
                resizeMode='cover'/>
              <Text style={styles.subTitleTextStyle}>
                {CONSTANTS.DELETE_INDIVIDUAL_CHAT_HISTORY}
              </Text>
              <Text style={styles.textStyle2}>
                {CONSTANTS.HOW_TO_FREE_UP_DESC4}
              </Text>
              <Text style={styles.textStyle2}>
                {CONSTANTS.HOW_TO_FREE_UP_DESC5}
              </Text>
              
              <Space height={56}/>
            </View>

          </View>
          
        </ScrollView>
       </SafeAreaView>
    )
  }
}

const bindState = state => {
    return {
      contact_list: state.homeState.contact_list,
      contact_list_loading: state.homeState.contact_list_loading,
      userInfo : state.authState.userInfo,
      studentInfo: state.userState.studentInfo,
      selected_class_index: state.homeState.selected_class_index,
    };
  };
  const bindDispatch = dispatch => {
    return {
      fetchContactList: (centre_id, class_id, user_id) => dispatch(homeAction.fetchContactList(centre_id, class_id, user_id)),
      fetchStudentInfo: (student_id) => dispatch(userAction.setStudentInfo(student_id)),
      
    };
  };
export default connect(bindState, bindDispatch)(FreeUpStorage);
const styles = StyleSheet.create({
    headerTextStyle: {
        color: configs.colors.black, 
        fontFamily: configs.fontFamily.OPS700, 
        fontSize: 24, 
        lineHeight: 33,
    },
    subTitleTextStyle: {
        color: configs.colors.primaryColor, 
        fontFamily: configs.fontFamily.OPS700, 
        fontSize: 16, 
        lineHeight: 22,
        marginTop: 30,
    },
    subTitleTextStyle2: {
        color: configs.colors.white, 
        fontFamily: configs.fontFamily.OPS700, 
        fontSize: 16, 
        lineHeight: 22,
        paddingVertical: 5,
    },
    textStyle: {
        color: 'black', 
        fontFamily: configs.fontFamily.OPS400, 
        fontSize: 14, 
        lineHeight: 19,
    },
    textStyle2: {
        color: configs.colors.primaryColor, 
        fontFamily: configs.fontFamily.OPS400, 
        fontSize: 14, 
        lineHeight: 19,
        marginTop: 16,
    },
})