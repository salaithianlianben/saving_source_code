import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import ScrollableTabView,{ ScrollableTabBar } from 'react-native-scrollable-tab-view';
import TabBar from 'react-native-underline-tabbar';
import { connect } from 'react-redux';
import homeAction from '../../../../../actions/homeAction';
import configs from '../../../../../utils/configs';
import Page from './page';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


class UnderlineTabBarExample extends Component {

    state = {
        merchandise_types:[
            {
                id:'all',name:'All',
            }
        ]
    }

    componentDidMount(){
        const { merchandise_types } = this.props;
        merchandise_types.map(e=>{
            this.setState(prevState=>({
                merchandise_types:[
                    ...prevState.merchandise_types,e
                ]
            }));
        })
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
      <View style={{ flex:1,justifyContent:'center',alignItems:'center'}}>
        <ScrollableTabView
          style={{
            width:'100%'
          }}
          onChangeTab={({i})=>{
            console.log('Merchandise tab changed to '+ i);
              if(i === this.props.merchandise_types.length){
                console.log("Hello");
              }else{
                this.props.fetchMerchandiseDataByType(this.props.merchandise_types[i].id,10,"",false,()=> console.log("Hello"));
              }
              
            }
          }
          renderTabBar={() => (
            <TabBar 
                
                tabBarTextStyle={{
                    fontSize:16,
                    color:configs.colors.grey,
                    fontWeight:'600'
                }}
                underlineHeight={4}
                underlineColor={configs.colors.primaryColor} activeTabTextStyle={{ color: configs.colors.primaryColor }} style={{
                borderWidth:0,
            }}/>
          )}
        
        >
          {
              this.state.merchandise_types.map(e=>(
                <Page tabLabel={{label: e.name }} data={e} merchandise_data={ e.id === "all" ? this.props.all_merchandise_data : this.props.merchandise_data } key={e.id} navigation={this.props.navigation} searchValue={this.props.searchValue}/>
              ))
          }
        </ScrollableTabView>
      </View>
    );
  }
}

const mapStateToProps = state => {
    return {
        merchandise_types: state.homeState.merchandise_types,
        merchandise_data: state.homeState.merchandise_data,
        all_merchandise_data: state.homeState.all_merchandise_data,
    }
}

const mapDispatchToProps = dispatch =>{
  return {
    fetchMerchandiseDataByType:(merchandise_type_id,size,merchandise_data_by_type_next_url,isNext,handleCallback) => dispatch( homeAction.fetchMerchandiseDataByType(merchandise_type_id,size,merchandise_data_by_type_next_url,isNext,handleCallback))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(UnderlineTabBarExample);

