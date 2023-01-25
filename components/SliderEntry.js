import React, { Component,  } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import configs from '../utils/configs';

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}
const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD'
};

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

 const sliderWidth = viewportWidth;
 const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

export default class SliderEntry extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object
    };

    get image () {
        const { data, parallax, parallaxProps, even } = this.props;

        return parallax ? (
            <ParallaxImage
              source={
                data.img_url == null
                  ? require('../assets/images/fundraising.png')              
                  : {uri: data.img_url}
              }
              containerStyle={styles.imageContainer}
              style={styles.image}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={"#DADADA"}
              {...parallaxProps}
            />
        ) : (
            <Image
              source={{ uri: illustration }}
              style={styles.image}
            />
        );
    }

    render () {
        const { data, navigation } = this.props;

     

        return (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
              onPress={(data) => 
                 this.props.onPress(this.props.data)
                 }
              >
               
                <View style={styles.imageContainer}>
                <View style={{  
                                borderRadius: 8,
                                elevation: 5,
                                shadowColor: colors.black,
                                shadowOpacity: 0.25,
                                shadowOffset: { width: 0, height: 10 },
                                shadowRadius: 10,}}>
                    { this.image }
                </View>
                    {/* <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} /> */}
                </View>
                <View numberOfLines={2} style={{ position: 'absolute', width: 200,  marginHorizontal: 20, marginVertical: 20 }}>
                    <Text style={{ fontSize: 18, fontFamily: configs.fontFamily.OPS800, color: "#fff"}} numberOfLines={4} ellipsizeMode="tail">{data.title}</Text>
                </View>
               
                {/* <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
                    { uppercaseTitle }
                    <Text
                      style={[styles.subtitle, even ? styles.subtitleEven : {}]}
                      numberOfLines={2}
                    >
                        { subtitle }
                    </Text>
                </View> */}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    slideInnerContainer: {
        width: viewportWidth,
        height: 140,
        borderRadius: 8,
      //  paddingHorizontal: itemHorizontalMargin,
      //  alignItems: 'center',
       
        //backgroundColor:'red',
        paddingBottom: 18 // needed for shadow
    },
    shadow: {
        position: 'absolute',
        top: 0,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: 18,
        shadowColor: colors.black,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        borderRadius: entryBorderRadius,
        
    },
    imageContainer: {
        width: viewportWidth - 40,
        height: 139,
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderRadius: 8,
      
    },
    imageContainerEven: {
        backgroundColor: colors.black
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        borderRadius: IS_IOS ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    // image's border radius is buggy on iOS; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
        backgroundColor: 'white'
    },
    radiusMaskEven: {
        backgroundColor: colors.black
    },
    textContainer: {
        justifyContent: 'center',
        paddingTop: 20 - entryBorderRadius,
        paddingBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
    },
    textContainerEven: {
        backgroundColor: colors.black
    },
    title: {
        color: colors.black,
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    titleEven: {
        color: 'white'
    },
    subtitle: {
        marginTop: 6,
        color: colors.gray,
        fontSize: 12,
        fontStyle: 'italic'
    },
    subtitleEven: {
        color: 'rgba(255, 255, 255, 0.7)'
    }
});