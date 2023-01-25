import React, {useState} from 'react';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {View, StyleSheet, Text} from 'react-native';
import configs from '../utils/configs';

function SegmentTab({data, onChangeSelect, defualtSelectedIndex}) {
  return (
    <View>
      <SegmentedControlTab
        tabsContainerStyle={styles.tabsContainerStyle}
        tabStyle={[styles.tabStyle]}
        firstTabStyle={styles.firstTabStyle}
        lastTabStyle={styles.lastTabStyle}
        tabTextStyle={styles.tabTextStyle}
        activeTabStyle={styles.activeTabStyle}
        activeTabTextStyle={styles.activeTabTextStyle}
        selectedIndex={defualtSelectedIndex}
        allowFontScaling={false}
        values={data}
        onTabPress={onChangeSelect}
      />
    </View>
  );
}

export default SegmentTab;

const styles = StyleSheet.create({
    tabsContainerStyle: {
      //custom styles
    },
    tabStyle: {
      //custom styles
      height:40,
      borderRadius:25,
      borderColor:configs.colors.primaryColor,
      marginHorizontal:5,
    },
    firstTabStyle: {
      //custom styles
      borderTopLeftRadius:25,
      borderBottomLeftRadius:25,
      borderEndWidth:1,
    },
    lastTabStyle: {
      //custom styles
      marginLeft:0,
      borderTopRightRadius:25,
      borderBottomRightRadius:25,
      borderStartWidth:1,
    },
    tabTextStyle: {
      //custom styles
    },
    activeTabStyle: {
      //custom styles
      backgroundColor:configs.colors.primaryColor
    },
    activeTabTextStyle: {
      //custom styles
      fontSize:14,
    },
    tabBadgeContainerStyle: {
      //custom styles
    },
    activeTabBadgeContainerStyle: {
      //custom styles
    },
    tabBadgeStyle: {
      //custom styles
    },
    activeTabBadgeStyle: {
      //custom styles
    }
  });