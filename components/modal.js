import React from 'react';
import { View,StyleSheet,Image,TouchableOpacity,Text,Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import configs from '../utils/configs';
import { Space } from './space';

const { width } = Dimensions.get('window');

const ModalBox = ( {isVisible, onClickButtonOneAction, onClickButtonTwoAction, onCloseModals, buttonOneText, buttonTwoText,messageText} ) =>{

    return (
        <Modal 
            onBackdropPress={onCloseModals}
            style={{
                flex:1,
                justifyContent:'center',
                alignSelf:'center'
            }}
            useNativeDriver
            hideModalContentWhileAnimating
            isVisible={isVisible}
        >
            <View style={styles.modalContainer}>
                <View style={styles.circle_avatar}>

                </View>
                <Space height={16}/>
                <Text style={{fontSize:16,fontWeight:'600'}}>{messageText}</Text>
                <Space height={20}/>
                <View style={{flexDirection:'row',marginHorizontal:16,}}>
                    {
                        buttonTwoText && (
                            <TouchableOpacity style={styles.buttonTwo} onPress={onClickButtonTwoAction}>
                                <Text style={{color:configs.colors.primaryColor}}>{buttonTwoText}</Text>
                            </TouchableOpacity>
                        )
                    }
                    {
                        buttonTwoText && (
                            <Space width={10}/>
                        )
                    }
                    {
                        buttonOneText && (
                            <TouchableOpacity style={styles.buttonOne} onPress={onClickButtonOneAction}>
                                <Text style={{color:'white'}}>{buttonOneText}</Text>
                            </TouchableOpacity>
                        )
                    }
                    
                </View>
            </View>
        </Modal>
    );

}

export default ModalBox;

const styles = StyleSheet.create({
    buttonOne:{
        height:48,
        backgroundColor:configs.colors.primaryColor,
        borderRadius:20,
        justifyContent:'center',
        // width:155,
        flex:0.5,
        alignItems:'center',
        alignSelf:'center'
    },
    buttonTwo:{
        height:48,
        backgroundColor:"white",
        borderRadius:20,
        borderWidth:1,
        borderColor:configs.colors.primaryColor,
        justifyContent:'center',
        // width:155,
        flex:0.5,
        alignItems:'center',
        alignSelf:'center'
    },
    modalContainer:{
        backgroundColor:'white',
        width:width - 48,
        borderRadius:8,
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center',
        paddingTop:31,
        paddingBottom:21,
    },
    circle_avatar:{
        backgroundColor:configs.colors.lightgreen,
        borderRadius:100,
        width:100,
        height:100,
        justifyContent:'center',
    }
})