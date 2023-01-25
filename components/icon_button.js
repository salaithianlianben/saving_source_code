import React from 'react';
import { TouchableHighlight,StyleSheet ,View,Text} from 'react-native';

const IconButton = ({ icon, onPress,style,disabled, item_number = 0}) => {
    return (
        <TouchableHighlight 
            disabled={disabled}
            style={[styles.container,style]}
            onPress={onPress}
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
        >
            <View>
            {
                icon
            }
            {
                item_number != 0 &&
                <View style={{ backgroundColor: 'red', borderRadius: 50, justifyContent: 'center', alignItems: 'center',  paddingHorizontal: 4, position: 'absolute', marginTop: -5, marginLeft: 15}}>
                   <Text style={{ color: '#fff', fontSize: 11}}>{item_number}</Text>
                </View>
            }
            
            </View>
           
        </TouchableHighlight>
    );
}

export default IconButton;

const styles = StyleSheet.create({
    container:{
        height:30,
        width:'auto',
        justifyContent:'center',
         marginLeft:10,
        alignItems:'center',
        borderRadius:20,
        backgroundColor:'transparent',
    }
})