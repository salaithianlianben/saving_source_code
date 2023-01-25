import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View,Text,ScrollView,TouchableOpacity,Image,StyleSheet, ActivityIndicator,FlatList } from 'react-native';
import { connect } from 'react-redux';
import homeAction from '../../../../actions/homeAction';
import Divider from '../../../../components/divider';
import ImageLoad from '../../../../components/ImageLoad';
import Loading from '../../../../components/Loading';
import { Space } from '../../../../components/space';
import configs from '../../../../utils/configs';
import utilities from '../../../../utils/utilities';
import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
  } from 'react-native-indicators';
 
class OrderPage extends Component {

    state ={
        is_loading_more:false,
        is_load_more_all_ordered:false,
        is_load_more_delivered_ordered:false,
        is_load_more_pending_payment_ordered:false,
        is_load_more_cancelled_ordered:false,
        is_load_more_payment_verification_ordered:false,
        is_loading: false,
    }

    componentDidMount (){
        this._RefreshData();
    }

    doLoadMoreOrRefresh = (isLoadMore, nextURL, status) => {
        console.log('NAY CHI : call api for '+ status+ ' nextURL : ' + nextURL + ' is load more ? '+ isLoadMore);
        
        const {getOrderedListForParents,userInfo,} = this.props;

        var nextUrl = isLoadMore ? nextURL : '';
        getOrderedListForParents(
            userInfo.id,
            status,
            10,
            isLoadMore,//for isNext
            nextUrl,
            (status,data)=>{
                if(isLoadMore){
                    this.setState({
                        is_loading_more:false,
                    })
                    switch (this.props.id) {
                        case "all":
                            this.setState({
                              is_load_more_all_ordered:false,
                            });
              
                        break;
              
                        case "topay":
                            this.setState({
                                is_load_more_pending_payment_ordered:false,
                            });
                                
                        break;
              
                        case "toreceive":
                            this.setState({
                                is_load_more_payment_verification_ordered:false,
                            });
              
                        break;
              
                        case "delivered":
                            this.setState({
                                is_load_more_delivered_ordered:false,
                            });
              
                        break;
              
                        case "cancelled":
                            this.setState({
                                is_load_more_cancelled_ordered:false,
                            });
              
                        break;
                      
                        default:
                            break;
                      }
                }
                
            }
        );
    }

    _RefreshData = () =>{
  
          switch (this.props.id) {
            case "all":
                this.doLoadMoreOrRefresh(false, '', configs.OrderListStatusMap.All);
              
              break;
  
            case "topay":
                this.doLoadMoreOrRefresh(false, '', configs.OrderListStatusMap.Pending);
                  
            break;
  
            case "toreceive":
                this.doLoadMoreOrRefresh(false, '', configs.OrderListStatusMap.Verification);
                  
            break;
  
            case "delivered":
                this.doLoadMoreOrRefresh(false, '', configs.OrderListStatusMap.Delivered);
                  
            break;
  
            case "cancelled":
                this.doLoadMoreOrRefresh(false, '', configs.OrderListStatusMap.Cancelled);
                
            break;
          
            default:
                break;
          }
      }

    _LoadMore = () =>{
      const {
        all_ordered_next_url,
        delivered_ordered_next_url,
        pending_payment_ordered_next_url,
        cancelled_ordered_next_url,
        payment_verification_ordered_next_url,} = this.props;

        switch (this.props.id) {
          case "all":
            if(all_ordered_next_url != ""){
              this.setState({
                is_load_more_all_ordered:true,
              });

            //   this.doLoadMoreOrRefresh(true, all_ordered_next_url, configs.OrderListStatusMap.All);
            }
            break;

            case "topay":
                if(pending_payment_ordered_next_url != ""){
                    this.setState({
                        is_load_more_pending_payment_ordered:true,
                    });

                    // this.doLoadMoreOrRefresh(true, pending_payment_ordered_next_url, configs.OrderListStatusMap.Pending);
                }
                break;

            case "toreceive":
                if(payment_verification_ordered_next_url != ""){
                    this.setState({
                        is_load_more_payment_verification_ordered:true,
                    });

                    // this.doLoadMoreOrRefresh(true, payment_verification_ordered_next_url, configs.OrderListStatusMap.Verification);
                }
                break;

            case "delivered":
                if(delivered_ordered_next_url != ""){
                    this.setState({
                        is_load_more_delivered_ordered:true,
                    });

                    // this.doLoadMoreOrRefresh(true, delivered_ordered_next_url, configs.OrderListStatusMap.Delivered);
                }
                break;

            case "cancelled":
                if(cancelled_ordered_next_url != ""){
                    this.setState({
                        is_load_more_cancelled_ordered:true,
                    });

                    // this.doLoadMoreOrRefresh(true, cancelled_ordered_next_url, configs.OrderListStatusMap.Cancelled);
                }
                break;
        
            default:
                break;
        }
    }

    _onLoadMore = () =>{
        this.setState({
            is_loading_more:true,
        })
        const {
          all_ordered_next_url,
          delivered_ordered_next_url,
          pending_payment_ordered_next_url,
          cancelled_ordered_next_url,
          payment_verification_ordered_next_url,} = this.props;
  
          switch (this.props.id) {
            case "all":
              if(all_ordered_next_url != ""){  
                this.doLoadMoreOrRefresh(true, all_ordered_next_url, configs.OrderListStatusMap.All);
              }
              break;
  
              case "topay":
                  if(pending_payment_ordered_next_url != ""){
                       
                      this.doLoadMoreOrRefresh(true, pending_payment_ordered_next_url, configs.OrderListStatusMap.Pending);
                  }
                  break;
  
              case "toreceive":
                  if(payment_verification_ordered_next_url != ""){
  
                      this.doLoadMoreOrRefresh(true, payment_verification_ordered_next_url, configs.OrderListStatusMap.Verification);
                  }
                  break;
  
              case "delivered":
                  if(delivered_ordered_next_url != ""){
  
                      this.doLoadMoreOrRefresh(true, delivered_ordered_next_url, configs.OrderListStatusMap.Delivered);
                  }
                  break;
  
              case "cancelled":
                  if(cancelled_ordered_next_url != ""){
  
                      this.doLoadMoreOrRefresh(true, cancelled_ordered_next_url, configs.OrderListStatusMap.Cancelled);
                  }
                  break;
          
              default:
                  break;
          }
      }

    _renderCMT = () =>{
        return (
            <>
            <TouchableOpacity style={{
                backgroundColor:'#E5FAFF',
                borderWidth:1,
                borderRadius:20,
                flexDirection:'row',
                paddingVertical:13,
                paddingHorizontal:20,
                borderColor:configs.colors.primaryColor,
            }}>
                <View style={{flex:0.2,justifyContent:'center'}}>
                    <Image source={require('../../../../assets/icons/ic_chat.png')} style={{height:35,width:35,resizeMode:'cover',}} />
                </View>
                
               
                <Text style={{color:configs.colors.primaryColor,flex:0.8, textAlign: 'justify', fontSize: 14}}>
                    {/* <Text>If the payment made through PayNow,</Text>
                    <Text> please allow at least 3 to 5 days</Text>
                    <Text> from the day of your payment date for the order</Text> */}
                    {/* <Text> to be reflected here. We will get in contact with you once your ordered item(s)</Text> */}
                    <Text>We will get in contact with you once your ordered item(s)</Text>
                    <Text> are ready for collection.</Text>
                </Text>
            </TouchableOpacity>
            <Space height={20}/>
            </>
        )
    }

    _renderLoading = () => {
        return (
            <View style={[this.props.id == "all" ? {
                height:configs.height - 410,
            } : {
                height:configs.height - 220,
            }, {
                width:'100%',
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:configs.colors.backgroundColor
            }]}>
                <ActivityIndicator animating color={configs.colors.grey} size={27}></ActivityIndicator>
                <Space height={10} />
                <Text>Loading ..</Text>
            </View>
        )
    }

    _renderEmptyOrderList = () => {
        return (
          <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              marginTop: configs.height / 5
          }}>
            <Image
              source={require('../../../../assets/icons/ic_empty_order_list.png')}
              style={{ width: 87, height: 64, marginBottom: 31,resizeMode:'contain' }}
            />
            <Text
              style={{
                color: '#CAD9FC',
                fontSize: 14,
                fontWeight: '600',
                fontFamily: configs.fontFamily.OPS700,
              }}>
              No order
            </Text>
          </View>
        )
    }

    getData = ()=>{
        switch (this.props.id) {
            case "all":
                return this.props.all_ordered_list_of_parent

            case "topay":
                return this.props.pending_payment_ordered_list_of_parent

            case "toreceive":
                return this.props.payment_verification_ordered_list_of_parent

            case "delivered":
                return this.props.delivered_ordered_list_of_parent

            case "cancelled":
                return this.props.cancelled_ordered_list_of_parent

            default:
                return this.props.all_ordered_list_of_parent
        }
    }

    getLoading = () =>{
        switch (this.props.id) {
            case "all":
                return this.props.is_fetching_all_ordered_lists

            case "topay":
                return this.props.is_fetching_pending_payment_ordered_lists

            case "toreceive":
                return this.props.is_fetching_payment_verification_ordered_lists

            case "delivered":
                return this.props.is_fetching_delivered_ordered_lists

            case "cancelled":
                return this.props.is_fetching_cancelled_ordered_lists

            default:
                return this.props.is_fetching_all_ordered_lists
        }
    }

    _renderItems = (index, item, data) => {
        return (
            <View key={index} style={{paddingTop: 20}}>
                <View style={{flexDirection:'row', width:'100%', flex: 1}}>
                    <View>
                    {
                        item.merchandise.img != undefined && item.merchandise.img != "" ? 
                        <ImageLoad
                            style={{
                                width: 80,//configs.width * 0.25,
                                height: 80, //configs.width * 0.25,
                                borderRadius:8,
                                borderWidth:1,
                                borderColor:'#DADADA',
                            }}
                            loadingStyle={{size: 'small', color: 'white'}}
                            borderRadius={8}
                            placeholderStyle={{
                                width: 80, //configs.width * 0.25,
                                height: 80, //configs.width * 0.25,
                                borderRadius:8,
                                borderWidth:1,
                                borderColor:'#DADADA',
                            }}
                            source={{
                              uri: item.merchandise.img[0],
                              cache: 'force-cache',
                            }}
                            placeholderSource={require('../../../../assets/images/placeholder_image.png')}
                          /> : <Image source={require('../../../../assets/images/placeholder_image.png')} style={{
                            width: 80, //configs.width * 0.25,
                            height: 80, //configs.width * 0.25,
                            borderRadius:8,
                            borderWidth:1,
                            borderColor:'#DADADA',
                        }}/>
                    }
                    </View>

                    <View style={{flex:1, marginLeft: 16}}>
                        <View style={{flexDirection:'row',}}>
                            <View style={{flex:0.8, justifyContent:'flex-start'}}>
                                <Text style={{fontWeight:'bold', lineHeight: 19, fontSize: 14}}>
                                    Order ID : {item.order_id}
                                </Text>
                                <Text numberOfLines={2} ellipsizeMode="tail" style={{marginTop: 8, fontWeight:'bold', lineHeight: 19, fontSize: 14}} >
                                    {item.merchandise.name}
                                </Text>
                                {
                                    item.merchandise.size != undefined && item.merchandise.size != "" ?
                                    <Text style={{marginTop: 8, lineHeight: 19, fontSize: 14}}>
                                        Size : { item.merchandise.size}</Text> : null
                                }
                                <Text style={{marginTop: 8, lineHeight: 19, fontSize: 14}}>
                                    S${item.merchandise.price}
                                </Text>
                                
                            </View>
                            <View style={{flex:0.2,justifyContent:'center',alignItems:'center',}}>
                                <Text style={{color:configs.colors.grey}}>X {item.amount}</Text>
                            </View>
                        </View>

                        {
                            item.status != "Pending Payment"  &&
                            <View>
                                {this._renderStatus(item.status)}

                                <Space height={8}/>

                                <Text style={{fontSize:12,fontWeight:'600',color:configs.colors.grey, marginBottom: 20}}>{item.last_updated}</Text>
                            </View>  
                           
                        }
                    </View>
                
                </View>
            </View>
        )
    }

    _onClickCancleOrder = (item, data) => {
        console.log('NAY CHI Order Cancle data : item id = '+ item.order_id
            + ', uder_id **** ' + this.props.userInfo.id);
        console.log(data);

        let details = data.details;
        let order_details_id = [];
        for (let index = 0; index < details.length; index++) {
          const element = details[index];
          order_details_id.push(element.id);
        }
        //const order_details_id = [item.id];
        console.log('order detail id = ** '+order_details_id);
        this.setState({
            is_loading: true,
        })
        this.props.postOrderedMerchandiseStatus(
            item.order_id,
            this.props.userInfo.id,
            order_details_id,
            'cancelled',
            (status)=>{
              console.log('NAY CHI Order Cancle data : status = '+status);
              this.setState({
                is_loading: false,
              });
              if(status == true){
                this._RefreshData();
                utilities.showToastMessage('Successfully cancelled!');
              }else{
                utilities.showToastMessage('Fail to cancel!');
              }
              
            });
    }

    async _onClickPay(data, handleCallback) {
        this.setState({
            is_loading: true,
        })
        await AsyncStorage.setItem(
            configs.constant.AS_KEY.PAY_CARTS,
            JSON.stringify([]),
            ()=>{
                for(let i = 0; i < data.details.length; i++) {
                    //var detail = data.details[i];
                    //await this.AddToCarts(detail.id, detail.amount, detail.merchandise);
                    setTimeout(() => {
                      var detail = data.details[i];
                      this.AddToCarts(detail.merchandise_id, detail.amount, detail.merchandise, detail.order_id, i, handleCallback);
                    }, i * 100)
                }
            },
          );
        
    }

    AddToCarts = async (id, count, item, orderID, index, handleCallback)=> {
        const carts = await AsyncStorage.getItem(configs.constant.AS_KEY.PAY_CARTS);
        
        const {userInfo} = this.props;
        let temp;
        if (carts === null || carts === undefined ||carts.length === 0 || carts === '') {
          temp = [
            {
              id: id,
              count: count,
              user_id: userInfo.id,
              item
            },
          ];
        } else {
            existingData = JSON.parse(carts);
            temp = [];
            temp = [
              ...existingData,
              {
                id: id,
                count: count,
                user_id: userInfo.id,
                item
              },
            ];
        }

        await AsyncStorage.setItem(
          configs.constant.AS_KEY.PAY_CARTS,
          JSON.stringify(temp),
          ()=>{
              handleCallback(index, orderID);
            },
        );
        
    }

    _renderItemDetails = (details, index, data) =>{
        console.log("NAY CHI : detail => for index "+ index);
        console.log(details);

        return (
            <View style={styles.card}>
                {
                    details.map((item,index)=>this._renderItems(index, item, data))
                }
                {
                    (details && details.length>0) ? details[0].status == "Pending Payment" &&  <View style={{width:'100%', paddingBottom: 20,}}>
                    <Divider style={{marginTop: 12}}/>
                    <Space height={16}/>
                    <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                        <TouchableOpacity style={{
                            height:48,
                            borderRadius:20,
                            width:'40%',
                            borderWidth:1,
                            borderColor:'#F66460',
                            justifyContent:'center',
                            alignItems:'center'
                          }}
                          onPress={()=> this._onClickCancleOrder(details[0], data)}
                        >
                            <Text style={{color:'#F66460'}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            height:48,
                            borderRadius:20,
                            width:'40%',
                            backgroundColor:configs.colors.primaryColor,
                            justifyContent:'center',
                            alignItems:'center'
                          }}
                          onPress={()=> {
                            this._onClickPay(data, (index, order_id)=>{
                                if(index == (data.details.length - 1)){
                                    console.log('_OnClickPay index '+ index);
                                    this.setState({
                                        is_loading: false,
                                    })
                                    this.props.navigation.navigate('Payment Screen', {
                                        key: configs.constant.AS_KEY.PAY_CARTS,
                                        order_id,
                                      });
                                }    
                            });
                          }}
                        >
                            <Text style={{color:"white",}}>Pay</Text>
                        </TouchableOpacity>
                    </View>
                </View>  : null}
            </View>
            
        );
    }

    _renderStatus = (status) =>{
        var smallStatus = status.toLowerCase();
        return (
            <View style={{
                borderRadius:14,
                height:24,
                justifyContent:'center',
                alignItems:'center',
                paddingHorizontal:15,
                alignSelf:'flex-start',
                marginTop: 8,
                backgroundColor:smallStatus == "cancelled" ? '#F66460' 
                : smallStatus == "payment verification" ? "#4075FF" 
                : smallStatus == "paid" ? "#7CD227" 
                : smallStatus == "delivered" ? "#F3B329" : "white" ,
            }}>
                <Text style={{color:'white',fontSize:12,}}>
                    {smallStatus == 'cancelled' ? "Cancel" : status}
                </Text>
            </View>
        )
    }

    render() { 
        const data = this.getData();
        //console.log('NAY CHI : getData size = ' + data.length+ ' for id '+ this.props.id);
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    backgroundColor:configs.colors.backgroundColor,
                    width:'100%',
                    height:'100%',
                    padding:10,
                }}
            >
                {
                    ( this.props.id == "toreceive" || this.props.id == "all" ) && this._renderCMT() 
                }
                {
                    this.getLoading() == true 
                    ? this._renderLoading() 
                    : (data != undefined && data.length > 0 )? 
                      <FlatList
                        style={{
                            height:'90%'
                        }}
                        onEndReached={this._LoadMore}
                        data={data}
                        renderItem={({item,index})=>{
                            // console.log(item.details);
                            return (
                                <View>
                                    {
                                        this._renderItemDetails(item.details, index, item)
                                    }
                                    {
                                        index == data.length - 1 
                                        && ( this.state.is_load_more_all_ordered == true 
                                            || this.state.is_load_more_cancelled_ordered == true 
                                            || this.state.is_load_more_delivered_ordered == true 
                                            || this.state.is_load_more_payment_verification_ordered == true 
                                            || this.state.is_load_more_pending_payment_ordered == true )
                                         &&
                                        <View style={{
                                            width:'100%',
                                            justifyContent:"center",
                                            alignItems:'center',
                                            // marginTop:10,
                                            marginBottom:15,
                                        }}>
                                            {
                                                this.state.is_loading_more === true ? <DotIndicator  size={5} color={configs.colors.grey}/> : <TouchableOpacity style={styles.loadmore} onPress={()=>this._onLoadMore()}>
                                                    <Text style={{color:configs.colors.primaryColor,fontWeight:'bold'}}>Load more</Text>
                                                </TouchableOpacity>
                                            }
                                        </View>
                                    }
                                </View>
                            )
                        }}
                        keyExtractor={(item,index)=>index.toString()}
                    /> : this._renderEmptyOrderList()
                }
                {(this.state.is_loading == true && <Loading style={{zIndex: 100}}/>)}

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    loadmore:{
        paddingVertical:14,
        paddingHorizontal:21,
        borderRadius:30,
        alignSelf:'center',
        backgroundColor:'white',
        shadowColor: '#f2f2f2',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.5,
        shadowRadius: 1,
        elevation: 1,
    },
    card: {
        borderRadius: 20,
        //paddingVertical: 20,
        marginBottom: 10,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        // shadowColor: '#f2f2f2',
        // shadowOffset: {width: 0, height: 1},
        // shadowOpacity: 0.5,
        // shadowRadius: 1,
        // elevation: 1,
        marginHorizontal: 4,
    },
})

const mapStatetoProps = state =>{
    return {
      userInfo: state.authState.userInfo,

      is_fetching_all_ordered_lists: state.homeState.is_fetching_all_ordered_lists,
      is_fetching_pending_payment_ordered_lists: state.homeState.is_fetching_pending_payment_ordered_lists,
      is_fetching_payment_verification_ordered_lists: state.homeState.is_fetching_payment_verification_ordered_lists,
      is_fetching_delivered_ordered_lists: state.homeState.is_fetching_delivered_ordered_lists,
      is_fetching_cancelled_ordered_lists: state.homeState.is_fetching_cancelled_ordered_lists,
      
      all_ordered_next_url: state.homeState.all_ordered_next_url,
      pending_payment_ordered_next_url: state.homeState.pending_payment_ordered_next_url,
      payment_verification_ordered_next_url: state.homeState.payment_verification_ordered_next_url,
      delivered_ordered_next_url: state.homeState.delivered_ordered_next_url,
      cancelled_ordered_next_url: state.homeState.cancelled_ordered_next_url,
      
      all_ordered_list_of_parent: state.homeState.all_ordered_list_of_parent,
      pending_payment_ordered_list_of_parent: state.homeState.pending_payment_ordered_list_of_parent,
      payment_verification_ordered_list_of_parent: state.homeState.payment_verification_ordered_list_of_parent,
      paid_ordered_list_of_parent: state.homeState.paid_ordered_list_of_parent,
      delivered_ordered_list_of_parent:state.homeState.delivered_ordered_list_of_parent,
      cancelled_ordered_list_of_parent:  state.homeState.cancelled_ordered_list_of_parent,
    }
}

const mapDispatchToProps = dispatch => {
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

        postOrderedMerchandiseStatus: (id, updated_by, order_details_id, status,handleCallback) =>
          dispatch(
            homeAction.postOrderedMerchandiseStatus(
            id,
            updated_by,
            order_details_id,
            status,
            handleCallback
            ),
        ),
      setCountOfCartItems: (value) => dispatch( homeAction.setCountOfCartItems(value)),
    }
}
 
export default connect(mapStatetoProps,mapDispatchToProps) (OrderPage);