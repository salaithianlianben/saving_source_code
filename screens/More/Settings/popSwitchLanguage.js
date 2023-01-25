import React from 'react';
import { View, Text, StyleSheet,TouchableWithoutFeedback } from 'react-native';
import Modal from 'react-native-modal';
import style from '../../../components/calendars/calendar/header/style';
import configs from '../../../utils/configs';
import Ionicons from 'react-native-vector-icons/Ionicons'

const langauges = [
    {
       id: 0,
       name: 'English',
       dbName: 'English',
       value: 'en'
    },
    {
       id: 1,
       name: '中文',
       dbName: 'Chinese',
       value: 'zh'               
    },
    {
       id: 2,
       name: 'Bahasa Melayu',
       dbName: 'Malay',
       value: 'ms'               
    },
    {
       id: 3,
       name: 'தமிழ்',
       dbName: 'Tamil',
       value: 'ta'
    }
 ];

 export function getLauguageName (value){
     const found = langauges.find(data => data.dbName === value);
     if(found === undefined) return ""; else return found.name;
 }

 export function getLauguageNameShort (value){
    const found = langauges.find(data => data.dbName === value);
    if(found === undefined) return ""; else return found.value;
}

 export function getDBLauguageName (value){
    const found = langauges.find(data => data.name === value);
    if(found === undefined) return ""; else return found.dbName;
}

class PopSwitchLanguage extends React.Component {
   
    render() {
        let { isVisibles, onCloseModals,setLanguage,selectedLanguage } = this.props;
        return (
            <Modal
                backdropOpacity={0.25}
                onBackdropPress={onCloseModals}
                statusBarTranslucent={true}
                style={{flex:1, justifyContent: 'center', alignItems: 'center',}}
                useNativeDriver
                hideModalContentWhileAnimating
                isVisible={isVisibles}>
                <View style={styles.container}>
                <Text style={{fontFamily:configs.fontFamily.OPS600,fontSize:16,marginBottom:7}}>Preferred Language</Text>
                    
            {   
               langauges.map((item, index) => (
                <View style={styles.itemContainer} key={item.id}>
                    <View style={{flex:0.9,}}>
                     <Text>{item.name}</Text>
                    </View>
                    <View style={{flex:0.1,alignItems:'flex-end'}}>
                     <TouchableWithoutFeedback onPress={()=>setLanguage(item.value,item.name)}>
                        <Ionicons name="checkmark-circle" color={item.value == selectedLanguage ? configs.colors.primaryColor: configs.colors.lightblue} size={24} />
                     </TouchableWithoutFeedback>
                    </View >
                </View>
                  
               ))
            }
         </View>
            </Modal>
        );
    }
};


const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: configs.colors.bgColor,
        borderRadius: 8,
        height: configs.width - 25,
        width: configs.width - 48,
       
    }, 
    container: {
        height: 246,
        width:327,
        backgroundColor: configs.colors.white,
        borderRadius:8,
        borderWidth:1,
        borderColor:configs.colors.lightgrey,
        paddingTop:24,
        paddingBottom:15,
        paddingLeft:26,
        paddingRight:19
    }, 
    itemContainer:{
        marginTop:10,
        marginBottom:10,
        flexDirection: 'row'
    } 

});

export default PopSwitchLanguage;
