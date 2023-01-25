import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import configs from '../../../../utils/configs';
import MerchandiseTabsComponent from './Tabs';
 
class MerchandiseScreenFacilitator extends Component {
  render() { 
    return (
      <SafeAreaView style={{height:'100%',backgroundColor:configs.colors.backgroundColor,}}>
        <MerchandiseTabsComponent navigation={this.props.navigation}/>
      </SafeAreaView>
    );
  }
}
 
export default MerchandiseScreenFacilitator;