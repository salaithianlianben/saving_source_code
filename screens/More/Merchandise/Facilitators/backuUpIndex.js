import React, {Component} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import DropdownSelect from '../../../../components/dropdown';
import ImageLoad from '../../../../components/ImageLoad';
import {Space} from '../../../../components/space';
import configs from '../../../../utils/configs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import homeAction from '../../../../actions/homeAction';
import moment from 'moment';
import DropdownV2 from '../../../../components/dropdownV2';

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

class MerchandiseScreenFacilitator extends Component {
  state = {
    selectedTime: 'this_week',
    selectedType: 'all',
    merchandiseDropdownArray: [{label: 'All', value: 'all'}],
    from_date: moment().startOf('week').format('YYYY-MM-DD'),
    to_date: moment().endOf('week').format('YYYY-MM-DD'),
    isFetching: false,
    isLoadMore: false,
    dropDownWidth: 100
  };

  getOrderStatus = (item) => {
    let temp = item.details.filter((x) => x.is_select === true);
    var isExist = temp.length > 0;
    return isExist;
  };

  onDeliveredOrderedMerchandiseData(data) {
    const details = data.details;
    let order_details_id = [];
    for (let index = 0; index < details.length; index++) {
      const element = details[index];
      order_details_id.push(element.id);
    }
    // this.props.postOrderedMerchandiseStatus(data.id,this.props.userInfo.id,order_details_id);
    // console.log(order_details_id);
  }

  handleCallback = () => {
    this.setState({
      isFetching: false,
    });
  };

  componentDidMount() {
    // this.props.fetchMerchandiseType();
    this.getMerchandiseDropdownData();
    this.setState({
      isFetching: true,
    });
    this.props.getOrderedMerchandiseData(
      this.state.from_date,
      this.state.to_date,
      10,
      undefined,
      this.props.userInfo.class_id[this.props.selected_class_index],
      false,
      '',
      this.handleCallback,
    );
    this.setOrderedMerchandiseData();
  }

  setOrderedMerchandiseData = () => {
    const {ordered_merchandise_data} = this.props;
    this.setState({
      ordered_merchandise_data: ordered_merchandise_data,
    });
  };

  getMerchandiseDropdownData = () => {
    const {merchandise_types} = this.props;
    merchandise_types.map((e) => {
      this.setState((prevState) => ({
        merchandiseDropdownArray: [
          ...prevState.merchandiseDropdownArray,
          {label: e.name, value: e.id},
        ],
      }));
    });
  };

  onChangeSelected = (item) => {
    // moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD')
    // moment().startOf('week').format('YYYY-MM-DD')
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

    this.setState({
      isFetching: true,
    });

    this.props.getOrderedMerchandiseData(
      from_date,
      to_date,
      10,
      this.state.selectedType === 'all' ? undefined : this.state.selectedType,
      this.props.userInfo.class_id[this.props.selected_class_index],
      false,
      '',
      this.handleCallback,
    );

    this.setState({
      selectedTime: item.value,
      from_date: from_date,
      to_date: to_date,
    });

    // this.setState({
    //   ordered_merchandise_data:[],
    // })
    // this.setOrderedMerchandiseData();
  };

  _renderLoading = () => {
    return (
      <View style={{height: '100%', width: '100%', justifyContent: 'center'}}>
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
    const {next_url, getOrderedMerchandiseData} = this.props;
    if (next_url != '') {
      this.setState({
        isLoadMore: true,
      });
      getOrderedMerchandiseData(
        this.state.from_date,
        this.state.to_date,
        10,
        this.state.selectedType === 'all' ? undefined : this.state.selectedType,
        this.props.userInfo.class_id[this.props.selected_class_index],
        true,
        next_url,
        () =>
          this.setState({
            isLoadMore: false,
          }),
      );
    }
  };

  onChangeSelectedType = (item) => {
    this.setState({
      isFetching: false,
      dropDownWidth: item.label.length+100
    });
    if (item.value === 'all') {
      this.props.getOrderedMerchandiseData(
        this.state.from_date,
        this.state.to_date,
        10,
        undefined,
        this.props.userInfo.class_id[this.props.selected_class_index],
        false,
        '',
        this.handleCallback,
      );
    } else {
      this.props.getOrderedMerchandiseData(
        this.state.from_date,
        this.state.to_date,
        10,
        item.value,
        this.props.userInfo.class_id[this.props.selected_class_index],
        false,
        '',
        this.handleCallback,
      );
    }

    // this.setState({
    //   selectedType: item.value,
    // });
    // this.setState({
    //   ordered_merchandise_data:[],
    // })
    // this.setOrderedMerchandiseData();
  };

  // getData = ()=>{
  //   return this.state.ordered_merchandise_data;
  // }

  render() {
    console.log(JSON.stringify(this.props.ordered_merchandise_data));
    const {ordered_merchandise_data} = this.props;

    return (
      <SafeAreaView
        style={{
          backgroundColor: configs.colors.backgroundColor,
          height: configs.height,
        }}>
        <View style={{paddingHorizontal: 20, backgroundColor: 'transparent'}}>
          <Space height={10} />
          <View
            style={[
              {
                flexDirection: 'row',
                // zIndex: 100,
                // shadowColor: 'white',
                // shadowOffset: {width: 0, height: 0.1},
                // shadowOpacity: 0.5,
                // shadowRadius: 1,
                // elevation: 1,
              },
            ]}>
            {/* <DropdownSelect
              data={[
                {label: 'This Week', value: 'this_week'},
                {label: 'This Month', value: 'this_month'},
                {label: 'last 3 months', value: 'last_3_months'},
              ]}
              placeholder="Time"
              selectedValue={this.state.selectedTime}
              style={styles.mainStyle}
              itemStyle={{}}
              dropDownStyle={{
                borderBottomLeftRadius: 30,
                borderBottomRightRadius: 30,
              }}
              containerStyle={styles.containerStyle}
              onChangeSelected={this.onChangeSelected}
            /> */}

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
                // borderBottomLeftRadius: 30,
                // borderBottomRightRadius: 30,
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
            {/* <DropdownSelect
              data={this.state.merchandiseDropdownArray}
              placeholder="Time"
              selectedValue={this.state.selectedType}
              style={styles.mainStyle}
              itemStyle={{}}
              dropDownStyle={{
                borderBottomLeftRadius: 30,
                borderBottomRightRadius: 30,
              }}
              containerStyle={styles.containerStyle}
              onChangeSelected={this.onChangeSelectedType}
            /> */}
            <DropdownV2
              style={{...styles.mainStyle, width: this.state.dropDownWidth,}}
              options={this.state.merchandiseDropdownArray}
              datas={this.state.merchandiseDropdownArray}
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
                // borderBottomLeftRadius: 30,
                // borderBottomRightRadius: 30,
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
          <Space height={15} />

          {this.props.isLoading ? (
            this._renderLoading()
          ) : (
            <FlatList
              data={ordered_merchandise_data}
              onEndReached={this.onLoadMore}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => {
                // console.log(index);
                return (
                  <View>
                    <View style={styles.card}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        {/* <Image
                          source={{
                            uri:
                              item.ordered_by.img,
                          }}
                          style={styles.studentImage}
                        /> */}
                        {item.ordered_by.img != undefined &&
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
                            placeholderSource={require('../../../../assets/icons/ic_account.png')}
                          />
                        ) : (
                          <Image
                            source={require('../../../../assets/icons/ic_account.png')}
                            style={styles.studentImage}
                          />
                        )}
                        <Space width={10} />
                        <Text>{item.ordered_by.name}</Text>
                      </View>
                      <Space height={10} />

                      {item.details.map((items, index) => (
                        <View key={index}>
                          <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 2}}>
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
                                  placeholderSource={require('../../../../assets/images/placeholder_image.png')}
                                />
                              ) : (
                                <Image
                                  style={styles.image}
                                  source={require('../../../../assets/images/placeholder_image.png')}
                                />
                              )}
                            </View>
                            <View
                              style={{flex: 3, justifyContent: 'space-around'}}>
                              <Text style={{fontWeight: '700'}}>
                                {items.merchandise.name}
                              </Text>
                              <Text style={{fontWeight: '600'}}>
                                Size: {items.merchandise.size}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: configs.colors.grey,
                                }}>
                                {items.last_updated}
                              </Text>
                            </View>
                            <View
                              style={{
                                flex: 1.5,
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
                                    fontSize: 20,
                                    color: configs.colors.grey,
                                  }}>
                                  {items.amount}
                                </Text>
                              </View>
                              <Space width={10} />
                              <CheckBox
                                checked={items.is_select}
                                checkedColor={configs.colors.primaryColor}
                                containerStyle={{
                                  height: 26,
                                  width: 26,
                                }}
                                onChange={(value) => {
                                  var details = ordered_merchandise_data.filter(
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

                                  var dataTemp = ordered_merchandise_data.filter(
                                    (x) => x.id === item.id,
                                  )[0];
                                  dataTemp.details = details;

                                  var i = ordered_merchandise_data.findIndex(
                                    (x) => x.id === item.id,
                                  );
                                  // let temp = [];
                                  if (i != -1) {
                                    temp = [
                                      ...ordered_merchandise_data.slice(0, i),
                                      {...dataTemp},
                                      ...ordered_merchandise_data.slice(i + 1),
                                    ];
                                    this.props.updateOrderedMerchandiseDataIsSelect(
                                      temp,
                                    );
                                  }
                                  // console.log(JSON.stringify(temp));
                                }}
                              />
                            </View>
                          </View>
                          <Space height={10} />
                          <Divider />
                          <Space height={10} />
                        </View>
                      ))}
                      <View>
                        {/* <Text>{data.status}</Text> */}
                        <TouchableOpacity
                          disabled={!this.getOrderStatus(item)}
                          onPress={() => {
                            const details = item.details;
                            let order_details_id = [details[0].id];
                            for (
                              let index = 1;
                              index < details.length;
                              index++
                            ) {
                              const element = details[index];
                              if (element.is_select) {
                                order_details_id = [
                                  ...order_details_id,
                                  element.id,
                                ];
                              }
                            }
                            this.setState({
                              isFetching: true,
                            });
                            // console.log(order_details_id);
                            this.props.postOrderedMerchandiseStatus(
                              item.id,
                              this.props.userInfo.id,
                              order_details_id,
                              "delivered"
                            );
                            this.props.getOrderedMerchandiseData(
                              this.state.from_date,
                              this.state.to_date,
                              10,
                              this.state.selectedType === 'all'
                                ? undefined
                                : this.state.selectedType,
                              this.props.userInfo.class_id[this.props.selected_class_index],
                              false,
                              '',
                              this.handleCallback,
                            );
                          }}
                          style={[
                            styles.button,
                            {
                              backgroundColor: this.getOrderStatus(item)
                                ? configs.colors.primaryColor
                                : '#DADADA',
                              borderRadius: this.getOrderStatus(item) ? 20 : 5,
                            },
                          ]}>
                          <Image
                            source={require('../../../../assets/icons/ic_delivered.png')}
                            style={{height: 16, width: 16}}
                          />
                          <Space width={10} />
                          <Text style={{color: 'white', fontSize: 14}}>
                            Delivered
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {index === ordered_merchandise_data.length - 1 ? (
                      this.state.isLoadMore || this.props.isLoadMoreLoading ? (
                        <View
                          style={{
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <ActivityIndicator
                            size="small"
                            animating
                            color="blue"
                          />
                        </View>
                      ) : null
                    ) : null}
                    {index === ordered_merchandise_data.length - 1 ? (
                      <Space height={200} />
                    ) : null}
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
          {/* <Space height={200} /> */}
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ordered_merchandise_data: state.homeState.ordered_merchandise_data,
    merchandise_types: state.homeState.merchandise_types,
    merchandise_details: state.homeState.merchandise_details,
    isLoading: state.homeState.isLoading,
    userInfo: state.authState.userInfo,
    next_url: state.homeState.next_url,
    isLoadMoreLoading: state.homeState.isLoadMoreLoading,
    selected_class_index: state.homeState.selected_class_index,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateOrderedMerchandiseDataIsSelect: (data) =>
      dispatch(homeAction.updateOrderedMerchandiseDataIsSelect(data)),
    getOrderedMerchandiseData: (
      start_date,
      end_date,
      size,
      merchandise_type_id,
      class_id,
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
          isNext,
          next_url,
          handleCallback,
        ),
      ),
    fetchMerchandiseType: () => dispatch(homeAction.fetchMerchandiseType()),
    fetchMerchandiseDetails: (id) =>
      dispatch(homeAction.fetchMerchandiseDetails(id)),
    postOrderedMerchandiseStatus: (id, updated_by, order_details_id, status) =>
      dispatch(
        homeAction.postOrderedMerchandiseStatus(
          id, updated_by, order_details_id, status
        ),
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MerchandiseScreenFacilitator);

const styles = StyleSheet.create({
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
    paddingVertical: 20,
    marginBottom: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    // shadowColor: '#f2f2f2',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.5,
    // shadowRadius: 1,
    // elevation: 1,
    marginHorizontal: 4,
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
  containerStyle: {
    width: 110,
    height: 40,
  },
  studentImage: {
    height: 24,
    width: 24,
    borderRadius: 24,
    borderWidth:1,
    borderColor:configs.colors.primaryColor,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: configs.colors.grey1,
  },
});
