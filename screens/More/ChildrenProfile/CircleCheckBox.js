import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image} from 'react-native'
import configs from '../../../utils/configs'
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function CircleCheckBox({ checked , label , onChange,labelStyle , checkedColor = configs.colors.primaryColor ,data}) {
    return (
        <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={[styles.container]} onPress={()=> onChange(data)} >
                {
                    <Ionicons name="checkmark-circle" color={checked ? checkedColor : "#E6F1FC"} size={24} />
                }
            </TouchableOpacity>
               {
                   label && <Text style={[labelStyle,{ paddingLeft:10,}]}>{ label }</Text>
               }
            
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        height:24,
        width:24,
        borderRadius:24,
        flexDirection:'row',
        alignContent:'center',
        justifyContent:'center',
        alignItems:'center',
        marginRight: 8
    }
})
