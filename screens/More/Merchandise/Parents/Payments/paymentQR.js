import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import configs from '../../../../../utils/configs';
import {connect} from 'react-redux';
import utilities from '../../../../../utils/utilities';
import { Space } from '../../../../../components/space';
import { HighlightedText } from  'react-native-highlighted-text';
import Dialog from "react-native-dialog";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { backgroundColor } from '../../../../../components/calendars/style';

const CountDown = ({ minutes = 0, seconds = 0 , setOver }) => {
    const [time, setTime] = React.useState({
      minutes: parseInt(minutes, 10),
      seconds: parseInt(seconds, 10)
    });
  
    const tick = () => {
  
      // Time up
      if (time.minutes === 0 && time.seconds === 0) {
        setOver(true);
      } else if (time.minutes === 0 && time.seconds === 0) {
        // decrement hour
        setTime({
          minutes: 59,
          seconds: 59
        });
      } else if (time.seconds === 0) {
        // decrement minute
        setTime({
          minutes: time.minutes - 1,
          seconds: 59
        });
      } else {
        // decrement seconds
        setTime({
          minutes: time.minutes,
          seconds: time.seconds - 1
        });
      }
    };
  
    // Resets to original state
    const reset = () => {
      setTime({
        minutes: parseInt(minutes),
        seconds: parseInt(seconds)
      });
      setOver(false);
    };
  
    React.useEffect(() => {
      // Works similar to componentDidMount
      let timerID = setInterval(() => tick(), 1000);
  
      // Works similar to componentWillUnmount, do clean up in return function of
      // useEffect
      return () => clearInterval(timerID);
  
      // there is no second argument to useEffect, so it acts as componentDidUpdate
    });
  
    var getMin = time.minutes
    .toString()
    .padStart(2, '0');
  
    var getSec = time.seconds.toString().padStart(2, '0');
  
    var value = `Please kindly proceed to payment before the QR code expire. It will expire in [[${getMin}]] mins [[${getSec}]] secs`;
  
    return (
      <HighlightedText
      style={{
        alignSelf:'center',
        fontSize:12
      }}
        highlightedTextStyles={[
          {
            color:configs.colors.primaryColor
          },{
            color:configs.colors.primaryColor
          }
        ]}
      >
        {value}
      </HighlightedText>
    );
  }

class PaymentQR extends Component {
    state = {
        qrCodeExpired:false,
        is_cancel_order:false,
    }

    _renderCancelOrderDialog = ( visible, onClose ) => {
      return (
        <Dialog.Container
          visible={visible}
          contentStyle={{
            borderRadius:8,
            backgroundColor: 'white'}}
          blurComponentIOS={<View></View>}>
          <Ionicons 
            size={30} 
            color={configs.colors.primaryColor} 
            name="close-circle-outline" 
            style={{
              alignSelf:'flex-end',
              justifyContent:'flex-end',
              position:'absolute',
              top:5,right:10}} 
              onPress={onClose}/>
              
          <View 
            style={{
              alignSelf:'center',
              alignItems:'center',
              justifyContent:'center',
              backgroundColor: 'white',
              marginTop: 15,
              marginBottom: 15,}}>
            <Text style={{fontSize:16, fontWeight:'bold'}}>
                The order has been submitted
            </Text>
            <Space height={20}/>
            <Text style={{alignSelf:'center', textAlign: 'center', marginLeft: 15, marginRight: 15}}>
              Please make payment within 48 hours, otherwise it will be cancelled
            </Text>
            <Space height={20}/>
            <TouchableOpacity 
              onPress={()=> {
                this.props.navigation.popToTop();
                this.props.navigation.push('Order Lists', {initialPage: 1});
              }} 
              style={{alignSelf:'center',backgroundColor:configs.colors.primaryColor,borderRadius:20,}}>
              <Text 
                style={{
                  paddingHorizontal:20,
                  paddingVertical:10,
                  color:'white',
                  fontWeight:'bold'}}>
                    Got it
              </Text>
            </TouchableOpacity>
          </View>
        </Dialog.Container>
      )
    }

    render() {
        return (
            <ScrollView style={{backgroundColor:configs.colors.backgroundColor}} showsVerticalScrollIndicator={false} contentContainerStyle={{ backgroundColor : configs.backgroundColor, paddingHorizontal: 16, paddingVertical: 16}}>
                <View 
                style={{ 
                    backgroundColor: "#fff", 
                    borderRadius: 20, 
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.20,
                    shadowRadius: 1.41, elevation: 2,
                    paddingHorizontal: 16,
                    paddingVertical: 16
                    }}>
                     <View style={{ backgroundColor: configs.colors.grey1, borderWidth: 1, borderRadius: 8, borderColor: configs.colors.lightgrey, height: 81, paddingHorizontal: 8, justifyContent: 'space-between', alignItems: 'center', marginBottom: 34, flexDirection: "row"}}>
                        <Text style={{ fontSize: 24, fontFamily: configs.fontFamily.OPS600}}>Total</Text>
                        <Text style={{ fontSize: 24, fontFamily: configs.fontFamily.OPS600}}>S$ {this.props.route.params.data.total_amount}</Text>
                     </View>
                     <View  style={{ justifyContent: 'center', alignItems: 'center', }}>
                        {/* <Image source={require('../../../../../assets/images/QR.png')} style={{ width: 197, height: 200}} /> */}
                        <TouchableOpacity onLongPress={()=>{ this.state.qrCodeExpired == false && utilities.checkPermission(`data:image/png;base64,${this.props.route.params.data.image_data}`)}}>
                            <Image source={{uri: `data:image/png;base64,${this.props.route.params.data.image_data}`}} style={{ height: configs.width * 0.5,
                    width: configs.width * 0.5,}} /> 
                            {
                                this.state.qrCodeExpired == true && <View
                                    style={{
                                    height: configs.width * 0.5,
                                    width: configs.width * 0.5,
                                    backgroundColor:'#ffffff80',
                                    justifyContent:'center',
                                    alignItems:'center',
                                    position:'absolute',
                                    }}
                                >
                                    <Image source={require('../../../../../assets/icons/ic_warning.png')} style={{height:48,width:53,resizeMode:'contain'}} />
                                    <Text style={{color:'red',fontSize:12,alignSelf:'center'}}>This QR code</Text>
                                    <Text style={{color:'red',fontSize:12,alignSelf:'center'}}>has expired</Text>
                                </View> 
                                }
                        </TouchableOpacity>
                        
                     </View>
                     <Space height={20}/>
                     <View style={{width:'90%',alignSelf:'center'}}>
                        <CountDown minutes={30} seconds={59} setOver={(value)=>{
                            this.setState({
                                qrCodeExpired:value,
                            })
                            }}/>
                    </View>
                    <Space height={10}/>
                     <View style={{ marginBottom: 24, marginHorizontal: 5}}>

                        <Text style={{ fontFamily: configs.fontFamily.OPS700, fontSize: 12, marginBottom: 14}}>Please follow these instructions:</Text>
                        <View style={{ flexDirection: 'row', }}>
                            <Image source={require('../../../../../assets/icons/check.png')} style={{ marginRight: 8, marginTop: 2, width: 12, height: 12}} />
                            <Text style={{ flex: 0.9, textAlign: 'justify', fontFamily: configs.fontFamily.OPS400, fontSize: 10}}>Save/Screenshot QR code to make payments using PayNow supporting apps.</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Image source={require('../../../../../assets/icons/check.png')} style={{ marginRight: 8, marginTop: 1,  width: 12, height: 12}} />
                            <Text style={{ flex:0.9, textAlign: 'justify', fontFamily: configs.fontFamily.OPS400, fontSize: 10}}>Make sure the recipient is Morning Star Community Services.</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 12}}>
                            <Image source={require('../../../../../assets/icons/check.png')} style={{ marginRight: 8,  marginTop: 2, width: 12, height: 12}} />
                            <Text style={{ textAlign: 'justify', flex: 0.9, fontFamily: configs.fontFamily.OPS400, fontSize: 10}}>After you have successfully made the payment, kindly return to Morning Star app to send the 
                            <Text style={{ fontFamily: configs.fontFamily.OPS700}}> transaction reference code</Text> shown on the success payment page on your banking app.</Text>
                        </View>
                 
                    </View>  
                     <TouchableOpacity onPress={() => {
                       this.props.navigation.navigate('merchandise PayNow QR',
                       {id:this.props.route.params.data.id, 
                        order_id: this.props.route.params.data.ref_id});
                      }
                     } style={styles.send_btn}>
                        <Text style={{ fontSize: 14, fontFamily: configs.fontFamily.OPS700, color: '#fff'}}>Send transaction reference code</Text>
                     </TouchableOpacity>
                     <Space height={10}/>
                     <TouchableOpacity onPress={()=>this.setState({
                       is_cancel_order:true,
                     })} style={styles.cancel_btn}>
                        <Text style={{ fontSize: 14, fontFamily: configs.fontFamily.OPS700, color: 'red'}}>Cancel</Text>
                     </TouchableOpacity>
                </View>
                { this._renderCancelOrderDialog(this.state.is_cancel_order,()=>this.setState({
                  is_cancel_order:false,
                }))}
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.authState.userInfo,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
    };
};
export default connect(mapStateToProps, null)(PaymentQR);
const styles =  StyleSheet.create({
    send_btn: {
        height: 48, 
        alignItems: 'center',
        backgroundColor: configs.colors.primaryColor,
        borderRadius: 20,
        justifyContent: 'center'
    },
    cancel_btn:{
      height: 48, 
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        justifyContent: 'center',
        borderWidth:1,
        borderColor:'red',
    }
})