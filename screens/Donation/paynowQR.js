import React, {Component} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  TouchableHighlight,
  Alert,
  StatusBar,
  Modal,
} from 'react-native';
import configs from '../../utils/configs';
// import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import paymentAction from '../../actions/paymentAction';
import Loading from '../../components/Loading';
import DonationPaymentSuccess from './payment_success';

const {width} = Dimensions.get('window');

class PayNowQRScreen extends Component {
  state = {
    email: '',
    transaction_code:'',
    modalVisible: false,
    
    isSubmitting:false,
    isSuccessSendingTrans:false,
  };

  handleCallback = (status) =>{
    this.setState({
      isSubmitting:false
    })
    if(status == true){
      this.setState({
        modalVisible:true,
        isSuccessSendingTrans:true,
      });
      // this.props.navigation.push('DonationPaymentSuccess',{ isSuccess : true,})
    }else{
      // this.props.navigation.push('DonationPaymentSuccess',{ isSuccess :false,})
      this.setState({
        modalVisible:true,
        isSuccessSendingTrans:false,
      });
    }
  }

  componentDidMount() {
    this.setState({
      email: this.props.route.params.data.parent_email,
    });
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar translucent={true} backgroundColor={this.state.isSubmitting ? '#00000020' : 'transparent'}/>
        {
          this.state.isSubmitting == true && <Loading />
        }
        <View style={styles.formContainer}>
          {/* <View style={{marginBottom: 20}}>
            <Text style={styles.title}>Order ID</Text>
            <View>
              <TextInput
                style={styles.drop}
                value={this.state.order_id}
                onChangeText={(val) => this.setState({order_id: val})}
              />
            </View>
          </View> */}
          <View style={{marginBottom: 20}}>
            <Text style={styles.title}>Transaction reference code</Text>
            <View>
              <TextInput
                style={styles.drop}
                value={this.state.transaction_code}
                onChangeText={(val) => this.setState({transaction_code: val})}
              />
              {/* <Text>{ this.state.ref_id}</Text> */}
            </View>
          </View>
          <View style={{marginBottom: 20}}>
            <Text style={styles.title}>Email</Text>
            <View style={styles.drop}>
              {/* <TextInput
                style={styles.drop}
                value={this.state.email}
                onChangeText={(val) => this.setState({email: val})}
              /> */}
              <Text>{ this.state.email}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#4075FF',
              borderRadius: 999999,
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() =>
              {
                this.setState({
                  isSubmitting:true,
                });
                this.props.sendTransRef(this.props.route.params.data.id,null,this.state.transaction_code,this.state.email,"donation",this.handleCallback)
              }
              
            }>
            <Text style={{color: '#fff', fontWeight: '700'}}>Send</Text>
          </TouchableOpacity>
        </View>

        {
          this.state.modalVisible === true && 
          <Modal
            isVisible={this.state.modalVisible}
            statusBarTranslucent={true}
            
          >
            <View
            style={{
              height:configs.height,
              width:configs.width
            }}
            >
              <DonationPaymentSuccess navigation={this.props.navigation} isSuccess={this.state.isSuccessSendingTrans} onCloseModal={()=>this.setState({
                modalVisible:false,
              })}/>
            </View>
          </Modal>
        }
      </SafeAreaView>
    );
  }
}

const bindDispatch = dispatch =>{
  return {
    sendTransRef: (id, order_id, transaction_ref, parent_email,payment_mode, handleCallbackSendTransactionCode) => dispatch(paymentAction.sendTransRef(id, order_id, transaction_ref, parent_email,payment_mode, handleCallbackSendTransactionCode)),
  }
}
export default connect(null,bindDispatch)(PayNowQRScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: configs.colors.backgroundColor,
  },
  formContainer: {
    height: 609,
    backgroundColor: '#fff',
    width: width / 1.1,
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 15,
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: '600',
  },
  drop: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 999999,
    height: 44,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btn: {
    borderColor: '#4075FF',
    borderWidth: 1,
    width: width / 2.6,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    borderRadius: 999999,
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