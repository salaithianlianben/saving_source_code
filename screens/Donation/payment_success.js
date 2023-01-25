import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Space} from '../../components/space';
import configs from '../../utils/configs';

class DonationPaymentSuccess extends Component {
  render() {
    const {isSuccess, onCloseModal } = this.props;
    return (
      <View style={styles.container}>
        {isSuccess === true ? (
          <>
            <Ionicons
              size={130}
              name="checkmark-circle-outline"
              color={'#7CD227'}
            />
            <Space height={20} />
            <View>
              <Text
                style={{fontSize: 24, fontWeight: 'bold', alignSelf: 'center'}}>
                Donation Complete!
              </Text>
              <Space height={20} />
              <Text>Thank you for your great generosity!</Text>
              <Text style={{justifyContent: 'center', alignSelf: 'center'}}>
                We, at Morning Star,
              </Text>
              <Text> greatly appreciate your donation.</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                onCloseModal,  
                this.props.navigation.pop(3)
              }}
              style={{
                height: 48,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: configs.colors.primaryColor,
                width: '80%',
                borderRadius: 20,
                position: 'absolute',
                bottom: 20,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: configs.fontFamily.OPS700,
                  color: '#fff',
                }}>
                Done
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Ionicons
              size={130}
              name="close-circle-outline"
              color={'#F66460'}
            />
            <Space height={20} />
            <View>
              <Text
                style={{fontSize: 24, fontWeight: 'bold', alignSelf: 'center'}}>
                Failed
              </Text>
              <Space height={20} />
              <Text style={{justifyContent: 'center', alignSelf: 'center'}}>
                Your transaction
              </Text>
              <Text style={{justifyContent: 'center', alignSelf: 'center'}}>
                cannot be completed
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => { onCloseModal,this.props.navigation.pop(3)}}
              style={{
                height: 48,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: configs.colors.primaryColor,
                width: '80%',
                borderRadius: 20,
                position: 'absolute',
                bottom: 20,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: configs.fontFamily.OPS700,
                  color: '#fff',
                }}>
                Try again
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: configs.colors.backgroundColor,
    height:configs.height,
    width:configs.width,
  },
});
export default DonationPaymentSuccess;
