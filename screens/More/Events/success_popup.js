import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, StatusBar } from 'react-native';
import Modal from 'react-native-modal';
import configs from '../../../utils/configs';
import ButtonBlue from '../../../components/buttonBlue';

class PopSuccessfulSend extends React.Component {    

    render() {
        let { isVisibles, onCloseModals } = this.props;
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
                isVisible={isVisibles}>
                <View  style={styles.container}>
                    <Image 
                        style={styles.backgroundImage}                   
                        source={require('../../../assets/images/ic_send_successful.png')}
                    />
                    <Text style={styles.titleText}>Your message has been{'\n'}successfully sent</Text>
                    <View style={{flexDirection:'column'}}>
                        <View style={{width:155}}>
                            <ButtonBlue 
                            styleText={{fontSize:14}}
                            title='Ok' onPress={()=>onCloseModals()}/>
                        </View>
                    </View>
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
        height: 283,
        width:327,
        backgroundColor: configs.colors.white,
        borderRadius:8,
        borderWidth:1,
        borderColor:configs.colors.lightgrey,
        alignItems:'center',
        paddingBottom:23,
        paddingTop:31
    },  

    backgroundImage: {
        height: 100,
        width: 100,
        resizeMode:'contain',
    },

    titleText:{
        paddingTop:16,
        paddingBottom:25,
        fontFamily:configs.fontFamily.OPS600,
        fontSize: 16,
        textAlign: 'center',
    }

});

export default PopSuccessfulSend;
