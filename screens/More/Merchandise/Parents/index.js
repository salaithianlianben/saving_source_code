import React, { Component } from 'react';
import { SafeAreaView,View,Text,StyleSheet,Image,Dimensions, StatusBar} from 'react-native';
import Search from '../../../../components/search';
import { Space } from '../../../../components/space';
import configs from '../../../../utils/configs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconButton from '../../../../components/icon_button';
import { connect } from 'react-redux';
import homeAction from '../../../../actions/homeAction';
import UnderlineTabBarExample from './Tabs';
import AsyncStorage from '@react-native-community/async-storage';

const { width} = Dimensions.get('window');

class MerchandiseParentScreen extends Component {

    state={
        searchValue:"",
        clothes:[
            { id:1, uri:"https://i.pinimg.com/originals/26/ff/4c/26ff4c649cf16ff170aca75b405f1958.jpg", isnew:true, name:"Sketch book", price:300 },
            { id:2, uri:"https://aliradar.com/api/image?url=https%3A%2F%2Fae01.alicdn.com%2Fkf%2FHTB1WoWIaW61gK0jSZFlq6xDKFXaW%2FJK-kindergarten-clothing-summer-school-primary-school-uniform-mini-japan-korean-style-school-uniform.jpg_640x640.jpg", isnew:false, name:"Sketch book", price:200 },
            { id:3, uri:"https://s.alicdn.com/@sc01/kf/HTB14IN9gFooBKNjSZFPq6xa2XXaB.jpg_300x300.jpg", isnew:true, name:"Sketch book", price:300 },
            { id:4, uri:"https://img.joomcdn.net/95baf68298fa6dbdb630c98904e16e10d59f3627_original.jpeg", isnew:false, name:"Sketch book", price:300 },
        ],
        topTabs:{},
        refreshing:false,
    }

    _renderHeader = () => {
        return (
          <SafeAreaView>
            <View style={styles.headerStyle}>
                <View style={{flex:0.2, paddingLeft: 8, alignItems: 'flex-start'}}>
                <IconButton 
                  icon={
                    <Ionicons
                      name="chevron-back"
                      size={22} color={"white"}
                    />
                  }
                  onPress={() => this.props.navigation.goBack()}
                />
                </View>
                <View style={{flex:0.6,  alignItems: 'center'}}>
                <Text style={{fontWeight:'700',fontSize:18,color:'white'}}>Merchandise</Text>
                </View>
                <View style={{flex:0.2,}}>
                <IconButton icon={
                    <AntDesign
                    name="shoppingcart"
                    size={24}
                    color={"white"}
                    style={{paddingRight: 10}}
                    
                  />
                }
                onPress={()=> this.props.navigation.navigate("Cart")}
                item_number={this.props.count_of_cart_items}
                />
                </View>
            </View>
          </SafeAreaView>
        );
    }

    componentDidMount(){
        this._setCountOfCartItems();
    }


    _setCountOfCartItems = async () => {
        let tempCarts = await AsyncStorage.getItem(configs.constant.AS_KEY.CARTS);
        let carts = JSON.parse(tempCarts);
        this.props.setCountOfCartItems(carts.length);
    }

    //todo remove
    _onRefresh = () =>{
        this.setState({
            refreshing:true,
        })
        const { fetchAllMerchandiseData } = this.props;
        fetchAllMerchandiseData(false, '', () => console.log('Get Data for all merchandise. On Refresh!'));
        //todo check
        this.setMerchandiseData();
        this.setState({
            refreshing:false,
        })
        
    }

    //todo remove
    setMerchandiseData = () => {
        setTimeout(() => {
          const {merchandise_types} = this.props;
          merchandise_types &&
            merchandise_types.map((e) => {
              this.props.fetchMerchandiseDataByType(e.id, 10, '', false, () =>
                console.log('Hello'),
              );
            });
        }, 1000);
      };

    render() {

        return (
            <View style={styles.mainViewContainer}>
                <View style={styles.headerContainer}>
                    <Image source={require('../../../../assets/images/merchandise_header.png')} style={{height:'100%',width,resizeMode:'contain',}} />
                    <Search placeholder="Search" value={this.state.searchValue} onChangeText={(value)=>this.setState({ searchValue:value})} style={{height:44,alignSelf:'center',position:'absolute',bottom:-20}}/>
                    <View style={{position: 'absolute'}}>
                        { this._renderHeader()}
                    </View>
                            
                </View>
                <Space height={20}/>
                <View style={{height:"100%"}}>
                {/* {
                    this.state.topTabs && <TopTabs toptabitems={this.props.merchandise_types} items={this.state.topTabs}/>
                } */}
                <UnderlineTabBarExample navigation={this.props.navigation} searchValue={this.state.searchValue}/>
                            
                </View>
            </View>
            // <SafeAreaView style={styles.container}>
            //      {/*<ScrollView scrollEnabled={false} style={{height:'auto',width:'auto'}}
            //         refreshControl={
            //             <RefreshControl
            //               colors={['#9Bd35A', '#689F38']}
            //               refreshing={this.state.refreshing}
            //               onRefresh={this._onRefresh.bind(this)}
            //             />
            //           }
            //     > */}
                    
            //     {/* </ScrollView> */}
              
            // </SafeAreaView>
        )
    }
}

const mapStateToProps = state =>{
    return {
        merchandise_types: state.homeState.merchandise_types,
        count_of_cart_items: state.homeState.count_of_cart_items,
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        setCountOfCartItems: (value) => dispatch( homeAction.setCountOfCartItems(value)),
        fetchAllMerchandiseData: (isNext, all_merchandise_data_next_url, handleCallback) => dispatch(homeAction.fetchAllMerchandiseData(isNext, all_merchandise_data_next_url, handleCallback)),
        fetchMerchandiseDataByType: (merchandise_type_id, size, merchandise_data_by_type_next_url, isNext, handleCallback) => dispatch(homeAction.fetchMerchandiseDataByType(merchandise_type_id, size, merchandise_data_by_type_next_url, isNext, handleCallback))
    }
}

export default connect (mapStateToProps,mapDispatchToProps)(MerchandiseParentScreen);

const styles = StyleSheet.create({
    mainViewContainer: {
        flex: 1,
        backgroundColor: configs.colors.white,
      },
    headerContainer:{
        backgroundColor: configs.colors.primaryColor,
        height: configs.height / 3.5,
        borderBottomStartRadius: 20,
        borderBottomEndRadius: 20,
    },
    headerStyle: {
        flexDirection:'row', 
        width, 
        alignItems:'center', 
        justifyContent: 'space-between', 
        marginTop: Platform.OS == 'ios' ?  0   : StatusBar.currentHeight, 
    },
    item:{
        height:300,
        borderRadius:10,
        width:width / 2 - 20,
        marginHorizontal:7,
    },
    isNew:{
        position:'absolute',
        left:0,
        top:10,
        backgroundColor:"#F3B329",
        borderTopRightRadius:15,
        borderBottomRightRadius:15,
        paddingLeft:3,
        paddingRight:7,
        paddingVertical:1,
    }
})