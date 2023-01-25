import React, {Component} from 'react';
import {
  Alert,
  TextInput,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import {Space} from '../../components/space';
import configs from '../../utils/configs';
import VideoPlayer from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createThumbnail} from 'react-native-create-thumbnail';

const {width} = Dimensions.get('window');

export default class FundraisingScreen extends Component {
  state = {
    selectedData: null,
    isSelected: false,
    isOthers: false,
    currentDonationAmount: 0,
    paused: true,
    inputBox: false,
    clickInput: false,
    inputHeight: 63,
    thumbNail: '',
  };

  getRangeValues = (ranges) => {
    let tempList = ranges.sort((a, b) => a - b);
    var i = tempList.findIndex(x => x == 0);
    
    if(i != -1){
      tempList.splice(i,1);
      tempList.push(0);
    }
    return tempList;
  }

  componentDidMount() {
    if (!this.props.route.params.item.video_url) {
      return;
    }
    createThumbnail({
      url: this.props.route.params.item.video_url,
      timeStamp: 3000,
    })
      .then((response) => {
        return this.setState({thumbNail: response.path});
      })
      .catch((err) => console.log({err}));
  }

  render() {
    const {route} = this.props;
    const {title, description, totalNeeds, range} = route.params;
    console.log(this.props.route.params.item);
    // console.log(this.props.route.params.item.range.sort((a,b)  => a- b));

    const setCurrentDonationAmount = (rangeValue) => {
      this.setState({currentDonationAmount: rangeValue});
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
          title: title,
          description: description,
          item: this.props.route.params.item,
        });
      }
    };

    const donateHandle = (item) => {
      if (item == 0) {
        return this.setState({selectedData: item});
      }
      
      this.setState({selectedData: item,});
      setCurrentDonationAmount(item);
    };

    console.log(this.state.currentDonationAmount);

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar translucent={true} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.props.route.params.item.img_url ? (
            <View style={styles.headerContainer}>
              <Image
                source={{uri: this.props.route.params.item.img_url}}
                style={{
                  height: '100%',
                  width,
                  resizeMode: 'cover',
                  borderBottomRightRadius: 40,
                  borderBottomLeftRadius: 40,
                }}
              />
            </View>
          ) : this.props.route.params.item.video_url && this.state.thumbNail ? (
            <View
              style={{
                width: '100%',
                height: 200,
                backgroundColor: 'black',
              }}>
              <VideoPlayer
                paused={this.state.paused}
                // here Video URL
                source={{uri: this.props.route.params.item.video_url}}
                posterResizeMode="cover"
                resizeMode="stretch"
                posterResizeMode="cover"
                resizeMode="contain"
                poster={this.state.thumbNail && this.state.thumbNail}
                style={{
                  height: '100%',
                  width,
                  resizeMode: 'cover',
                }}
              />
              {
                this.state.paused ?
                <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  ...StyleSheet.absoluteFillObject,
                }}
                onPress={() =>
                  this.setState({
                    paused:false,
                  })
                  // this.props.navigation.navigate('VideoScreen', {
                  //   video_url: this.props.route.params.item.video_url,
                  // })
                }>
                <Ionicons
                  name="play-outline"
                  style={{
                    color: 'white',
                    flex: 1,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 25,
                    marginTop: -30,
                  }}
                />
              </TouchableOpacity>: null
              }
            </View>
          ) : (
            <View
              style={{
                ...styles.headerContainer,
                backgroundColor: 'black',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: '#fff', fontSize: 14}}>
                Something went wrong
              </Text>
            </View>
          )}

          {/* <Text style={styles.headerText}>Fundraising video or image should be here</Text> */}

          <View style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={{fontSize: 18, fontWeight: '700'}}>{title}</Text>
            <Space height={20} />
            <Text>{description}</Text>
            <Space height={30} />
            <FlatList
              data={this.getRangeValues(range)}
              numColumns={3}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={
                    this.state.selectedData === item
                      ? styles.active_card
                      : styles.card
                  }
                  key={index}
                  onPress={() => {
                    donateHandle(item);
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
                          this.state.selectedData === item
                            ? 'white'
                            : configs.colors.primaryColor,
                        fontSize: 17,
                      }}>
                      {item == 0 ? "Others" : "S$"+item}
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
              keyExtractor={(item, index) => index.toString()}
            />
            <Space height={20} />
            {this.state.selectedData == 0 && (
              <View style={styles.amount_container}>
                <View style={{marginLeft: 5}}>
                  {this.state.clickInput && this.state.selectedData.length > 0 && (
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
                    fontWeight: '700',
                    marginLeft: -5,
                    height: 83,
                    paddingHorizontal: 10,
                  }}
                  value={this.state.currentDonationAmount == 0 ? '' :this.state.currentDonationAmount}
                  onChangeText={(e) => {
                    this.setState({
                      currentDonationAmount:e,
                    })
                  }}
                  placeholder={ this.state.selectedData == 0 ?"$0 ":''}
                  keyboardType="number-pad"
                  maxLength={7}
                />
              </View>
            )}
            <Space height={20} />
            <TouchableOpacity
              style={styles.button}
              onPress={navigateToDonationPaymentPage}>
              <Text style={{color: 'white'}}>
                Donate S${this.state.currentDonationAmount}
              </Text>
            </TouchableOpacity>
            <Space height={30} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: configs.colors.backgroundColor,
  },
  headerContainer: {
    height: 200,
    backgroundColor: configs.colors.primaryColor,
    width,
  },
  card: {
    borderRadius: 8,
    borderColor: configs.colors.primaryColor,
    borderWidth: 1,
    height: 88,
    width: width / 4, //change this to relative value
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
    position: 'absolute',
    top: 40,
    fontSize: 18,
    color: 'white',
    fontWeight: '700',
    left: 20,
  },
  // amount_container: {
  //   height: 100,
  //   borderWidth: 1,
  //   borderColor: '#f2f2f2',
  //   borderRadius: 8,
  //   backgroundColor: '#F7FAFF',
  //   justifyContent: 'center',

  // },
  body: {
    marginTop: -50,
    padding: 16,
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 20,
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
  amount_container: {
    height: 63,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#f2f2f2',
    backgroundColor: '#F7FAFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
