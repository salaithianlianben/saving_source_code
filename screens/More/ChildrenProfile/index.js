import React, { Component } from 'react';
import { ScrollView,View,SafeAreaView,Text,StyleSheet ,TouchableOpacity, Image,Dimensions} from 'react-native';
import { Space } from '../../../components/space';
import ImageLoad from '../../../components/ImageLoad';
import configs from '../../../utils/configs';
import CircleCheckBox from './CircleCheckBox';
import { connect } from 'react-redux';
import AsyncStorage from "@react-native-community/async-storage";
import userAction from '../../../actions/userAction';
import RNRestart from 'react-native-restart';
class ChildrenProfile extends Component {

    state={
        isCenterOn:true,
        isParentsOn:false,
        active_student:"",
    }

    setActiveStudent = async (data) => {
        AsyncStorage.setItem(configs.constant.AS_KEY.ACTIVE_STUDENT_ID,data);
        this.setState({
            active_student:data,
        });
        await this.props.setStudentInfo(data,false);
        RNRestart.Restart()
    }
    componentDidMount (){
        let {studentInfo} = this.props;

        if(studentInfo!==undefined && studentInfo.length!== 0){
           this.setState({active_student: studentInfo.id});
        }

    }
    render() {
        const children = this.props.userInfo.children;
        // console.log(this.props.userInfo.children);
        return (
            <SafeAreaView style={styles.container}>
                <View style={{margin:20}}>
                    <Text style={{fontSize:16,fontWeight:'700'}}>Switch the profile</Text>
                    <Space height={20}/>
                    <View>
                        {
                            children && children.map( (e)=>(
                                <View style={styles.card} key={e.id}>
                                    <View style={{flex:0.15}}>
                                        {/* <Image source={{uri: 'https://images-na.ssl-images-amazon.com/images/I/51rwBMmnPYL._SX384_BO1,204,203,200_.jpg'}} style={{height:36,width:36,borderRadius:36,borderWidth:2,borderColor:configs.colors.primaryColor,}} cache="reload"/> */}
                                        {
                                            e.img != "" || e.img != undefined || e.img != null ? 
                                            <ImageLoad
                                                style={styles.studentImage}
                                                loadingStyle={{ size: "small", color: "white" }}
                                                borderRadius={36}
                                                placeholderStyle={{
                                                borderRadius: 8,
                                                height: 48,
                                                width: 48,
                                                }}
                                                source={{ uri:e.img, cache: 'force-cache' }}
                                                placeholderSource={require("../../../assets/icons/ic_account.png")}
                                            /> : <Image 
                                                source={require("../../../assets/icons/ic_account.png")}
                                                style={styles.studentImage}
                                            />
                                        }
                                    </View>
                                    <View style={{flex:0.75,}}>
                                        <Text>{e.name}</Text>
                                    </View>
                                    <View style={{flex:0.1,alignItems:'flex-end'}}>
                                        <CircleCheckBox data={e} checked={this.state.active_student === e.id } onChange={()=>{
                                            this.setActiveStudent(e.id)}
                                        }/>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const mapStateToProps = state => {
    return {
        userInfo : state.authState.userInfo,
        studentInfo: state.userState.studentInfo,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setStudentInfo: (student_id,from_home) => dispatch( userAction.setStudentInfo(student_id,from_home) ),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ChildrenProfile);

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:configs.colors.backgroundColor
    },
    card:{
        flexDirection:'row',
        height:48,
        backgroundColor:'white',
        marginVertical:5,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:20,
        paddingHorizontal:8,
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    studentImage:{
        height:36,
        width:36,
        borderRadius:36,
        borderWidth:2,
        borderColor:configs.colors.primaryColor,
    }
})
