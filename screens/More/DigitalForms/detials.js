import React, {Component} from 'react';
import {
  ScrollView,
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  FlatList,
  Button,
  Alert,
  Image,
  Platform,
  BackHandler,
  KeyboardAvoidingView,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import Modal from 'react-native-modal';
import RadioButtonSN from '../../../components/radio_button';
import DocumentPicker from 'react-native-document-picker';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import configs from '../../../utils/configs';
import DropdownSelect from '../../../components/dropdown';
import DropdownV2 from '../../../components/dropdownV2';
import IconButton from '../../../components/icon_button';
import CheckBox from '../../../components/checkbox';
import CalendarPicker from 'react-native-calendar-picker';
import ImageLoad from '../../../components/ImageLoad';
import RBSheet from 'react-native-raw-bottom-sheet';
import {RNS3} from 'react-native-aws3';
import base64 from 'react-native-base64';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {connect} from 'react-redux';
import Loading from '../../../components/Loading';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import homeAction from '../../../actions/homeAction';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import utilities from '../../../utils/utilities';
import Dialog from 'react-native-dialog';
import SuccessfulModal from './successfulModal';
import {HighlightedText} from 'react-native-highlighted-text';

const {height, width} = Dimensions.get('window');
const Space = ({width, height}) => {
  return <View style={{width, height}}></View>;
};

class DigitalFormsDetails extends Component {
  state = {
    isShowCalendar: false,
    form_settings_data: [],
    isPosting: false,
    isSuccess: false,
    isFetching: false,
    is_submitted: false,
    submitted_id: '',
    is_expired: false,
    form_data: {},
    is_submitted_for_validation: false,
    temp_date:moment(),
  };

  _fetchDigitalForms(nextUrl, isNext, handleCallback) {
    const {userInfo, studentInfo, selected_class_index} = this.props;

    var status = 'Open';
    var user_role = userInfo.user_type;
    var class_id =
      user_role === 'parent'
        ? studentInfo.class_id[0]
        : userInfo.class[selected_class_index].id;
    var valid_date = moment().format('YYYY-MM-DD');

    this.props.fetchDigitalForms(
      status,
      class_id,
      userInfo.id,
      user_role,
      valid_date,
      valid_date,
      10,
      nextUrl,
      isNext,
      handleCallback,
    );
  }

  _renderExpiredDialog = (visible) => {
    return (
      <Dialog.Container
        visible={visible}
        contentStyle={{borderRadius: 10, backgroundColor: 'white'}}
        blurComponentIOS={<View></View>}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
            marginTop: -10,
          }}>
          <Ionicons
            name="warning-outline"
            color="#F3B329"
            size={120}
            style={{alignSelf: 'center'}}
          />
          <Text style={{alignSelf: 'center'}}>This form is currently</Text>
          <Text style={{alignSelf: 'center'}}>unavailable!</Text>
          <Space height={20} />
          <TouchableOpacity
            style={{
              backgroundColor: configs.colors.primaryColor,
              paddingHorizontal: 40,
              paddingVertical: 10,
              borderRadius: 20,
            }}
            onPress={() => {
              this.setState({
                is_expired: false,
              });
              this.props.navigation.goBack();
            }}>
            <Text style={{color: 'white'}}>OK</Text>
          </TouchableOpacity>
        </View>
      </Dialog.Container>
    );
  };

  _getUrlLastIndexData = (value) => {
    var xyz = value.split('/');
    return xyz[xyz.length - 1];
  };

  _isCheckMultipleChoiceGrid = (rIndex, cIndex, index) => {
    let tempFormSettingsData = this.state.form_settings_data;

    tempFormSettingsData[index].value === undefined
      ? (tempFormSettingsData[index].value = [])
      : null;
    if (tempFormSettingsData[index].value.length > 0) {
      let tempValue = tempFormSettingsData[index].value;
      var exitIndex = tempValue.findIndex((x) => x.row === rIndex);
      if (exitIndex !== -1) {
        tempFormSettingsData[index].value[exitIndex].row = rIndex;
        tempFormSettingsData[index].value[exitIndex].col = cIndex;
      } else {
        tempFormSettingsData[index].value = [
          ...tempFormSettingsData[index].value,
          {row: rIndex, col: cIndex, value: true},
        ];
      }
    } else {
      tempFormSettingsData[index].value = [
        {row: rIndex, col: cIndex, value: true},
      ];
    }

    console.log(tempFormSettingsData[index].value);

    this.setState({
      form_settings_data: tempFormSettingsData,
    });
  };

  _renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={{flex: 1, paddingLeft: 16, borderRadius: 10}}
          onPress={() => {
            this._fetchDigitalForms('', false, () => console.log('Hello'));
            this.props.navigation.goBack();
          }}>
          <Ionicons
            name="chevron-back"
            color={configs.colors.primaryColor}
            size={24}
          />
        </TouchableOpacity>
        <View style={{flex: 4, alignSelf: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Digital forms</Text>
        </View>
        <TouchableOpacity
          style={{marginRight: 12}}
          onPress={this._submitFormData}>
          <Text
            style={{
              color: configs.colors.primaryColor,
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  _getFileType = (value) => {
    let a = value.split('/');
    return '.' + a[a.length - 1];
  };

  _checkFileTypeExistOrNot = () => {
    let {form_settings_data} = this.state;
    var indexs = form_settings_data.findIndex((x) => x.type == 'File upload');
    if (indexs != -1) {
      if(form_settings_data[indexs].value !== undefined && form_settings_data[indexs].value !== null && form_settings_data[indexs].value !== {} && form_settings_data[indexs].value !== "")
        return true;
      else return false;
    } else {
      return false;
    }
  };

  _checkFileType = (type) => {
    var tempTypeArray = type.split('/');
    return tempTypeArray[1];
  };

  _submitFormData = () => {
    const {id} = this.props.route.params;
    this.setState({
      is_submitted_for_validation: true,
    });

    var isValid = this._checkValidationAll();

    if (isValid === true) {
      this.setState({
        isPosting: true,
      });

      var count = 0;

      let {form_settings_data, is_submitted, submitted_id} = this.state;

      for (let xx = 0; xx < form_settings_data.length; xx++) {
        const element = form_settings_data[xx];
        if (element.type == 'File upload') {
          count = count + 1;
        }
      }

      var successCount = 0;

      var isFileTypeExist = this._checkFileTypeExistOrNot();

      if (isFileTypeExist == true) {
        form_settings_data.map(async (x, i) => {
          if (x.type == 'File upload') {
            var type = this._checkFileType(x.value.type);
            //TODO size limit 10MB => e.size
            const options = {
              acl: configs.constant.S3_KEYS.AWS_ACL,
              keyPrefix:
                type === 'pdf'
                  ? configs.constant.S3_KEYS.AWS_KEY_PREFIX_FILE
                  : configs.constant.S3_KEYS.AWS_KEY_PREFIX_IMAGE,
              bucket: configs.constant.S3_KEYS.AWS_BUCKET_NAME,
              region: configs.constant.S3_KEYS.AWS_REGION,
              accessKey: configs.constant.S3_KEYS.AWS_ACCESS_KEY,
              secretKey: configs.constant.S3_KEYS.AWS_SECRET_KEY,
              successActionStatus: 201,
            };
            var tempFile = {
              uri: x.value.uri,
              name: x.value.name,
              type: x.value.type,
            };
            await RNS3.put(tempFile, options)
              .then((response) => {
                if (response.status != 201) {
                  throw 'errors';
                } else {
                  successCount = successCount + 1;
                  let tempData = form_settings_data;
                  tempData[i].value =
                    configs.constant.S3_KEYS.AWS_CLOUD_FRONT +
                    response.body.postResponse.key;
                  this.setState({
                    form_settings_data: tempData,
                  });
                  if (successCount == count) {
                    const {
                      postDigitalForms,
                      userInfo,
                      studentInfo,
                      selected_class_index,
                    } = this.props;

                    postDigitalForms(
                      is_submitted ? submitted_id : id,
                      JSON.stringify(tempData),
                      userInfo.id,
                      userInfo.user_type,
                      userInfo.user_type === 'parent'
                        ? studentInfo.class_id[0]
                        : userInfo.class[selected_class_index].id,
                      userInfo.user_type === 'parent'
                        ? studentInfo.centre_id[0]
                        : userInfo.centre_id[0],
                      (vlue) => {
                        this.setState({
                          isPosting: false,
                        });
                        if (vlue == true) {
                          this._fetchDigitalForms('', false, () =>
                            console.log('Successful'),
                          );

                          // utilities.showToastMessage("Successful! Thanks for your submitted form.","success");
                          this.setState({
                            isSuccess: true,
                          });
                        } else {
                          utilities.showToastMessage(
                            'Failed! please, try again to submit the form',
                            'error',
                          );
                          this.setState({
                            isSuccess: false,
                          });
                        }
                      },
                      is_submitted,
                    );
                  }
                }
              })
              .catch((error) => {
                console.log(error);
                this.setState({
                  isPosting: false,
                });
                Alert.alert(
                  'Server errors',
                  'Fail to upload file to s3 server!',
                );
              });
          }
        });
      } else {
        console.log('not exist file type');
        // this.setState({
        //   isPosting:false,
        // })
        const {postDigitalForms, userInfo, studentInfo, selected_class_index} =
          this.props;

        postDigitalForms(
          is_submitted ? submitted_id : id,
          JSON.stringify(form_settings_data),
          userInfo.id,
          userInfo.user_type,
          userInfo.user_type === 'parent'
            ? studentInfo.class_id[0]
            : userInfo.class[selected_class_index].id,
          userInfo.user_type === 'parent'
            ? studentInfo.centre_id[0]
            : userInfo.centre_id[0],
          (value) => {
            this.setState({
              isPosting: false,
            });
            if (value == true) {
              this._fetchDigitalForms('', false, () =>
                console.log('Successful'),
              );
              // utilities.showToastMessage("Successful! Thanks for your submitted form.","success");
              this.setState({
                isSuccess: true,
              });
            } else {
              utilities.showToastMessage(
                'Failed! please, try again to submit the form',
                'error',
              );
              this.setState({
                isSuccess: false,
              });
            }
          },
          is_submitted,
        );
      }
    } else {
      this.setState({
        is_submitted_for_validation: true,
      });
    }
  };

  _checkValidationAll = () => {
    let dataList = this.state.form_settings_data;
    for (let i = 0; i < dataList.length; i++) {
      const element = dataList[i];
      if (element.mandatory !== undefined) {
        if (element.mandatory === true)
          if (
            element.value == null ||
            element.value == '' ||
            element.value.length < 0
          ) {
            // console.log("false");
            return false;
          }
      }
    }
    // console.log("true");
    return true;
  };

  componentDidMount() {
    this.setState({
      isFetching: true,
    });

    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );

    const {id} = this.props.route.params;
    const {userInfo} = this.props;

    this.props.getFormDetailsData(
      id,
      undefined,
      userInfo.id,
      (status, resultdata) => {
        const {data, is_submitted, submitted_id, is_expired, form_data} =
          this._getFormSettingsData(resultdata);
        if (status == true) {
          this.setState({
            form_settings_data: data,
            is_submitted: is_submitted,
            submitted_id: submitted_id,
            is_expired: is_expired,
            form_data: form_data,
          });
        }
        this.setState({
          isFetching: false,
        });
      },
    );
  }

  backAction = () => {
    this._fetchDigitalForms('', false, () => console.log('Hello'));
  };

  _onDocumentPicking = async (index) => {
    // console.log("Hello");
    await DocumentPicker.pick({
      type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
    })
      .then((response) => {
        let tempData = this.state.form_settings_data;
        tempData[index].value = response;
        this.setState({
          form_settings_data: tempData,
          // isFileTypeExist:true,
        });
        console.log(response);
      })
      .catch((err) => console.log(err));
  };

  multi = (v, i, i1) => {
    let tempData = this.state.form_settings_data;
    tempData[i1].value = i;
    this.setState({
      form_settings_data: tempData,
    });
    console.log(tempData[i1].value);
  };

  onChangeMultipleGrid(value, rIndex, cIndex, index) {
    let tempFormData = this.state.form_settings_data;
    if (index !== -1) {
      let tempArray = {row: rIndex, col: cIndex, value: value};
      let valueData =
        tempFormData[index].value !== undefined
          ? tempFormData[index].value
          : [];
      var fIndex = valueData.findIndex(
        (x) => x.row === rIndex && x.col === cIndex,
      );
      if (fIndex !== -1) {
        tempFormData[index].value.splice(fIndex, 1);
      } else {
        tempFormData[index].value !== undefined
          ? (tempFormData[index].value = [
              ...tempFormData[index].value,
              tempArray,
            ])
          : (tempFormData[index].value = [tempArray]);
      }
    }
    this.setState({
      form_settings_data: tempFormData,
    });
  }

  isCheckCheckbox = (valueData = [], rIndex, cIndex) => {
    var fIndex = valueData.findIndex(
      (x) => x.row === rIndex && x.col === cIndex,
    );
    return fIndex !== -1;
  };

  _renderItems = (item, index) => {
    // console.log("Hello",item.type);
    var Index1 = index;
    switch (item.type) {
      case 'Short answer':
        var questions = item.data;
        item.mandatory && item.mandatory === true
          ? (questions = questions + ' [[*]]')
          : null;
        return (
          <View key={index} style={styles.item}>
            {/* <Text style={{fontSize: 14, fontWeight: '600'}}>
              {item.data != '' ? item.data : 'Subject'} {item.mandatory && item.mandatory === true && "*"}
            </Text> */}
            <HighlightedText
              style={{fontSize: 14, fontWeight: '600'}}
              highlightedTextStyles={[
                {
                  color: 'red',
                },
              ]}>
              {questions}
            </HighlightedText>
            <Space height={10} />
            <View style={styles.inputcontainer}>
              <TextInput
                value={item.value == null ? '' : item.value}
                onChangeText={(text) => {
                  let tempData = this.state.form_settings_data;
                  tempData[index].value = text;
                  this.setState({
                    form_settings_data: tempData,
                  });
                }}
              />
            </View>
            {this.state.is_submitted_for_validation === true &&
              item.mandatory &&
              item.mandatory === true &&
              (item.value == null || item.value == '') && (
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <Ionicons
                    name="alert-circle-outline"
                    color={'red'}
                    size={18}
                  />
                  <Text style={{color: 'red', fontSize: 12, paddingLeft: 5}}>
                    This field is required
                  </Text>
                </View>
              )}
          </View>
        );

      case 'Multiple choice':
        var option = [];
        item.option.map((op, i) =>
          option.push({label: op, id: i, value: op}),
        );
        option = option.filter((x) => x.value != '');
        // var onPress = (value, index) => {
        //     let tempData = this.state.form_settings_data;
        //     tempData[Index1].value = value;
        //     this.setState({
        //       form_settings_data: tempData,
        //     });
        // }
        var questions = item.data;
        item.mandatory && item.mandatory === true
          ? (questions = questions + ' [[*]]')
          : null;
        return (
          <View style={styles.item} key={index}>
            <Space height={10} />
            {/* <Text style={{fontSize: 14, fontWeight: '600'}}>{item.data}</Text> */}
            <HighlightedText
              style={{fontSize: 14, fontWeight: '600'}}
              highlightedTextStyles={[
                {
                  color: 'red',
                },
              ]}>
              {questions}
            </HighlightedText>
            <Space height={10} />
            <View style={{width: '100%'}}>
              <View style={{width: '100%', marginLeft: 10}}>
                <RadioForm formHorizontal={false} animation={true}>
                  {option.map((obj, i) => (
                    <RadioButton labelHorizontal={true} key={i}>
                      <RadioButtonInput
                        obj={obj}
                        index={i}
                        isSelected={item.value === obj.label}
                        // onPress={onPress}
                        onPress={(value, index) => {
                          let tempDataArray = this.state.form_settings_data;
                          tempDataArray[Index1].value = obj.label;
                          this.setState({
                            form_settings_data: tempDataArray,
                          });
                        }}
                        borderWidth={1}
                        buttonInnerColor={configs.colors.primaryColor}
                        buttonOuterColor={
                          item.value === obj.label ? '#2196f3' : '#DADADA'
                        }
                        buttonSize={15}
                        buttonOuterSize={25}
                      />
                      <View style={{width: 5}} />
                      <RadioButtonLabel
                        obj={obj}
                        index={i}
                        labelStyle={{fontSize: 13, color: 'black'}}
                        labelWrapStyle={{alignSelf: 'center'}}
                      />
                    </RadioButton>
                  ))}
                </RadioForm>
              </View>
            </View>
            {this.state.is_submitted_for_validation === true &&
              item.mandatory &&
              item.mandatory === true &&
              (item.value == null || item.value == '' || item.value == {}) && (
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <Ionicons
                    name="alert-circle-outline"
                    color={'red'}
                    size={18}
                  />
                  <Text style={{color: 'red', fontSize: 12, paddingLeft: 5}}>
                    This field is required
                  </Text>
                </View>
              )}
          </View>
        );

      case 'File upload':
        var questions = item.data;
        item.mandatory && item.mandatory === true
          ? (questions = questions + ' [[*]]')
          : null;
        return (
          <View style={styles.item} key={index}>
            {/* <Text style={{fontSize: 14, fontWeight: '600'}}>{item.data}</Text> */}
            <HighlightedText
              style={{fontSize: 14, fontWeight: '600'}}
              highlightedTextStyles={[
                {
                  color: 'red',
                },
              ]}>
              {questions}
            </HighlightedText>
            <Space height={10} />
            {item.value !== undefined &&
            item.value !== null &&
            item.value !== {} ? (
              <View style={{marginBottom: 10}}>
                <View
                  style={{
                    backgroundColor: '#F9FBFF',
                    borderRadius: 30,
                    borderWidth: 0.5,
                    borderColor: configs.colors.grey,
                    flexDirection: 'row',
                    height: 44,
                    paddingLeft: 15,
                    paddingRight: 5,
                  }}>
                  {typeof item.value == 'string' ? (
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        color: configs.colors.primaryColor,
                        flex: 0.9,
                        paddingRight: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                      }}>
                      {this._getUrlLastIndexData(item.value)}
                    </Text>
                  ) : (
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        color: configs.colors.primaryColor,
                        flex: 0.9,
                        paddingRight: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                      }}>
                      {item.value.name}
                      {this._getFileType(item.value.type)}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={{flex: 0.1, alignSelf: 'center'}}
                    onPress={() => {
                      let tempData = this.state.form_settings_data;
                      tempData[index].value = null;
                      this.setState({
                        form_settings_data: tempData,
                      });
                    }}>
                    <Ionicons
                      name="close-circle-outline"
                      color={configs.colors.primaryColor}
                      size={30}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
            <TouchableOpacity
              disabled={
                item.value !== undefined &&
                item.value !== null &&
                item.value !== {}
              }
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: 48,
                borderWidth: 1,
                width: '100%',
                borderColor:
                  item.value !== undefined &&
                  item.value !== null &&
                  item.value !== {}
                    ? configs.colors.grey
                    : configs.colors.primaryColor,
                alignSelf: 'center',
                borderRadius: 30,
                backgroundColor: '#fff',
                flexDirection: 'row',
              }}
              onPress={() => this._onDocumentPicking(index)}>
              <Ionicons
                name="cloud-upload"
                size={18}
                color={
                  item.value !== undefined &&
                  item.value !== null &&
                  item.value !== {}
                    ? configs.colors.grey
                    : configs.colors.primaryColor
                }
              />
              <Space width={10} />
              <Text
                style={{
                  color:
                    item.value !== undefined &&
                    item.value !== null &&
                    item.value !== {}
                      ? configs.colors.grey
                      : configs.colors.primaryColor,
                  fontWeight: 'bold',
                }}>
                File upload
              </Text>
            </TouchableOpacity>
            {this.state.is_submitted_for_validation === true &&
              item.mandatory &&
              item.mandatory === true &&
              (item.value == null ||
                item.value == '' ||
                item.value.length === 0) && (
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <Ionicons
                    name="alert-circle-outline"
                    color={'red'}
                    size={18}
                  />
                  <Text style={{color: 'red', fontSize: 12, paddingLeft: 5}}>
                    This field is required
                  </Text>
                </View>
              )}
          </View>
        );

      case 'Multiple choice grid':
        var tableHead = [' '].concat(item.cols);
        var tableTitle = item.rows;
        var questions = item.data;
        let DataValue = item.value !== undefined ? [...item.value] : [];
        item.mandatory && item.mandatory === true
          ? (questions = questions + ' [[*]]')
          : null;
        return (
          <View key={index} style={{marginTop: 20}}>
            <View>
              <HighlightedText
                style={{fontSize: 14, fontWeight: '600'}}
                highlightedTextStyles={[
                  {
                    color: 'red',
                  },
                ]}>
                {questions}
              </HighlightedText>
            </View>
            <Space height={20} />

            <ScrollView showsHorizontalScrollIndicator={true} horizontal={true}>
              <View style={{flexDirection: 'column'}}>
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                  {tableHead.map((head, hIndx) => (
                    <View key={hIndx} style={{width: configs.width * 0.23}}>
                      <Text
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignSelf: 'center',
                        }}>
                        {head}
                      </Text>
                    </View>
                  ))}
                </View>
                {tableTitle.map((titleData, tIndex) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 8,
                        marginBottom: 8,
                      }}
                      key={tIndex}>
                      {tableHead.map((rowData, rIndex) => {
                        if (rIndex === 0) {
                          return (
                            <View
                              key={rIndex}
                              style={{width: configs.width * 0.23}}>
                              <Text
                                style={{
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  alignSelf: 'center',
                                }}>
                                {tableTitle[tIndex]}
                              </Text>
                            </View>
                          );
                        } else {
                          return (
                            <View
                              key={rIndex}
                              style={{
                                width: configs.width * 0.23,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <RadioButtonSN
                                animation={'bounceIn'}
                                isSelected={this.isCheckCheckbox(
                                  DataValue,
                                  tIndex,
                                  rIndex - 1,
                                )}
                                onPress={() =>
                                  this._isCheckMultipleChoiceGrid(
                                    tIndex,
                                    rIndex - 1,
                                    index,
                                  )
                                }
                                size={14}
                                outerColor={configs.colors.grey}
                              />
                            </View>
                          );
                        }
                      })}
                    </View>
                  );
                })}
              </View>
            </ScrollView>
            {this.state.is_submitted_for_validation === true &&
              item.mandatory &&
              item.mandatory === true &&
              (item.value == null ||
                item.value == '' ||
                item.value === undefined) && (
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <Ionicons
                    name="alert-circle-outline"
                    color={'red'}
                    size={18}
                  />
                  <Text style={{color: 'red', fontSize: 12, paddingLeft: 5}}>
                    This field is required
                  </Text>
                </View>
              )}
          </View>
        );

      case 'Multiple':
        var tableHead = [' '].concat(item.cols);
        var tableTitle = item.rows;
        let valueData = item.value !== undefined ? [...item.value] : [];
        var questions = item.data;
        item.mandatory && item.mandatory === true
          ? (questions = questions + ' [[*]]')
          : null;
        return (
          <View key={index} style={{marginTop: 20}}>
            <View>
              <HighlightedText
                style={{fontSize: 14, fontWeight: '600'}}
                highlightedTextStyles={[
                  {
                    color: 'red',
                  },
                ]}>
                {questions}
              </HighlightedText>
            </View>
            <Space height={20} />
            <ScrollView showsHorizontalScrollIndicator={true} horizontal={true}>
              <View style={{flexDirection: 'column'}}>
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                  {tableHead.map((head, hIndx) => (
                    <View key={hIndx} style={{width: configs.width * 0.23}}>
                      <Text
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {head}
                      </Text>
                    </View>
                  ))}
                </View>
                {tableTitle.map((titleData, tIndex) => {
                  return (
                    <View style={{flexDirection: 'row'}} key={tIndex}>
                      {tableHead.map((rowData, rIndex) => {
                        if (rIndex === 0) {
                          return (
                            <View
                              key={rIndex}
                              style={{width: configs.width * 0.23}}>
                              <Text
                                style={{
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                {tableTitle[tIndex]}
                              </Text>
                            </View>
                          );
                        } else {
                          return (
                            <View
                              key={rIndex}
                              style={{
                                width: configs.width * 0.23,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <CheckBox
                                checked={this.isCheckCheckbox(
                                  valueData,
                                  tIndex,
                                  rIndex - 1,
                                )}
                                onChange={(value) =>
                                  this.onChangeMultipleGrid(
                                    value,
                                    tIndex,
                                    rIndex - 1,
                                    index,
                                  )
                                }
                              />
                            </View>
                          );
                        }
                      })}
                    </View>
                  );
                })}
              </View>
            </ScrollView>
            {this.state.is_submitted_for_validation === true &&
              item.mandatory &&
              item.mandatory === true &&
              (item.value == null ||
                item.value == '' ||
                item.value.length === 0) && (
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <Ionicons
                    name="alert-circle-outline"
                    color={'red'}
                    size={18}
                  />
                  <Text style={{color: 'red', fontSize: 12, paddingLeft: 5}}>
                    This field is required
                  </Text>
                </View>
              )}
          </View>
        );

      case 'Checkbox':
        let optionData = item.option.filter((x) => x != '');
        var questions = item.data;
        item.mandatory && item.mandatory === true
          ? (questions = questions + ' [[*]]')
          : null;
        return (
          <View style={styles.item} key={index}>
            <HighlightedText
              style={{fontSize: 14, fontWeight: '600'}}
              highlightedTextStyles={[
                {
                  color: 'red',
                },
              ]}>
              {questions}
            </HighlightedText>
            <Space height={10} />
            <View style={{width: '100%'}}>
              <View style={{flex: 0.7, justifyContent: 'space-around'}}>
                {optionData.map((x, i) => (
                  <View style={{marginVertical: 3}} key={i}>
                    <CheckBox
                      labelTop={false}
                      lableHorizontal={true}
                      labelStyle={{paddingBottom: 5}}
                      checked={
                        item.value != null ? item.value.includes(x) : false
                      }
                      label={x}
                      onChange={(value) => {
                        let tempData = this.state.form_settings_data;
                        if (value) {
                          let checkedValues = tempData[index].value;
                          if (checkedValues != null) {
                            tempData[index].value = [...checkedValues, x];
                          } else {
                            tempData[index].value = [x];
                          }
                        } else {
                          var ind = tempData[index].value.findIndex(
                            (y) => y == x,
                          );
                          if (ind != -1) {
                            tempData[index].value.splice(ind, 1);
                          }
                        }
                        this.setState({
                          form_settings_data: tempData,
                        });
                      }}
                    />
                  </View>
                ))}
              </View>
            </View>
            {this.state.is_submitted_for_validation === true &&
              item.mandatory &&
              item.mandatory === true &&
              (item.value == null ||
                item.value == '' ||
                item.value.length < 0) && (
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <Ionicons
                    name="alert-circle-outline"
                    color={'red'}
                    size={18}
                  />
                  <Text style={{color: 'red', fontSize: 12, paddingLeft: 5}}>
                    This field is required
                  </Text>
                </View>
              )}
          </View>
        );

      case 'Paragraph':
        var questions = item.data;
        item.mandatory && item.mandatory === true
          ? (questions = questions + ' [[*]]')
          : null;
        return (
          <View key={index} style={styles.item}>
            <HighlightedText
              style={{fontSize: 14, fontWeight: '600'}}
              highlightedTextStyles={[
                {
                  color: 'red',
                },
              ]}>
              {questions}
            </HighlightedText>
            <Space height={10} />
            <TextInput
              style={{
                textAlignVertical: 'top',
                borderWidth: 1,
                borderColor: '#DADADA',
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginBottom: 22,
                marginTop: 2,
                fontSize: 14,
                fontFamily: configs.fontFamily.OPS400,
                minHeight: 120,
              }}
              multiline
              numberOfLines={5}
              value={item.value == null ? '' : item.value}
              onChangeText={(value) => {
                let tempData = this.state.form_settings_data;
                tempData[index].value = value;
                this.setState({
                  form_settings_data: tempData,
                });
              }}
            />
            {this.state.is_submitted_for_validation === true &&
              item.mandatory &&
              item.mandatory === true &&
              (item.value == null || item.value == '') && (
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <Ionicons
                    name="alert-circle-outline"
                    color={'red'}
                    size={18}
                  />
                  <Text style={{color: 'red', fontSize: 12, paddingLeft: 5}}>
                    This field is required
                  </Text>
                </View>
              )}
          </View>
        );

      case 'Dropdown':
        let dropdownData = [{label: 'Select', value: null}];
        item.option.map((x) => {
          if (x != '' && x != undefined && x != null)
            dropdownData.push({
              label: x,
              value: x,
            });
        });
        var questions = item.data;
        item.mandatory && item.mandatory === true
          ? (questions = questions + ' [[*]]')
          : null;
        return (
          <View style={styles.item} key={index}>
            <HighlightedText
              style={{fontSize: 14, fontWeight: '600'}}
              highlightedTextStyles={[
                {
                  color: 'red',
                },
              ]}>
              {questions}
            </HighlightedText>
            <Space height={10} />
            <View style={{zIndex: 2000}}>
              <DropdownV2
                style={styles.mainStyle}
                datas={dropdownData}
                options={dropdownData}
                selectedValue={
                  item.value == null ? dropdownData[0].value : item.value
                }
                onChangeSelected={(data) => {
                  let tempData = this.state.form_settings_data;
                  tempData[index].value = data.value;
                  this.setState({
                    form_settings_data: tempData,
                  });
                }}
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
                  width: width - 70,
                  height: 120,
                  marginTop: -15,
                  // marginLeft: 5,
                }}
                dropdownTextStyle={{fontSize: 13, textAlign: 'center'}}
                containerText={{
                  justifyContent: 'center',
                  textAlign: 'center',
                  paddingVertical: 8,
                }}
              />
            </View>
            {this.state.is_submitted_for_validation === true &&
              item.mandatory &&
              item.mandatory === true &&
              (item.value == null || item.value == '') && (
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <Ionicons
                    name="alert-circle-outline"
                    color={'red'}
                    size={18}
                  />
                  <Text style={{color: 'red', fontSize: 12, paddingLeft: 5}}>
                    This field is required
                  </Text>
                </View>
              )}
          </View>
        );

      case 'Date':
        const {isShowCalendar, form_settings_data} = this.state;
        var questions = item.data;
        item.mandatory && item.mandatory === true
          ? (questions = questions + ' [[*]]')
          : null;
        return (
          <View style={styles.item} key={index}>
            <HighlightedText
              style={{fontSize: 14, fontWeight: '600'}}
              highlightedTextStyles={[
                {
                  color: 'red',
                },
              ]}>
              {questions}
            </HighlightedText>
            <Space height={10} />
            <View
              style={{
                flexDirection: 'row',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#dadada',
                alignItems: 'center',
                paddingVertical: 8,
              }}>
              <Text
                style={{
                  flex: 5,
                  marginLeft: 10,
                  fontSize: 14,
                  fontFamily: configs.fontFamily.OPS600,
                }}>
                {item.value == null
                  ? 'dd/mm/yyyy'
                  : moment(item.value).format('DD/MM/YYYY')}
              </Text>
              <View style={{flex: 1}}>
                <IconButton
                  icon={
                    <Ionicons
                      name="calendar"
                      color={configs.colors.primaryColor}
                      size={24}
                    />
                  }
                  onPress={() => this.setState({isShowCalendar: true})}
                />
              </View>
            </View>
            {isShowCalendar ? (
              // <DateTimePicker
              //   testID="dateTimePicker"
              //   value={item.value != null ? new Date(item.value) : new Date()}
              //   mode="date"
              //   is24Hour={true}
              //   display="default"
              //   onChange={(event, selectedDate) => {
              //     this.setState({
              //       isShowCalendar: false,
              //     });
              //     let tempData = form_settings_data;
              //     tempData[index].value = selectedDate;
              //     // console.log(selectedDate);
              //     this.setState({
              //       form_settings_data: tempData,
              //     });
              //   }}
              // />
              <Modal
                hasBackdrop={true}
                backdropColor={'#000000'}
                backdropOpacity={0.5}
                statusBarTranslucent={true}
                animationType="slide"
              // transparent={false}
                // transparent={}
                isVisible={this.state.isShowCalendar}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.'); //temporary behavior, retest on physical device
                }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <View style={{paddingHorizontal: 50, marginHorizontal: 10}}>
                      <CalendarPicker
                        onDateChange={(date) => {
                              this.setState({
                                temp_date: date.format('YYYY-MM-DD'),
                              });
                              
                        }}
                        headerWrapperStyle={{ height: 30}}
                        previousTitleStyle={{ height: 30,}}
                        nextTitleStyle={{ height: 30}}
                        textStyle={{fontWeight: '700'}}
                        monthTitleStyle={{color: '#4075FF'}}
                        yearTitleStyle={{color: '#4075FF'}}
                        todayTextStyle={{color: '#fff'}}
                        selectedDayColor="#E9F0FD"
                        todayBackgroundColor="#F6D102"
                        previousTitle={
                          <Image
                            style={{height: 20, width: 8, resizeMode: 'contain'}}
                            source={require('../../../assets/icons/ic_arrow_left_blue.png')}
                          />
                        }
                        nextTitle={
                          <Image
                            style={{
                              height: 20,
                              width: 8,
                              resizeMode: 'contain',
                            }}
                            source={require('../../../assets/icons/ic_arrow_right_blue.png')}
                          />
                        }
                      />
                    </View>
                    <TouchableHighlight
                      style={styles.openButton}
                      onPress={() => {
                        let tempData = form_settings_data;
                              tempData[index].value = this.state.temp_date;
                              // console.log(selectedDate);
                              this.setState({
                                form_settings_data: tempData,
                                isShowCalendar: false,
                              });
                      
                      }}>
                      <Text style={styles.textStyle}>Ok</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </Modal>
            ) : null}
            {this.state.is_submitted_for_validation === true &&
              item.mandatory &&
              item.mandatory === true &&
              (item.value == null || item.value == '') && (
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <Ionicons
                    name="alert-circle-outline"
                    color={'red'}
                    size={18}
                  />
                  <Text style={{color: 'red', fontSize: 12, paddingLeft: 5}}>
                    This field is required
                  </Text>
                </View>
              )}
            <Space height={10} />
          </View>
        );

      case 'Linear scale':
        var questions = item.data;
        item.mandatory && item.mandatory === true
          ? (questions = questions + ' [[*]]')
          : null;
        var questionLists = [item.linear1];
        for (let i = item.linear1 + 1; i <= item.linear2; i++) {
          questionLists.push(i);
        }
        return (
          <View style={styles.item} key={index}>
            <HighlightedText
              style={{fontSize: 14, fontWeight: '600'}}
              highlightedTextStyles={[
                {
                  color: 'red',
                },
              ]}>
              {questions}
            </HighlightedText>
            <Space height={10} />
            <ScrollView horizontal>
              <Text
                style={{
                  color: configs.colors.primaryColor,
                  fontSize: 12,
                  fontWeight: 'bold',
                  alignItems:'flex-end',
                  alignSelf:'flex-end'
                }}>
                {item.label1}
              </Text>
              {questionLists.map((q, c) => (
                <View key={c} style={{
                  marginHorizontal:10,
                }}>
                  <Text style={{
                    justifyContent:'center',
                    alignSelf:'center'
                  }}>{q}</Text>
                  <Space height={5}/>
                  <RadioButtonSN
                    animation={'bounceIn'}
                    isSelected={false}
                    size={14}
                    isSelected={
                      item.value !== undefined ? item.value === q : false
                    }
                    onPress={()=>{
                      let tempValueFormData = this.state.form_settings_data;
                      tempValueFormData[index].value = q;
                      this.setState({
                        form_settings_data:tempValueFormData,
                      });
                    }}
                    outerColor={configs.colors.grey}
                  />
                </View>
              ))}
              <Text
                style={{
                  color: configs.colors.primaryColor,
                  fontSize: 12,
                  fontWeight: 'bold',
                  alignSelf:'flex-end'
                }}>
                {item.label2}
              </Text>
            </ScrollView>
            <Space height={5}/>
            {this.state.is_submitted_for_validation === true &&
              item.mandatory &&
              item.mandatory === true &&
              (item.value == null || item.value == '') && (
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <Ionicons
                    name="alert-circle-outline"
                    color={'red'}
                    size={18}
                  />
                  <Text style={{color: 'red', fontSize: 12, paddingLeft: 5}}>
                    This field is required
                  </Text>
                </View>
              )}
          </View>
        );

      default:
        return null;
    }
  };

  _getFormSettingsData = (form_details) => {
    if (form_details == {}) {
      return [];
    } else {
      let is_submitted =
        form_details.submitted_forms != undefined
          ? form_details.submitted_forms.length > 0
          : true;
      var is_valid = moment().isBetween(
        moment(form_details.valid_from_date).subtract(1, 'days'),
        moment(form_details.valid_to_date).add(1, 'days'),
      );
      if (is_submitted) {
        return {
          data: JSON.parse(form_details.submitted_forms[0].form_settings),
          is_submitted: is_submitted,
          submitted_id: form_details.submitted_forms[0].id,
          is_expired: !is_valid,
          form_data: form_details,
        };
      } else {
        // let form_settings_data = JSON.parse(form_details.form_settings);
        // let temp = form_settings_data;
        // let tempValue = [];
        // for (let a = 0; a < form_settings_data.length; a++) {
        //   const element = form_settings_data[a];
        //   if (element.type === 'Multiple choice grid') {
        //     var array = [];
        //     for (let b = 0; b < element.cols.length; b++) {
        //       array.push(0);
        //     }
        //     for (let c = 0; c < element.rows.length; c++) {
        //       tempValue.push(array);
        //     }
        //     temp[a].value = tempValue;
        //   }
        // }
        return {
          data: JSON.parse(form_details.form_settings),
          is_submitted: is_submitted,
          submitted_id: '',
          is_expired: !is_valid,
          form_data: form_details,
        };
      }
    }
  };

  _renderLoading = () => {
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: configs.colors.backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Loading ...</Text>
      </View>
    );
  };

  render() {
    const data = this.state.form_settings_data;
    let form_data = this.state.form_data;

    return (
      <SafeAreaView
        style={{
          backgroundColor: configs.colors.white,
          flex: 1,
        }}>
        <StatusBar
          translucent={true}
          backgroundColor={
            this.state.isSuccess === true ||
            this.state.is_expired === true ||
            this.state.isPosting === true
              ? '#00000020'
              : 'white'
          }
        />
        {this._renderHeader()}

        {this.state.isPosting === true && <Loading />}
        <View
          style={{
            backgroundColor: configs.colors.backgroundColor,
            flex: 1,
          }}>
          {this.state.is_expired == true &&
            this._renderExpiredDialog(this.state.is_expired)}

          {this.state.isSuccess === true && (
            <SuccessfulModal
              isSuccessVisible={this.state.isSuccess}
              GoToSeeHandler={() => {
                this.props.navigation.goBack();
                this.setState({
                  isSuccess: false,
                });
              }}
            />
          )}

          {/* Body */}

          {this.state.isFetching == true ? (
            this._renderLoading()
          ) : (
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps="handled"
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}>
              <View style={styles.container}>
                {form_data.img != undefined && form_data.img != '' ? (
                  <ImageLoad
                    style={{
                      height: configs.width * 0.6,
                      width: '100%',
                    }}
                    borderTopLeftRadius={20}
                    borderTopRightRadius={20}
                    loadingStyle={{
                      size: 'small',
                      color: 'white',
                    }}
                    placeholderStyle={{
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      height: configs.width * 0.6,
                      width: '100%',
                    }}
                    source={{
                      uri: form_data.img,
                      cache: 'force-cache',
                    }}
                    placeholderSource={require('../../../assets/images/placeholder_image.png')}
                  />
                ) : (
                  <Image
                    source={require('../../../assets/images/placeholder_image.png')}
                    style={{
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      height: configs.width * 0.6,
                      width: '100%',
                    }}
                  />
                )}
                <View style={{padding: 15}}>
                  <View>
                    <Text style={{fontSize: 18, fontWeight: '600'}}>
                      {this.state.form_data.name}
                    </Text>
                  </View>
                  <Space height={15} />
                  <View>
                    <Text>{this.state.form_data.description}</Text>
                  </View>

                  <Space height={20} />
                  {data &&
                    data.map((item, index) => this._renderItems(item, index))}
                </View>
              </View>
              <Space height={20} />
            </KeyboardAwareScrollView>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const bindDispatch = (dispatch) => {
  return {
    postDigitalForms: (
      form_id,
      form_settings,
      submitted_by,
      submitted_by_role,
      class_id,
      centre_id,
      handleCallback,
      is_submitted,
    ) =>
      dispatch(
        homeAction.postDigitalForms(
          form_id,
          form_settings,
          submitted_by,
          submitted_by_role,
          class_id,
          centre_id,
          handleCallback,
          is_submitted,
        ),
      ),
    getFormDetailsData: (id, size, user_id, handleCallback) =>
      dispatch(
        homeAction.getFormDetailsData(id, size, user_id, handleCallback),
      ),
    uploadS3: () => dispatch(homeAction.uploadS3()),
    uploadS3Fail: () => dispatch(homeAction.uploadS3Fail()),
    fetchDigitalForms: (
      status,
      class_id,
      user_id,
      user_role,
      valid_from_date,
      valid_to_date,
      size,
      next,
      isNext,
      handleCallback,
    ) =>
      dispatch(
        homeAction.fetchDigitalForms(
          status,
          class_id,
          user_id,
          user_role,
          valid_from_date,
          valid_to_date,
          size,
          next,
          isNext,
          handleCallback,
        ),
      ),
  };
};
const bindState = (state) => {
  return {
    userInfo: state.authState.userInfo,
    studentInfo: state.userState.studentInfo,
    form_details: state.homeState.form_details,
    digital_forms_post_loading: state.homeState.digital_forms_post_loading,
    selected_class_index: state.homeState.selected_class_index,
  };
};

const styles = StyleSheet.create({
  textArea: {
    borderWidth: 1,
    borderColor: configs.colors.borderColor,
    borderRadius: 8,
    height: 65,
    width: '100%',
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    // marginTop: Platform.OS == "ios" ? 0 : StatusBar.currentHeight,
    marginTop: StatusBar.currentHeight,
  },
  inputcontainer: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    height: 44,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: configs.colors.borderColor,
  },
  container: {
    // flex:1,
    // marginHorizontal: 20,
    // marginVertical: Platform.OS == 'ios' ? 20 : 40,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: 'white',
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    // marginBottom:30
  },
  mainStyle: {
    borderWidth: 1,
    borderColor: '#d2d2d2',
    paddingVertical: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  bottom_sheet_item: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
    // backgroundColor:'blue',
    height: 50,
  },
  ImagePicker: {
    height: configs.height / 5,
    backgroundColor: '#E5FAFF',
    borderColor: configs.colors.primaryColor,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  ImageContainer: {
    //  width: configs.width,
    height: configs.height / 5,
    borderRadius: 8,
    marginBottom: 16,
  },
  item: {
    marginVertical: 10,
  },
  head: {height: 40, backgroundColor: '#f1f8ff'},
  wrapper: {flexDirection: 'row'},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {height: 28},
  text: {textAlign: 'center'},
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
    width,
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

export default connect(bindState, bindDispatch)(DigitalFormsDetails);
