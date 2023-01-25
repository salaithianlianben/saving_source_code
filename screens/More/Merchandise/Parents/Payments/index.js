import React, { Component } from 'react'
import { SafeAreaView,View,Text,TouchableOpacity,ScrollView,StyleSheet, Image,FlatList, Alert,StatusBar } from 'react-native'
import { Space } from '../../../../../components/space'
import configs from '../../../../../utils/configs';
import { connect } from 'react-redux';
import homeAction from '../../../../../actions/homeAction';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import IconButton from '../../../../../components/icon_button';
import paymentAction from '../../../../../actions/paymentAction';
import utilities from '../../../../../utils/utilities';
import Loading from '../../../../../components/Loading';


class PaymentScreen extends Component {

    state={
        selected_Payment:0,
        my_carts:[],
        is_loading:false,
    }

    async onDeleteAllItemInCarts() {
        const {userInfo} = this.props;
        const { key } = this.props.route.params;

        this.props.setCountOfCartItems(0);
    
          await AsyncStorage.setItem(
            key,
            JSON.stringify([]),
            ()=>{
                this.setState({
                    my_carts:[],
                }); 
            }
          );
        
      }

    async componentDidMount(){
        const { key } = this.props.route.params;
        const TempCarts = await AsyncStorage.getItem(key);
        this.setState({
            my_carts:JSON.parse(TempCarts)
        });

       // this.getMerchandiseDatas();
    }

    handlePaymentStatus = async ( status,data ) =>{
        console.log("status "+ status);
        this.setState({
            is_loading:false,
        })
        
        if(status == true){
            this.onDeleteAllItemInCarts();
            if(data.approve_link != undefined){
                this.props.navigation.navigate('Web View Component',{
                   from:"merchandise",
                    data:{
                        uri:data.approve_link,
                        order_id:data.order_id,
                        merchandise: true
                    },
                })
            }else{
                utilities.showToastMessage("Can't get payment link from server","warning");
            }
        }
    }

    getMerchandiseDatas = () => {
        var id = "";
        
        const { userInfo } = this.props;
        const { my_carts } = this.state;

        let carts = my_carts.filter(item=> item.user_id === userInfo.id);
            // console.log(carts);
            if(carts.length !== 0 || carts !== null || carts !== undefined){
                for (let index = 0; index < carts.length; index++) {
                    const element = carts[index];
                    id = id === null || id === "" ? element.id : id+","+element.id;
                } 
                if(id != null){
                    this.props.fetchMerchandiseDetails(id);
                }
                  
            }
    }

    
    getCountFromCarts = (id)=>{
        const { userInfo } = this.props;
        const { my_carts } = this.state;

        let carts = my_carts.filter(item=> item.user_id === userInfo.id);
        var data = carts.filter(item=> item.item.id === id);

        return data[0] != undefined ? data[0].count : 0;
    }

    getTotalAmount = () => {
        const { my_carts } = this.state;
        const { userInfo } = this.props;

        var total= 0;
        const merchandise_details  = my_carts.length > 0 ? this.state.my_carts : [];
        if(merchandise_details != null || merchandise_details != undefined){
            for (let index = 0; index < merchandise_details.length; index++) {
                const element = merchandise_details[index];
                
                let carts = my_carts.filter(item=> item.user_id === userInfo.id);
                var data = carts.filter(item=> item.id === element.id);

                var count = data[0] != undefined ? data[0].count : 1;

                total += element.item.price * count;
            }
        }
        
        return total.toFixed(2);
    }
    _handlePaymentWithPaynowStatus = async (status, data)=>{

        
        if(status == true){
            this.onDeleteAllItemInCarts();   
            this.setState({
                is_loading:false,
            })
            this.props.navigation.navigate("merchandise payment QR",{
                data:data,
            });
        }else{
            this.setState({
                is_loading:false,
            })
            utilities.showToastMessage("Can't get paynow QR code from server","warning"); 
        }
      
        
    }
    orderMerchandise =  () => {
        this.setState({
            is_loading:true,
        });
        const {key} = this.props.route.params;
        
        const ordered_by = this.props.userInfo.id;
        const centre_id = this.props.studentInfo.centre_id[0];
        const class_id = this.props.studentInfo.class_id[0];
        const merchandise_details = this.state.my_carts.length > 0 ? this.state.my_carts : [];
        if(merchandise_details.length > 0){
            let items = [];
            let total_amount = 0;

            for (let index = 0; index < merchandise_details.length; index++) {
                const element = merchandise_details[index];
                var count = this.getCountFromCarts(element.id);
                var temp = `${element.id}-${count}`;
                items = [
                    ...items,
                    temp,
                ]
                total_amount += element.item.price*count;
            } 
            if(key === configs.constant.AS_KEY.PAY_CARTS){
                console.log("create Payment from Pay button");

                this.createPayment(total_amount, this.props.route.params.order_id);

            }else{
                this.props.submitOrderMerchandise(ordered_by,items,centre_id,class_id,(status,data)=>{
                    if(status == true){
                        console.log(data);
                        console.log("Successful");
                        
                        this.createPayment(total_amount, data.id);
                    }else{
                        this.setState({
                            is_loading:false,
                        });
                        utilities.showToastMessage("Failed! can't submit order","error");
                        
                    }
                });
            }
        }
    }

    createPayment (total_amount, orderID){
        const {key} = this.props.route.params;

        if(this.state.selected_Payment == 0){
            
            this.props.createPaymentForMerchandiseWithPaypal("merchandising",this.props.userInfo.id,"SGD",total_amount.toFixed(2),orderID,(s,data)=>{

                if(s == true){
                    console.log('CREATE PAYMENT PAYPAL Success data new :');
                    //console.log(data);
                    if(data.approve_link != undefined){
                        this.onDeleteAllItemInCarts();

                        this.props.navigation.navigate("More");
                        if(key != configs.constant.AS_KEY.PAY_CARTS){
                            this.props.navigation.navigate("MerchandiseParentScreen");
                        }

                        this.props.navigation.navigate('Web View Component',{
                            from:"merchandise",
                            data:{
                                uri:data.approve_link,
                                paypal_token:data.paypal_order_token,
                                merchandise: true
                            },
                        })
                    }else{
                        utilities.showToastMessage("Can't get payment link from server","warning");
                    }
                }else{
                    utilities.showToastMessage("Failed! can't create payment","error");
                }
                this.setState({
                    is_loading:false,
                });
            });
        }else{
        
            this.props.createPaymentForMerchandiseWithPaynow("merchandising",this.props.userInfo.id,"SGD",orderID,(s,data)=>{
                if(s == true){
                    console.log('CREATE PAYMENT Success data ');
                    //console.log(data);
                    this.onDeleteAllItemInCarts();
                    
                    this.props.navigation.navigate("More")
                    if(key != configs.constant.AS_KEY.PAY_CARTS){
                        this.props.navigation.navigate("MerchandiseParentScreen");
                    }

                    this.props.navigation.navigate("merchandise payment QR",{
                        data:data,
                    });
                }else{
                    utilities.showToastMessage("Can't get paynow QR code from server","warning"); 
                }
                this.setState({
                    is_loading:false,
                })
            });
        }
    }

    getMerchandiseData = () => {
        return this.state.my_carts.length > 0 ? this.props.merchandise_details : [];
    }

    render() {
       console.log( JSON.stringify(this.state.my_carts));
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar translucent={true} backgroundColor={this.state.is_loading ? '#00000020' : 'transparent'}/>
                {
                    (this.state.is_loading == true) &&
                    <Loading />
                }
                <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View style={styles.dot}></View>
                        <Space width={5}/>
                        <Text style={{fontSize:16,}}>Items</Text>
                    </View>
                    <Space height={10}/>
                    <FlatList
                        data={this.state.my_carts}
                        renderItem={({item})=>(
                            <View>
                                <View style={styles.card}>
                                    <View style={styles.cardBody}>
                                        <Image source={{uri:item.item.img[0]}} style={styles.image} />
                                        <Space width={20}/>
                                        <View style={{justifyContent:'space-around',height:'100%',flex:0.5}}>
                                            <Text style={{fontWeight:'700'}} ellipsizeMode={"tail"} numberOfLines={2}>{item.item.name}</Text>
                                            {  item.size !=undefined && item.size != "" && item.size != null &&  <Text style={{fontWeight:'600'}}>Size: {item.item.size}</Text> }
                                            <Text style={{fontSize:14,color:configs.colors.grey}}>S${item.item.price.toFixed(2)}</Text>
                                        </View>
                                        <View style={{flexDirection:'row',flex:0.2,alignItems:'center',justifyContent:'flex-end',}}>
                                            <Text style={{fontSize:18,color:configs.colors.grey}}>x{this.getCountFromCarts(item.id)}</Text>
                                        </View>
                                    </View>
                                </View>
                                <Space height={5}/>
                            </View>
                        )}
                        keyExtractor={(item)=> item.id.toString()}
                    />
                    <View style={styles.totalContainer}>
                        <Text style={{fontSize:24,fontWeight:'700',}}>Total</Text>
                        <Text style={{fontSize:24,fontWeight:'600',}}>S${this.getTotalAmount()}</Text>
                    </View>
                    <Space height={10}/>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View style={styles.dot}></View>
                        <Space width={5}/>
                        <Text style={{fontSize:16,}}>Payment Methods</Text>
                    </View>
                    <Space height={10}/>
                    <View style={{flexDirection:'row',}}>
                            <TouchableOpacity style={[styles.pay_image,{ borderColor:this.state.selected_Payment === 0 ? configs.colors.primaryColor : "#f2f2f2",borderWidth: this.state.selected_Payment === 0  ? 2 : 1,}]} onPress={()=> this.setState({
                                selected_Payment:0,
                            })}>
                                <Image source={require("../../../../../assets/images/credit_card.png")} style={{height:40,width:'auto',resizeMode:'contain'}}/>
                                <Space height={5}/>
                                <Text style={{color:configs.colors.primaryColor,fontWeight:'bold',alignSelf:'center',fontSize:16}}>Credit Card</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.pay_image,{ borderColor:this.state.selected_Payment === 1 ? configs.colors.primaryColor : "#f2f2f2",borderWidth: this.state.selected_Payment === 1  ? 2 : 1,}]} onPress={()=> this.setState({
                                selected_Payment:1,
                            })}>
                                <Image source={require("../../../../../assets/images/pay_now.png")} style={{height:70,width:'auto',resizeMode:'contain'}}/>
                            </TouchableOpacity>
                    </View>
                    <Space height={30}/>
                </ScrollView>

                <View style={{backgroundColor:configs.colors.backgroundColor,paddingHorizontal:24,marginBottom:10,}}>
                    <TouchableOpacity style={styles.button} onPress={this.orderMerchandise}>
                        <Text style={{color:"white"}}>Submit Order</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}


const mapStateToProps = state => {
    return {
        my_carts : state.homeState.my_carts,
        studentInfo: state.userState.studentInfo,
        merchandise_details: state.homeState.merchandise_details,
        userInfo: state.authState.userInfo,
        is_loading_create_merchandise_payment: state.paymentState.is_loading_create_merchandise_payment,
        is_loading_creating_merchandise_payment_with_paynow: state.paymentState.is_loading_creating_merchandise_payment_with_paynow
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchMerchandiseDetails : (id)=> dispatch( homeAction.fetchMerchandiseDetails(id) ),
        createPaymentMerchandise : 
        (payment_mode, parent_id, currency_code, total_amount, minimum, sub_total, tax_total, items, handleMerchandisePaymentStatus)  => 
        dispatch( paymentAction.createPaymentMerchandise(payment_mode, parent_id, currency_code, total_amount, minimum, sub_total, tax_total, items, handleMerchandisePaymentStatus)),
        PaymentMerchandiseWithPaynow : (payment_mode, parent_id, total_amount, sub_total, tax_total, items, handleMerchandisePaymentWithPaynowStatus) =>
        dispatch( paymentAction.PaymentMerchandiseWithPaynow(payment_mode, parent_id, total_amount, sub_total, tax_total, items, handleMerchandisePaymentWithPaynowStatus)),
        clearFetchMerchandiseDetailsData: () => dispatch( homeAction.clearFetchMerchandiseDetailsData()),
        setCountOfCartItems: (value) => dispatch( homeAction.setCountOfCartItems(value)),
        submitOrderMerchandise:(ordered_by,items,centre_id,class_id, handleCallback) => dispatch( homeAction.submitOrderMerchandise(ordered_by,items,centre_id,class_id,handleCallback)),
        createPaymentForMerchandiseWithPaypal:(payment_mode,parent_id,currency_code,total_amount,order_id,handleCallback) => dispatch( paymentAction.createPaymentForMerchandiseWithPaypal(payment_mode,parent_id,currency_code,total_amount,order_id,handleCallback)),
        createPaymentForMerchandiseWithPaynow:(payment_mode,parent_id,currency_code,order_id,handleCallback) => dispatch( paymentAction.createPaymentForMerchandiseWithPaynow(payment_mode,parent_id,currency_code,order_id,handleCallback)),
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(PaymentScreen);

const styles = StyleSheet.create({
    pay_image:{
        // width:150,
        justifyContent:'center',
        padding:5,
        flex:1,
        height:140,
        borderRadius:15,
        marginHorizontal:5,
        borderColor:"#f2f2f2",
        borderWidth:1,
    },
    container:{
        flex:1,
        backgroundColor:"white",
    },
    body:{
        padding:14,
    },
    dot:{
        backgroundColor:configs.colors.primaryColor,
        height:12,
        width:12,
        borderRadius:12,
    },
    card:{
        height:112,
        borderRadius:8,
        borderWidth:1,
        borderColor:"#f2f2f2",
        padding:16,
        backgroundColor:'white'
    },
    totalContainer:{
        paddingHorizontal:10,
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'#f6f6f6',
        height:81,
        borderWidth:1,
        borderColor:'#f2f2f2',
        borderRadius:8,
        alignItems:'center',
    },
    cardBody:{
        flexDirection:'row',
        alignItems:'center'
    },
    image:{
        flex:0.3,
        height:80,
        width:80,
        borderRadius:8,
        borderColor:'#f2f2f2',
        borderWidth:1,
        alignSelf:'center',
        resizeMode:'cover'
    },
    button:{
        height:48,
        backgroundColor:configs.colors.primaryColor,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderColor:'white',
        borderRadius:20,
    }
})