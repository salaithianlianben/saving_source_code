import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Animated} from 'react-native';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import TabBar from 'react-native-underline-tabbar';
import {connect} from 'react-redux';
import homeAction from '../../../../actions/homeAction';
import configs from '../../../../utils/configs';
import OrderPage from './page';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class UnderlineTabBarOrderList extends Component {
  state = {
    is_fetching_all_ordered_lists: false,
    is_fetching_pending_payment_ordered_lists: false,
    is_fetching_payment_verification_ordered_lists: false,
    is_fetching_delivered_ordered_lists: false,
    is_fetching_cancelled_ordered_lists: false,
    all_ordered_next_url: '',
    delivered_ordered_next_url: '',
    pending_payment_ordered_next_url: '',
    cancelled_ordered_next_url: '',
    payment_verification_ordered_next_url: '',
  };

  componentDidMount() {
    
  }

  _scrollX = new Animated.Value(0);
  // 6 is a quantity of tabs
  interpolators = Array.from({length: 6}, (_, i) => i).map((idx) => ({
    scale: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: [1, 1.2, 1],
      extrapolate: 'clamp',
    }),
    opacity: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    }),
    textColor: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: ['#000', '#fff', '#000'],
    }),
    backgroundColor: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: ['rgba(0,0,0,0.1)', '#000', 'rgba(0,0,0,0.1)'],
      extrapolate: 'clamp',
    }),
  }));

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollableTabView
          style={{
            width: '100%',
            backgroundColor: 'white',
          }}
          initialPage= {this.props.routeParams.initialPage}
          onChangeTab={({i}) => {
            console.log(i);
          }}
          renderTabBar={() => (
            <TabBar
              tabBarTextStyle={{
                fontSize: 16,
                color: configs.colors.grey,
                fontWeight: '600',
                backgroundColor: 'white',
              }}
              underlineHeight={4}
              underlineColor={configs.colors.primaryColor}
              activeTabTextStyle={{color: configs.colors.primaryColor}}
              style={{
                borderWidth: 0,
                backgroundColor: 'white',
              }}
            />
          )}>
          <OrderPage
            tabLabel={{label: 'All'}}
            key={'all'}
            id={'all'}
            navigation={this.props.navigation}
          />
          <OrderPage
            tabLabel={{label: 'To Pay'}}
            key={'topay'}
            id={'topay'}
            navigation={this.props.navigation}
          />
          <OrderPage
            tabLabel={{label: 'To Receive'}}
            key={'toreceive'}
            id={'toreceive'}
            navigation={this.props.navigation}
          />
          <OrderPage
            tabLabel={{label: 'Delivered'}}
            key={'delivered'}
            id={'delivered'}
            navigation={this.props.navigation}
          />
          <OrderPage
            tabLabel={{label: 'Cancelled'}}
            key={'cancelled'}
            id={'cancelled'}
            navigation={this.props.navigation}
          />
        </ScrollableTabView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.authState.userInfo,
    all_ordered_list_of_parent: state.homeState.all_ordered_list_of_parent,
    pending_payment_ordered_list_of_parent:
      state.homeState.pending_payment_ordered_list_of_parent,
    payment_verification_ordered_list_of_parent:
      state.homeState.payment_verification_ordered_list_of_parent,
    paid_ordered_list_of_parent: state.homeState.paid_ordered_list_of_parent,
    delivered_ordered_list_of_parent:
      state.homeState.delivered_ordered_list_of_parent,
    cancelled_ordered_list_of_parent:
      state.homeState.cancelled_ordered_list_of_parent,
    is_fetching_all_ordered_lists: state.homeState.is_fetching_all_ordered_lists,
    is_fetching_pending_payment_ordered_lists: state.homeState.is_fetching_pending_payment_ordered_lists,
    is_fetching_payment_verification_ordered_lists: state.homeState.is_fetching_payment_verification_ordered_lists,
    is_fetching_delivered_ordered_lists: state.homeState.is_fetching_delivered_ordered_lists,
    is_fetching_cancelled_ordered_lists: state.homeState.is_fetching_cancelled_ordered_lists,
    all_ordered_next_url: state.homeState.all_ordered_next_url,
    delivered_ordered_next_url: state.homeState.delivered_ordered_next_url,
    pending_payment_ordered_next_url: state.homeState.pending_payment_ordered_next_url,
    cancelled_ordered_next_url: state.homeState.cancelled_ordered_next_url,
    payment_verification_ordered_next_url: state.homeState.payment_verification_ordered_next_url,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOrderedListForParents: (
      user_id,
      status,
      size,
      isNext,
      ordered_next_url,
      handleCallback,
    ) =>
      dispatch(
        homeAction.getOrderedListForParents(
          user_id,
          status,
          size,
          isNext,
          ordered_next_url,
          handleCallback,
        ),
      ),
    // getCancelledOrderedListsOfParenet: (user_id,status,size,isNext,ordered_next_url,handleCallback )=> dispatch( homeAction.getCancelledOrderedListsOfParenet(user_id,status,size,isNext,ordered_next_url,handleCallback ) ),
    // getPaymentVerificationOrderedListsOfParent: (user_id,status,size,isNext,ordered_next_url,handleCallback )=> dispatch( homeAction.getPaymentVerificationOrderedListsOfParent(user_id,status,size,isNext,ordered_next_url,handleCallback ) ),
    // getPendingPaymenetOrderedListsOfParent: (user_id,status,size,isNext,ordered_next_url,handleCallback )=> dispatch( homeAction.getPendingPaymenetOrderedListsOfParent(user_id,status,size,isNext,ordered_next_url,handleCallback ) ),
    // getDeliveredOrderedListsOfPrents: (user_id,status,size,isNext,ordered_next_url,handleCallback )=> dispatch( homeAction.getDeliveredOrderedListsOfPrents(user_id,status,size,isNext,ordered_next_url,handleCallback ) ),
    fetchMerchandiseDataByType: (
      merchandise_type_id,
      size,
      merchandise_data_by_type_next_url,
      isNext,
      handleCallback,
    ) =>
      dispatch(
        homeAction.fetchMerchandiseDataByType(
          merchandise_type_id,
          size,
          merchandise_data_by_type_next_url,
          isNext,
          handleCallback,
        ),
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnderlineTabBarOrderList);
