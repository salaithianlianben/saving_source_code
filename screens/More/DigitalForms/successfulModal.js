import React from 'react'
import { View, Text, Modal, StyleSheet, Image, TouchableOpacity} from 'react-native'
import configs from '../../../utils/configs';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SuccessfulModal({ isSuccessVisible, GoToSeeHandler}) {
    return (
        <Modal 
        visible={isSuccessVisible}
        transparent={true}
        statusBarTranslucent={true}
        //backdropColor="transparent"
        >
            <View style={styles.ModalContainer}>
                <View style={styles.InnerContainer}>
                <Ionicons size={130} name="checkmark-circle-outline" color={"#7CD227"}/>
                    <Text style={{ fontSize: 16, fontFamily: configs.fontFamily.OPS600,}}>Thank You</Text>
                    <View style={{height:10}}/>

                    <Text style={{alignSelf:'center',width:'100%'}}>The form was submitted successfully.</Text>
                    
                    <View style={{height:10}}/>
                    <TouchableOpacity style={styles.GoToSee} onPress={GoToSeeHandler}>
                        <Text style={{ fontSize: 14, fontFamily: configs.fontFamily.OPS700, color: '#fff'}}>Ok</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({
    ModalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    InnerContainer: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: configs.colors.grey,
        marginHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 50,
        backgroundColor: '#fff',
        alignSelf:'center'
    },
    GoToSee: {
        paddingVertical: 14, 
        paddingHorizontal: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: configs.colors.primaryColor,
        borderRadius: 20,
        

    }
})