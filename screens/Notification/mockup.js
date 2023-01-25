// import React, {Component} from 'react';
// import {
//   SafeAreaView,
//   Text,
//   View,
//   ScrollView,
//   FlatList,
//   StatusBar,
//   TouchableOpacity,
//   StyleSheet,
//   RefreshControl
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Feather from 'react-native-vector-icons/Feather';
// import configs from '../../utils/configs';
// import {Space} from '../../components/space';
// import RBSheet from 'react-native-raw-bottom-sheet';
// import Clipboard from '@react-native-community/clipboard';
// import Toast from 'react-native-simple-toast';
// import homeAction from '../../actions/homeAction';
// import { connect } from "react-redux";
// import Loading from '../../components/Loading';
// import moment from 'moment';
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
// import {getLauguageNameShort} from '../../screens/More/Settings/popSwitchLanguage';

// const Header = ({navigation, setAllReadNotification}) => {
//   return (
//     <View style={styles.headerContainer}>
//       <TouchableOpacity
//         style={{flex: 0.2, paddingLeft: 8}}
//         onPress={() => navigation.goBack()}>
//         <Ionicons
//           name="chevron-back"
//           color={configs.colors.primaryColor}
//           size={24}
//         />
//       </TouchableOpacity>
//       <View style={{flex: 0.6, alignSelf: 'center', alignItems: 'center'}}>
//         <Text style={{fontSize: 18, fontWeight: '700'}}>Notification</Text>
//       </View>
//       <TouchableOpacity
//         style={{flex: 0.2, marginRight: 5}}
//         onPress={setAllReadNotification}>
//         <Text
//           style={{
//             color: configs.colors.primaryColor,
//             fontSize: 18,
//             fontWeight: '700',
//           }}>
//           All read
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

//  class Notification extends Component {
//   state = {
//     data: [],
//     selectedItem : "",
//     isFetching: false,
//     isLoadMore: false
//   };

//   _copyMessage = () => {
//     let getTextNoti = this.props.notifications.find(data => data.id === this.state.selectedItem).message;
//     getTextNoti === undefined ? "" : getTextNoti;
//     Clipboard.setString(getTextNoti);
//     this.RBSheet.close();
//     Toast.show("Copied successfully");
//   }

//   _translateMessage = () =>{
//     let {userSetting} = this.props;
//     let selected = this.state.selectedItem;
//     let selectedMessage = this.props.notifications.find(data=>data.id === selected).message;
//     let target = userSetting!==undefined? getLauguageNameShort(userSetting.preferred_language) :"";
//     this.props.getTranslate(selected,target,selectedMessage,this._translateMessageUpdate) 
//     this.RBSheet.close();
//   }

//   _translateMessageUpdate = (id,data,isTranslate) =>{
//     if(isTranslate){
//       if(data.translations !== undefined && data.translations !== null && data.translations.length !== 0){
//         this.props.setTranslate(id,data.translations[0].translatedText);
//       }
//     }else{
//       alert("Unable to translate.");
//     }
//   }

//   _setReadNotification = (isAll,selectedId) => {
//       let {readNotification,userInfo,notifications} = this.props;
//       let notification_id = [];
//       if(isAll){
//         let getAllNotUpdate = notifications.filter(data => data.has_read === false);
//         for (let itemData of getAllNotUpdate) {
//           notification_id.push(itemData.id);  
//         }
//        readNotification(notification_id,userInfo.id,userInfo.user_type);
//       }else{
//         notification_id.push(selectedId);
//         readNotification(notification_id,userInfo.id,userInfo.user_type);
//       }


//   };

//   _formatDate = (text) =>{
//     const receiveDate = moment(text, "YYYY MMM DD hh:mm:ss").format("YYYY-MM-DD");
//     const currentDate = moment().format("YYYY-MM-DD");

//     if(currentDate === receiveDate){
//       return moment(receiveDate).format('hh:mm');
//     }
//     else{
//       return moment(receiveDate).format('DD/MM');
//     }
//   }
//   _onOpenNotification = (id,has_read) =>{
//     let {notifications} = this.props;
//     let selectedNoti = notifications.find(data => data.id === id);

//     if(!has_read){
//     this._setReadNotification(false,id);
//   }
//     // to detect which type navigate (to do)
//     if(selectedNoti !== undefined && selectedNoti !== null){
//         if(selectedNoti.ref_type === 'donation')
//         {
//             console.log('GO TO DONATION : ID ',selectedNoti.ref_id);
//         }else if(selectedNoti.ref_type === 'form'){
//           console.log('GO TO FORM : ID ',selectedNoti.ref_id);
//         }

//     }
//   }

//   onRefresh =  () =>{
//     let {fetchAllNotification,userInfo,notifications,isLoadingNoti,notificationNext} = this.props;

//     this.setState({isFetching: true});
//     fetchAllNotification(userInfo.id,userInfo.user_type,10,"",false,this.handleCallbackFirst);

//   }
  
//   handleCallbackFirst = () =>{

//     this.setState({isFetching: false});

//   }


//   onLoadMore = () =>{
//     let {fetchAllNotification,userInfo,notifications,isLoadingNoti,notificationNext} = this.props;

//     if(notificationNext !== undefined && notificationNext !== "" && notificationNext !== null){
//       this.setState({isLoadMore : true});

//       fetchAllNotification(userInfo.id,userInfo.user_type,10,notificationNext,true,this.handleCallbackLoad);
//     }
//   }
 
//   handleCallbackLoad = () =>{

//     this.setState({isLoadMore : false});

//   }
  
//   componentDidMount(){
//     let {fetchAllNotification,userInfo,notifications,isLoadingNoti,notificationNext} = this.props;

//     fetchAllNotification(userInfo.id,userInfo.user_type,10,"",false,this.handleCallbackFirst);
//   }

//   render() {

//     let {notifications,isLoadingNoti,isReadNotification} = this.props;

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar backgroundColor={'white'} translucent={false} />
//             <Header
//             navigation={this.props.navigation}
//             setAllReadNotification={()=> this._setReadNotification(true)}
//             />
//             <ScrollView 
//                refreshControl={ 
//                 <RefreshControl 
//                 refreshing={this.state.isFetching} 
//                 onRefresh={this.onRefresh} 
//                 /> }
//                   onScrollEndDrag = {this.onLoadMore.bind(this)}
//                  showsVerticalScrollIndicator={false}>
//               {(isLoadingNoti || isReadNotification) && <Loading/>}
//             {notifications &&
//               <FlatList
//                data={notifications}
//                renderItem={({ item ,index}) => (
//               <View key={index} style={styles.item}>
//               <View>
//                 <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                     <View style={{flex: 0.8, flexDirection: 'row'}}>
//                     {!item.has_read ? (
//                         <View style={styles.dot}></View>
//                     ) : (
//                         <View style={{width: 8}}></View>
//                     )}
//                     <Text
//                         style={{
//                         color: configs.colors.primaryColor,
//                         marginLeft: 6,
//                         }}>
//                         {item.sender}
//                     </Text>
//                     </View>
//                     <View
//                     style={{
//                         flex: 0.2,
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                     }}>
//                     <Text style={{color: configs.colors.grey, fontSize: 12}}>
//                         {this._formatDate(item.created_at)}
//                     </Text>
//                     <TouchableOpacity onPress={() => {
//                       this.setState({selectedItem :  item.id})
//                       this.RBSheet.open()}}>
//                         <Feather
//                         name="more-vertical"
//                         color={configs.colors.lightgrey}
//                         size={18}
//                         style={{marginRight: -5}}
//                         />
//                     </TouchableOpacity>
//                     </View>
//                 </View>
//                 <Space height={5} />
//                 <View style={{paddingLeft: 14,paddingRight:14}}>
//                   <TouchableWithoutFeedback onPress={()=>this._onOpenNotification(item.id,item.has_read)}>

//                     <Text>{item.message}</Text>
//                     </TouchableWithoutFeedback>
//                 </View>

//                 {item.is_translate && 
//                 <View><Space height={10}/>
//                 <View style={{marginLeft:14,marginRight:14,borderBottomColor:configs.colors.primaryColor,borderBottomWidth:1}}/>
//                 <View style={{paddingLeft: 14,paddingRight:14}}>
//                 <Space height={10}/>

//                     <Text style={{color:configs.colors.primaryColor}}>{item.translate}</Text>
//                 </View>

//                 <Space height={10}/>
                
//                 <View style={{alignSelf: 'flex-start',borderRadius:4,backgroundColor:configs.colors.primaryColor,paddingLeft:6,paddingRight:8,paddingTop:4,paddingBottom:4,marginLeft: 14,marginRight:14}}>
//                     <View style={{ alignItems:'center',flexDirection:'row'}}>
//                     <Ionicons size={16} style={{marginRight:4}} color={configs.colors.white} name="checkmark-outline"/>
//                     <Text style={{fontFamily:configs.fontFamily.OPS600,size:12,color:configs.colors.white}}>Translate</Text>
//                     </View>
//                 </View>
//                 </View>
//                 }
//                 </View>
//             </View>        )}
//             />
// }
                    
//                 {!notifications &&
//                   <View style={{alignSelf:'center'}}>
//                      <Text>No record.</Text>
//                   </View>
//                 }

//             </ScrollView>
//             <View>
//             <RBSheet
//                 closeOnPressBack
//                 ref={(ref) => {
//                 this.RBSheet = ref;
//                 }}
//                 dragFromTopOnly={true}
//                 // height="auto"
//                 // height={this.state.bottomSheetHeight}
//                 openDuration={250}
//                 customStyles={{
//                 container: styles.bottomSheetContainer,
//                 }}
//                 closeOnDragDown>
//                 <View style={{padding:20}}>
//                     <TouchableOpacity style={styles.bottom_sheet_item} onPress={this._copyMessage}>
//                         <Text style={{fontSize:16,fontWeight:'700'}}>Copy Message</Text>
//                     </TouchableOpacity >
//                     <TouchableOpacity style={styles.bottom_sheet_item} onPress={this._translateMessage}>
//                         <Text style={{fontSize:16,fontWeight:'700'}}>Translate</Text>
//                     </TouchableOpacity>
//                 </View>
//             </RBSheet>
//             </View>
//         </SafeAreaView>
//     );
//   }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: configs.colors.backgroundColor,
//     },
//     bottom_sheet_item:{
//         padding:10,
//         width:'auto',
//         // backgroundColor:'blue',
//         height:50,
//     },
//     dot: {
//         height: 8,
//         width: 8,
//         alignSelf: 'center',
//         borderRadius: 8,
//         backgroundColor: '#F66460',
//     },
//     headerContainer: {
//         // flex:1,
//         flexDirection: 'row',
//         height: 60,
//         backgroundColor: 'white',
//         alignItems: 'center',
//     },
//     item: {
//         marginHorizontal: 17,
//         marginTop: 17,
//         padding: 15,
//         backgroundColor: 'white',
//         borderRadius: 8,
//         width: 'auto',
//     },
//     bottomSheetContainer:{
//         borderTopLeftRadius:15,
//         borderTopRightRadius:15,
//         height: 'auto',
//     },
//     bottomSheetBody:{
//         marginHorizontal:20,
//         marginVertical:10,
//         // height:"auto",
//     },
// });


// const bindState = state => {
//   return {
//     userInfo : state.authState.userInfo,
//     notifications : state.homeState.notifications,
//     isLoadingNoti : state.homeState.isLoadingNoti,
//     isReadNotification : state.homeState.isReadNotification,
//     notificationNext : state.homeState.notificationNext,
//     userSetting : state.userState.userSetting,

//   }
// }

// const bindDispatch = dispatch => {
//   return {
//     fetchAllNotification: (userId, role,size = 10,next,isNext,handleCallback) => dispatch(homeAction.fetchAllNotification(userId, role,size = 10,next,isNext,handleCallback)),
//     getTranslate: (id,target,text,handleCallback) => dispatch(homeAction.getTranslate(id,target,text,handleCallback)),    
//     setTranslate: (id,value) => dispatch(homeAction.setTranslate(id,value)),
//     readNotification : (notification_id,id,role) => dispatch(homeAction.readNotification(notification_id,id,role)),
//   };
// };

// export default connect(
//   bindState,
//   bindDispatch
// )(Notification);
