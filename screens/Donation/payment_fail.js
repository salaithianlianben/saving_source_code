import React, { Component } from 'react';
import { View,StyleSheet,Text,SafeAreaView,TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Space } from '../../components/space';
import configs from '../../utils/configs';
 
class DonationPaymentFail extends Component {
    render() { 
        return (
            <SafeAreaView style={styles.container}>
                <Ionicons size={130} name="close-circle-outline" color={"#F66460"}/>
                <Space height={20}/>
                <View>
                    <Text style={{fontSize:24,fontWeight:'bold',alignSelf:'center'}}>Failed</Text>
                    <Space height={20}/>
                    <Text style={{justifyContent:'center',alignSelf:'center'}}>Your transaction</Text>
                    <Text style={{justifyContent:'center',alignSelf:'center'}}>cannot be completed</Text>
                </View>
                <TouchableOpacity onPress={() => this.props.navigation.pop(2)} style={{ height: 48, justifyContent: 'center', alignItems: 'center', backgroundColor:configs.colors.primaryColor, width:'80%', borderRadius: 20,position:'absolute',bottom:20,}}>
                    <Text style={{ fontSize: 14, fontFamily: configs.fontFamily.OPS700, color: '#fff'}}>Try again</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignContent:'center',
        alignItems:'center',
        justifyContent:'center',
        height:configs.height,
        backgroundColor:configs.colors.backgroundColor
    }
}) 
export default DonationPaymentFail;