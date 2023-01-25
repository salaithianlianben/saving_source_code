import React, { Component } from 'react';
import { ScrollView,View,SafeAreaView,Text,StyleSheet, Image,Dimensions} from 'react-native';
// import { RawButton } from 'react-native-gesture-handler';
import * as constants from '../../../utils/constants';
import configs from '../../../utils/configs';

const { width } = Dimensions.get("window");
const NO_WIDTH_SPACE = '​';
const hyperTextClick = (string, props) =>
    string.split(' ').map((word, i) => (
      <Text key={i}>
        <Text 
          style={styles.hyperTextStyle}
          onPress={() => {
                props.navigation.navigate('Web View Component',{
                    from:'handbook',
                       data:{
                           uri:Platform.OS === 'android'
                           ? constants.HandBookPDFLink_Android
                           :constants.HandBookPDKLink,
                           order_id:'',
                       },
                   })
          }}>{word} </Text>
        {NO_WIDTH_SPACE}
      </Text>
    ));

export default class HandbooksScreen extends Component {
    render() {
        return (
            <SafeAreaView
                style={styles.container}>

                <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
                    <View style={styles.imageContainer}>
                        <Image source={require('../../../assets/images/handbook_image.jpg')} style={{height:'100%',width:'100%',resizeMode:'contain'}} />
                        {/* <View style={{position: 'absolute',bottom:40,left:30,}}>
                            <Text style={{color:'white',fontWeight:'bold',fontSize:24,}}>Handbook</Text>
                            <Text style={{color:'white',fontSize:16,}}>Quick guide to new parents of our school</Text>
                        </View> */}
                    </View>
                    <View style={{paddingVertical:configs.margin.leftRightmargin, paddingHorizontal:configs.margin.leftRightmargin,}}>
                        <Text style={styles.bodyTextStyle}>{constants.HandBookText} Please{hyperTextClick(' click here ', this.props)}for the full version of the Parent's Handbook</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    body:{
        
    },
    imageContainer:{
        height:310,
        width
    },
    bodyTextStyle:{
      color: configs.colors.black,
      fontSize: 14,
      fontFamily:configs.fontFamily.OPS400,
      lineHeight: 19,
    },
    hyperTextStyle: {
      color: 'blue',
      fontSize: 14,
      fontFamily:configs.fontFamily.OPS400,
      lineHeight: 19,
    },
})