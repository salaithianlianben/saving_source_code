import React, { Component } from 'react'
import { SafeAreaView, ScrollView, View,Text,TouchableOpacity,StyleSheet,Image,FlatList,ActivityIndicator,SectionList } from 'react-native'
import configs from '../../../utils/configs';
import SegmentTab from '../../../components/segment_tab';
import ImageLoad from '../../../components/ImageLoad';
import { Space } from '../../../components/space';
import { connect } from 'react-redux';
import homeAction from '../../../actions/homeAction';
import { WebView } from 'react-native-webview';
import moment from 'moment';
class OrderListss extends Component {

    state={
        selectedIndex:"Ordered",
        isLoadMore:false,
        isFetching:false
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
              source={require('../../../assets/icons/ic_empty_order_list.png')}
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

    handleCallback = () =>{
        this.setState({
            isFetching:false,
        })
    }

    DateSplit = (date) => {
        var array = date.split(" ");
        return array[0]+" "+array[1]+" "+array[2]
    }

    componentDidMount(){
        this.setState({
            isFetching:true,
        })
        this.props.getOrderedListForParents(this.props.userInfo.id,this.state.selectedIndex,10,false,"", this.handleCallback );

    }

    handleIndexChange = (index) => {

        this.setState({
          ...this.state,
          isFetching:true,
          selectedIndex: index === 0 ? "Ordered" : "Delivered",
        });
        this.props.getOrderedListForParents(this.props.userInfo.id,index === 0 ? "Ordered" : "Delivered",10,false,"",this.handleCallback );
        // console.log(index);
    }

    onLoadMore = () => {
        const { ordered_next_url,getOrderedListForParents,userInfo } = this.props;
        if(ordered_next_url != ""){
            this.setState({
                isLoadMore:true,
            });
            getOrderedListForParents(userInfo.id,this.state.selectedIndex,10,true,ordered_next_url, ()=>{
                this.setState({
                    isLoadMore:false,
                })
            } )
        }
    }

    _getOrderListData = () => {
        const { ordered_list_parents } = this.props;
        let TEMP = [];
        if(this.state.selectedIndex == "Ordered"){
            for (let index = 0; index < ordered_list_parents.length; index++) {
                const element = ordered_list_parents[index];
                if(TEMP.length > 0){
                    var tempDate = this.DateSplit(element.created_at);
                    var i = TEMP.findIndex(x=>x.date == tempDate);
                    if(i >= 0){
                        TEMP = [
                            ...TEMP.slice(0,i),
                            Object.assign({}, TEMP[i], {
                                date:tempDate,
                                data:[
                                    ...TEMP[i].data,
                                    ...element.details,
                                ]
                            }),
                            ...TEMP.slice(i+1),
                        ]
                    }else{
                        TEMP =[
                            ...TEMP,
                            {
                                date:tempDate,
                                data:element.details,
                            }
                        ]
                    }
                }else{
                    TEMP = [
                        {
                            date:this.DateSplit(element.created_at),
                            data:[
                                ...element.details,
                            ]
                        }
                    ]
                }
            }
        }else{
            for (let index = 0; index < ordered_list_parents.length; index++) {
                console.log("*"+index);
                const element = ordered_list_parents[index];
                for (let x = 0; x < element.details.length; x++) {
                    console.log("+"+x);
                    const ex = element.details[x];
                    // if(ex.length > 0){
                        var tempDate = this.DateSplit(ex.last_updated);
                        var i = TEMP.findIndex(x=>x.date == tempDate);
                        if(i != -1){
                            TEMP = [
                                ...TEMP.slice(0,i),
                                Object.assign({}, TEMP[i], {
                                    date:tempDate,
                                    data:[
                                        ...TEMP[i].data,
                                        { ...ex },
                                    ]
                                }),
                                ...TEMP.slice(i+1),
                            ]
                        }else{
                            console.log("()")
                            TEMP = [
                                ...TEMP,
                                {
                                    date:this.DateSplit(ex.last_updated),
                                    data:[
                                        ex,
                                    ]
                                }
                            ]
                        }
                    // }
                }
            }
        }
        return TEMP;
    }

    _renderCMT = () =>{
        return (
            <>
            <TouchableOpacity style={{
                backgroundColor:'#E5FAFF',
                borderWidth:1,
                borderRadius:20,
                flexDirection:'row',
                padding:15,
                borderColor:configs.colors.primaryColor,
            }}>
                <View style={{flex:0.2}}>
                    <Image source={require('../../../assets/icons/ic_chat.png')} style={{height:40,width:40,resizeMode:'cover',}} />
                </View>
                
               
                <Text style={{color:configs.colors.primaryColor,flex:0.8, textAlign: 'justify', fontSize: 14}}>
                    <Text>If the payment made through PayNow,</Text>
                    <Text> please allow at least 3 to 5 days</Text>
                    <Text> from the day of your payment date for the order</Text>
                    <Text> to be reflected here. We will get in contact with you once your ordered item(s)</Text>
                    <Text> are ready for collection.</Text>
                </Text>
            </TouchableOpacity>
            <Space height={20}/>
            </>
        )
    }


    render() {
        const { ordered_list_parents } = this.props;
        
        return (
            <SafeAreaView style={styles.container}>
               <View style={styles.body}>
                <View style={{marginTop: 25, }}>
                        <SegmentTab
                            data={['Ordered', 'Delivered']}
                            defualtSelectedIndex={this.state.selectedIndex === "Ordered" ? 0 : 1}
                            onChangeSelect={(index) => this.handleIndexChange(index)}
                            />
                </View>
                <Space height={16}/>
                <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                        {
                            this.props.is_Loading_Ordered_List && this.state.isFetching ? <View style={{height:configs.height,width:'100%',}}>
                                {/* <ActivityIndicator size="small" animating color="blue" /> */}
                                {/* <Loading/> */}
                                <View>
                                    <View style={{width:'40%',height:8,backgroundColor:'#00000010',borderRadius:8,}}></View>
                                    <Space height={10}/>
                                    <View style={{height:109,flexDirection:'row',width:'100%',padding:10}}>
                                        <View style={{height:'100%',flex:0.3,backgroundColor:'#00000010',borderRadius:20,}}></View>
                                        <View style={{flex:0.7,justifyContent:'space-between',paddingVertical:10,paddingHorizontal:10,}}>
                                            <View style={{width:'60%',height:8,borderRadius:8,backgroundColor:'#00000010'}}></View>
                                            <View style={{height:8,width:'40%',borderRadius:8,backgroundColor:'#00000010',}}></View>
                                            <View style={{width:'30%',height:8,borderRadius:8,backgroundColor:'#00000010',}}></View>
                                        </View>
                                    </View>
                                    <Space height={10}/>
                                    <View style={{height:109,flexDirection:'row',width:'100%',padding:10}}>
                                        <View style={{height:'100%',flex:0.3,backgroundColor:'#00000010',borderRadius:20,}}></View>
                                        <View style={{flex:0.7,justifyContent:'space-between',paddingVertical:10,paddingHorizontal:10,}}>
                                            <View style={{width:'60%',height:8,borderRadius:8,backgroundColor:'#00000010'}}></View>
                                            <View style={{height:8,width:'40%',borderRadius:8,backgroundColor:'#00000010',}}></View>
                                            <View style={{width:'30%',height:8,borderRadius:8,backgroundColor:'#00000010',}}></View>
                                        </View>
                                    </View>
                                    <Space height={20}/>
                                    <View style={{width:'40%',height:8,backgroundColor:'#00000010',borderRadius:8,}}></View>
                                    <Space height={10}/>
                                    <View style={{height:109,flexDirection:'row',width:'100%',padding:10}}>
                                        <View style={{height:'100%',flex:0.3,backgroundColor:'#00000010',borderRadius:20,}}></View>
                                        <View style={{flex:0.7,justifyContent:'space-between',paddingVertical:10,paddingHorizontal:10,}}>
                                            <View style={{width:'60%',height:8,borderRadius:8,backgroundColor:'#00000010'}}></View>
                                            <View style={{height:8,width:'40%',borderRadius:8,backgroundColor:'#00000010',}}></View>
                                            <View style={{width:'30%',height:8,borderRadius:8,backgroundColor:'#00000010',}}></View>
                                        </View>
                                    </View>
                                    <Space height={10}/>
                                    <View style={{height:109,flexDirection:'row',width:'100%',padding:10}}>
                                        <View style={{height:'100%',flex:0.3,backgroundColor:'#00000010',borderRadius:20,}}></View>
                                        <View style={{flex:0.7,justifyContent:'space-between',paddingVertical:10,paddingHorizontal:10,}}>
                                            <View style={{width:'60%',height:8,borderRadius:8,backgroundColor:'#00000010'}}></View>
                                            <View style={{height:8,width:'40%',borderRadius:8,backgroundColor:'#00000010',}}></View>
                                            <View style={{width:'30%',height:8,borderRadius:8,backgroundColor:'#00000010',}}></View>
                                        </View>
                                    </View>
                                </View>
                            </View> : (
                                <View>
                                    
                                    {
                                        this._getOrderListData() && this._getOrderListData().length > 0 ? 
                                        <>
                                        
                                        {
                                            this.state.selectedIndex == "Ordered" && this._renderCMT()
                                        }
                                        <SectionList
                                        sections={this._getOrderListData()}
                                        keyExtractor={(item, index) => item + index}
                                        scrollEnabled={true}
                                        showsVerticalScrollIndicator={false}
                                        onEndReached={this.onLoadMore}
                                        ListFooterComponent={()=><View>
                                            
                                            {
                                                ( this.state.isLoadMore ) && <View style={{width:'100%',justifyContent:'center'}}>
                                                    <ActivityIndicator animating size="small" color="blue" />
                                                </View>
                                            }
                                            <Space height={220} />
                                        </View>}
                                        renderItem={({ item,index }) => {
                                            const data = item;
                                                        return (
                                                            <View>
                                                                <View style={styles.card}>
                                                                    <View style={styles.cardBody}>
                                                                        {
                                                                            data.merchandise.img.length > 0 ? (
                                                                                <ImageLoad
                                                                                    borderRadius={8}
                                                                                    resizeMode={"cover"}
                                                                                    style={styles.image}
                                                                                    loadingStyle={{ size: "small", color: "white" }}
                                                                                    source={{ uri: data.merchandise.img[0], cache: 'force-cache' }}
                                                                                    placeholderStyle={{
                                                                                        height:80,
                                                                                        width:80,
                                                                                        borderRadius:8,                    
                                                                                    }}
                                                                                    placeholderSource={require("../../../assets/images/placeholder_image.png")}
                                                                                />
                                                                            ):(
                                                                                <Image source={require("../../../assets/images/placeholder_image.png")} style={styles.image} />
                                                                            )
                                                                        }
                                                                        {/* <Image source={{uri:data.merchandise.img.length >0 ? data.merchandise.img[0] : 'https://i.pinimg.com/originals/26/ff/4c/26ff4c649cf16ff170aca75b405f1958.jpg'}} style={styles.image} /> */}
                                                                        <Space width={16}/>
                                                                        <View style={{justifyContent:'space-around',height:'100%',flex:0.7}}>
                                                                            <Text style={{fontWeight:'700'}}>{data.merchandise.name}</Text>
                                                                            <Text style={{fontWeight:'600'}}>Size: {data.merchandise.size}</Text>
                                                                            <Text style={{fontSize:14,color:configs.colors.grey}}>S${data.merchandise.price}</Text>
                                                                            {
                                                                               this.state.selectedIndex === "Ordered" && data.status == "Payment Verification" &&
                                                                                <View style={{backgroundColor: configs.colors.primaryColor,width: 150, height: 24, justifyContent: 'center', alignItems: 'center',  borderRadius: 14}}>
                                                                                  <Text style={{ fontSize: 12, fontFamily: configs.fontFamily.OPS500, color: '#fff'}}>Payment verification</Text>
                                                                                </View>   
                                                                            }
                                                                            {
                                                                                this.state.selectedIndex === "Ordered" && data.status == "Paid" && 
                                                                                <View style={{backgroundColor: configs.colors.lightgreen, width: 51, height: 23,  justifyContent: 'center', alignItems: 'center', borderRadius: 14}}>
                                                                                    <Text style={{ fontSize: 12, fontFamily: configs.fontFamily.OPS500, color: '#fff'}}>Paid</Text>
                                                                                </View>
                                                                            }
                                                                            {
                                                                                this.state.selectedIndex === "Ordered" && data.status == "Cancel" &&
                                                                                <>
                                                                                <View style={{backgroundColor: configs.colors.active_noti, width: 67, height: 24, justifyContent: 'center', alignItems: 'center', borderRadius: 14, marginBottom: 8}}>
                                                                                    <Text style={{ fontSize: 12, fontFamily: configs.fontFamily.OPS500, color: '#fff'}}>Cancel</Text>
                                                                                </View>
                                                                                <Text style={{ color: configs.colors.active_noti, fontSize: 12, fontFamily: configs.fontFamily.OPS600}}>The payment didn’t received</Text>
                                                                                
                                                                                </>
                                                                            }
                                                                            <Text style={{ fontSize: 12, fontFamily: configs.fontFamily.OPS600, color: '#939494'}}>{moment(data.last_updated, 'YYYY MMM DD HH:mm:ss').format('DD MMM YYYY hh:mm:ss')}</Text>
                                                                        </View>
                                                                            
                                                                        <View style={{flex:0.2,alignItems:'center',justifyContent:'center',}}>
                                                                            <Text style={{fontSize:18,color:configs.colors.grey,alignSelf:'flex-end'}}>x{data.amount}</Text>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        )
                                        }}
                                        renderSectionHeader={({ section: { date } }) => (
                                            <View style={{flexDirection:'row',alignItems:'center',}}>
                                                <View style={{width:7,height:7,borderRadius:30,backgroundColor:configs.colors.primaryColor}}></View>
                                                <Text style={{fontWeight:'bold',paddingLeft:5,}}>{date}</Text>
                                            </View>
                                        )}
                                    />
                                    

                                    </> : this._renderEmptyOrderList() }
                                </View>
                            )
                        }
                    </View>
                </ScrollView>  
              </View>
            </SafeAreaView>
        )
    }
}

const mapStateToProps = state => {
    return {
        ordered_list_parents: state.homeState.ordered_list_parents,
        userInfo: state.authState.userInfo,
        is_Loading_Ordered_List: state.homeState.is_Loading_Ordered_List,
        ordered_next_url: state.homeState.ordered_next_url,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getOrderedListForParents: (user_id,status,size,isNext,ordered_next_url,handleCallback )=> dispatch( homeAction.getOrderedListForParents(user_id,status,size,isNext,ordered_next_url,handleCallback ) )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(OrderListss);

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:configs.colors.backgroundColor
    },
    body:{
        flex:1,
        marginLeft: 24,
        marginRight: 24,
        backgroundColor:configs.colors.backgroundColor
    },
    image:{
        flex:0.3,
        height:80,
        width:80,
        borderRadius:8,
        borderColor:'#f2f2f2',
        borderWidth:1,
        resizeMode:'cover',
      
    },
    card:{
        height:165,
        borderRadius:20,
        borderWidth:1,
        borderColor:"#f2f2f2",
        padding: 16,
        // paddingBottom:17,
        marginVertical:5,
        backgroundColor:'white'
    },
    cardBody:{
        flexDirection:'row',
      
    },
})