import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image} from 'react-native'
import configs from '../../utils/configs'
import Done from '../../assets/icons/Done.png'


export default function RectangleCheckBox({ checked , onChange , label , labelStyle , checkedColor = configs.colors.primaryColor}) {
    return (
        <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={[styles.container,checked && { borderWidth:0,backgroundColor:checkedColor }]} onPress={()=> onChange(!checked)} >
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
        height:20,
        width:20,
        borderWidth:1,
        borderRadius:4,
        borderColor:"#DADADA",
        flexDirection:'row',
        alignContent:'center',
        justifyContent:'center',
        alignItems:'center',
        marginRight: 8
    }
})
