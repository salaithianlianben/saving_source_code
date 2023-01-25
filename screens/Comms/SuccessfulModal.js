import React from 'react'
import { View, Text, Modal, StyleSheet, Image, TouchableOpacity} from 'react-native'
import configs from '../../utils/configs'

export default function SuccessfulModal({ isSuccessVisible, GoToSeeHandler}) {
    return (
        <Modal 
        visible={isSuccessVisible}
        transparent={true}
        //backdropColor="transparent"
        statusBarTranslucent={true}
        >
            <View style={styles.ModalContainer}>
                <View style={styles.InnerContainer}>
                    <Image source={require('../../assets/images/Success.png')} style={{ marginBottom: 16}}  />
                    <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 24}}>Send Successful</Text>
                    <TouchableOpacity style={styles.GoToSee} onPress={GoToSeeHandler}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fff'}}>Go to See</Text>
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
        alignItems: 'center'
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
        backgroundColor: '#fff'
    },
    GoToSee: {
        paddingVertical: 14, 
        paddingHorizontal: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: configs.colors.primaryColor,
        borderRadius: 8,
        

    }
})