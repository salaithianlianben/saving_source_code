import React, { Component } from 'react';
import { Linking,View,SafeAreaView,Text,StyleSheet ,TouchableOpacity, Image,Dimensions,Alert} from 'react-native';
import configs from '../../../utils/configs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Space } from '../../../components/space';
import ImageLoad from '../../../components/ImageLoad';
import { connect } from 'react-redux';
import userAction from '../../../actions/userAction';
import ImagePicker from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import authAction from '../../../actions/authAction';
import Loading from '../../../components/Loading';
const { width } = Dimensions.get("window");

class Profile extends Component {

    componentDidMount(){
        this.props.getUserData(this.props.userInfo.id);
    }

    pickSingle(cropit, circular = false, mediaType) {
        ImagePicker.openPicker({
        width: 500,
        height: 500,
        cropping: cropit,
        cropperCircleOverlay: circular,
        sortOrder: 'none',
        compressImageMaxWidth: 1000,
        compressImageMaxHeight: 1000,
        compressImageQuality: 1,
        compressVideoPreset: 'MediumQuality',
        includeExif: true,
        cropperStatusBarColor: 'white',
        cropperToolbarColor: 'white',
        cropperActiveWidgetColor: 'white',
        cropperToolbarWidgetColor: '#3498DB',
        })
        .then((image) => {

            this.setState({
                image: {
                    uri: image.path,
                    width: image.width,
                    height: image.height,
                    mime: image.mime,
                    size: image.size,
                },
            });
            let img = {
                uri: image.path,
                width: image.width,
                height: image.height,
                mime: image.mime,
                size: image.size,
            };
            this.RBSheet.close();
            setTimeout(() => {
              if(this.props.userInfo.user_type == "parent"){
                this.props.updateParentInfo(this.props.userInfo.id,img,);
              }else{
                this.props.updateFacilitatorInfo(this.props.userInfo.id,img,);
              }
            }, 300);
            
        })
        .catch((e) => {
            console.log(e);
            this.RBSheet.close();
            if(e.message){
              var msg = e.message.toLowerCase();
              if (msg.includes('cannot access image')) { 
              Alert.alert(e.message,
                null,
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  {
                    text: "OK",
                    onPress: () => Linking.openURL('app-settings:'),
                    style: "ok"
                  }
                ]
              );
            }
          }
        });
    }
      pickSingleWithCamera(cropping, mediaType = 'photo') {
        ImagePicker.openCamera({
          cropping: cropping,
          width: 500,
          height: 500,
          includeExif: true,
          mediaType,
        })
          .then((image) => {
            this.setState({
              image: {
                uri: image.path,
                width: image.width,
                height: image.height,
                mime: image.mime,
                size: image.size,
              },
             // images: null,
            });
            let img = {
                uri: image.path,
                width: image.width,
                height: image.height,
                mime: image.mime,
                size: image.size,
            };
            this.RBSheet.close();
            setTimeout(() => {
              if(this.props.userInfo.user_type == "parent"){
                this.props.updateParentInfo(this.props.userInfo.id,img,);
              }else{
                this.props.updateFacilitatorInfo(this.props.userInfo.id,img,);
              }
            }, 300);
            
          })
          .catch((e) => {
              console.log(e);
              this.RBSheet.close();
              if(e.message){
                var msg = e.message.toLowerCase();
                if (msg.includes('camera permission')) { 
                  Alert.alert('Please grant camera permission.',
                    null,
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      },
                      {
                        text: "OK",
                        onPress: () => Linking.openURL('app-settings:'),
                        style: "ok"
                      }
                    ]
                  );
                }
              }
          });
      }

      getRelationShip = (relationship)=>{
          if(relationship == "Mother"){
              return "Mom"
          }else{
              if(relationship == "Father"){
                  return "Dad"
              }else{
                  return relationship
              }
          }
      }

    render() {

        let { userInfo,studentInfo } = this.props;
        
        return (
            <SafeAreaView style={styles.container}>
                <Space height={60}/>
                <View >
                    <View style={styles.imageContainer}>
                        {/* <Image source={{uri: userInfo.img}} style={styles.image} /> */}
                        {
                            userInfo.img == undefined || userInfo.img == "" || userInfo.img == null ? 
                            <Image source={require("../../../assets/icons/ic_account.png")} style={styles.image} />
                            :
                            <ImageLoad
                                style={styles.image}
                                loadingStyle={{ size: "small", color: "white" }}
                                borderRadius={155}
                                placeholderStyle={styles.image}
                                source={{ uri:userInfo.img, cache: 'force-cache' }}
                                isProfile={true}
                                placeholderSource={require("../../../assets/icons/ic_account.png")}
                            />
                        }
                        <TouchableOpacity style={styles.cameraButton} onPress={() => {
                            this.RBSheet.open();
                        }}>
                            <Ionicons name="md-camera-outline" color="white" size={22} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Space height={50}/>
                <View style={{alignSelf:'center',alignItems:'center'}}>
                    <Text style={{ color: configs.colors.primaryColor, fontSize: 14, fontWeight: '600'}}>{userInfo.user_type.charAt(0).toUpperCase()}{userInfo.user_type.slice(1)}</Text>
                    <Text style={styles.name}>{userInfo.name}</Text>
                    
                    {userInfo.user_type == "facilitator" ? (
                      <View>
                        <Space height={10}/>
                        <Text style={{fontSize:16,color:configs.colors.grey}}>
                          {userInfo.email}
                        </Text>
                      </View>
                      ): null
                    }
                    {/* `${studentInfo && studentInfo.name}'s ${this.getRelationShip(userInfo.relationship)}` */}
                    <Space height={10}/>
                    {
                        userInfo.user_type == "facilitator" &&
                        userInfo.class.map((c,i) =>
                          <Text key={i} style={{fontSize:20,fontWeight:'700',color:configs.colors.primaryColor}}>
                             Class {c.name}
                          </Text>
                        )
                       
                    }
                   {(this.props.is_loading_user == true && <Loading style={{zIndex: 100}}/>)}
                </View>
                <RBSheet
                    closeOnPressBack
                    ref={(ref) => {
                    this.RBSheet = ref;
                    }}
                    dragFromTopOnly={true}
                    // height="auto"
                    // height={this.state.bottomSheetHeight}
                    openDuration={250}
                    customStyles={{
                    container: styles.bottomSheetContainer,
                    }}
                    closeOnDragDown>
                    <View style={{padding:20,}}>
                    {/* <View style={{borderBottomColor:'#d2d2d2',borderBottomWidth:1}}></View> */}
                        <TouchableOpacity style={styles.bottom_sheet_item}
                            onPress={()=>{ 
                                this.pickSingleWithCamera(true);
                            }}
                        >
                            <Text style={{fontSize:16,fontWeight:'700',justifyContent:'center',}}>Camera</Text>
                        </TouchableOpacity >
                        <View style={{borderBottomColor:'#d2d2d2',borderBottomWidth:1}}></View>
                        <TouchableOpacity style={styles.bottom_sheet_item} 
                          onPress={()=>{ 
                            this.pickSingle(false);
                        }}>
                            <Text style={{fontSize:16,fontWeight:'700'}}>Library</Text>
                        </TouchableOpacity>
                        <View style={{borderBottomColor:'#d2d2d2',borderBottomWidth:1}}></View>
                        <TouchableOpacity style={styles.bottom_sheet_item} onPress={()=>this.RBSheet.close()}>
                            <Text style={{fontSize:16,fontWeight:'700'}}>Cancel</Text>
                        </TouchableOpacity>
                        {/* <View style={{borderBottomColor:'#d2d2d2',borderBottomWidth:1}}></View> */}
                    </View>
                </RBSheet>
            </SafeAreaView>
        )
    }
}

const mapStateToProps = state => {
    return {
      userInfo : state.authState.userInfo,
      is_success: state.userState.is_success,
      is_loading_user: state.userState.is_loading_user,
      studentInfo: state.userState.studentInfo,
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
        updateFacilitatorInfo: (id,img) => dispatch( userAction.updateFacilitatorInfo(id,img)),
        updateParentInfo: (id,img,) => dispatch( userAction.updateParentInfo(id,img,) ),
        getUserData:(id) => dispatch( authAction.getUserData(id)),
    }
  }
export default connect(mapStateToProps,mapDispatchToProps)(Profile);
const styles = StyleSheet.create({
    name:{
        fontSize:24,
        fontWeight:'700'
    },
    container:{
        flex:1,
        backgroundColor:'#F7FAFF'
    },
    body:{
        
    },
    cameraButton:{
        height:40,
        width:40,
        borderRadius:40,
        position: 'absolute',
        backgroundColor:configs.colors.primaryColor,
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center',
        bottom:-15,
    },
    imageContainer:{
        height:160,
        width:160,
        borderRadius:160,
        backgroundColor:configs.colors.primaryColor,
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center',
    },
    image:{
        height:155,
        alignItems:'center',
        alignSelf:'center',
        width:155,
        borderRadius:155,
    },
    bottom_sheet_item:{
        padding:10,
        width:'100%',
        alignItems:'center',
        // backgroundColor:'blue',
        height:50,
    },
})