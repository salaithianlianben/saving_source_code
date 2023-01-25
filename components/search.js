import React from 'react';
import { View,Text,StyleSheet,TextInput,Dimensions } from 'react-native';
import configs from '../utils/configs';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width} = Dimensions.get("window");

const  Search =({ value, onChangeText, placeholder,style })=>{
    return (
        <View style={[styles.container,style]}>
            <TextInput 
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                name="search"
                style={[styles.text,]}
                placeholderTextColor={configs.colors.primaryColor}
            />
            <View style={{flex:0.1,alignItems:'flex-end'}}>
                <Ionicons name="search-outline" color={configs.colors.primaryColor} size={20} />
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:width - 50,
        borderRadius:20,
        backgroundColor:'#E9F0FD',
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:10,
    },
    text:{
        marginLeft:5,
        color:configs.colors.primaryColor,flex:0.9,
    }
})

export default Search
