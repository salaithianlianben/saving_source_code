import React, {Component, Fragment} from 'react';
import {SafeAreaView, View, StatusBar, StyleSheet} from 'react-native';
import configs from '../utils/configs';

export default class SafeArea extends Component {
  render() {
    return (
      <Fragment>
        {/* safeareaview */}
        <View
          style={[
            styles.safeAreaTop,
            {
              backgroundColor: this.props.statusBarColor
                ? this.props.statusBarColor
                : configs.colors.white,
            },
          ]}
        />
        <StatusBar
          translucent={true}
          // backgroundColor={'transparent'}
          // barStyle="dark-content"
          backgroundColor={configs.colors.transparent}
          barStyle={this.props.statusBarStyle}
        />
        {/* safeareaview */}
        <View
          style={[
            styles.safeAreaBottom,
            {
              backgroundColor: this.props.bottomBarColor
                ? this.props.bottomBarColor
                : configs.colors.white,
            },
          ]}>
          <View style={styles.container}>{this.props.children}</View>
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaTop: {
    flex: 0,
    backgroundColor: configs.colors.white,
  },
  safeAreaBottom: {
    flex: 1,
    backgroundColor: configs.colors.grey,
  },
  container: {
    flex: 1,
    backgroundColor:configs.colors.white,
  },
});