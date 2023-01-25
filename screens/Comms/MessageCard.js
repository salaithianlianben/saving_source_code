import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import configs from '../../utils/configs'
import moment from 'moment';
export default function MessageCard(props) {
    return (
    <>
    <TouchableOpacity style={styles.MessageCard} onPress={() => props.navigation.navigate("ChatRoom", {receiver_info : {
        id : props.id,
        name: props.Name,
        role: props.role
    }})}>
            <>
            
                {/* <Image source={{uri: props.ProfileImage}} style={{ marginRight: 10, marginLeft: 4, width: 40, height: 40, borderRadius: 40, borderWidth: 2, borderColor: "#4075FF"}} /> */}
                <Image source={require('../../assets/images/Ellipse.png')} style={{ marginRight: 10, marginLeft: 4, width: 40, height: 40}} />
           
            <View style={{ flexDirection: 'column', width: '100%'}}>
               <View style={{ flexDirection: 'row', marginBottom: 9, justifyContent:"space-between"}}>
                    <View style={{ flexDirection: 'row'}}>
                       {
                       props.Active  &&
                       <Image source={require('../../assets/icons/Oval.png')} style={{ width: 8, height: 8, marginTop: 5}} />
                       }
                       <Text style={{ fontSize: 16, fontWeight: '700', marginLeft: 6}}>{props.Name}</Text>
                    </View>
                  
                  
                   
                    <Text style={{ fontSize: 12, fontWeight: '400', marginTop: 4, right: 51}}>
                    {moment(props.DurationTime,'YYYY MMM DD h:mm:ss').format('MMM DD')}
                    </Text>
                  
               </View>
               <View style={{ paddingRight: 51}}>
                   {/* <View style={{ flexDirection: 'row', marginRight: 6, marginBottom: 8}}>
                       {
                           props.urgent ?
                           <Image source={require('../../assets/icons/info.png')} style={{ width: 16, height: 16, marginRight: 6}} /> :
                           null
                       }
                       <Text style={{ fontSize: 14, fontWeight: '700'}}>{props.Title}</Text>
                   </View> */}
                   <View>
                        <Text style={{ fontSize: 14, fontWeight: '400'}}>{props.Content}</Text>
                   </View>
               </View>
            </View>
            </>
        </TouchableOpacity>
        {
            props.NoBottom &&
            <View style={{ width: '100%', height: 2, borderColor: "#F6F6F6", borderWidth: 1}}></View>
        }
        
    </>
    )
}
const styles = StyleSheet.create({
    MessageCard: {
        
       
        paddingTop: 9,
        paddingBottom: 15,
        flexDirection: 'row'
    },
    Active: {
        width: 8,
        height: 8,
        backgroundColor: configs.colors.primaryColor,
        borderRadius: 8,
        marginRight: 6,
        marginTop: 7
    }
})