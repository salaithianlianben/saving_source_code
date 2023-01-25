import React, { Component } from 'react'
import { SafeAreaView, StyleSheet, } from 'react-native'
import configs from '../../../utils/configs';
import UnderlineTabBarOrderList from './Tabs';
class OrderLists extends Component {


    render() {
        
        return (
            <SafeAreaView style={styles.container}>
               <UnderlineTabBarOrderList 
                 navigation={this.props.navigation}
                 routeParams={this.props.route.params} />
            </SafeAreaView>
        )
    }
}

export default OrderLists;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:configs.colors.backgroundColor,
        height:'100%'
    },
})