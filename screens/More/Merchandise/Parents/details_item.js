import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Image,
  Text,
  Modal,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Space} from '../../../../components/space';
import configs from '../../../../utils/configs';
import {connect} from 'react-redux';
import homeAction from '../../../../actions/homeAction';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IconButton from '../../../../components/icon_button';
import AsyncStorage from '@react-native-community/async-storage';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import ImageLoad from '../../../../components/ImageLoad';
import utilities from '../../../../utils/utilities';
import Snackbar from 'react-native-snackbar';
import ImageViewer from 'react-native-image-zoom-viewer';
import { isTemplateLiteral } from 'typescript';
class Details_Item extends Component {
  AddToCarts = async (id, item) => {
    this.setState((prev)=>{
      return {
        ...prev,
        amount: prev.amount - 1
      }
    });
    const carts = await AsyncStorage.getItem(configs.constant.AS_KEY.CARTS);
    // let carts = this.props.my_carts;
    const {userInfo} = this.props;
    // console.log(carts);
    let temp;
    if (
      carts === null ||
      carts === undefined ||
      carts.length === 0 ||
      carts === ''
    ) {
      temp = [
        {
          id: id,
          count: 1,
          user_id: userInfo.id,
          item
        },
      ];
      // this.props.addToCart(temp);
    } else {
      tempData = JSON.parse(carts);
      temp = tempData.filter(
        (item) => item.id === id && item.user_id === userInfo.id,
      );
      let temp2 = tempData.filter(
        (item) => item.id !== id && item.user_id === userInfo.id,
      );

      // console.log(carts.filter(item => item.id === id) +"+++++" + temp2 );

      if (
        temp.length === 0 ||
        temp === null ||
        temp === '' ||
        temp === undefined
      ) {
        // console.log("hello");
        temp = [];
        temp = [
          ...temp2,
          {
            id: id,
            count: 1,
            user_id: userInfo.id,
            item
          },
        ];
      } else {
        temp = [
          ...temp2,
          {
            id: id,
            count: temp[0].count + 1,
            user_id: userInfo.id,
            item
          },
        ];
      }
      // this.props.addToCart(temp);
      
    }
   
    var total = 0;
    var i = 0;
    while (i < temp.length) {
      total += temp[i].count;
      i++;
    }
   // console.log(" length "+ total);
    await AsyncStorage.setItem(
      configs.constant.AS_KEY.CARTS,
      JSON.stringify(temp),
    );
  
    this.props.setCountOfCartItems(total);
    Snackbar.show({
      text: 'Added to cart successfully!',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor	: configs.colors.primaryColor
    });
    // utilities.showToastMessage(
    //   "Added to cart successfully!",
    //   'success',
    // );
  };

  _renderHeader = () => {
    return (
      <View style={styles.headerStyle}>
        <View style={{flex:0.2}}>
        <IconButton
              icon={
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={configs.colors.primaryColor}
                />
              }
              onPress={() => this.props.navigation.goBack()}
            
            />
        </View>
        <View style={{flex:0.9, alignItems: 'center'}}>
          <Text style={{fontSize:18,fontWeight:'bold',}}>Item</Text>
        </View>
        <View style={{flex:0.3}}>
            <IconButton
                icon={
                  <AntDesign
                    name="shoppingcart"
                    size={24}
                    color={configs.colors.primaryColor}
                    style={{paddingRight: 10}}
                    
                  />
                }
                onPress={() => this.props.navigation.navigate('Cart')}
                
                item_number={this.props.count_of_cart_items}
              />
        </View>
      </View>
    );
  }

  state={
    amount:0,
    isSelectedToShowImage: false,
    selectToShowImage: null,
  }

  componentDidMount() {
    this.props.setData('hello');
    const {item} = this.props.route.params;
    const Img = [];
    item.img.map(ig => Img.push({ url: ig}));
  
    console.log('Item Detail : amount = '+item.amount);
    this.setState({
      amount:item.amount,
      isSelectedToShowImage: false,
      selectToShowImage: Img
    });
    console.log(this.props.route.params.item.id);
  }
  

  render() {
    const {item} = this.props.route.params;
    console.log(JSON.stringify(item));

    return (
      <SafeAreaView style={styles.container}>
          <Modal
          transparent={true}
          animationType={'fade'}
          statusBarTranslucent={true}
          visible={this.state.isSelectedToShowImage}>
          <View
            style={{
              backgroundColor: '#000000',
              width: configs.width,
              height: configs.height,
              paddingTop: 40,
            }}>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                marginHorizontal: 10,
                marginTop: 5,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: "#fff",
                borderRadius: 30,
                height: 30,
                width: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.setState({ isSelectedToShowImage: false })
               
              }}>
              <Ionicons name="close-outline" color={'white'} size={24} />
            </TouchableOpacity>
            <ImageViewer imageUrls={this.state.selectToShowImage} 
              loadingRender={()=>{
              return (
                <ActivityIndicator
                  animating={true}
                  color="#ffffff"
                  size="large"
                  style={styles.activityIndicator}/>)
                } 
              }
              enablePreload={true}/>

          </View>
        </Modal>
        
        <StatusBar backgroundColor={"white"} />
        { this._renderHeader ()}
        <ScrollView style={{flex: 1, backgroundColor: configs.colors.backgroundColor}} showsVerticalScrollIndicator={false}>
        
        <View style={{padding: 16}} showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            <View>
              <View>
              <SwiperFlatList
                paginationActiveColor={configs.colors.primaryColor}
                paginationDefaultColor="#d2d2d2"
                autoplayLoop={true}
                paginationStyleItem={{
                  height: 8,
                  width: 8,
                  marginHorizontal:2,
                }}
                showPagination={item.img.length > 1}
                data={item.img}
                renderItem={({item}) => (
                  
                  <View style={{height: configs.height/2, width: configs.width - 80}}>
                    {item != undefined || item != null ? (
                      
                      <TouchableOpacity onPress={() => {
                        this.setState({
                        
                          isSelectedToShowImage: true,
                        });
                        
                      }}>
                        <ImageLoad
                          style={styles.image}
                            loadingStyle={{size: 'small', color: 'white'}}
                            borderRadius={8}
                            resizeMode={'cover'}
                            placeholderStyle={{
                            borderRadius: 8,
                            height: '100%',
                            width: '100%',
                        }}
                          source={{uri: item, cache: 'force-cache'}}
                          placeholderSource={require('../../../../assets/images/placeholder_image.png')}
                        />
              
                      </TouchableOpacity>
                    ) : (
                      <Image
                        source={require('../../../../assets/images/placeholder_image.png')}
                        style={styles.image}
                      />
                    )}
                    
                  </View>
                )}
              />
                <View style={{position: 'absolute', alignSelf: 'flex-end'}}>
                  
                  <View style={{height: configs.height/2 - 44}}/>
                  
                  <TouchableOpacity 
                    onPress={() => this.setState({isSelectedToShowImage: true, })}>
                    <Image
                      source={require('../../../../assets/icons/ic_zoom_in.png')}
                      style={styles.zoomIconStyle}/>
                  </TouchableOpacity>
                  
                </View>
                
              </View>
            </View>
            <Space height={20} />
            <View>
              <Text style={{fontSize: 18, fontFamily: configs.fontFamily.OPS600, lineHeight: 25}}>
                {item.name}
              </Text>

              { item.size !=undefined && item.size != "" && item.size != null && 
              (<View>
                <Space height={16} />
                <Text style={{fontSize: 14, fontFamily: configs.fontFamily.OPS600, lineHeight: 22}}>Size: {item.size}</Text>
              </View>) }

              <Space height={16} />
              <Text
                style={{
                  color: configs.colors.primaryColor,
                  fontSize: 20,
                  lineHeight: 24,
                  fontFamily: configs.fontFamily.OPS600,
                }}>{`S$${item.price.toFixed(2)}`}</Text>
              <Space height={16} />
              <View>
                <Text style={{
                  fontSize: 14, 
                  fontFamily: configs.fontFamily.OPS400, 
                  lineHeight: 22, 
                  textAlign:'justify'}}>
                    {item.description}
                </Text>
              </View>
            </View>
          </View>
        </View>
        </ScrollView>
          <View style={{paddingHorizontal: 16}}>
            <Space height={15} />
              <TouchableOpacity
                disabled={this.state.amount == 0}
                style={[styles.button,   {backgroundColor : this.state.amount == 0 ? configs.colors.grey  : configs.colors.primaryColor} ]}
                onPress={() => this.AddToCarts(item.id, item)}>
                <Text style={{color: 'white', alignSelf: 'center'}}>
                {this.state.amount === 0 ? "Sold Out" : "Add To Cart"}
                </Text>
              </TouchableOpacity>
            <Space height={20} />
          </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.homeState.isLoading,
    my_carts: state.homeState.my_carts,
    userInfo: state.authState.userInfo,
    count_of_cart_items: state.homeState.count_of_cart_items,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (carts) => dispatch(homeAction.addToCart(carts)),
    setData: (temp) => dispatch(homeAction.setData(temp)),
    setCountOfCartItems: (value) => dispatch( homeAction.setCountOfCartItems(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Details_Item);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: configs.colors.white,
  },
  headerStyle: { 
    flexDirection:'row',
    width:'100%',height:50,
    alignItems:'center',
    backgroundColor:'white', 
    marginTop: Platform.OS == 'ios' ?  0   : StatusBar.currentHeight, 
  },
  body: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderColor: '#f2f2f2',
    borderWidth: 1,
    resizeMode: 'cover',
  },
  zoomIconStyle: {
    width: 24,
    height: 24,
    marginRight: 20,
  },
  button: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20,
  },
});
