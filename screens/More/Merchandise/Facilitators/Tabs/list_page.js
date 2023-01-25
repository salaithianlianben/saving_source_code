import React, {Component, useDebugValue} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  DotIndicator,
} from 'react-native-indicators';
import configs from '../../../../../utils/configs';
import DropdownV2 from '../../../../../components/dropdownV2';
import moment from 'moment';
import {Space} from '../../../../../components/space';
import {connect} from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Ionicons from 'react-native-vector-icons/Ionicons';
import homeAction from '../../../../../actions/homeAction';
import ImageLoad from '../../../../../components/ImageLoad';
import RBSheet from 'react-native-raw-bottom-sheet';
import utilities from '../../../../../utils/utilities';

const CheckBox = ({
  checked,
  onChange,
  label,
  labelStyle,
  checkedColor = 'blue',
  containerStyle,
}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        style={[
          styles.checkboxContainer,
          containerStyle,
          checked && {borderWidth: 0, backgroundColor: checkedColor},
        ]}
        onPress={() => onChange(!checked)}>
        <Ionicons
          name="md-checkmark-sharp"
          color={!checked ? configs.colors.grey : 'white'}
          size={13}
          style={{}}
        />
      </TouchableOpacity>
      <Text style={[labelStyle, {paddingLeft: 10}]}>{label}</Text>
    </View>
  );
};

const Divider = () => {
  return <View style={{height: 1, backgroundColor: '#f2f2f2'}}></View>;
};

class ListPageOfMerchandise extends Component {
  state = {
    dropDownWidth: 100,
    selectedTime: 'this_week',
    selectedType: 'all',
    from_date: moment().startOf('week').format('YYYY-MM-DD'),
    to_date: moment().endOf('week').format('YYYY-MM-DD'),
    merchandiseDropdownArray: [{label: 'All', value: 'all'}],
    ordered_next_url: '',
    delivered_next_url: '',
    is_fetching_ordered_data: false,
    is_fetching_delivered_data: false,
    is_load_more_delivered_data: false,
    is_load_more_ordered_data: false,
    selectedItems: {},
  };

  onChangeSelectedType = (item) => {
    if (this.props.status == 'Paid') {
      this.setState({
        is_fetching_ordered_data: true,
        dropDownWidth: item.label.length + 100,
      });
    } else {
      this.setState({
        is_fetching_delivered_data: true,
        dropDownWidth: item.label.length + 100,
      });
    }

    /*console.log('NAY CHI check : status = '+this.props.status);
    console.log('NAY CHI check : item selected value = '+item.value);
    console.log('NAY CHI check : item selected from date value = '+this.state.from_date);
    console.log('NAY CHI check : item selected to date value = '+this.state.to_date);
    console.log('NAY CHI check : item selected Class ID ='+ this.props.userInfo.class_id[this.props.selected_class_index]);*/

    if (item.value === 'all') {
      if (this.props.status == 'Paid') {
        this.props.getOrderedMerchandiseData(
          this.state.from_date,
          this.state.to_date,
          10,
          undefined,
          this.props.userInfo.class[this.props.selected_class_index].id,
          this.props.status,
          false,
          '',
          (status, data) => {
            if (status) {
              this.setState({
                is_fetching_ordered_data: false,
                ordered_next_url: data.next,
              });
            } else {
              this.setState({
                is_fetching_ordered_data: false,
              });
            }
          },
        );
      } else {
        this.props.getDeliveredMerchandiseData(
          this.state.from_date,
          this.state.to_date,
          10,
          undefined,
          this.props.userInfo.class[this.props.selected_class_index].id,
          this.props.status,
          false,
          '',
          (status, data) => {
            if (status) {
              this.setState({
                is_fetching_delivered_data: false,
                delivered_next_url: data.next,
              });
            } else {
              this.setState({
                is_fetching_delivered_data: false,
              });
            }
          },
        );
      }
    } else {
      if (this.props.status == 'Paid') {
        this.props.getOrderedMerchandiseData(
          this.state.from_date,
          this.state.to_date,
          10,
          item.value,
          this.props.userInfo.class[this.props.selected_class_index].id,
          this.props.status,
          false,
          '',
          (status, data) => {
            if (status) {
              this.setState({
                is_fetching_ordered_data: false,
                ordered_next_url: data.next,
              });
            } else {
              this.setState({
                is_fetching_ordered_data: false,
              });
            }
          },
        );
      } else {
        this.props.getDeliveredMerchandiseData(
          this.state.from_date,
          this.state.to_date,
          10,
          item.value,
          this.props.userInfo.class[this.props.selected_class_index].id,
          this.props.status,
          false,
          '',
          (status, data) => {
            if (status) {
              this.setState({
                is_fetching_delivered_data: false,
                delivered_next_url: data.next,
              });
            } else {
              this.setState({
                is_fetching_delivered_data: false,
              });
            }
          },
        );
      }
    }
  };

  onChangeSelected = (item) => {
    var from_date;
    var to_date;
    if (item.value === 'this_week') {
      from_date = moment().startOf('week').format('YYYY-MM-DD');
      to_date = moment().endOf('week').format('YYYY-MM-DD');
    } else {
      if (item.value === 'this_month') {
        from_date = moment().clone().startOf('month').format('YYYY-MM-DD');
        to_date = moment().clone().endOf('month').format('YYYY-MM-DD');
      } else {
        from_date = moment()
          .subtract(2, 'months')
          .startOf('month')
          .format('YYYY-MM-DD');
        to_date = moment().clone().endOf('month').format('YYYY-MM-DD');
      }
    }
    if (this.props.status == 'Paid') {
      this.setState({
        is_fetching_ordered_data: true,
      });
    } else {
      this.setState({
        is_fetching_delivered_data: true,
      });
    }

    if (this.props.status == 'Paid') {
      this.props.getOrderedMerchandiseData(
        from_date,
        to_date,
        10,
        this.state.selectedType === 'all' ? undefined : this.state.selectedType,
        this.props.userInfo.class[this.props.selected_class_index].id,
        this.props.status,
        false,
        '',
        (status, data) => {
          if (status == true) {
            console.log(data);
            this.setState({
              is_fetching_ordered_data: false,
              ordered_next_url: data.next,
            });
          }
        },
      );
    } else {
      this.props.getDeliveredMerchandiseData(
        from_date,
        to_date,
        10,
        this.state.selectedType === 'all' ? undefined : this.state.selectedType,
        this.props.userInfo.class[this.props.selected_class_index].id,
        this.props.status,
        false,
        '',
        (status, data) => {
          if (status == true) {
            console.log(data);
            this.setState({
              is_fetching_delivered_data: false,
              delivered_next_url: data.next,
            });
          }
        },
      );
    }

    this.setState({
      selectedTime: item.value,
      from_date: from_date,
      to_date: to_date,
    });
  };

  componentDidMount() {
    console.log('list Page '+ this.props.status);
    if (this.props.status == 'Paid') {
      this.setState({
        ordered_next_url: this.props.next_url,
      });
    } else {
      this.setState({
        delivered_next_url: this.props.next_url,
      });
    }
  }

  getOrderStatus = (item) => {
    let temp = item.details.filter((x) => x.is_select === true);
    var isExist = temp.length > 0;
    return isExist;
  };

  _renderLoading = () => {
    return (
      <View style={{width: '100%', justifyContent: 'center'}}>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item
            flexDirection="column"
            margin={10}
            width={configs.width * 0.9}>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              marginBottom={10}>
              <SkeletonPlaceholder.Item
                height={20}
                width={20}
                borderRadius={20}></SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                height={10}
                width={configs.width / 3}
                borderRadius={20}
                marginLeft={10}></SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
              <SkeletonPlaceholder.Item
                height={configs.width / 5}
                width={configs.width / 5}
                borderRadius={10}></SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                flexDirection="column"
                justifyContent="space-around"
                alignSelf="stretch"
                marginLeft={10}>
                <SkeletonPlaceholder.Item
                  height={10}
                  width={configs.width / 2}
                  borderRadius={5}></SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  height={10}
                  width={configs.width / 2}
                  borderRadius={5}></SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  height={10}
                  width={configs.width / 2}
                  borderRadius={5}></SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              height={30}
              width={configs.width * 0.8}
              borderRadius={20}
              marginTop={10}></SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item
            flexDirection="column"
            margin={10}
            width={configs.width * 0.9}>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              marginBottom={10}>
              <SkeletonPlaceholder.Item
                height={20}
                width={20}
                borderRadius={20}></SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                height={10}
                width={configs.width / 3}
                borderRadius={20}
                marginLeft={10}></SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
              <SkeletonPlaceholder.Item
                height={configs.width / 5}
                width={configs.width / 5}
                borderRadius={10}></SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                flexDirection="column"
                justifyContent="space-around"
                alignSelf="stretch"
                marginLeft={10}>
                <SkeletonPlaceholder.Item
                  height={10}
                  width={configs.width / 2}
                  borderRadius={5}></SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  height={10}
                  width={configs.width / 2}
                  borderRadius={5}></SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  height={10}
                  width={configs.width / 2}
                  borderRadius={5}></SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              height={30}
              width={configs.width * 0.8}
              borderRadius={20}
              marginTop={10}></SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item
            flexDirection="column"
            margin={10}
            width={configs.width * 0.9}>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              marginBottom={10}>
              <SkeletonPlaceholder.Item
                height={20}
                width={20}
                borderRadius={20}></SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                height={10}
                width={configs.width / 3}
                borderRadius={20}
                marginLeft={10}></SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
              <SkeletonPlaceholder.Item
                height={configs.width / 5}
                width={configs.width / 5}
                borderRadius={10}></SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                flexDirection="column"
                justifyContent="space-around"
                alignSelf="stretch"
                marginLeft={10}>
                <SkeletonPlaceholder.Item
                  height={10}
                  width={configs.width / 2}
                  borderRadius={5}></SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  height={10}
                  width={configs.width / 2}
                  borderRadius={5}></SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  height={10}
                  width={configs.width / 2}
                  borderRadius={5}></SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              height={30}
              width={configs.width * 0.8}
              borderRadius={20}
              marginTop={10}></SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item
            flexDirection="column"
            margin={10}
            width={configs.width * 0.9}>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              marginBottom={10}>
              <SkeletonPlaceholder.Item
                height={20}
                width={20}
                borderRadius={20}></SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                height={10}
                width={configs.width / 3}
                borderRadius={20}
                marginLeft={10}></SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
              <SkeletonPlaceholder.Item
                height={configs.width / 5}
                width={configs.width / 5}
                borderRadius={10}></SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                flexDirection="column"
                justifyContent="space-around"
                alignSelf="stretch"
                marginLeft={10}>
                <SkeletonPlaceholder.Item
                  height={10}
                  width={configs.width / 2}
                  borderRadius={5}></SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  height={10}
                  width={configs.width / 2}
                  borderRadius={5}></SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  height={10}
                  width={configs.width / 2}
                  borderRadius={5}></SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              height={30}
              width={configs.width * 0.8}
              borderRadius={20}
              marginTop={10}></SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item
            flexDirection="column"
            margin={10}
            width={configs.width * 0.9}>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              marginBottom={10}>
              <SkeletonPlaceholder.Item
                height={20}
                width={20}
                borderRadius={20}></SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                height={10}
                width={configs.width / 3}
                borderRadius={20}
                marginLeft={10}></SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
              <SkeletonPlaceholder.Item
                height={configs.width / 5}
                width={configs.width / 5}
                borderRadius={10}></SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                flexDirection="column"
                justifyContent="space-around"
                alignSelf="stretch"
                marginLeft={10}>
                <SkeletonPlaceholder.Item
                  height={10}
                  width={configs.width / 2}
                  borderRadius={5}></SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  height={10}
                  width={configs.width / 2}
                  borderRadius={5}></SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  height={10}
                  width={configs.width / 2}
                  borderRadius={5}></SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              height={30}
              width={configs.width * 0.8}
              borderRadius={20}
              marginTop={10}></SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </View>
    );
  };

  onLoadMore = () => {
    const {getOrderedMerchandiseData, getDeliveredMerchandiseData, status} =
      this.props;
    const {ordered_next_url, delivered_next_url} = this.state;
    if (status == 'Paid') {
      if (
        ordered_next_url !== '' &&
        ordered_next_url !== undefined &&
        ordered_next_url !== null
      ) {
        this.setState({
          is_load_more_ordered_data: true,
        });
        getOrderedMerchandiseData(
          this.state.from_date,
          this.state.to_date,
          10,
          this.state.selectedType === 'all'
            ? undefined
            : this.state.selectedType,
          this.props.userInfo.class[this.props.selected_class_index].id,
          status,
          true,
          ordered_next_url,
          (s, data) => {
            if (s == true) {
              this.setState({
                is_load_more_ordered_data: false,
                ordered_next_url: data.next,
              });
            } else {
              this.setState({
                is_load_more_ordered_data: false,
              });
            }
          },
        );
      }
    } else {
      if (
        delivered_next_url != '' &&
        delivered_next_url != undefined &&
        delivered_next_url != null
      ) {
        this.setState({
          is_load_more_delivered_data: true,
        });
        getDeliveredMerchandiseData(
          this.state.from_date,
          this.state.to_date,
          10,
          this.state.selectedType === 'all'
            ? undefined
            : this.state.selectedType,
          this.props.userInfo.class[this.props.selected_class_index].id,
          status,
          true,
          delivered_next_url,
          (s, data) => {
            if (status == true) {
              this.setState({
                is_load_more_delivered_data: false,
                delivered_next_url: data.next,
              });
            } else {
              this.setState({
                is_load_more_delivered_data: false,
              });
            }
          },
        );
      }
    }
  };

  render() {
    const {data = []} = this.props;

    return (
      <View style={styles.container}>
        <View
          style={[
            {
              flexDirection: 'row',
              width: '100%',
              paddingHorizontal: 10,
              paddingVertical: 15,
            },
          ]}>
          <DropdownV2
            style={styles.mainStyle}
            options={[
              {label: 'This Week', value: 'this_week'},
              {label: 'This Month', value: 'this_month'},
              {label: 'Last 3 Months', value: 'last_3_months'},
            ]}
            selectedValue={this.state.selectedTime}
            onChangeSelected={this.onChangeSelected}
            dropdownTextHighlightStyle={{
              color: 'grey',
            }}
            textStyle={{
              fontSize: 14,
              paddingLeft: 10,
              flex: 1,
            }}
            datas={[
              {label: 'This Week', value: 'this_week'},
              {label: 'This Month', value: 'this_month'},
              {label: 'last 3 months', value: 'last_3_months'},
            ]}
            iconStyle={{width: 10, height: 8, marginRight: 15}}
            dropDownStyle={{
              backgroundColor: 'white',
              width: 120,
              height: 120,
              marginTop: -10,
              marginLeft: 5,
            }}
            dropdownTextStyle={{fontSize: 13, textAlign: 'center'}}
            containerText={{
              justifyContent: 'center',
              textAlign: 'center',
              paddingVertical: 8,
            }}
          />

          <Space width={10} />

          <DropdownV2
            style={{...styles.mainStyle, width: this.state.dropDownWidth}}
            options={this.props.merchandiseDropdownArray}
            datas={this.props.merchandiseDropdownArray}
            selectedValue={this.state.selectedType}
            onChangeSelected={this.onChangeSelectedType}
            dropdownTextHighlightStyle={{
              color: 'grey',
            }}
            textStyle={{
              fontSize: 14,
              paddingLeft: 10,
              flex: 1,
            }}
            iconStyle={{width: 10, height: 8, marginRight: 15}}
            dropDownStyle={{
              backgroundColor: 'white',
              width: 90,
              marginTop: -10,
              marginLeft: 3,
            }}
            dropdownTextStyle={{fontSize: 13, textAlign: 'center'}}
            containerText={{
              justifyContent: 'center',
              textAlign: 'center',
              paddingVertical: 8,
            }}
          />
        </View>
        <View style={{marginHorizontal: 10}}>
          {this.props.isLoading == true ||
          this.state.is_fetching_delivered_data == true ||
          this.state.is_fetching_ordered_data == true ? (
            this._renderLoading()
          ) : (
            <FlatList
              data={data}
              style={{
                height: '90%',
              }}
              onEndReached={this.onLoadMore}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => {
                //console.log('NAY CHI ORDERD ITEM : ');
                //console.log(item);
                return (
                  <View>
                    <View style={styles.card}>

                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        {/*item.ordered_by.img != undefined &&
                        item.ordered_by.img != null &&
                        item.ordered_by.img != '' ? (
                          <ImageLoad
                            style={styles.studentImage}
                            loadingStyle={{size: 'small', color: 'white'}}
                            borderRadius={24}
                            placeholderStyle={styles.studentImage}
                            source={{
                              uri: item.ordered_by.img,
                              cache: 'force-cache',
                            }}
                            placeholderSource={require('../../../../../assets/icons/ic_account.png')}
                          />
                        ) : (
                          <Image
                            source={require('../../../../../assets/icons/ic_account.png')}
                            style={styles.studentImage}
                          />
                        )*/}
                        <Text style={{fontWeight:'bold', lineHeight: 19, fontSize: 14, marginLeft: 2}}>Order ID : {item.id}</Text>

                        <Space width={10} />
                        
                        <Text>{item.ordered_by.name}</Text>
                      </View>
                      
                      <Space height={10} />

                      {item.details.map((items, index) => (
                        <View key={index}>
                          <View style={{flexDirection: 'row'}}>
                            <View>
                              {items.merchandise.img[0] != undefined &&
                              items.merchandise.img[0] != null &&
                              items.merchandise.img[0] != '' ? (
                                <ImageLoad
                                  style={styles.image}
                                  borderRadius={8}
                                  loadingStyle={{size: 'small', color: 'white'}}
                                  source={{
                                    uri: items.merchandise.img[0],
                                    cache: 'force-cache',
                                  }}
                                  placeholderStyle={styles.image}
                                  placeholderSource={require('../../../../../assets/images/placeholder_image.png')}
                                />
                              ) : (
                                <Image
                                  style={styles.image}
                                  source={require('../../../../../assets/images/placeholder_image.png')}
                                />
                              )}
                            </View>
                            <View
                              style={{flex: 1, justifyContent: 'space-around', marginLeft: 16, marginRight: 4}}>
                              <Text style={{fontWeight:'bold', lineHeight: 19, fontSize: 14}} numberOfLines={2} ellipsizeMode="tail">
                                {items.merchandise.name}
                              </Text>
                              {items.merchandise.size != undefined &&
                              items.merchandise.size != '' ? (
                                <Text style={{marginTop: 8, lineHeight: 19, fontSize: 14}}>
                                  Size: {items.merchandise.size}
                                </Text>
                              ) : null}
                              <Text style={{marginTop: 8, lineHeight: 19, fontSize: 14, color: configs.colors.grey}}>
                                {items.merchandise.last_updated}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Text style={{color: configs.colors.grey}}>
                                  x
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 14,
                                    lineHeight: 19,
                                    fontWeight: '600',
                                    color: configs.colors.grey,
                                  }}>
                                  {items.amount}
                                </Text>
                              </View>
                              <Space width={15} />
                              {this.props.status == 'Paid' && (
                                <CheckBox
                                  checked={items.is_select}
                                  checkedColor={configs.colors.primaryColor}
                                  containerStyle={{
                                    height: 32,
                                    width: 32,
                                    marginRight: -10,
                                  }}
                                  onChange={(value) => {
                                    var details = data.filter(
                                      (x) => x.id === item.id,
                                    )[0].details;
                                    var temp = [];
                                    var merchandise = details.filter(
                                      (x) => x.id === items.id,
                                    )[0];
                                    var index = details.findIndex(
                                      (x) => x.id === item.id,
                                    );
                                    merchandise.is_select = value;
                                    if (index != -1) {
                                      details = [
                                        ...details.slice(0, index),
                                        merchandise,
                                        ...details.slice(index + 1),
                                      ];
                                    }

                                    var dataTemp = data.filter(
                                      (x) => x.id === item.id,
                                    )[0];
                                    dataTemp.details = details;

                                    var i = data.findIndex(
                                      (x) => x.id === item.id,
                                    );
                                    // let temp = [];
                                    if (i != -1) {
                                      temp = [
                                        ...data.slice(0, i),
                                        {...dataTemp},
                                        ...data.slice(i + 1),
                                      ];
                                      this.props.updateOrderedMerchandiseDataIsSelect(
                                        temp,
                                        this.props.status,
                                      );
                                    }
                                    // console.log(JSON.stringify(temp));
                                  }}
                                />
                              )}
                            </View>
                          </View>
                          <Space height={8} />
                          <Divider />
                          <Space height={8} />
                        </View>
                      ))}

                      <View>
                        {/* <Text>{data.status}</Text> */}
                        {this.props.status == 'Paid' ? (
                          <TouchableOpacity
                            disabled={!this.getOrderStatus(item)}
                            onPress={() => {
                              this.RBSheet.open();
                              this.setState({
                                selectedItems: item,
                              });
                            }}
                            style={[
                              styles.button,
                              {
                                backgroundColor: this.getOrderStatus(item)
                                  ? configs.colors.primaryColor
                                  : '#DADADA',
                                borderRadius: 20,
                                marginTop: 8,
                              },
                            ]}>
                            <Image
                              source={require('../../../../../assets/icons/ic_delivered.png')}
                              style={{height: 16, width: 16}}
                            />
                            <Space width={10} />
                            <Text style={{color: 'white', fontSize: 14}}>
                              Delivered
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <Text
                            style={{
                              color: configs.colors.grey,
                              alignSelf: 'flex-start',
                              fontWeight:'600',
                              lineHeight: 19,
                              fontSize: 14,
                            }}>
                            {'Delivered on : ' + item.details[0].last_updated}
                          </Text>
                        )}
                      </View>
                    
                    </View>
                    {index === data.length - 1
                      ? (this.state.is_load_more_delivered_data == true ||
                          this.state.is_load_more_ordered_data == true) && (
                          <View
                            style={{
                              width: '100%',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <DotIndicator size={5} color={configs.colors.grey}/>
                          </View>
                        )
                      : null}
                    {index === data.length - 1 && <Space height={200} />}
                  </View>
                );
              }}

              ListEmptyComponent={() => (
                <View
                  style={{
                    height: configs.height - 300,
                    width: 'auto',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#d2d2d2',
                      fontWeight: 'bold',
                    }}>
                    Empty Data
                  </Text>
                </View>
              )}
            />
          )}
        </View>
        <RBSheet
          closeOnPressBack
          dragFromTopOnly={true}
          closeOnDragDown={true}
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          dragFromTopOnly={true}
          openDuration={250}
          customStyles={{
            container: styles.bottomSheetContainer,
          }}
          closeOnDragDown>
          <View
            style={{
              marginHorizontal: 20,
              marginVertical: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{fontWeight: 'bold', fontSize: 16, alignSelf: 'center'}}>
              Please help to verify and confirm
            </Text>
            <Text
              style={{fontWeight: 'bold', fontSize: 16, alignSelf: 'center'}}>
              {' '}
              the Order ID with parent before proceed.
            </Text>
            <Space height={20} />
            <Text style={{alignSelf: 'center'}}>
              If you have done so, do you want to proceed
            </Text>
            <Text style={{alignSelf: 'center'}}> to confirm this action?</Text>
            <Space height={20} />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <TouchableOpacity
                style={{
                  height: 48,
                  borderRadius: 20,
                  borderWidth: 1,
                  width: '45%',
                  borderColor: configs.colors.primaryColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => this.RBSheet.close()}>
                <Text
                  style={{
                    alignSelf: 'center',
                    color: configs.colors.primaryColor,
                    fontWeight: 'bold',
                  }}>
                  No
                </Text>
              </TouchableOpacity>
              <Space width={8} />
              <TouchableOpacity
                style={{
                  height: 48,
                  borderRadius: 20,
                  backgroundColor: configs.colors.primaryColor,
                  width: '45%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.RBSheet.close();
                  const details = this.state.selectedItems.details;
                  let order_details_id = [details[0].id];
                  for (let index = 1; index < details.length; index++) {
                    const element = details[index];
                    if (element.is_select) {
                      order_details_id = [...order_details_id, element.id];
                    }
                  }

                  // console.log(tempData);
                  console.log(order_details_id);
                  this.props.postOrderedMerchandiseStatus(
                    this.state.selectedItems.id,
                    this.props.userInfo.id,
                    order_details_id,
                    'delivered',
                    (status)=>{
                      if(status == true){
                        utilities.showToastMessage("Successful! you have been delivered the items.","success");
                        let tempData = [];
                        if(order_details_id.length == this.state.selectedItems.details.length){
                          tempData = data.filter((ev)=> ev.id !== this.state.selectedItems.id);
                        }else{
                          tempData = data;
                          let itemData = this.state.selectedItems;
                          let orderDetails = [];
                          
                          for (let index = 0; index < order_details_id.length; index++) {
                            const element = order_details_id[index];
                            var count = 0;
                            var tD = {};
                            for (let i = 0; i < itemData.details.length; i++) {
                              const e = itemData.details[i];
                              tD = e;
                              if(element != e.id){
                                count += 1;
                              }else{
                                break;
                              }
                            }
                            if(count == itemData.details.length){
                              orderDetails.push(tD);
                            }
                          }
                          itemData.details = orderDetails;
                          var idx = tempData.findIndex( (ab)=> ab.id == itemData.id);
                          if(idx != -1){
                            tempData[idx] = itemData;
                            
                          }
                        }
                        this.props.updateMerchandiseDataOrderedDelivered(tempData);
                        this.props.getDeliveredMerchandiseData(
                          this.state.from_date,
                          this.state.to_date,
                          10,
                          undefined,
                          this.props.userInfo.class[this.props.selected_class_index].id,
                          this.props.status,
                          false,
                          '',
                          ()=>console.log("getting delivered data")
                        );
                      }else{
                        utilities.showToastMessage("Failed!",'error')
                      }
                    }
                  );
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ordered_merchandise_data: state.homeState.ordered_merchandise_data,
    delivered_merchandise_data: state.homeState.delivered_merchandise_data,
    userInfo: state.authState.userInfo,
    selected_class_index: state.homeState.selected_class_index,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMerchandiseDataOrderedDelivered:(data) => dispatch( homeAction.updateMerchandiseDataOrderedDelivered(data)),
    updateOrderedMerchandiseDataIsSelect: (data, status) =>
      dispatch(homeAction.updateOrderedMerchandiseDataIsSelect(data, status)),
    getOrderedMerchandiseData: (
      start_date,
      end_date,
      size,
      merchandise_type_id,
      class_id,
      status,
      isNext,
      next_url,
      handleCallback,
    ) =>
      dispatch(
        homeAction.getOrderedMerchandiseData(
          start_date,
          end_date,
          size,
          merchandise_type_id,
          class_id,
          status,
          isNext,
          next_url,
          handleCallback,
        ),
      ),
    getDeliveredMerchandiseData: (
      start_date,
      end_date,
      size,
      merchandise_type_id,
      class_id,
      status,
      isNext,
      next_url,
      handleCallback,
    ) =>
      dispatch(
        homeAction.getDeliveredMerchandiseData(
          start_date,
          end_date,
          size,
          merchandise_type_id,
          class_id,
          status,
          isNext,
          next_url,
          handleCallback,
        ),
      ),
    fetchMerchandiseType: () => dispatch(homeAction.fetchMerchandiseType()),
    fetchMerchandiseDetails: (id) =>
      dispatch(homeAction.fetchMerchandiseDetails(id)),
    postOrderedMerchandiseStatus: (id, updated_by, order_details_id, status,handleCallback) =>
      dispatch(
        homeAction.postOrderedMerchandiseStatus(
          id,
          updated_by,
          order_details_id,
          status,
          handleCallback
        ),
      ),
  };
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: configs.colors.backgroundColor,
    height: configs.height,
    width: configs.width,
  },
  mainStyle: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: 'white',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
    width: 127,
    height: 44,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  checkboxContainer: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#f2f2f2',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  containerStyle: {
    width: 110,
    height: 40,
  },
  studentImage: {
    height: 24,
    width: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: configs.colors.primaryColor,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: configs.colors.grey1,
  },

  button: {
    flexDirection: 'row',
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    borderRadius: 15,
  },
  card: {
    borderRadius: 20,
    paddingVertical: 16,
    marginBottom: 10,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    // shadowColor: '#f2f2f2',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.5,
    // shadowRadius: 1,
    // elevation: 1,
    marginHorizontal: 4,
  },
  bottomSheetContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 'auto',
  },
  bottomSheetBody: {
    marginHorizontal: 20,
    marginVertical: 10,

    // height:"auto",
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListPageOfMerchandise);
