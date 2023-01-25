import React, { Component } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from 'react-native-underline-tabbar';
import { connect } from 'react-redux';
import { isThisTypeNode } from 'typescript';
import homeAction from '../../../../../actions/homeAction';
import configs from '../../../../../utils/configs';
import ListPageOfMerchandise from './list_page';
import moment from 'moment';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const from_date = moment().startOf('week').format('YYYY-MM-DD');
const to_date = moment().endOf('week').format('YYYY-MM-DD');


class MerchandiseTabsComponent extends Component {

    state = {
        is_fetching_ordered:false,
        is_fetching_delivered:false,
        dropDownWidth: 100,
        selectedTime: 'this_week',
        selectedType: 'all',
        ordered_next_url:'',
        delivered_next_url:'',
        merchandiseDropdownArray: [{label: 'All', value: 'all'}],
    }

    getMerchandiseDropdownData = () => {
      const {merchandise_types} = this.props;
      if(merchandise_types != undefined){
        merchandise_types.map((e) => {
          this.setState((prevState) => ({
            merchandiseDropdownArray: [
              ...prevState.merchandiseDropdownArray,
              {label: e.name, value: e.id},
            ],
          }));
        });
      }
    };

    componentDidMount(){
        this.setState({
            is_fetching_ordered:true,
            is_fetching_delivered:true,
        });
        this.props.fetchMerchandiseType();
        this.props.getOrderedMerchandiseData(
            from_date,
            to_date,
            10,
            undefined,
            this.props.userInfo.class[this.props.selected_class_index].id,
            "Paid",
            false,
            '',
            (status,data)=>{
              if(status == true){
                console.log("is_fetching_ordered_data");
                console.log(data);
                this.setState({
                  ordered_next_url:data.next,
                  is_fetching_ordered:false,
                })
              }else{
                this.setState({
                  is_fetching_ordered:false,
                })
              }
            },
        );
        this.props.getDeliveredMerchandiseData(
            from_date,
            to_date,
            10,
            undefined,
            this.props.userInfo.class[this.props.selected_class_index].id,
            "Delivered",
            false,
            '',
            (status,data)=>{
              if(status == true){
                this.setState({
                  delivered_next_url:data.next,
                  is_fetching_delivered:false,
                });
              }else{
                this.setState({
                  is_fetching_delivered:false,
                });
              }
            },
        );
        this.getMerchandiseDropdownData();
    }

  _scrollX = new Animated.Value(0);
  // 6 is a quantity of tabs
  interpolators = Array.from({ length: 6 }, (_, i) => i).map(idx => ({
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
      <View style={{ flex:1,}}>
          
        <ScrollableTabView
          style={{
              width:'100%',
              backgroundColor:'white',
          }}
          onChangeTab={({i})=>{
              console.log(i);
            }
          }
          renderTabBar={() => (
            <TabBar 
                
                tabBarTextStyle={{
                    fontSize:16,
                    color:configs.colors.grey,
                    fontWeight:'600',
                    backgroundColor:'white',
                }}
                underlineHeight={4}
                underlineColor={configs.colors.primaryColor} activeTabTextStyle={{ color: configs.colors.primaryColor }} style={{
                borderWidth:0,
                backgroundColor:'white'
            }}/>
          )}
        >
            <ListPageOfMerchandise tabLabel={{label: 'To deliver' }} key={'to_deliver'} isLoading={this.state.is_fetching_ordered} merchandiseDropdownArray={this.state.merchandiseDropdownArray} data={this.props.ordered_merchandise_data} status="Paid" next_url={this.state.ordered_next_url}/>
            <ListPageOfMerchandise tabLabel={{label: 'Delivered' }} key={'delivered'} isLoading={this.state.is_fetching_delivered} merchandiseDropdownArray={this.state.merchandiseDropdownArray} data={this.props.delivered_merchandise_data} status="Delivered" next_url={this.state.delivered_next_url}/>
        </ScrollableTabView>
        
      </View>
    );
  }
}

const mapStateToProps = state => {
    return {
        userInfo: state.authState.userInfo,
        merchandise_types: state.homeState.merchandise_types,
        ordered_merchandise_data: state.homeState.ordered_merchandise_data,
        delivered_merchandise_data: state.homeState.delivered_merchandise_data,
        selected_class_index: state.homeState.selected_class_index,
    }
}

const mapDispatchToProps = dispatch =>{
  return {
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
      getDeliveredMerchandiseData:(start_date,
        end_date,
        size,
        merchandise_type_id,
        class_id,
        status,
        isNext,
        next_url,
        handleCallback,)=>dispatch(
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
        )
        ),
    fetchMerchandiseType: () => dispatch(homeAction.fetchMerchandiseType()),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(MerchandiseTabsComponent);

