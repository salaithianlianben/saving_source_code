import React from 'react';
import {View} from 'react-native';

const Divider = ({ style})=>{
    return (
        <View style={[
            {
                height:5,
                borderBottomColor:"#f2f2f2",
                borderBottomWidth:1,
            },style
        ]}></View>
    );
}

export default Divider;