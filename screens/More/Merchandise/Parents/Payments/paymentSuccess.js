import React, { Component } from 'react'
import {
    View,
    SafeAreaView,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,
    TouchableHighlight,
    Alert,
  } from 'react-native';
import { Space } from '../../../../../components/space';
import configs from '../../../../../utils/configs';
import Ionicons from 'react-native-vector-icons/Ionicons';
class PaymentSuccess extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                {
                    this.props.route.params.status ?
                    <>
                       <Space height={45}/>
                        <Ionicons size={130} name="checkmark-circle-outline" color={"#7CD227"}/>
                        <Text style={{ fontFamily: configs.fontFamily.OPS700, fontSize: 24, }}>Order Submitted!</Text>
                        <Space height={20}/>
                        <Text style={{ fontSize: 16, fontFamily: configs.fontFamily.OPS600}}>Check your order detail under the Order List.</Text>
                        <Text style={{ fontSize: 16, fontFamily: configs.fontFamily.OPS600}}>Here's your Order ID:</Text>
                        <Text style={{ fontSize: 16, fontFamily: configs.fontFamily.OPS700, }}>{this.props.route.params.order_id}</Text>
                        <Space height={170}/>
                        <TouchableOpacity 
                            onPress={() => {
                                // this.props.navigation.goBack();
                                //this.props.navigation.navigate('MerchandiseParentScreen');
                                this.props.navigation.popToTop();
                                this.props.navigation.push('Order Lists', {initialPage: 2});

                            }} style={{ height: 48, justifyContent: 'center', alignItems: 'center', backgroundColor: configs.colors.primaryColor, width: 311, borderRadius: 20}}>
                            <Text style={{ fontSize: 14, fontFamily: configs.fontFamily.OPS700, color: '#fff'}}>Order History</Text>
                        </TouchableOpacity>
                    </> :
                    <>
                     <Space height={45}/>
                     <Ionicons size={130} name="close-circle-outline" color={"#F66460"}/>
                     <Text style={{ fontFamily: configs.fontFamily.OPS700, fontSize: 24, }}>Failed</Text>
                     <Space height={20}/>
                     <Text style={{ fontSize: 16, fontFamily: configs.fontFamily.OPS600}}>Your transaction</Text>
                     <Text style={{ fontSize: 16, fontFamily: configs.fontFamily.OPS600}}>cannot be completed</Text>
               
                     <Space height={170}/>
                     <TouchableOpacity onPress={() => this.props.navigation.navigate('MerchandiseParentScreen')} style={{ height: 48, justifyContent: 'center', alignItems: 'center', backgroundColor: configs.colors.primaryColor, width: 311, borderRadius: 20}}>
                         <Text style={{ fontSize: 14, fontFamily: configs.fontFamily.OPS700, color: '#fff'}}>Try again</Text>
                     </TouchableOpacity>
                    </>
                }
               
            </SafeAreaView>
        )
    }
}
export default PaymentSuccess;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    }
});