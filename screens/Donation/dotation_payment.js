import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import {Space} from '../../components/space';
import configs from '../../utils/configs';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import paymentAction from '../../actions/paymentAction';
import {Linking} from 'react-native';
import {WebView} from 'react-native-webview';
import Loading from '../../components/Loading';
import utilities from '../../utils/utilities';
import Hyperlink from 'react-native-hyperlink'
const {width} = Dimensions.get('window');
import { HighlightedText } from  'react-native-highlighted-text'

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

class DontationPayments extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    selected_Payment: 0,
    modalVisible: false,
    paymentWebViewVisible: false,
    approved_link: '',
    order_id: '',
    paynow_data: null,
    is_loading: false,
    showQrCode: false,
    qrCodeImage: null,
    qrCodeExpired:false,
  };

  handlePaymentStatus = (status, data) => {
    this.setState({
      is_loading: false,
    });
    if (status == true) {
      if (data.approve_link != undefined) {
        this.props.navigation.navigate('Web View Component', {
          from: "donation",
          data: {
            uri: data.approve_link,
            order_id: data.order_id,
            merchandise: false
          },
        });
      } else {
        utilities.showToastMessage(
          "Can't get payment link from server",
          'warning',
        );
      }
    }
  };

  _handlePaymentWithPaynowStatus = (status, data) => {
    if (status == true && data) {
      this.setState({
        paynow_data: data,
      });
      this.setState({
        is_loading: false,
        showQrCode: true,
        qrCodeImage: data.image_data,
      });
    } else {
      this.setState({
        paynow_data: null,
        showQrCode: false,
      });
      this.setState({
        is_loading: false,
        showQrCode: false,
      });
      utilities.showToastMessage(
        "Can't get paynow QR code from server",
        'warning',
      );
    }
  };

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };

  componentDidMount() {
    this.setState({
      showQrCode: false,
      qrCodeImage: null,
    });
    this.props.route.params.item && console.log("donation id "+ this.props.route.params.item.id);
  }

  render() {
    const {
      route,
      is_loading_create_payment,
      is_loading_creating_payment_with_paynow,
    } = this.props;
    const {donationAmount, title, description} = route.params;
    // console.log(is_loading_creating_payment_with_paynow);
    return (
      <SafeAreaView style={styles.container}>
        {
          (this.state.is_loading == true && <Loading />)}
        <StatusBar
          translucent={true}
          backgroundColor={
            is_loading_create_payment == true ||
            is_loading_creating_payment_with_paynow == true ||
            this.state.is_loading == true
              ? '#00000020'
              : 'transparent'
          }
          barStyle="dark-content"
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              backgroundColor: 'white',
              margin: 16,
              padding: 10,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.18,
              shadowRadius: 1.0,
              elevation: 1,
              borderRadius: 15,
            }}>
            <Text style={{fontSize: 18, fontWeight: '600'}}>{title}</Text>

            {/* Content */}
            <Space height={20} />
            <Text>{description}</Text>
            <Space height={20} />
            <View style={styles.totalContainer}>
              <Text style={{fontSize: 24, fontWeight: '700'}}>Donate</Text>
              <Text style={{fontSize: 24, fontWeight: '600'}}>
                S${donationAmount}
              </Text>
            </View>

            {/* Credit */}
            {!this.state.showQrCode && this.state.qrCodeImage == null ? (
              <>
                <Space height={20} />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.dot}></View>
                  <Space width={5} />
                  <Text style={{fontSize: 16, fontWeight: '700'}}>
                    Payment Methods
                  </Text>
                </View>
                <Space height={20} />
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={[
                      styles.pay_image,
                      {
                        borderColor:
                          this.state.selected_Payment === 0
                            ? configs.colors.primaryColor
                            : '#f2f2f2',
                        borderWidth: this.state.selected_Payment === 0 ? 2 : 1,
                      },
                    ]}
                    onPress={() =>
                      this.setState({
                        selected_Payment: 0,
                      })
                    }>
                    <Image
                      source={require('../../assets/images/credit_card.png')}
                      style={{height: 50, width: 'auto', resizeMode: 'contain'}}
                    />
                    <Text
                      style={{
                        fontFamily: 'Open Sans',
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontSize: 16,
                        paddingTop: 10,
                        color: '#4075FF',
                        alignSelf: 'center',
                      }}>
                      Credit Card
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.pay_image,
                      {
                        borderColor:
                          this.state.selected_Payment === 1
                            ? configs.colors.primaryColor
                            : '#f2f2f2',
                        borderWidth: this.state.selected_Payment === 1 ? 2 : 1,
                      },
                    ]}
                    onPress={() =>
                      this.setState({
                        selected_Payment: 1,
                      })
                    }>
                    <Image
                      source={require('../../assets/images/pay_now.png')}
                      style={{height: 70, width: 'auto', resizeMode: 'contain'}}
                    />
                  </TouchableOpacity>
                </View>
                <Space height={50} />
                <TouchableHighlight
                  style={styles.button}
                  onPress={() => {
                    // this.setModalVisible(true);
                    if (this.state.selected_Payment == 0) {
                      this.setState({
                        is_loading: true,
                      });
                      this.props.createPayment(
                        'donation',
                        this.props.route.params.item.id,
                        this.props.userInfo.id,
                        'SGD',
                        donationAmount,
                        true,
                        this.handlePaymentStatus,
                      );
                      }
                    else {
                      this.setState({
                        is_loading: true,
                      });
                      this.props.createPaymentWithPaynow(
                        'donation',
                        this.props.route.params.item.id,
                        this.props.userInfo.id,
                        donationAmount,
                        true,
                        this._handlePaymentWithPaynowStatus,
                      );
                    }
                  }}>
                  <Text style={{color: 'white'}}>Checkout</Text>
                </TouchableHighlight>
                
               
              </>
            ) : (
              <>
              <TouchableOpacity
                onLongPress={()=>this.state.qrCodeExpired == false && utilities.checkPermission(`data:image/png;base64,${this.state.qrCodeImage}`)}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 24,
                }}>
                <Image
                  source={{
                    uri: `data:image/png;base64,${this.state.qrCodeImage}`,
                  }}
                  style={{
                    height: configs.width * 0.5,
                    width: configs.width * 0.5,
                  }}
                />
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
                    <Image source={require('../../assets/icons/ic_warning.png')} style={{height:48,width:53,resizeMode:'contain'}} />
                    <Text style={{color:'red',fontSize:12,alignSelf:'center'}}>This QR code</Text>
                    <Text style={{color:'red',fontSize:12,alignSelf:'center'}}>has expired</Text>
                  </View> 
                }
              </TouchableOpacity>
              <Space height={10}/>
              <View style={{width:'90%',alignSelf:'center'}}>
                <CountDown minutes={30} seconds={59} setOver={(value)=>{
                  this.setState({
                    qrCodeExpired:value,
                  })
                }}/>
              </View>
                <Space height={24} />
                <View style={{ marginBottom: 24, marginHorizontal: 5}}>

                  <Text style={{ fontFamily: configs.fontFamily.OPS700, fontSize: 12, marginBottom: 14}}>Please follow these instructions:</Text>
                  <View style={{ flexDirection: 'row', }}>
                    <Image source={require('../../assets/icons/check.png')} style={{ marginRight: 8, marginTop: 2, width: 12, height: 12}} />
                    <Text style={{ flex: 0.9, textAlign: 'justify', fontFamily: configs.fontFamily.OPS400, fontSize: 10}}>Save/Screenshot QR code to make payments using PayNow supporting apps.</Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 12 }}>
                    <Image source={require('../../assets/icons/check.png')} style={{ marginRight: 8, marginTop: 1,  width: 12, height: 12}} />
                    <Text style={{ flex:0.9, textAlign: 'justify', fontFamily: configs.fontFamily.OPS400, fontSize: 10}}>Make sure the recipient is Morning Star Community Services.</Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 12}}>
                    <Image source={require('../../assets/icons/check.png')} style={{ marginRight: 8,  marginTop: 2, width: 12, height: 12}} />
                    <Text style={{ textAlign: 'justify', flex: 0.9, fontFamily: configs.fontFamily.OPS400, fontSize: 10}}>After you have successfully made the payment, kindly return to Morning Star app to send the 
                    <Text style={{ fontFamily: configs.fontFamily.OPS700}}> transaction reference code</Text> shown on the success payment page on your banking app.</Text>
                  </View>
                  </View>  
                  <TouchableOpacity 
                    onPress={()=>{
                      const { payment_paynow_data,userInfo } = this.props;
                      this.props.navigation.navigate('PayNowQRScreen',{
                        data:{
                          parent_email:userInfo.email,
                          id:payment_paynow_data.id,
                        }
                      })
                    }}
                    style={{ backgroundColor: configs.colors.primaryColor, borderRadius: 20, height: 48, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{color: '#fff', fontFamily: configs.fontFamily.OPS700, fontSize: 14}}>Send transaction reference code</Text>
                  </TouchableOpacity>
            </>
                
              
            )}

            {/* Button  */}
            <Space height={60} />
            <View style={styles.centeredView}>
              <Modal
                hasBackdrop={true}
                backdropColor={'#000000'}
                backdropOpacity={0.5}
                animationType="slide"
                statusBarTranslucent={true}
                transparent={false}
                isVisible={this.state.modalVisible}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.'); //temporary behavior, retest on physical device
                }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <View
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        backgroundColor: '#7CD227',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={require('../../assets/images/SuccessfulPayment.png')}
                        style={{height: 65, width: 65, resizeMode: 'contain'}}
                      />
                    </View>

                    <Text style={styles.modalText}>Pay Successful</Text>

                    <TouchableHighlight
                      style={styles.openButton}
                      onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                      }}>
                      <Text style={styles.textStyle}>Ok</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createPayment: (
      payment_mode , donation_id ,parent_id,currency_code,total_amount, minimum, 
      handlePaymentStatus,
    ) =>
      dispatch(
        paymentAction.createPayment(
          payment_mode , donation_id ,parent_id,currency_code,total_amount, minimum, 
          handlePaymentStatus,
        ),
      ),
    getCompletePaymentStatus: (order_id) =>
      dispatch(paymentAction.getCompletePaymentStatus(order_id)),
    getPaymentStatus: (order_id) =>
      dispatch(paymentAction.getPaymentStatus(order_id)),
    createPaymentWithPaynow: (
      payment_mode,
      donation_id,
      parent_id,
      total_amount,
      minimum,
    
      handleCallback,
    ) =>
      dispatch(
        paymentAction.createPaymentWithPaynow(
          payment_mode,
          donation_id,
          parent_id,
          total_amount,
          minimum,
      
          handleCallback,
        ),
      ),
  };
};

const mapStateToProps = (state) => {
  return {
    userInfo: state.authState.userInfo,
    is_loading_creating_payment_with_paynow:
      state.paymentState.is_loading_creating_payment_with_paynow,
    is_loading_create_payment: state.paymentState.is_loading_create_payment,
    payment_success: state.paymentState.payment_success,
    is_loading_check_payment_status:
      state.paymentState.is_loading_check_payment_status,
    is_loading_complete_payment_status:
      state.paymentState.is_loading_complete_payment_status,
    payment_status: state.paymentState.payment_status,
    payment_paynow_data: state.paymentState.payment_paynow_data,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DontationPayments);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: configs.colors.backgroundColor,
  },
  pay_image: {
    // width:150,
    // alignItems:'center',
    justifyContent: 'center',
    padding: 5,
    flex: 1,
    height: 140,
    borderRadius: 15,
    marginHorizontal: 5,
    borderColor: '#f2f2f2',
    borderWidth: 1,
  },
  totalContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f6f6f6',
    maxWidth: '100%',
    minHeight: 51,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    borderRadius: 8,
    alignItems: 'center',
  },
  button: {
    height: 48,
    backgroundColor: configs.colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20,
  },
  dot: {
    backgroundColor: configs.colors.primaryColor,
    height: 12,
    width: 12,
    borderRadius: 12,
  },
  card: {
    borderRadius: 8,
    borderColor: '#f2f2f2',
    borderRadius: 8,
    height: 48,
    borderWidth: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#DADADA',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  openButton: {
    padding: 10,
    elevation: 2,
    width: 150,
    height: 48,
    backgroundColor: '#4075FF',
    borderRadius: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    height: '100%',
    alignSelf: 'center',
    paddingTop: 5,
    fontSize: 16,
  },
  modalText: {
    marginVertical: 20,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    color: '#000000',
  },
});
