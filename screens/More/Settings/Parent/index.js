import React, { Component } from 'react';
import { ScrollView,View,SafeAreaView,Text,StyleSheet ,TouchableOpacity, Image,Dimensions, StatusBar} from 'react-native';
import { Space } from '../../../../components/space';
import configs from '../../../../utils/configs';
import { Switch } from '../../../../components/switch';
import LanguageModal,{getLauguageName,getDBLauguageName,getLauguageNameShort} from '../popSwitchLanguage';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { connect } from "react-redux";
import homeAction from '../../../../actions/homeAction';
import userAction from '../../../../actions/userAction';
import { set } from 'react-native-reanimated';
import Loading from "../../../../components/Loading";
class Settings extends Component {

    state={
        isCenterOn:false,
        isFacilitatorOn:false,
        preferredLanguageShort: "",
        preferredLanguage: "",
        isModal: false
    }

    closeModal = () => this.setState({isModal: false});

    openModal = () => this.setState({isModal: true});

    setPreferredLanguage = (value,name) => {
        this.setState({preferredLanguage:name,preferredLanguageShort:value});
        this.setWholeSetting(this.state.isFacilitatorOn,this.state.isCenterOn,name);
        this.closeModal();
    }
    
    setWholeSetting = (facilitatorOn,centreOn,preferred_language) =>{
        let {userInfo,setSetting } = this.props;
        const facilitatorOnV = facilitatorOn === false ? 0 : 1;
        const centreOnV = centreOn === false ? 0 : 1;
        const preferred_languageV = getDBLauguageName(preferred_language);

        setSetting(userInfo.id,userInfo.user_type,facilitatorOnV,"",centreOnV,preferred_languageV);
    }
    
    componentDidMount(){
        let {userSetting} = this.props;
        if(userSetting !==undefined){
        const getName = getLauguageName(userSetting.preferred_language);
        const getNameShort = getLauguageNameShort(userSetting.preferred_language);
        const centre = userSetting.centre === 0 ? false : true;
        const facilitator = userSetting.facilitator === 0 ? false : true;

        this.setState({
            preferredLanguage:getName,
            preferredLanguageShort: getNameShort,
            isCenterOn:centre,
            isFacilitatorOn: facilitator});
        }
    }

    render() {
        
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor={this.state.isModal == true ? '#00000040' : 'transparent'} translucent={true} />
                <LanguageModal
                  isVisibles={this.state.isModal}
                  onCloseModals={this.closeModal}
                  selectedLanguage = {this.state.preferredLanguageShort}
                  setLanguage = {(value,name) => this.setPreferredLanguage(value,name)}
                />
                {this.props.Loading && <Loading/>}
                <View style={{margin:20}}>
                    <Text style={{fontSize:16,fontWeight:'700'}}>Push Notification</Text>
                    <Space height={20}/>
                    <View>
                        <View style={styles.card}>
                            <View style={{flex:0.5}}>
                                <Image source={require('../../../../assets/icons/ic_center.png')} style={{height:16,width:20,resizeMode:'contain'}} />
                            </View>
                            <View style={{flex:4,}}>
                                <Text>Centre message</Text>
                            </View>
                            <View style={{flex:1,}}>
                                <Switch
                                    value={this.state.isCenterOn}
                                    onValueChange={(val) => {this.setState({ isCenterOn:val })
                                    this.setWholeSetting(this.state.isFacilitatorOn,val,this.state.preferredLanguage)}}
                                    disabled={false}
                                    activeText={''}
                                    inActiveText={''}
                                    circleBorderActiveColor={"white"}
                                    // circleInActiveColor={'red'}
                                    circleSize={24}
                                    circleBorderWidth={0}
                                    innerCircleStyle={{ alignItems: "center", justifyContent: "center", }} // style for inner animated circle for what you (may) be rendering inside the circle
                                    outerCircleStyle={!this.state.isCenterOn ? {paddingLeft:5} : {paddingRight:5} } // style for outer animated circle
                                />
                            </View>
                        </View>
                        <View style={styles.card}>
                            <View style={{flex:0.5}}>
                                <Image source={require('../../../../assets/icons/ic_teacher_message.png')} style={{height:16,width:20,resizeMode:'contain'}} />
                            </View>
                            <View style={{flex:4,}}>
                                <Text>Teacher's message</Text>
                            </View>
                            <View style={{flex:1,}}>
                                <Switch
                                    value={this.state.isFacilitatorOn}
                                    onValueChange={(val) => {this.setState({ isFacilitatorOn:val })
                                                             this.setWholeSetting(val,this.state.isCenterOn,this.state.preferredLanguage)}}
                                    disabled={false}
                                    activeText={''}
                                    inActiveText={''}
                                    circleBorderActiveColor={"white"}
                                    // circleInActiveColor={'red'}
                                    circleSize={24}
                                    circleBorderWidth={0}
                                    innerCircleStyle={{ alignItems: "center", justifyContent: "center", }} // style for inner animated circle for what you (may) be rendering inside the circle
                                    outerCircleStyle={!this.state.isFacilitatorOn ? {paddingLeft:5} : {paddingRight:5} } // style for outer animated circle
                                />
                            </View>
                        </View>
                        <View style={styles.card}>
                            <View style={{flex:0.5}}>
                                <Image source={require('../../../../assets/icons/ic_translation.png')} style={{height:16,width:20,resizeMode:'contain'}} />
                            </View>
                            <View style={{flex:4,}}>
                                <Text>Language Translator</Text>
                            </View>
                            <View style={{flex:1}}>
                                <TouchableWithoutFeedback onPress={()=>this.openModal()}>
                               <Text style={styles.textLang}>{this.state.preferredLanguage}</Text>
                               </TouchableWithoutFeedback>
                            </View>
                        </View>                        
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:configs.colors.backgroundColor
    },
    card:{
        flexDirection:'row',
        height:40,
        backgroundColor:'white',
        marginVertical:5,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:20,
        paddingHorizontal:10,
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    textLang:{
        fontFamily:configs.fontFamily.OPS600,
        fontSize: 14,
        color:configs.colors.primaryColor
    }
})


const bindState = state => {
    return {
      isLoading : state.userState.isLoading,
      userInfo : state.authState.userInfo,
      userSetting : state.userState.userSetting,
    }
  }
  
  const bindDispatch = dispatch => {
    return {
     setSetting:(user_id,user_role,facilitator,parent,centre,preferred_language)=>dispatch(userAction.setSetting(user_id,user_role,facilitator,parent,centre,preferred_language)),
     getSetting: (user_id,user_type) => dispatch(userAction.getSetting(user_id,user_type)),

    };
  };

export default connect(
    bindState,
    bindDispatch
  )(Settings);