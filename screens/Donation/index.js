import React, {Component} from 'react';
import {
  Alert,
  TextInput,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  StatusBar,
  KeyboardAvoidingView
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {connect} from 'react-redux';
import {Space} from '../../components/space';
import configs from '../../utils/configs';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CollapsibleToolbar from '../../components/CollapsibleToolbar';
const {width} = Dimensions.get('window');

class DonationScreen extends Component {
  state = {
    data: [
      {id: 1, price: 5, name: 'S$5'},
      {id: 2, price: 10, name: 'S$10'},
      {id: 3, price: 20, name: 'S$20'},
      {id: 4, price: 50, name: 'S$50'},
      {id: 5, price: 100, name: 'S$100'},
      {id: 6, price: 0, name: 'Others'},
    ],
    selectedData: 0,
    isOthers: false,
    othersAmount: 0,
    currentDonationAmount: 0,
  };

  render() {

    const setCurrentDonationAmount = (itemId) => {
      let filteredData = this.state.data.filter((item) => item.id === itemId);
      if (itemId === 6) {
        this.setState({isOthers: true, currentDonationAmount: 0});
      } else {
        this.setState({
          currentDonationAmount: filteredData[0]['price'],
          isOthers: false,
          othersAmount: 0,
        });
      }
    };

    const navigateToDonationPaymentPage = () => {
      if (this.state.currentDonationAmount === 0) {
        Alert.alert(
          'Donation amount is empty!',
          'Please select the appropriate amount to donate.',
          [{text: 'OK'}],
          {cancelable: false},
        );
      } else {
        this.props.navigation.navigate('Donation Payments', {
          donationAmount: this.state.currentDonationAmount,
          from: 'Donation Screen',
          title: this.props.general_donation.title,
          description: this.props.general_donation.description,
          item: this.props.general_donation,
        });
      }
    };

    

    return (
      <View style={styles.container}>
        <CollapsibleToolbar
          title={'Donation'}
          headerColor={configs.colors.primaryColor}
          headerColorDark={configs.colors.primaryColor}
          image={require('../../assets/images/donation_header.png')}
          backPress={this.backPress}
          type={configs.HEADER_TYPE.DONATION_PAGE}
          data={this.props}
          navigation={this.props.navigation}
          appBarHeight={65}>
          <View style={{marginTop: -32}}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            //extraHeight={600}
            // style={{
            //   height: configs.height - (getStatusBarHeight() + 59),
            // }}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        >
        {/* <ScrollView showsVerticalScrollIndicator={false}>
          <Image
              source={require('../../assets/images/donation_header.png')}
              style={{
                height: configs.height / 3.5,
                width,
                resizeMode: 'cover',
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20,
          }}/>

          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Donation</Text>
          </View> */}
          <View style={styles.body}>
            
              <Text numberOfLines={2} style={{fontSize: 18, fontWeight: '700'}}>
                {this.props.general_donation.title}
              </Text>
              <Space height={20} />
              <Text numberOfLines={4}>{this.props.general_donation.description}</Text>
              <Space height={30} />
           
            <FlatList
              data={this.state.data}
              numColumns={3}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={
                    this.state.selectedData === item.id
                      ? styles.active_card
                      : styles.card
                  }
                  key={index}
                  onPress={() => {
                    this.setState({selectedData: item.id});
                    setCurrentDonationAmount(item.id);
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                    }}>
                    <Text
                      style={{
                        fontWeight: '700',
                        color:
                          this.state.selectedData === item.id
                            ? 'white'
                            : configs.colors.primaryColor,
                        fontSize: 17,
                      }}>
                      {item.name}
                    </Text>
                    <Space height={5} />
                    <View style={styles.earn}>
                      <Image
                        source={require('../../assets/icons/ic_donation.png')}
                        style={{height: 17, width: 17, margin: 5}}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
            <Space height={20} />
            {
              this.state.isOthers == true ? <>
                
            <View
              style={[
                styles.amount_container,
                this.state.isOthers
                  ? styles.enabledAmountContainer
                  : styles.disabledAmountContainer,
              ]}>
              <View>
                {this.state.isOthers &&
                  this.state.currentDonationAmount.length > 0 && (
                    <Text
                      style={{
                        color: configs.colors.primaryColor,
                        fontSize: 36,
                        fontWeight: '700',
                        marginLeft: 20,
                      }}>
                      $
                    </Text>
                  )}
              </View>
              <TextInput
                  style={{
                    color: configs.colors.primaryColor,
                    fontSize: 36,
                    fontWeight: '600',
                    marginLeft: -5,
                    paddingHorizontal: 10,
                    paddingVertical:7,
                  }}
                  
                  value={this.state.othersAmount}
                  onChangeText={(text) => {
                    if (text === '') text = 0;
                    this.setState({othersAmount: text}, function () {
                      this.setState({
                        currentDonationAmount: this.state.othersAmount,
                      });
                    });
                  }}
                  placeholder={this.state.isOthers ? '$0 ' : ''}
                  default="0"
                  editable={this.state.isOthers}
                  keyboardType="number-pad"
                  maxLength={7} />
            </View>
              </> : null
            }
            
            <Space height={20} />
            <TouchableOpacity
              style={styles.button}
              onPress={navigateToDonationPaymentPage}>
              <Text style={{color: 'white'}}>
                Donate S${this.state.currentDonationAmount}
              </Text>
            </TouchableOpacity>
            <Space height={25} />
          </View>
        {/* </ScrollView> */}
        </KeyboardAwareScrollView> 
          </View>
        </CollapsibleToolbar>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    donationList: state.fundraisingState.donationList,
    general_donation: state.fundraisingState.general_donation
  };
};

export default connect(mapStateToProps, null)(DonationScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: configs.colors.backgroundColor,
  },
  headerContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: getStatusBarHeight() + 10,
  },
  card: {
    borderRadius: 8,
    borderColor: configs.colors.primaryColor,
    borderWidth: 1,
    height: 88,
    width: width / 4,
    margin: 5,
    alignItems: 'center',
  },
  earn: {
    borderRadius: 32,
    height: 32,
    width: 32,
    backgroundColor: '#F3B329',
    alignItems: 'center',
  },
  active_card: {
    borderRadius: 8,
    borderColor: configs.colors.primaryColor,
    borderWidth: 1,
    height: 88,
    width: width / 4,
    margin: 5,
    backgroundColor: configs.colors.primaryColor,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontFamily: configs.fontFamily.OPS700,
  },
  amount_container: {
    borderWidth: 1,
    borderRadius: 8,
  },
  enabledAmountContainer: {
    borderColor: '#f2f2f2',
    backgroundColor: '#F7FAFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledAmountContainer: {
    borderColor: '#f2f2f2',
    backgroundColor: '#F7FAFF',
  },
  body: {
    flex: 1,
    padding: 16,
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 20,
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
});
