import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import ImageLoad from '../../../components/ImageLoad';

const ImageOverlap = ({students, setFail}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      {
      students.length < 6 ?
      
      students.map((e, index) => (
        <View
          key={index}
          style={[
            index > 0 && {marginLeft: -10},
            {zIndex: 100 - index * 10, flexDirection: 'row'},
          ]}>
          {e.img === '' ? (
            <Image
              source={require('../../../assets/icons/ic_account.png')}
              style={[styles.image]}
            />
          ) : (
            <ImageLoad
              style={styles.image}
              loadingStyle={{size: 'small', color: 'white'}}
              borderRadius={30}
              placeholderStyle={styles.image}
              source={{uri: e.img, cache: 'force-cache'}}
              placeholderSource={require('../../../assets/icons/ic_account.png')}
            />
          )}
          {index === students.length - 1 && students.length > 1 && (
            <Image
              source={require('../../../assets/icons/ic_avatar_more.png')}
              style={[styles.image, {marginLeft: -10, zIndex: -1000}]}
            />
          )}
        </View>
      )):    
      students.slice(0,6).map((e, index) => (
        <View
          key={index}
          style={[
            index > 0 && {marginLeft: -10},
            {zIndex: 100 - index * 10, flexDirection: 'row'},
          ]}>
          {e.img === '' ? (
            <Image
              source={require('../../../assets/icons/ic_account.png')}
              style={[styles.image]}
            />
          ) : (
            <ImageLoad
              style={styles.image}
              loadingStyle={{size: 'small', color: 'white'}}
              borderRadius={30}
              placeholderStyle={styles.image}
              source={{uri: e.img, cache: 'force-cache'}}
              placeholderSource={require('../../../assets/icons/ic_account.png')}
            />
          )}
          {index === students.length - 1 && students.length > 1 && (
            <Image
              source={require('../../../assets/icons/ic_avatar_more.png')}
              style={[styles.image, {marginLeft: -10, zIndex: -1000}]}
            />
          )}
        </View>
      ))
    
    
    }
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 30,
    // position: 'absolute',
    width: 24,
    height: 24,
    borderColor: 'white',
    borderWidth: 1,
  },
});

export default ImageOverlap;
