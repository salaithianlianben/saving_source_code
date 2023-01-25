import { WebView } from 'react-native-webview';
import React, { Component } from 'react'
import { ActivityIndicator, View, Image, Text, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import configs from '../../utils/configs';
import { connect } from 'react-redux';
import * as constants from '../../utils/constants';
import IconButton from '../../components/icon_button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import utilities from '../../utils/utilities';

class DonationWeb extends Component {
    state = {
        backButtonEnabled: false
    };
    constructor(props) {
        super(props);
        this.WEBVIEW_REF = React.createRef();
    }

    _renderLoading = () => {
        return (
            <View style={{position: 'absolute',justifyContent:'center',alignItems:'center',height:configs.height,width:configs.width}}>
                <>
                    <ActivityIndicator size={24} color={configs.colors.primaryColor}/>
                    <Text style={{alignSelf:'center'}}>Loading ....</Text>
                </>
            </View>
        );
    }

    goBack = () =>{
        console.log('Webview back click !!!');
        if(this.state.backButtonEnabled)
           // this.webview.current.goBack();
           this.WEBVIEW_REF.current.goBack();
    }

    onNavigationStateChange = (navState) => {
        this.setState({
            backButtonEnabled: navState.canGoBack,
        });
    };
    
    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: configs.colors.white}}>
            <View style={styles.headerStyle}>
                <View style={{flex:0.1, paddingLeft: 8, alignItems: 'flex-start'}}>
                {this.state.backButtonEnabled ? <IconButton 
                  icon={
                    <Ionicons
                      name="chevron-back"
                      size={22} color={"black"}
                    />
                  }
                  onPress={() => this.goBack()}
                />:null}
                
                </View>
                <View style={{flex: 0.8, alignSelf: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>Donation</Text>
                </View>
                
            </View>
                <WebView
                    //ref={this._refWebView}
                    ref={this.WEBVIEW_REF}
                    originWhitelist={['*']}
                    renderLoading={this._renderLoading}
                    startInLoadingState={true}
                    source={{ uri:constants.DONATION_WEBSITE_URL, }}
                    onNavigationStateChange={this.onNavigationStateChange}
                    // onNavigationStateChange={ async (event) => {
                    //     //console.log("event : ");
                    //     //console.log(event);
                    //   if(event.url != null && event.url != undefined && event.url != "") {
                    //     utilities.openURLInBrowser(event.url);
                    //   }  
                    // }}
                />
            </SafeAreaView>

        )
    }
}

const styles = StyleSheet.create({
    headerStyle: { 
        flexDirection:'row',
        width:'100%',height:50,
        alignItems:'center',
        backgroundColor:'white', 
        marginTop: Platform.OS == 'ios' ?  0   : StatusBar.currentHeight, 
      },
  });

export default  connect(null,null)(DonationWeb);