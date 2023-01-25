import React, {Component} from 'react';
import {View, StyleSheet, Image, Text,} from 'react-native';
import configs from '../utils/configs';

class MaintenanceScreen extends Component {

  NetInfoSubscribtion = null;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    
  }

  render(){
    return (
      <View style={styles.container}>

        <Image
          source={require('../assets/images/img_maintenance.png')}
          style={{
            height:configs.width/2 + 40,
            width:configs.width/2 + 40,
            resizeMode:'cover',
          }}
        />

          <Text style={{marginTop: 40,color:configs.colors.light_bluegray,fontSize:24,lineHeight:33,fontFamily:configs.fontFamily.OPS700}}>
            We’ll be back.</Text>
          <Text style={{marginTop: 16, marginHorizontal: 25,textAlign: 'center',color:configs.colors.light_bluegray,fontSize:14,lineHeight:19,fontFamily:configs.fontFamily.OPS400}}>
            We’re busy updating the Morning Star App for you. Please check back soon.</Text>
      </View>
    );
  }
}

export default MaintenanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: configs.colors.backgroundColor,
  },
});