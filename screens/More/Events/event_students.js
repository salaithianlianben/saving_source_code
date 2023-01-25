import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import configs from '../../../utils/configs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import moment from 'moment';
import homeAction from '../../../actions/homeAction';
import ImageLoad from '../../../components/ImageLoad';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const eventColors = [
  {id: 1, type: 'arrived', code: '#7CD227'},
  {id: 2, type: 'absent', code: '#F3B329'},
  {id: 3, type: 'unfilled', code: '#8DC3E9'},
  {id: 4, type: 'event', code: '#F66460'},
];

const Divider = () => {
  return (
    <View
      style={{height: 1, backgroundColor: configs.colors.borderColor}}></View>
  );
};

const Tab = createMaterialTopTabNavigator();

const Dott = () => {
  return (
    <View
      style={{
        height: 2,
        width: 2,
        backgroundColor: configs.colors.primaryColor,
        margin: 2,
      }}></View>
  );
};

const Registered = ({eventPeopleData}) => {

  return (
    <ScrollView
      style={{backgroundColor: 'white', flex: 1}}
      showsVerticalScrollIndicator={true}>
      <View>
        {eventPeopleData &&
          eventPeopleData
            .filter((e) => e.attend_status)
            .map((data,i) => (
              <>
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    marginVertical: 14,
                  }}>
                  <View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View>
                        {
                          data.img != undefined && data.img != null && data.img != "" ?
                          <ImageLoad
                            style={{height: 36, width: 36}}
                            loadingStyle={{size: 'small', color: 'white'}}
                            borderRadius={36}
                            placeholderStyle={styles.image}
                            source={{uri: data.img, cache: 'force-cache'}}
                            placeholderSource={require('../../../assets/icons/ic_account.png')}
                          /> : <Image source={require('../../../assets/icons/ic_account.png')} style={styles.image} />
                        }
                      </View>
                      <View style={{paddingLeft: 8}}>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              fontFamily: configs.fontFamily.OPS700,
                              fontSize: 14,
                            }}>
                            {data.name}
                          </Text>
                          <Text
                            style={{
                              fontFamily: configs.fontFamily.OPS600,
                              fontSize: 14,
                              color: configs.colors.grey,
                            }}>
                            ・{data.relationship}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: configs.colors.grey,
                            fontSize: 12,
                            fontFamily: configs.fontFamily.OPS600,
                          }}>
                          Send on {data.created_at}
                        </Text>
                      </View>
                    </View>
                    {/* Child  */}
                    {/* <View style={{alignItems: 'center', width: 36}}>
                      <Dott />
                      <Dott />
                      <Dott />
                    </View>                
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View>
                        <Image
                          source={{
                            uri:
                              'https://static.toiimg.com/thumb/msid-74553168,imgsize-183007,width-800,height-600,resizemode-75/74553168.jpg',
                          }}
                          style={styles.image}
                        />
                      </View>
                      <View style={{width: 8}} />
                      <Text style={{fontWeight: '700'}}>Jill Fong</Text>
                    </View>
                  { /* End Child*/}
                  </View>
                  <View
                    style={{
                      alignSelf: 'center',
                      alignItems: 'flex-end',
                      flex: 1,
                    }}>
                    <Ionicons
                      name="md-checkmark-circle"
                      color={getEventColorCode('arrived')}
                      size={22}
                    />
                  </View>
                </View>
                <Divider />
              </>
            ))}
      </View>

      <Divider />
    </ScrollView>
  );
};

const Vacacies = ({eventPeopleData}) => {

  return (
    <ScrollView
      style={{backgroundColor: 'white', height: '100%'}}
      showsVerticalScrollIndicator={false}>
      {eventPeopleData &&
        eventPeopleData
          .filter((e) => !e.attend_status)
          .map((data,ab) => (
            <>
              <View style={{marginVertical: 10, marginHorizontal: 10}} key={ab}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View>
                    {
                      data.img != undefined && data.img != null && data.img != "" ?
                      <ImageLoad
                        style={{height: 40, width: 40}}
                        loadingStyle={{size: 'small', color: 'white'}}
                        borderRadius={40}
                        placeholderStyle={{
                          borderRadius: 40,
                          height: 40,
                          width: 40,
                        }}
                        source={{uri: data.img, cache: 'force-cache'}}
                        placeholderSource={require('../../../assets/icons/ic_account.png')}
                      /> :
                      <Image 
                        style={{
                          height:40,
                          width:40,
                          borderRadius:40,
                        }}
                        source={require('../../../assets/icons/ic_account.png')}
                      />
                    }
                    
                  </View>
                  <View style={{paddingLeft: 8}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontWeight: '700'}}>{data.name}</Text>
                      <Text style={{color: configs.colors.grey}}>
                        ・{data.relationship}
                      </Text>
                    </View>
                    <Text style={{color: configs.colors.grey, fontSize: 12}}>
                      Send on {data.created_at}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignSelf: 'center',
                      alignItems: 'flex-end',
                      flex: 1,
                    }}>
                    <AntDesign
                      name="minuscircle"
                      color={getEventColorCode('absent')}
                      size={16}
                    />
                  </View>
                </View>
              </View>

              <Divider />
            </>
          ))}
    </ScrollView>
  );
};

const getEventColorCode = (type) => {
  var event = eventColors.filter((e) => e.type === type)[0];
  return event.code;
};

const TabNavigation = ({eventPeopleData,registeredCount,vacanciesCount}) => {

  return (
    <Tab.Navigator
      tabBarOptions={{
        indicatorStyle: {
          height: 4,
        },
        showIcon: true,
        labelStyle: {
          fontSize: 10,
          textTransform: 'none',
          paddingTop: 10,
          fontFamily: configs.fontFamily.OPS700,
          width: '100%',
          marginTop: 10,
        },

        style: {
          elevation: 0,
          shadowColor: '#000000',
          shadowOffset: {width: 0, height: 10}, // change this for more shadow
          shadowOpacity: 0.4,
          shadowRadius: 6,
        },

        iconStyle: {
          alignItems: 'center',
          alignSelf: 'center',
          width: '100%',
        },
      }}>
      <Tab.Screen
        children={() => <Registered eventPeopleData={eventPeopleData} />}
        name="Registered"
        options={{
          tabBarIcon: () => {
            return (
              <Text
                style={{
                  color: getEventColorCode('arrived'),
                  fontSize: 32,
                  fontFamily: configs.fontFamily.OPS600,
                }}>
                {registeredCount}
              </Text>
            );
          },

          tabBarLabel: 'Registered',
        }}
      />
      <Tab.Screen
        children={() => <Vacacies eventPeopleData={eventPeopleData} />}
        name="Vacacies"
        options={{
          tabBarIcon: () => {
            return (
              <Text
                style={{
                  color: configs.colors.lightblue1,
                  fontSize: 32,
                  fontFamily: configs.fontFamily.OPS600,
                }}>
                {vacanciesCount}
              </Text>
            );
          },
          tabBarLabel: 'Vacancies',
        }}
      />
    </Tab.Navigator>
  );
};

const EventStudents = ({
  eventsData,
  eventId,
  onClose,
  eventPeopleData,
  eventPeopleLoader,
  registeredCount,
  vacanciesCount
}) => {
  const getEventid = eventsData.filter((data) => data.id === eventId);
  const getEventType =
    getEventid !== undefined && getEventid.length !== 0
      ? getEventid[0].register_link
      : '';

      // console.log(eventsData);

  const renderLoader = () => {
    return (
      <SkeletonPlaceholder>
        {[0, 1, 2, 3, 4].map(() => (
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            marginVertical={8}>
            <SkeletonPlaceholder.Item
              width={40}
              height={40}
              borderRadius={50}
              marginLeft={10}
            />
            <SkeletonPlaceholder.Item marginLeft={10}>
              <SkeletonPlaceholder.Item
                width={180}
                height={10}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                marginTop={6}
                width={150}
                height={10}
                borderRadius={4}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        ))}
      </SkeletonPlaceholder>
    );
  };

  const [eventDatas, setEventDatas] = useState(eventsData);
  return (
    <View>
      {getEventType === '' && getEventid.length !== 0 && (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 15,
              marginBottom: 20,
            }}>
            <View style={styles.dots}></View>
            <Text style={{paddingLeft: 10, fontWeight: 'bold', fontSize: 16}}>
              Event
            </Text>
          </View>
          <View style={styles.body}>
            <View style={styles.bodyHeader}>
              <View style={{flex: 2}}>
                <Text
                  style={{
                    color: configs.colors.grey,
                    paddingBottom: 5,
                    fontFamily: configs.fontFamily.OPS600,
                    fontSize: 14,
                  }}>
                  {moment(getEventid[0].reg_to_date).format('YYYY MMM DD dddd')}{' '}
                  {/* 2020 Aug 18 Fri 19:00 ~ 20:30*/}
                </Text>
                <Text
                  style={{fontSize: 18, fontFamily: configs.fontFamily.OPS600}}>
                  {getEventid[0].title}
                </Text>
              </View>
              <View>
                {/* <Image
                  key={eventDatas[0].fail}
                  source={
                    eventDatas[0].fail ||
                    getEventid[0].img === undefined ||
                    getEventid[0].img === ''
                      ? require('../../../assets/images/event_child.png')
                      : {uri: getEventid[0].img_url}
                  }
                  style={{
                    height: 56,
                    width: 80,
                    borderRadius: 8,
                  }}
                  onError={(ev) => {
                    setEventDatas(...eventDatas, (fail = true));
                  }}
                /> */}
                {
                  getEventid[0].img_url != undefined && getEventid[0].img_url != null && getEventid[0].img_url != "" ?
                  <ImageLoad
                            style={{height: 56,
                              width: 80,
                              borderRadius: 8,}}
                            loadingStyle={{size: 'small', color: 'white'}}
                            borderRadius={8}
                            placeholderStyle={{
                              height: 56,
                    width: 80,
                    borderRadius: 8,
                            }}
                            source={{uri: getEventid[0].img_url, cache: 'force-cache'}}
                            placeholderSource={require('../../../assets/images/placeholder_image.png')}
                          />
                  : <Image source={require('../../../assets/images/placeholder_image.png')} style={{
                    height: 56,
                    width: 80,
                    borderRadius: 8,
                  }}/>
                }
              </View>
            </View>
            <Divider />
            <TabNavigation eventPeopleData={[]} registeredCount={0} vacanciesCount={0}/>
          </View>
          <View style={{marginVertical: 10}}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text
                style={{
                  fontFamily: configs.fontFamily.OPS700,
                  fontSize: 14,
                  color: configs.colors.white,
                }}>
                Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {getEventType !== '' && getEventid.length !== 0 && (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 15,
              marginBottom: 20,
            }}>
            <View style={styles.dots}></View>
            <Text style={{paddingLeft: 10, fontWeight: 'bold', fontSize: 16}}>
              Event
            </Text>
          </View>
          <View style={styles.body}>
            <View style={styles.bodyHeader}>
              <View style={{flex: 2}}>
                <Text
                  style={{
                    color: configs.colors.grey,
                    paddingBottom: 5,
                    fontFamily: configs.fontFamily.OPS600,
                    fontSize: 14,
                  }}>
                  {moment(getEventid[0].reg_to_date).format('YYYY MMM DD dddd')}{' '}
                </Text>
                <Text
                  style={{fontSize: 18, fontFamily: configs.fontFamily.OPS600}}>
                  {getEventid[0].title}
                </Text>
              </View>
              <View>
              {
                  getEventid[0].img_url != undefined && getEventid[0].img_url != null && getEventid[0].img_url != "" ?
                  <ImageLoad
                            style={{height: 56,
                              width: 80,
                              borderRadius: 8,}}
                            loadingStyle={{size: 'small', color: 'white'}}
                            borderRadius={8}
                            placeholderStyle={{
                              height: 56,
                    width: 80,
                    borderRadius: 8,
                            }}
                            source={{uri: getEventid[0].img_url, cache: 'force-cache'}}
                            placeholderSource={require('../../../assets/images/placeholder_image.png')}
                          />
                  : <Image source={require('../../../assets/images/placeholder_image.png')} style={{
                    height: 56,
                    width: 80,
                    borderRadius: 8,
                  }}/>
                }
              </View>
            </View>
            <Divider />
            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              {/* <Text
                style={{fontSize: 14, fontFamily: configs.fontFamily.OPS400}}>
                {getEventid[0].description}
              </Text> */}
              <TabNavigation eventPeopleData={eventPeopleData} registeredCount={registeredCount} vacanciesCount={vacanciesCount}/>
              {eventPeopleLoader && renderLoader()}
            </ScrollView>
          </View>

          <View style={{marginVertical: 10}}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text
                style={{
                  fontFamily: configs.fontFamily.OPS700,
                  fontSize: 14,
                  color: configs.colors.white,
                }}>
                Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};


export default EventStudents;

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    backgroundColor: configs.colors.primaryColor,
    height: 46,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyHeader: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: 'row',
  },
  body: {
    padding: 5,
    height: 500,
    borderColor: configs.colors.borderColor,
    borderRadius: 8,
    borderWidth: 1,
  },
  container: {
    flex: 1,
  },
  dots: {
    height: 12,
    width: 12,
    borderRadius: 12,
    backgroundColor: configs.colors.primaryColor,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  image: {
    height: 36,
    width: 36,
    borderRadius: 36,
  },
});
