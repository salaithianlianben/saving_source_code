import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Image,
  FlatList,
} from 'react-native';
import {Space} from '../../../../components/space';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import configs from '../../../../utils/configs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import homeAction from '../../../../actions/homeAction';
import AsyncStorage from '@react-native-community/async-storage';
import IconButton from '../../../../components/icon_button';
import ImageLoad from '../../../../components/ImageLoad';
import RBSheet from 'react-native-raw-bottom-sheet';
import Loading from '../../../../components/Loading';
// const shopingCarts = JSON.parse(await AsyncStorage.getItem(configs.constant.AS_KEY.CARTS));

class Cart extends Component {
  state = {
    my_carts: [],
    isLoading: true,
    isFetching:false,
    selected_item_id:'',
  };

  onRefresh = async () => {
    this.setState({
      isFetching:true,
    });
    const TempCarts = await AsyncStorage.getItem(configs.constant.AS_KEY.CARTS);
    this.setState({
      my_carts: JSON.parse(TempCarts) != null ? JSON.parse(TempCarts) : [],
    });
    this.setState({
      isFetching:false,
    });
  }

  async componentDidMount() {
    this.setState({
        isLoading: true,
      });
    const TempCarts = await AsyncStorage.getItem(configs.constant.AS_KEY.CARTS);
    this.setState({
      my_carts: JSON.parse(TempCarts) != null ? JSON.parse(TempCarts) : [],
    });

    console.log(JSON.parse(TempCarts));

  //  this.getMerchandiseDatas(JSON.parse(TempCarts)); 
    this.setState({
      isLoading: false,
    });
  }

  getMerchandiseDatas = (my_carts) => {
     
    const {userInfo} = this.props;
    // const {my_carts} = this.state;
    if(my_carts != null){
      let carts = my_carts.filter((item) => item.user_id === userInfo.id);
      //   console.log(carts);
      if (
        carts != null ||
        carts != undefined ||
        carts.length != undefined ||
        carts.length > 0
      ) {
        var tempText = '';
        for (let index = 0; index < carts.length; index++) {
          const element = carts[index];
          tempText = tempText == '' ? element.id : tempText + ',' + element.id;
        }
        if (tempText != '') {
          this.props.fetchMerchandiseDetails(tempText);
        }
      }
    }
      
   
  };

  getCountFromCarts = (id) => {
    const {userInfo} = this.props;
    const {my_carts} = this.state;

    let carts = my_carts.filter((item) => item.user_id === userInfo.id);
    var data = carts.filter((item) => item.id === id);

    return data[0] != undefined ? data[0].count : 0;
  };
  async onDeleteCarts(id) {
    const {userInfo} = this.props;
    const {my_carts} = this.state;
    let temp = my_carts;
    // this.setState({
    //   isLoading: true,
    // });
    let carts = temp.filter((item) => item.user_id === userInfo.id);
    var index = carts.findIndex((x) => x.id === id);
    if (index !== -1) {
      temp.splice(index, 1);
      
      this.setState({my_carts: temp}, () =>
        console.log("h")
      );  

      this.props.setCountOfCartItems(temp.length);

      await AsyncStorage.setItem(
        configs.constant.AS_KEY.CARTS,
        JSON.stringify(temp),
      );
      //  this.setState({
      //   isLoading: false,
      // })
      
     
    }
  }

  getTotalAmount = () => {
    const {my_carts} = this.state;
    const {userInfo} = this.props;

    var total = 0;
    let merchandise_details =
      my_carts != null
        ? my_carts.length > 0
          ? this.state.my_carts
          : []
        : [];
    if (merchandise_details != null || merchandise_details != undefined) {
      for (let index = 0; index < merchandise_details.length; index++) {
        const element = merchandise_details[index];

        let carts = my_carts.filter((item) => item.user_id === userInfo.id);
        var data = carts.filter((item) => item.id === element.id);

        var count = data[0] != undefined ? data[0].count : 1;

        total += element.item.price * count;
      }
    }

    return total.toFixed(2);
  };

  getMerchandiseData = (my_carts) => {
    return my_carts != null
      ? my_carts.length > 0
        ? this.props.merchandise_details
        : []
      : [];
  };

  _renderLoading = () => {
    return (
      <View style={{width:configs.width,backgroundColor:configs.colors.backgroundColor, height:configs.height}} >
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item margin={15}>

            <SkeletonPlaceholder.Item flexDirection="row" marginVertical={10} alignItems="center">
              <SkeletonPlaceholder.Item borderRadius={15} width={15} height={15}/>
              <SkeletonPlaceholder.Item borderRadius={5} width={configs.width * 0.3} height={10} marginLeft={10}/>
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item flexDirection="row" borderRadius={5} padding={10} borderWidth={1} width={'100%'} alignItems="center" borderColor={"#00000020"} marginVertical={5}>
              <SkeletonPlaceholder.Item height={80} width={80} borderRadius={15} />
              <SkeletonPlaceholder.Item flexDirection="column" justifyContent="space-between" alignContent="space-between" alignSelf="stretch" marginLeft={10}>
                <SkeletonPlaceholder.Item height={10} width={configs.width * 0.4} borderRadius={5} />
                <SkeletonPlaceholder.Item height={10} width={configs.width * 0.3} borderRadius={5} />
                <SkeletonPlaceholder.Item height={10} width={configs.width * 0.2} borderRadius={5} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
            
            <SkeletonPlaceholder.Item flexDirection="row" borderRadius={5} padding={10} borderWidth={1} width={'100%'} alignItems="center" borderColor={"#00000020"} marginVertical={5}>
              <SkeletonPlaceholder.Item height={80} width={80} borderRadius={15} />
              <SkeletonPlaceholder.Item flexDirection="column" justifyContent="space-between" alignContent="space-between" alignSelf="stretch" marginLeft={10}>
                <SkeletonPlaceholder.Item height={10} width={configs.width * 0.4} borderRadius={5} />
                <SkeletonPlaceholder.Item height={10} width={configs.width * 0.3} borderRadius={5} />
                <SkeletonPlaceholder.Item height={10} width={configs.width * 0.2} borderRadius={5} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item flexDirection="row" borderRadius={5} padding={10} borderWidth={1} width={'100%'} alignItems="center" borderColor={"#00000020"} marginVertical={5}>
              <SkeletonPlaceholder.Item height={80} width={80} borderRadius={15} />
              <SkeletonPlaceholder.Item flexDirection="column" justifyContent="space-between" alignContent="space-between" alignSelf="stretch" marginLeft={10}>
                <SkeletonPlaceholder.Item height={10} width={configs.width * 0.4} borderRadius={5} />
                <SkeletonPlaceholder.Item height={10} width={configs.width * 0.3} borderRadius={5} />
                <SkeletonPlaceholder.Item height={10} width={configs.width * 0.2} borderRadius={5} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item flexDirection="row" borderRadius={5} padding={10} borderWidth={1} width={'100%'} alignItems="center" borderColor={"#00000020"} marginVertical={5}>
              <SkeletonPlaceholder.Item height={80} width={80} borderRadius={15} />
              <SkeletonPlaceholder.Item flexDirection="column" justifyContent="space-between" alignContent="space-between" alignSelf="stretch" marginLeft={10}>
                <SkeletonPlaceholder.Item height={10} width={configs.width * 0.4} borderRadius={5} />
                <SkeletonPlaceholder.Item height={10} width={configs.width * 0.3} borderRadius={5} />
                <SkeletonPlaceholder.Item height={10} width={configs.width * 0.2} borderRadius={5} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>

          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </View>
    )
  }

  _renderEmptyCart  =() => {
    return (
      <View style={{height:configs.height * 0.8,alignItems:'center',justifyContent:'center'}}>
              <Image source={require('../../../../assets/icons/ic_cart.png')} style={{height:100,width:100,resizeMode:'contain'}}/>
              <Text style={{color:configs.colors.grey,paddingTop:20,}}>Empty Cart</Text>
        </View>
    )
  }

  render() {
    var length = this.getMerchandiseData(this.state.my_carts) != undefined ? this.getMerchandiseData(this.state.my_carts) != null ? this.getMerchandiseData(this.state.my_carts).length : 0 : 0;
    return this.state.isLoading || this.state.isFetching ? this._renderLoading()
    : (
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isFetching}
              onRefresh={this.onRefresh}
            />
          }
        >
        <View style={[styles.body]}>
          {
            this.state.my_carts.length > 0 && <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.dot}></View>
            <Space width={5} />
            <Text style={{fontSize: 16}}>Items</Text>
          </View>
          }
          <Space height={10} />
          {
            this.state.my_carts.length > 0 ?
            <FlatList
            initialNumToRender={5}
            
            ListFooterComponent={() => this.state.my_carts.length > 0 && (
              <View>
                <View style={styles.totalContainer}>
                  <Text style={{fontSize: 24, fontWeight: '700'}}>Total</Text>
                  <Text style={{fontSize: 24, fontWeight: '600'}}>
                    S${this.getTotalAmount()}
                  </Text>
                </View>
                <Space height={100} />
              </View>
            )}
            showsVerticalScrollIndicator={false}
            data={this.state.my_carts}
            renderItem={({item}) => (
              <View>
                <View style={styles.card}>
                  <View style={styles.cardBody}>
                    {item.item.img == null ||
                    item.item.img.length == 0 ||
                    item.item.img == undefined ? (
                      <Image
                        source={require('../../../../assets/images/placeholder_image.png')}
                        style={styles.image}
                      />
                    ) : (
                      <ImageLoad
                        style={styles.image}
                        loadingStyle={{size: 'small', color: 'white'}}
                        borderRadius={8}
                        resizeMode={'cover'}
                        placeholderStyle={{
                          borderRadius: 8,
                          height: 80,
                          width: 80,
                        }}
                        source={{uri: item.item.img[0], cache: 'force-cache'}}
                        placeholderSource={require('../../../../assets/images/placeholder_image.png')}
                      />
                    )}

                    <Space width={20} />
                    <View
                      style={{
                        justifyContent: 'space-around',
                        height: '100%',
                        flex: 0.8,
                      }}>
                      <Text numberOfLines={2} ellipsizeMode="tail" style={{fontWeight: '700'}}>{item.item.name}</Text>
                      
                      <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',alignItems:'center'}}>
                        
                        <View>
                          {  item.size !=undefined && item.size != "" && item.size != null && <Text style={{fontWeight: '600',marginBottom:5}}>Size: {item.size}</Text> }
                          <Text style={{fontSize: 14, color: configs.colors.grey}}>
                          S${item.item.price.toFixed(2)}
                        </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            // flex: 0.3,
                            // width:'100%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={{fontSize: 18, color: configs.colors.grey}}>
                            x{this.getCountFromCarts(item.id)}
                          </Text>
                          <IconButton
                            icon={
                              <Ionicons
                                name="trash-outline"
                                size={18}
                                color={configs.colors.primaryColor}
                              />
                            }
                            onPress={()=>{
                              this.RBSheet.open();
                              this.setState({
                                selected_item_id:item.id,
                              })
                            }}
                          />
                        </View>
                      </View>
                      
                    </View>
                    
                  </View>
                </View>
                <Space height={5} />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />: this._renderEmptyCart()
          }
          
        </View>
        {this.state.my_carts.length != 0 || this.state.my_carts.length > 0 ? (
          <View
            style={{
              backgroundColor: 'transparent',
              paddingHorizontal: 24,
              marginBottom: 10,
              position: 'absolute',
              bottom: 0,
              width: 'auto',
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.navigation.navigate('Payment Screen',
                {key: configs.constant.AS_KEY.CARTS, order_id: ''})}>
              <Text style={{color: 'white'}}>Checkout</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        </ScrollView>

        <RBSheet
          closeOnPressBack
          dragFromTopOnly={true}f
          closeOnDragDown={true}
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          dragFromTopOnly={true}
          openDuration={250}
          customStyles={{
            container: styles.bottomSheetContainer,
          }}
          closeOnDragDown
        >
          <View style={{justifyContent:'center',alignItems:'center',marginVertical:10,marginBottom:20,}}>
            <Text style={{fontSize:16,fontWeight:'bold',alignSelf:'center'}}>Confirm to delete?</Text>
            <Space height={10}/>
            <Text>Are you sure you want to permanently</Text>
            <Text>this item from cart?</Text>
            <Space height={20}/>
            <View style={{flexDirection:'row',justifyContent:'space-around',}}>
              <TouchableOpacity style={{paddingVertical:10,width:configs.width * 0.35,borderWidth:1,borderColor:configs.colors.primaryColor,borderRadius:20}} onPress={()=>this.RBSheet.close()}>
                <Text style={{color:configs.colors.primaryColor,fontWeight:'bold',alignSelf:'center'}}>Cancel</Text>
              </TouchableOpacity>
              <Space width={configs.width * 0.1}/>
              <TouchableOpacity style={{paddingVertical:10,width:configs.width * 0.35,backgroundColor:configs.colors.primaryColor,borderRadius:20}} onPress={()=>{
                this.RBSheet.close();
                this.onDeleteCarts(this.state.selected_item_id)
              }}>
                <Text style={{color:'white',fontWeight:'bold',alignSelf:'center'}}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    my_carts: state.homeState.my_carts,
    merchandise_details: state.homeState.merchandise_details,
    userInfo: state.authState.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMerchandiseDetails: (id) =>
      dispatch(homeAction.fetchMerchandiseDetails(id)),
      setCountOfCartItems: (value) => dispatch( homeAction.setCountOfCartItems(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: configs.colors.backgroundColor,
  },
  body: {
    padding: 14,
  },
  dot: {
    backgroundColor: configs.colors.primaryColor,
    height: 12,
    width: 12,
    borderRadius: 12,
  },
  card: {
    height: 112,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    padding: 16,
    backgroundColor: 'white',
  },
  totalContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f6f6f6',
    height: 81,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    borderRadius: 8,
    alignItems: 'center',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    flex: 0.3,
    height: 80,
    width: 80,
    borderRadius: 8,
    borderColor: '#f2f2f2',
    borderWidth: 1,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  button: {
    height: 48,
    backgroundColor: configs.colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white',
    width: configs.width - 48,
    borderRadius: 20,
  },
  bottomSheetContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 'auto',
  },
  bottomSheetBody: {
    marginHorizontal: 20,
    marginVertical: 10,

    // height:"auto",
  },
});
