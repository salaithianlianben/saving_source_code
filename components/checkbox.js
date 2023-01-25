import React from 'react';
import { View,TouchableOpacity ,StyleSheet ,Text} from 'react-native';
import configs from '../utils/configs';
import Ionicons from 'react-native-vector-icons/Ionicons'

const CheckBox = ({ checked , onChange , label , labelStyle , checkedColor = "blue", containerStyle,lableHorizontal = false,labelTop = false }) => {
    return (
        <View style={{flexDirection:lableHorizontal ? 'row':'column'}}>
            {
                labelTop == true && <Text style={[labelStyle,{alignSelf:'center'}]}>{ label }</Text>
            }
            <TouchableOpacity style={[styles.container,containerStyle,checked && { borderWidth:0,backgroundColor:checkedColor }]} onPress={()=> onChange(!checked)}>
                {
                    checked && <Ionicons name="md-checkmark-sharp" color={"white"} size={13} style={{}}/>
                }
            </TouchableOpacity>
            {
                labelTop == false && <Text style={[labelStyle,{ paddingLeft:10,}]}>{ label }</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        height:23,
        width:23,
        borderWidth:1,
        borderRadius:5,
        borderColor:configs.colors.borderColor,
        flexDirection:'row',
        alignContent:'center',
        justifyContent:'center',
        alignItems:'center'
    }
})

export default CheckBox;