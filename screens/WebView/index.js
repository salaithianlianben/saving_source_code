import { WebView } from 'react-native-webview';
import React, { Component } from 'react'
import { ActivityIndicator, View,Image,Text } from 'react-native';
import configs from '../../utils/configs';
import MORNINGSTAR_URL_DEV from '../../utils/configs';
import { connect } from 'react-redux';
import paymentAction from  '../../actions/paymentAction';
import { DotsLoader } from 'react-native-indicator';
import homeAction from '../../actions/homeAction';
import Loading from '../../components/Loading';
class WebViewComponent extends Component {

    state = {
        isLoading:false,
    }

    _renderLoadingForHandbook = () => {
        return (
            <View style={{position: 'absolute',justifyContent:'center',alignItems:'center',height:configs.height,width:configs.width,}}>
                <ActivityIndicator size={24} color={configs.colors.primaryColor}/>
                <Text style={{alignSelf:'center'}}>Loading ....</Text>
            </View>
        )
    }

    _renderLoading = () => {
        return (
            <View style={{position: 'absolute',justifyContent:'center',alignItems:'center',height:configs.height,width:configs.width}}>
                    {
                        this.props.route.params.from != "handbook" ? 
                        <>
                         <View style={{flexDirection:'row'}}>
                        <View style={{height:80,width:80,borderRadius:80,backgroundColor:'#4075FF',justifyContent:'center'}}>
                            <Image source={require('../../assets/icons/ic_ms_icon.png')} style={{width:37,height:48, alignSelf:'center',resizeMode:'contain'}} />
                        </View>
                        <View style={{height:80,alignItems:'center',justifyContent:'center',marginHorizontal:5,}}>
                            <DotsLoader size={5}/>
                        </View>
                        <View style={{height:80,width:80,borderRadius:80,backgroundColor:'#D1EAFF',justifyContent:'center'}}>
                            <Image source={require('../../assets/icons/ic_paypal_icon.png')} style={{width:37,height:48, alignSelf:'center',resizeMode:'contain'}} />
                        </View>
                    </View>

                    <View style={{height:40}}/>
                    
                    <Text style={{fontSize:24,fontWeight:'bold'}}>Loading...</Text></> :<>
                    
                    <ActivityIndicator size={24} color={configs.colors.primaryColor}/>
                    <Text style={{alignSelf:'center'}}>Loading ....</Text></>
                    }
                   

            </View>
        );
    }
    
    render() {
        const successURL = configs.constant.PAYPAL_SUCCESS_URL;
        console.log("paypal success callback URL : " +successURL);
        console.log(this.props.route.params);
        return (
            <View style={{height:configs.height,width:configs.width}}>
                {this.props.is_loading_complete_payment_status && <Loading/>}

                <WebView
                    onNavigationStateChange={ async (event) => {
                        //console.log("event : ");
                        //console.log(event);
                      if(event.url != null && event.url != undefined && event.url != "") {
                          console.log('Calling Complete API with token ... '+ event.url);
                          
                        if (event.url.toString().includes(successURL)) {
                            console.log('Contain ? '+ successURL);
                            //https://morningstar-dev.web.app/paysuccess.html?ref_id=MS95873KA&ref_type=merchandising&token=71S08250R8058351C&PayerID=ADMEWKLCEJM24
                            if (!this.props.is_loading_complete_payment_status){
                                let paypalToken = event.url.split("token=").pop().split("&")[0];
                                console.log('token = '+ paypalToken);
                                this.props.getCompletePaymentStatus(paypalToken);
                            }
                        }
                        if(event.url == configs.constant.MORNINGSTAR_URL || event.url == MORNINGSTAR_URL_DEV) {
                              //no need to call on app anymore
                              if(this.props.route.params.data.merchandise) {
                                console.log('Paypal payment for merchandise success.');
                                //await AsyncStorage.setItem(configs.constant.AS_KEY.CARTS,JSON.stringify([]));
                                //this.props.setCountOfCartItems(0);
                                 
                                //need to ask Thwin or Paing Hmu Ko about this
                                /*if(this.props.ordered_data.length != 0) {
                                    const details = this.props.ordered_data.details;
                                    let order_details_id = [];
                                    for (let index = 0; index < details.length; index++) {
                                      const element = details[index];
                                      order_details_id.push(element.id);
                                    }
                                    this.props.postOrderedMerchandiseStatus(this.props.ordered_data.id,this.props.userInfo.id,order_details_id, "ordered");
                                }*/
                                // this.props.navigation.navigate('More');
                                // this.props.navigation.navigate('MerchandiseParentScreen');
                                this.props.navigation.goBack();
                              } else {
                                this.props.navigation.goBack();
                              }
                          }
                      }  
                    }}
                    originWhitelist={['*']}
                    renderLoading={this._renderLoading}
                    startInLoadingState={true}
                    ref={(ref) => { this.webview = ref; }}
                    source={{ uri:this.props.route.params.data.uri }}
                />
            </View>

        )
    }
}

const mapStateToProps = (state) => {
    return {
       
        ordered_data: state.homeState.ordered_data,
        userInfo: state.authState.userInfo,
        is_loading_complete_payment_status: state.paymentState.is_loading_complete_payment_status,
    };
};
const mapDispatchToProps = dispatch => {

    return {
        getCompletePaymentStatus: ( order_id ) => dispatch(paymentAction.getCompletePaymentStatus( order_id)),
        setCountOfCartItems: (value) => dispatch( homeAction.setCountOfCartItems(value)),
        postOrderedMerchandiseStatus: (id, updated_by, order_details_id, status) =>
        dispatch(
        homeAction.postOrderedMerchandiseStatus(
          id, updated_by, order_details_id, status
        ),
      ),
    }

}
export default  connect(mapStateToProps,mapDispatchToProps)(WebViewComponent);