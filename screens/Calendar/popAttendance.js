import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import Modal from 'react-native-modal';
import configs from '../../utils/configs';
import ButtonBlue from '../../components/buttonBlue';
import ButtonBorderBlue from '../../components/buttonBorderBlue';

class PopAttendance extends React.Component {
    constructor(props) {
        super(props);
      
        };
    

    render() {
        let { isVisible, onCloseModal } = this.props;
        return (
            <Modal
                onBackdropPress={onCloseModal}
                style={{
                    flex:1,
                    justifyContent:'center',
                    alignSelf:'center'
                }}
                useNativeDriver
                hideModalContentWhileAnimating
                isVisible={isVisible}>
                      <View  style={styles.container}>
                        
                           <Image
                                      style={styles.backgroundImage}                   
                   
                            source={require('../../assets/icons/ic_attendance.png')}
                            />

                     <Text style={{...styles.titleText,paddingTop:9,color:configs.colors.primaryColor}}>2020 Aug 25 Fri</Text>
                    
                     <Text style={{...styles.titleText,paddingTop:2,color:configs.colors.black}}>Mandy's Attendance</Text>

                    <View style={{flexDirection:'row',justifyContent:'space-evenly',marginTop:25}}>
                    <ButtonBorderBlue style={{width:136,marginRight:3}}title='Absence'/>
                    <ButtonBlue style={{width:136,marginLeft:3}}title='Attendance'/>
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
        height: 281,
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

    iconImage: {
        flex:1,
        height: 40,
        width: 41,
        resizeMode:'contain',
        alignSelf:'center',
        alignContent:'center'
    },  

    titleText:{
        paddingTop:9,
        fontFamily:configs.fontFamily.OPS600,
        fontSize: 16
    }

});

export default PopAttendance;
