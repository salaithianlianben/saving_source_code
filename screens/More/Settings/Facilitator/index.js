import React, { Component } from 'react';
import { ScrollView,View,SafeAreaView,Text,StyleSheet ,TouchableOpacity, Image,Dimensions} from 'react-native';
import { Space } from '../../../../components/space';
import configs from '../../../../utils/configs';
import { Switch } from '../../../../components/switch';
import { connect } from "react-redux";
import userAction from '../../../../actions/userAction';
import Loading from "../../../../components/Loading";

class Settings extends Component {

    state={
        isCenterOn:true,
        isParentsOn:false,
    }

    setWholeSetting = (parentOn,centreOn) =>{
        let {userInfo,setSetting,userSetting } = this.props;
        const parentOnV = parentOn === false ? 0 : 1;
        const centreOnV = centreOn === false ? 0 : 1;
        const preferred_languageV = userSetting!==undefined?userSetting.preferred_language : "";

        setSetting(userInfo.id,userInfo.user_type,"",parentOnV,centreOnV,preferred_languageV);
    }

    componentDidMount(){

        let {userSetting} = this.props;

        if(userSetting !==undefined){
        const centre = userSetting.centre === 0 ? false : true;
        const parent = userSetting.parent === 0 ? false : true;
        
        this.setState({
            isCenterOn:centre,
            isParentsOn: parent});
        }
    
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                {this.props.isLoading && <Loading/>}
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
                                    this.setWholeSetting(this.state.isParentsOn,val)}}
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
                                <Image source={require('../../../../assets/icons/ic_parents.png')} style={{height:16,width:20,resizeMode:'contain'}} />
                            </View>
                            <View style={{flex:4,}}>
                                <Text>Parents message</Text>
                            </View>
                            <View style={{flex:1,}}>
                                <Switch
                                    value={this.state.isParentsOn}
                                    onValueChange={(val) => {this.setState({ isParentsOn:val })
                                    this.setWholeSetting(val,this.state.isCenterOn)
                                }}
                                    disabled={false}
                                    activeText={''}
                                    inActiveText={''}
                                    circleBorderActiveColor={"white"}
                                    // circleInActiveColor={'red'}
                                    circleSize={24}
                                    circleBorderWidth={0}
                                    innerCircleStyle={{ alignItems: "center", justifyContent: "center", }} // style for inner animated circle for what you (may) be rendering inside the circle
                                    outerCircleStyle={!this.state.isParentsOn ? {paddingLeft:5} : {paddingRight:5} } // style for outer animated circle
                                />
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