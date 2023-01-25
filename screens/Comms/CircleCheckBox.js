import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image} from 'react-native'
import configs from '../../utils/configs'
import Done from '../../assets/icons/Done.png'


export default function CircleCheckBox({ checked , onChange , label , labelStyle , checkedColor = configs.colors.primaryColor}) {
    return (
        <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={[styles.container,checked && { backgroundColor:checkedColor }]} onPress={()=> onChange(!checked)} >
                {
                    checked && <Image source={Done} />
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
        backgroundColor:"#DADADA",
        flexDirection:'row',
        alignContent:'center',
        justifyContent:'center',
        alignItems:'center',
        marginRight: 8
    }
})
