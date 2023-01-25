import React, { Component } from 'react'
import RBSheet from "react-native-raw-bottom-sheet";
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity, Alert, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux';
import ReciperList from './ReciperList'
import configs from '../../utils/configs';
import homeAction from '../../actions/homeAction';
import utilities from '../../utils/utilities';
import userAction from '../../actions/userAction';

class ContactLists extends Component {

    constructor(props) {
        super(props);
        this.state = {
           
            centre_id: [],
            class_id: [],
            all: [],
            user_id: "",
            img: require('../../assets/images/Ellipse2.png'),
        }
    }
   componentDidMount() {
       console.log("Hello")

       if(this.props.userInfo.user_type === "parent") {
        let {studentInfo} = this.props;
             //   this.props.fetchStudentInfo(this.props.userInfo.children_id[0]);

             if(studentInfo!==undefined && studentInfo.length!== 0){
               
                const centre_id = studentInfo.centre_id[0];
                const class_id  = studentInfo.class_id[0];
               
                this.props.fetchContactList(centre_id,class_id,this.props.userInfo.id);
                this.props.contact_list.admin_users &&
                this.props.contact_list.admin_users.map(admin => 
                    this.state.all.push(admin)
                )
                this.props.contact_list.facilitator_users &&
                this.props.contact_list.facilitator_users.map(fac => 
                    this.state.all.push(fac)
                ) 
               
               
                console.log(this.state.all.length);
             }
               
               
       } else {
                
                 this.props.fetchContactList(this.props.userInfo.centre_id[0],this.props.userInfo.class_id[this.props.selected_class_index],this.props.userInfo.id);
                // console.log( ' class '+ this.props.userInfo.class_id[this.props.selected_class_index]+ " centre "+ this.props.userInfo.centre_id[0]);
                 this.props.contact_list.admin_users &&
                 this.props.contact_list.admin_users.map(admin => 
                    this.state.all.push(admin)
                ) 
                this.props.contact_list.facilitator_users &&
                this.props.contact_list.facilitator_users.map(fac => 
                    this.state.all.push(fac)
                ) 

                this.props.contact_list.parent_users &&
                this.props.contact_list.parent_users.map(pa =>
                    this.state.all.push(pa)    
                )
              
       }
      
   }
    render() {
        let {refRBSheet, onCancels, contact_list} = this.props;
        const ContactList_Length = this.state.all.length;
    
            
        const renderItem = ({ item, index }) => (
           <>

            {
                this.props.userInfo.user_type == "parent" ?
                item.relationship ?
                null : ContactList_Length == item[index+1] ? 
                 <ReciperList key={index} marginBottom={true} name={item.name} item={item} profileImage={item.img} close={onCancels} navigation={this.props.navigation}/> :
                 <ReciperList key={index} marginBottom={false} name={item.name} item={item} profileImage={item.img} close={onCancels} navigation={this.props.navigation}/> 
                : this.props.userInfo.id == item.id ? 
                null : ContactList_Length == item[index+1] ? 
                <ReciperList key={index} name={item.name} marginBottom={true}  item={item} profileImage={item.img}  close={onCancels} navigation={this.props.navigation}/> :
                <ReciperList key={index} marginBottom={false} name={item.name} item={item} profileImage={item.img} close={onCancels} navigation={this.props.navigation}/>
            }
           </>
        );

        return(
            <RBSheet
            ref={refRBSheet}
            closeOnDragDown={true}
            dragFromTopOnly={true}
            //closeOnPressMask={false}
           // height={this.state.bottomSheetHeight}
            openDuration={250}
            customStyles={{
                wrapper: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  },
                container: {
                height: configs.height - 200,
                paddingHorizontal: 25,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8
                },
                draggableIcon: {
                    width:40,
                    height:5,
                    marginTop:18,
                    backgroundColor: configs.colors.lightgrey 
                },
            }}
            >
                <View style={styles.ContactTitle}>
                            <View style={styles.Active}></View>
                            <Text style={{ color: '#1B1A1A', fontSize: 16, fontWeight: '700'}}>Contact</Text>
                </View>
                    {
                        this.props.contact_list_loading &&
                        <ActivityIndicator size="large" color="#00ff00" />
                    }
                
                     <TouchableWithoutFeedback style={{ flex: 1}}>
                     {
                         this.state.all && 
                         <FlatList
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={true}
                            data={this.state.all}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                     }
                         
                      </TouchableWithoutFeedback>              
                       
                        
               
                <View style={{  paddingBottom: 10,  marginTop: 17,}}>
                    <TouchableOpacity style={styles.Cancel} onPress={onCancels}>
                        <Text style={{ color: configs.colors.primaryColor, fontSize: 14, fontWeight: '700'}}>Cancel</Text>
                    </TouchableOpacity>
                            
                </View>     
            </RBSheet>
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
export default connect(bindState, bindDispatch)(ContactLists);
const styles = StyleSheet.create({
    ContactTitle: {
        flexDirection: 'row',
        marginLeft: 5,
        marginBottom: 24
    },
    Active: {
        width: 12,
        height: 12,
        borderRadius: 12,
        marginRight: 6,
        backgroundColor: configs.colors.primaryColor,
        marginTop: 5
    },
    Cancel: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        borderColor: configs.colors.primaryColor,
        borderWidth: 1
    },
    Send: {
        width: 150,
        height: 46,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: configs.colors.primaryColor,
        borderRadius: 8,
        borderWidth: 1
    },
})