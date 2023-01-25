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
  StatusBar
} from 'react-native';
import Modal from 'react-native-modal';
import configs from '../../../../../utils/configs';
import {connect} from 'react-redux';
import paymentAction from '../../../../../actions/paymentAction';
import Loading from '../../../../../components/Loading';
import AsyncStorage from '@react-native-community/async-storage';
import homeAction from '../../../../../actions/homeAction';

const {width} = Dimensions.get('window');


class MerchandisePayNowQR extends Component {
  state = {
    email: '',
    ref_id: '',
    order_id: '',
    modalVisible: false,
  };
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   // do things with nextProps.someProp and prevState.cachedSomeProp
  //   return {
  //     email: nextProps.userInfo.email,
  //     //order_id: nextProps.ordered_data.id
  //     // ... other derived state properties
  //   };
  // }
  componentDidMount() {
    console.log(" order id = "+ this.props.route.params.order_id);
    console.log(" id "+ this.props.route.params.id);
    this.setState({order_id: this.props.route.params.order_id });
  }
  
  handlePaymentStatus = async ( status ) =>{
    console.log("payment status "+ status);
    
    if(status == true){
      // this.setState({
      //   modalVisible: true,
      // })
      // await AsyncStorage.setItem(configs.constant.AS_KEY.CARTS,JSON.stringify([]));
      // this.props.setCountOfCartItems(0);
      this.props.navigation.popToTop();
      this.props.navigation.navigate('MerchandiseParentScreen');
      this.props.navigation.navigate('PaymentSuccess', {
        status : true,
        order_id: this.state.order_id
      });
    }else{
      this.props.navigation.popToTop();
      this.props.navigation.navigate('MerchandiseParentScreen');
      this.props.navigation.navigate('PaymentSuccess', {
          status : false,
          order_id: ""
      });
      // utilities.showToastMessage("Can't make payment","warning");
    }
  }
  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };
  render() {
    const { userInfo} = this.props;
    //const {order_id, id} = this.props.route.params;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar translucent={true} backgroundColor={this.props.is_loading_send_transaction_code ? '#00000020' : 'transparent'}/>
        { 
            this.props.is_loading_send_transaction_code &&
            <Loading />
        }
        <View style={styles.formContainer}>
          <View style={{marginBottom: 20}}>
            <Text style={styles.title}>Order ID</Text>
            <View>
              <View style={{ backgroundColor: '#F6F6F6', borderWidth: 1, borderColor: "#DADADA", borderRadius: 20, height: 44, paddingHorizontal: 10,
                justifyContent: 'center', marginTop: 10}}>
                <Text style={{ fontSize: 14, }}>{this.state.order_id}</Text>
              </View>
            </View>
          </View>
          <View style={{marginBottom: 20}}>
            <Text style={styles.title}>Transaction reference code</Text>
            <View>
              <TextInput
                style={styles.drop}
                value={this.state.ref_id}
                onChangeText={(val) => this.setState({ref_id: val})}
              />
            </View>
          </View>
          <View style={{marginBottom: 20}}>
            <Text style={styles.title}>Email</Text>
            <View>
              <TextInput
                style={styles.drop}
                value={userInfo.email}
                onChangeText={(val) => this.setState({email: val})}
              />
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
            onPress={() => {

              //need to ask Thwin or Paing Hmu Ko about this
              /*if(this.props.ordered_data.length != 0) {
                const details = this.props.ordered_data.details;
                let order_details_id = [];
                for (let index = 0; index < details.length; index++) {
                  const element = details[index];
                  order_details_id.push(element.id);
                }
                this.props.postOrderedMerchandiseStatus(this.state.order_id,this.props.userInfo.id,order_details_id, "ordered");
              }*/

              // this.setState({
              //   modalVisible: true,
              // })
              console.log('Ordered data ');
              console.log(this.props.ordered_data);
              (this.props.route.params.id != "" && this.props.route.params.id != undefined && this.props.route.params.id != null) ?
              (this.state.order_id != undefined && userInfo.email != "" && this.state.ref_id != "") &&
              this.props.sendTransRef(this.props.route.params.id, this.state.order_id, this.state.ref_id, userInfo.email, "merchandising", this.handlePaymentStatus) :
              Alert.alert("Errors ","Field Empty")
            
            }
            }>
            <Text style={{color: '#fff', fontWeight: '700'}}>Send</Text>
          </TouchableOpacity>

          <View style={styles.centeredView}>
            <Modal
              hasBackdrop={true}
              backdropColor={'#000000'}
              backdropOpacity={0.5}
              transparent={true}
              isVisible={false}
              statusBarTranslucent={true}
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
                      source={require('../../../../../assets/images/ic_thanks.png')}
                      style={{height: 65, width: 65, resizeMode: 'contain'}}
                    />
                  </View>

                  <Text style={styles.modalText}>Thank you</Text>

                  <TouchableHighlight
                    style={styles.openButton}
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                      this.props.navigation.navigate('MerchandiseParentScreen');
                    }}>
                    <Text style={styles.textStyle}>Ok</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.authState.userInfo,
        ordered_data: state.homeState.ordered_data,
        isLoading: state.homeState.isLoading,
        is_loading_send_transaction_code: state.paymentState.is_loading_send_transaction_code
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
      sendTransRef: (id, order_id, transaction_ref, parent_email,payment_mode, handleCallbackSendTransactionCode) => dispatch(paymentAction.sendTransRef(id, order_id, transaction_ref, parent_email,payment_mode, handleCallbackSendTransactionCode)),
      setCountOfCartItems: (value) => dispatch( homeAction.setCountOfCartItems(value)),
      postOrderedMerchandiseStatus: (id, updated_by, order_details_id, status) =>
      dispatch(
        homeAction.postOrderedMerchandiseStatus(
          id, updated_by, order_details_id, status
        ),
      ),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(MerchandisePayNowQR);
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