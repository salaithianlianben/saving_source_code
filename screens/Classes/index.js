import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Text,
  Image,
  ImageBackground,
  Button,
  TextInput,
  RefreshControl,
  FlatList,
  TouchableHighlight,
  StatusBar,
  Alert,
} from 'react-native';
import utilities from '../../utils/utilities';
import ButtonBorderBlue from '../../components/buttonBorderBlue';
import RBSheet from 'react-native-raw-bottom-sheet';
import {connect} from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import moment from 'moment';
import configs from '../../utils/configs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import homeAction from '../../actions/homeAction';
import ButtonBlue from '../../components/buttonBlue';
import Loading from '../../components/Loading';
import DayCalendars from './dayCalendars';
import ImageLoad from '../../components/ImageLoad';
import PopSuccess from './popSuccessfulNote';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import CollapsibleToolbar from '../../components/CollapsibleToolbar';

const date = new Date();

class Classes extends Component {
  state = {
    isFetching: false,
    isInitilizing: true,
    isUnderLay: -1,
    selectedDate:
      date.getFullYear() +
      '-' +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + date.getDate()).slice(-2),
    startDate: '',
    endDate: '',
    selectedItem: null,
    detail: '',
    isSubmitting: false,
    isSuccessfulNoteModal: false,
  };

  getClassAttendance = () => {
    let {userInfo, selected_class_index} = this.props;
    if (userInfo.class.length > 0) {
      this.props.fetchStudentAttendanceByClass(
        userInfo.class[selected_class_index].id,
        this.state.selectedDate,
        () => this.setState({isInitilizing: false}),
      );
    }
  };

  getWeek = () => {
    const begginingOfCurrentWeek =
      new Date(moment(this.state.selectedDate).startOf('week')) ||
      new Date(moment().startOf('week'));
    const endOfWeek =
      new Date(moment(this.state.selectedDate).endOf('week')) ||
      new Date(moment().endOf('week'));
    begginingOfCurrentWeek.setDate(begginingOfCurrentWeek.getDate() + 1);
    endOfWeek.setDate(endOfWeek.getDate() + 1);

    this.setState({
      startDate:
        begginingOfCurrentWeek.getFullYear() +
        '-' +
        ('0' + (begginingOfCurrentWeek.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + begginingOfCurrentWeek.getDate()).slice(-2),
      endDate:
        endOfWeek.getFullYear() +
        '-' +
        ('0' + (endOfWeek.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + endOfWeek.getDate()).slice(-2),
    });
  };

  _renderLoading = () => {
    return (
      <View style={{width: '100%'}}>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              borderRadius={20}
              padding={10}
              borderWidth={1}
              borderColor={'#00000020'}
              justifyContent="space-between"
              alignItems="center"
              marginVertical={5}
              marginHorizontal={16}>
              <SkeletonPlaceholder.Item
                width={44}
                height={44}
                borderRadius={44}
              />
              <SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  width={configs.width * 0.3}
                  borderRadius={5}
                  height={5}
                />
                <SkeletonPlaceholder.Item
                  width={configs.width * 0.1}
                  borderRadius={5}
                  height={5}
                  marginTop={5}
                />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                width={30}
                height={30}
                borderRadius={10}>
                {/* <Text>+</Text> */}
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item
              flexDirection="row"
              borderRadius={20}
              padding={10}
              borderWidth={1}
              borderColor={'#00000020'}
              justifyContent="space-between"
              alignItems="center"
              marginVertical={5}
              marginHorizontal={16}>
              <SkeletonPlaceholder.Item
                width={44}
                height={44}
                borderRadius={44}
              />
              <SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  width={configs.width * 0.3}
                  borderRadius={5}
                  height={5}
                />
                <SkeletonPlaceholder.Item
                  width={configs.width * 0.1}
                  borderRadius={5}
                  height={5}
                  marginTop={5}
                />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                width={30}
                height={30}
                borderRadius={10}>
                {/* <Text>+</Text> */}
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item
              flexDirection="row"
              borderRadius={20}
              padding={10}
              borderWidth={1}
              borderColor={'#00000020'}
              justifyContent="space-between"
              alignItems="center"
              marginVertical={5}
              marginHorizontal={16}>
              <SkeletonPlaceholder.Item
                width={44}
                height={44}
                borderRadius={44}
              />
              <SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  width={configs.width * 0.3}
                  borderRadius={5}
                  height={5}
                />
                <SkeletonPlaceholder.Item
                  width={configs.width * 0.1}
                  borderRadius={5}
                  height={5}
                  marginTop={5}
                />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                width={30}
                height={30}
                borderRadius={10}>
                {/* <Text>+</Text> */}
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item
              flexDirection="row"
              borderRadius={20}
              padding={10}
              borderWidth={1}
              borderColor={'#00000020'}
              justifyContent="space-between"
              alignItems="center"
              marginVertical={5}
              marginHorizontal={16}>
              <SkeletonPlaceholder.Item
                width={44}
                height={44}
                borderRadius={44}
              />
              <SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  width={configs.width * 0.3}
                  borderRadius={5}
                  height={5}
                />
                <SkeletonPlaceholder.Item
                  width={configs.width * 0.1}
                  borderRadius={5}
                  height={5}
                  marginTop={5}
                />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                width={30}
                height={30}
                borderRadius={10}>
                {/* <Text>+</Text> */}
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item
              flexDirection="row"
              borderRadius={20}
              padding={10}
              borderWidth={1}
              borderColor={'#00000020'}
              justifyContent="space-between"
              alignItems="center"
              marginVertical={5}
              marginHorizontal={16}>
              <SkeletonPlaceholder.Item
                width={44}
                height={44}
                borderRadius={44}
              />
              <SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  width={configs.width * 0.3}
                  borderRadius={5}
                  height={5}
                />
                <SkeletonPlaceholder.Item
                  width={configs.width * 0.1}
                  borderRadius={5}
                  height={5}
                  marginTop={5}
                />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                width={30}
                height={30}
                borderRadius={10}>
                {/* <Text>+</Text> */}
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </View>
    );
  };

  componentDidMount() {
    this.getWeek();
    this.getClassAttendance();
  }

  onRefresh = () => {
    let {fetchStudentAttendanceByClass, userInfo, selected_class_index} = this.props;

    this.setState({isFetching: true});

    if (userInfo.class.length > 0) {
      fetchStudentAttendanceByClass(
        userInfo.class[selected_class_index].id,
        this.state.selectedDate,
        this.handleCallbackFirst,
      );
    } else {
      this.setState({isFetching: false});
    }
  };

  getPreviousDate = () => {
    const {fetchNoteDataForAttendance, userInfo} = this.props;

    this.setState({
      isInitilizing: true,
    });

    const currentDayInMilli = new Date(
      moment(this.state.selectedDate, 'YYYY-MM-D').format('DD MMM YYYY'),
    ).getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const previousDayInMilli = currentDayInMilli - oneDay;
    const previousDate = new Date(previousDayInMilli);

    this.setDate(previousDate);

    this.getClassAttendance();
  };

  setDate = (newDate) => {
    const date = newDate || new Date();
    this.setState({
      selectedDate:
        date.getFullYear() +
        '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + date.getDate()).slice(-2),
    });
  };

  handleCallbackMakeAttendDetail = (success) => {
    if (success) {
      // utilities.showToastMessage("Successful!",'success');
      this.setState({
        isSuccessfulNoteModal: true,
      });
    } else {
      utilities.showToastMessage('Fail to submit!', 'warning');
    }
    this.setState({
      isSubmitting: false,
      detail:'',
    });
  };

  onSubmitAttendance = () => {
    const {userInfo, selected_class_index} = this.props;

    if (this.state.detail.trim() != '') {
      this.props.setStudentAttendDetails(
        userInfo.id,
        this.state.selectedItem.id,
        this.state.detail,
        userInfo.centre_id[0],
        userInfo.class[selected_class_index].id,
        this.handleCallbackMakeAttendDetail,
      );
    } else {
      Alert.alert('Warning!', 'Details is required.');
      this.setState({
        isSubmitting: false,
      });
    }
  };

  getCountOfArrivedStudents = () => {
    return this.props.student_attendance_in_class == null ||
      this.props.student_attendance_in_class == undefined
      ? 0
      : this.props.student_attendance_in_class.filter(
          (e) => e.status === 'present',
        ).length;
  };

  getTotalOfStudentAttendanceInClass = () => {
    return this.props.student_attendance_in_class == null ||
      this.props.student_attendance_in_class == undefined
      ? 0
      : this.props.student_attendance_in_class.length;
  };

  getNextDate = () => {
    const {fetchNoteDataForAttendance, userInfo} = this.props;

    this.setState({
      isInitilizing: true,
    });
    const currentDayInMilli = new Date(
      moment(this.state.selectedDate, 'YYYY-MM-D').format('DD MMM YYYY'),
    ).getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const nextDayInMilli = currentDayInMilli + oneDay;
    const nextDate = new Date(nextDayInMilli);
    this.setDate(nextDate);
    this.getClassAttendance();
  };

  getShortRelationShipName = (data) => {
    if (data == null || data == undefined) return '';
    if (data.relationship === 'Father') {
      return 'Dad';
    } else {
      if (data.relationship === 'Mother') {
        return 'Mom';
      } else {
        return data.relationship;
      }
    }
  };

  getNickNameOfStudent = (name) => {
    let tempArray = name.split(' ');
    let tempName = tempArray[0] + "'s";
    return tempName;
  };

  handleCallbackFirst = () => {
    this.setState({isFetching: false});
  };
  _handleData = (status) => {
    if (status == true) {
      this.setState({
        detail:
          this.props.studentAttendDetail === undefined ||
          this.props.studentAttendDetail.length === 0
            ? ''
            : this.props.studentAttendDetail.details,
      });
      this.RBSheet.open();
    }
  };

  render() {
    const {selected_class_index} = this.props;

    return (
      <CollapsibleToolbar
          title={'Class '+ this.props.userInfo.class[selected_class_index].name}
          headerColor={configs.colors.primaryColor}
          headerColorDark={configs.colors.primaryColor}
          image={require('../../assets/images/class_header.png')}
          backPress={this.backPress}
          type={configs.HEADER_TYPE.NEWSFEED_PAGE}
          data={this.props}
          navigation={this.props.navigation}
          appBarHeight={65}
          refreshState={this.state.isFetching}
          refreshing={this.onRefresh} >
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', padding: 14, marginTop: 7}}>
            <DayCalendars
              styleLeft={
                this.state.selectedDate === this.state.startDate
                  ? {opacity: 0.5}
                  : ''
              }
              styleRight={
                this.state.selectedDate === this.state.endDate
                  ? {opacity: 0.5}
                  : ''
              }
              disableLeft={this.state.selectedDate === this.state.startDate}
              disableRight={this.state.selectedDate === this.state.endDate}
              selectedDate={this.state.selectedDate}
              onClickPrevious={this.getPreviousDate}
              onClickNext={this.getNextDate}
            />
          </View>

          <View style={styles.arriveContainer}>
            <View style={styles.arriveContainerText}>
              <Text style={styles.arriveAmountText}>
                {this.getCountOfArrivedStudents()} /{' '}
                {this.getTotalOfStudentAttendanceInClass()}
              </Text>
              <Text style={styles.arriveTitle}> students arrived</Text>
            </View>
          </View>

          <View style={{margin: 10}}>
            {this.state.isInitilizing ||
            this.state.isFetching ||
            this.props.isStudentAttendDetailLoading || this.state.isSubmitting ? (
              this._renderLoading()
            ) : (
              <View>
                <FlatList
                  data={this.props.student_attendance_in_class}
                  renderItem={({item, index}) => {
                    return (
                      <View
                        style={[
                          this.state.isUnderLay == index
                            ? styles.listItemActive
                            : styles.listItem,
                        ]}>
                        <View style={{flex: 0.25}}>
                          <View style={{width: 44, height: 44}}>
                            {item.img != '' &&
                            item.img != null &&
                            item.img != undefined ? (
                              <ImageLoad
                                style={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: 44 / 2,
                                  borderColor: configs.colors.primaryColor,
                                  borderWidth: 2,
                                  overflow: 'hidden',
                                }}
                                loadingStyle={{size: 'small', color: 'white'}}
                                borderRadius={8}
                                placeholderStyle={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: 44 / 2,
                                  borderColor: configs.colors.primaryColor,
                                  borderWidth: 2,
                                  overflow: 'hidden',
                                }}
                                source={{uri: item.img, cache: 'force-cache'}}
                                placeholderSource={require('../../assets/icons/ic_account.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: 44 / 2,
                                  borderColor: configs.colors.primaryColor,
                                  borderWidth: 2,
                                  overflow: 'hidden',
                                }}
                                source={require('../../assets/icons/ic_account.png')}
                              />
                            )}
                            {item.status == 'present' && (
                              <Image
                                source={require('../../assets/icons/ic_check_circle_blue.png')}
                                style={{
                                  width: 16,
                                  height: 16,
                                  right: 0,
                                  position: 'absolute',
                                  bottom: 0,
                                }}
                              />
                            )}
                          </View>
                        </View>

                        <View  style={{flex: 0.7}} >
                          <Text numberOfLines={1}>{item.name}</Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                          }}>
                          <TouchableHighlight
                            style={{
                              height: 32,
                              width: 32,
                              borderRadius: 10,
                              borderWidth: 1,
                              borderColor: configs.colors.primaryColor,
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor:
                                this.state.isUnderLay == index
                                  ? configs.colors.primaryColor
                                  : '#fff',
                            }}
                            // onShowUnderlay={}
                            underlayColor={configs.colors.primaryColor}
                            onHideUnderlay={() =>
                              this.setState({isUnderLay: -1})
                            }
                            onShowUnderlay={() =>
                              this.setState({isUnderLay: index})
                            }
                            onPress={() => {
                              if (item.parent.length > 0) {
                                this.setState({selectedItem: item});
                                this.RBSheet.open();
                              } else {
                                Alert.alert(
                                  'Warning!',
                                  'Parent record not found.',
                                );
                              }
                            }}>
                            <Text
                              style={{
                                color:
                                  this.state.isUnderLay == index
                                    ? 'white'
                                    : configs.colors.primaryColor,
                                fontSize: 17,
                              }}>
                              +
                            </Text>
                          </TouchableHighlight>
                          <Ionicons
                            name="chevron-forward-outline"
                            size={20}
                            color={configs.colors.primaryColor}
                          />
                        </View>
                      </View>
                    );
                  }}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            )}
          </View>

          <View>
            <RBSheet
              ref={(ref) => {
                this.RBSheet = ref;
              }}
              closeOnDragDown={true}
              closeOnPressMask={false}
              dragFromTopOnly={true}
              height={395}
              customStyles={{
                wrapper: {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
                draggableIcon: {
                  width: 40,
                  height: 5,
                  marginTop: 18,
                  backgroundColor: configs.colors.lightgrey,
                },
                container: {borderTopLeftRadius: 8, borderTopEndRadius: 8},
              }}>
              <View style={{marginLeft: 24, marginRight: 24}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 24,
                    marginBottom: 24,
                  }}>
                  <Image
                    style={{height: 12, width: 12}}
                    source={require('../../assets/icons/ic_circle_blue.png')}
                  />
                  <Text
                    style={{
                      marginLeft: 9,
                      fontSize: 16,
                      fontFamily: configs.fontFamily.OPS700,
                    }}>
                    Note
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderRadius: 8,
                    borderColor: configs.colors.lightgrey,
                    padding: 13,
                  }}>
                  <View style={{alignItems: 'flex-start', flex: 0.2}}>
                    {this.state.selectedItem != null &&
                    this.state.selectedItem.parent.length > 0 ? (
                      this.state.selectedItem.parent[0].img != null &&
                      this.state.selectedItem.parent[0].img != '' ? (
                        <ImageLoad
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 48 / 2,
                            borderWidth: 2,
                            borderColor: configs.colors.primaryColor,
                            overflow: 'hidden',
                          }}
                          loadingStyle={{size: 'small', color: 'white'}}
                          borderRadius={48 / 2}
                          placeholderStyle={{
                            width: 48,
                            height: 48,
                            borderRadius: 48 / 2,
                            borderWidth: 2,
                            borderColor: configs.colors.primaryColor,
                            overflow: 'hidden',
                          }}
                          source={{
                            uri: this.state.selectedItem.parent[0].img,
                            cache: 'force-cache',
                          }}
                          placeholderSource={require('../../assets/icons/ic_account.png')}
                        />
                      ) : (
                        <Image
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 48 / 2,
                            borderWidth: 2,
                            borderColor: configs.colors.primaryColor,
                            overflow: 'hidden',
                          }}
                          source={require('../../assets/icons/ic_account.png')}
                        />
                      )
                    ) : (
                      <Image
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 48 / 2,
                          borderWidth: 2,
                          borderColor: configs.colors.primaryColor,
                          overflow: 'hidden',
                        }}
                        source={require('../../assets/icons/ic_account.png')}
                      />
                    )}

                    {this.state.selectedItem != null ? (
                      this.state.selectedItem.img != null &&
                      this.state.selectedItem.img != '' ? (
                        <ImageLoad
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 36 / 2,
                            borderWidth: 2,
                            borderColor: configs.colors.white,
                            overflow: 'hidden',
                            position: 'absolute',
                            bottom: -11,
                            right: -11,
                          }}
                          loadingStyle={{size: 'small', color: 'white'}}
                          borderRadius={36 / 2}
                          placeholderStyle={{
                            width: 36,
                            height: 36,
                            borderRadius: 36 / 2,
                            borderWidth: 2,
                            borderColor: configs.colors.white,
                            overflow: 'hidden',
                            position: 'absolute',
                            bottom: -11,
                            right: -11,
                          }}
                          source={{
                            uri: this.state.selectedItem.img,
                            cache: 'force-cache',
                          }}
                          placeholderSource={require('../../assets/icons/ic_account.png')}
                        />
                      ) : (
                        <Image
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 36 / 2,
                            borderWidth: 2,
                            borderColor: configs.colors.white,
                            overflow: 'hidden',
                            position: 'absolute',
                            bottom: -11,
                            right: -11,
                            resizeMode: 'center',
                          }}
                          source={require('../../assets/icons/ic_account.png')}
                        />
                      )
                    ) : (
                      <Image
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 36 / 2,
                          borderWidth: 2,
                          borderColor: configs.colors.white,
                          overflow: 'hidden',
                          position: 'absolute',
                          bottom: -11,
                          right: -11,
                          resizeMode: 'center',
                        }}
                        source={require('../../assets/icons/ic_account.png')}
                      />
                    )}
                  </View>
                  <View
                    style={{
                      flex: 0.8,
                      
                      flexDirection: 'row',
                      marginLeft: 13,
                      alignItems: 'center',
                    }}>
                    <Text
                      
                      numberOfLines={2}
                      style={{
                        
                        flex: 0.5,
                        fontSize: 14,
                        fontFamily: configs.fontFamily.OPS700,
                        color: configs.colors.black,
                      }}>
                      
                      {this.state.selectedItem &&
                        (this.state.selectedItem.parent.length !== 0
                          ? this.state.selectedItem.parent[0].name
                          : '')}
                    
                    
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        
                        flex: 0.5,
                        fontSize: 14,
                        fontFamily: configs.fontFamily.OPS700,
                        color: configs.colors.grey,
                      }}>
                      ・
                      {this.state.selectedItem != null &&
                        this.getNickNameOfStudent(
                          this.state.selectedItem.name,
                        )}{' '}
                      {this.state.selectedItem != null &&
                        this.getShortRelationShipName(
                          this.state.selectedItem.parent[0],
                        )}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    borderColor: configs.colors.lightgrey,
                    marginTop: 10,
                  }}>
                  <TextInput
                    multiline={true}
                    onChangeText={(value) =>
                      this.setState({
                        detail: value,
                      })
                    }
                    value={this.state.detail}
                    style={{
                      height: 120,
                      textAlignVertical: 'top',
                      paddingHorizontal: 15,
                      paddingVertical: 11,
                    }}
                  />
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      marginTop: 20,
                      marginBottom: 27,
                      flex: 1,
                      marginRight: 8,
                    }}>
                    <ButtonBorderBlue
                      title="Cancel"
                      onPress={() => this.RBSheet.close()}
                    />
                  </View>
                  <View
                    style={{
                      marginTop: 20,
                      flex: 1,
                      marginBottom: 27,
                      marginLeft: 8,
                    }}>
                    <ButtonBlue
                      onPress={() => {
                        this.setState({
                          isSubmitting: true,
                          isSuccessfulNoteModal:true,
                        });
                        this.onSubmitAttendance();
                        this.getClassAttendance();
                        this.RBSheet.close();
                      }}
                      styleText={{fontSize: 14}}
                      title="Save"
                    />
                  </View>
                </View>
              </View>
            </RBSheet>
          </View>
        
        </View>
        <PopSuccess
          isVisibles={this.state.isSuccessfulNoteModal}
          onCloseModals={() => {
            this.setState({
              isSuccessfulNoteModal: false,
            });
          }}
        />
      </CollapsibleToolbar>
      // <ScrollView
      //   style={{
      //     flex: 1,
      //     marginTop: 0,
      //     backgroundColor: configs.colors.backgroundColor,
      //   }}
      //   contentContainerStyle={{flexGrow: 1}}
      //   refreshControl={
      //     <RefreshControl
      //       refreshing={this.state.isFetching}
      //       onRefresh={this.onRefresh}
      //     />
      //   }
      //   nestedScrollEnabled={false}
      //   showsVerticalScrollIndicator={false}>
      //   <View style={{flex: 1}}>
      //     <StatusBar
      //       translucent={true}
      //       backgroundColor={
      //         this.state.isSubmitting == true ||
      //         this.state.isSuccessfulNoteModal == true
      //           ? '#00000020'
      //           : 'transparent'
      //       }
      //       barStyle="dark-content"
      //     />

      //     <Image
      //       source={require('../../assets/images/class_header.png')}
      //       style={{
      //         height: configs.height / 3.3,
      //         width: '100%',
      //         resizeMode: 'stretch',
      //         borderBottomRightRadius: 20,
      //         borderBottomLeftRadius: 20,
      //       }}
      //     />

      //     <View style={styles.headerContainer}>
      //       <Text style={styles.headerText}>
      //         Class {this.props.userInfo.class[selected_class_index].name}
      //       </Text>
      //     </View>

          
      //   </View>
      
      // </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    student_attendance_in_class: state.homeState.student_attendance_in_class,
    userInfo: state.authState.userInfo,
    isLoadingClass: state.homeState.isLoadingClass,
    isStudentAttendDetailLoading: state.homeState.isStudentAttendDetailLoading,
    isMakeStudentAttendDetailLoading:
      state.homeState.isMakeStudentAttendDetailLoading,
    studentAttendDetail: state.homeState.studentAttendDetail,
    all_note_data: state.homeState.all_note_data,
    selected_class_index: state.homeState.selected_class_index,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchStudentAttendanceByClass: (class_id, date, handleCallback) =>
      dispatch(
        homeAction.fetchStudentAttendanceByClass(
          class_id,
          date,
          handleCallback,
        ),
      ),

    fetchNoteDataForAttendance: (
      class_id,
      date,
      parent_id,
      facilitator_id,
      handleCallback,
    ) =>
      dispatch(
        homeAction.fetchNoteDataForAttendance(
          class_id,
          date,
          parent_id,
          facilitator_id,
          handleCallback,
        ),
      ),

    setStudentAttendDetails: (
      facilitaor_id,
      student_id,
      details,
      centre_id,
      class_id,
      handleCallback,
    ) =>
      dispatch(
        homeAction.setStudentAttendDetails(
          facilitaor_id,
          student_id,
          details,
          centre_id,
          class_id,
          handleCallback,
        ),
      ),

    setStudentAttendDetailsUpdate: (id, details, handleCallback) =>
      dispatch(
        homeAction.setStudentAttendDetailsUpdate(id, details, handleCallback),
      ),

    setStudentAttendanceByClassUpdate: (data) =>
      dispatch(homeAction.setStudentAttendanceByClassUpdate(data)),
  };
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: getStatusBarHeight() + 10,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontFamily: configs.fontFamily.OPS700,
  },
  buttonCheck: {
    width: 163,
    height: 46,
    padding: 14,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: configs.colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  arriveContainer: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: configs.colors.orange,
    paddingBottom: 13,
    paddingTop: 13,
    height: 48,
    borderRadius: 20,
    marginTop: 7,
    marginBottom: 20,
    marginLeft: 16,
    marginRight: 16,
  },
  arriveContainerText: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  arriveAmountText: {
    fontSize: 16,
    fontFamily: configs.fontFamily.OPS700,
    color: configs.colors.white,
  },
  arriveTitle: {
    fontSize: 14,
    fontFamily: configs.fontFamily.OPS600,
    color: configs.colors.white,
  },
  listItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 0,
    marginLeft: 16,
    alignItems: 'center',
    marginRight: 16,
    borderRadius: 20,
    backgroundColor: configs.colors.white,
    borderColor: configs.colors.white,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  listItemActive: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 0,
    marginLeft: 16,
    alignItems: 'center',
    marginRight: 16,
    borderRadius: 20,
    backgroundColor: '#E5FAFF',
    borderColor: configs.colors.white,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  listItemText: {
    fontSize: 14,
    fontFamily: configs.fontFamily.OPS600,
  },
  checkIcon: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
    marginRight: 7,
  },
  checkTitle: {
    color: configs.colors.primaryColor,
    fontSize: 14,
    fontFamily: configs.fontFamily.OPS700,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Classes);
