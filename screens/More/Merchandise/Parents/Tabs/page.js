import React, { Component } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View, ScrollView, FlatList, StyleSheet, Dimensions, Image,RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import {
    DotIndicator,
  } from 'react-native-indicators';
import configs from '../../../../../utils/configs';
import { Space } from '../../../../../components/space';
import ImageLoad from '../../../../../components/ImageLoad';
import Loading from '../../../../../components/Loading';
import AntDesign from 'react-native-vector-icons/AntDesign';
import homeAction from '../../../../../actions/homeAction';
import AsyncStorage from '@react-native-community/async-storage';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import TextTicker from 'react-native-text-ticker';

const { width, height } = Dimensions.get('window');

class Page extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.setCarts();
        this.getMerchandiseDatas();
    }

    setCarts = async () => {
        const TempCarts = await AsyncStorage.getItem(configs.constant.AS_KEY.CARTS);
        this.setState({
            my_carts: JSON.parse(TempCarts)
        });
    }


    getMerchandiseDatas = () => {
        var id = "";

        const { userInfo } = this.props;
        const { my_carts } = this.state;

        let carts = my_carts.filter(item => item.user_id === userInfo.id);
        console.log(carts);
        if (carts.length >= 0) {
            for (let index = 0; index < carts.length; index++) {
                const element = carts[index];
                id = id === "" ? element.id : id + "," + element.id;
            }
            if (id != "") {
                this.props.fetchMerchandiseDetails(id);
            }

        }
    }

    state = {
        isLoadMore: false,
        isTypeLoadMore: false,
        isLoading: false,
        my_carts: [],
        refreshing:false,
    }

    onLoadMore = () => {
        if (this.props.data.id === "all") {
            this.setState({
                isLoadMore: true,
            });
            const { fetchAllMerchandiseData, all_merchandise_data_next_url } = this.props;
            if (all_merchandise_data_next_url) {
                console.log("Calling")
                fetchAllMerchandiseData(true, all_merchandise_data_next_url, this.handleCallback);
            }
        } else {
            this.setState({
                isTypeLoadMore: true,
            });
            const { fetchMerchandiseDataByType, merchandise_data_by_type_next_url } = this.props;
            if (merchandise_data_by_type_next_url) {
                fetchMerchandiseDataByType(this.props.data.id, 10, merchandise_data_by_type_next_url, true, this.handleCallback);
            }
        }

    }

    handleCallback = () => {
        if (this.props.data.id === "all") {
            this.setState({
                isLoadMore: false,
            });
        } else {
            this.setState({
                isTypeLoadMore: false,
            });
        }

    }

    renderFooter = () => {
        return (
            <View>
                <ActivityIndicator animating size="large" />
            </View>
        )
    }

    getDataMechandise = () => {
        const merchandise_data = this.props.data.id === "all" ? this.props.all_merchandise_data : this.props.merchandise_data && this.props.merchandise_data.filter(x => x.id === this.props.data.id)[0];
        let data = merchandise_data ? this.props.data.id === "all" ? merchandise_data : merchandise_data.data : [];
        // return data.filter(x=>x.name ===)
        let temp = data.filter(entry => Object.values(entry).some(val => typeof val === "string" && val.includes(this.props.searchValue)));

        return temp;
    }

    _renderLoading = () => {
        return (
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>


                    <View style={{ height: '100%', }}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item height={250} marginHorizontal={7} marginVertical={15} width={width / 2 - 20}>
                                <SkeletonPlaceholder.Item height={200} width={'100%'} borderRadius={10} backgroundColor="#E0E0E0" marginBottom={8}></SkeletonPlaceholder.Item>
                                <SkeletonPlaceholder.Item width={'50%'} height={10} backgroundColor='#E0E0E0' borderRadius={10} marginBottom={8}></SkeletonPlaceholder.Item>
                                <SkeletonPlaceholder.Item flexDirection='row' justifyContent='space-between'>
                                    <SkeletonPlaceholder.Item width={36} height={10} borderRadius={10} backgroundColor='#E0E0E0' ></SkeletonPlaceholder.Item>
                                    <SkeletonPlaceholder.Item width={25} height={25} borderRadius={25} backgroundColor='#E0E0E0'></SkeletonPlaceholder.Item>
                                </SkeletonPlaceholder.Item>
                            </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder>
                    </View>

                    <View style={{ height: '100%', }}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item height={250} marginHorizontal={7} marginVertical={15} width={width / 2 - 20}>
                                <SkeletonPlaceholder.Item height={200} width={'100%'} borderRadius={10} backgroundColor="#E0E0E0" marginBottom={8}></SkeletonPlaceholder.Item>
                                <SkeletonPlaceholder.Item width={'50%'} height={10} backgroundColor='#E0E0E0' borderRadius={10} marginBottom={8}></SkeletonPlaceholder.Item>
                                <SkeletonPlaceholder.Item flexDirection='row' justifyContent='space-between'>
                                    <SkeletonPlaceholder.Item width={36} height={10} borderRadius={10} backgroundColor='#E0E0E0' ></SkeletonPlaceholder.Item>
                                    <SkeletonPlaceholder.Item width={25} height={25} borderRadius={25} backgroundColor='#E0E0E0'></SkeletonPlaceholder.Item>
                                </SkeletonPlaceholder.Item>
                            </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>


                    <View style={{ height: '100%', }}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item height={250} marginHorizontal={7} marginVertical={15} width={width / 2 - 20}>
                                <SkeletonPlaceholder.Item height={200} width={'100%'} borderRadius={10} backgroundColor="#E0E0E0" marginBottom={8}></SkeletonPlaceholder.Item>
                                <SkeletonPlaceholder.Item width={'50%'} height={10} backgroundColor='#E0E0E0' borderRadius={10} marginBottom={8}></SkeletonPlaceholder.Item>
                                <SkeletonPlaceholder.Item flexDirection='row' justifyContent='space-between'>
                                    <SkeletonPlaceholder.Item width={36} height={10} borderRadius={10} backgroundColor='#E0E0E0' ></SkeletonPlaceholder.Item>
                                    <SkeletonPlaceholder.Item width={25} height={25} borderRadius={25} backgroundColor='#E0E0E0'></SkeletonPlaceholder.Item>
                                </SkeletonPlaceholder.Item>
                            </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder>
                    </View>

                    <View style={{ height: '100%', }}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item height={250} marginHorizontal={7} marginVertical={15} width={width / 2 - 20}>
                                <SkeletonPlaceholder.Item height={200} width={'100%'} borderRadius={10} backgroundColor="#E0E0E0" marginBottom={8}></SkeletonPlaceholder.Item>
                                <SkeletonPlaceholder.Item width={'50%'} height={10} backgroundColor='#E0E0E0' borderRadius={10} marginBottom={8}></SkeletonPlaceholder.Item>
                                <SkeletonPlaceholder.Item flexDirection='row' justifyContent='space-between'>
                                    <SkeletonPlaceholder.Item width={36} height={10} borderRadius={10} backgroundColor='#E0E0E0' ></SkeletonPlaceholder.Item>
                                    <SkeletonPlaceholder.Item width={25} height={25} borderRadius={25} backgroundColor='#E0E0E0'></SkeletonPlaceholder.Item>
                                </SkeletonPlaceholder.Item>
                            </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder>
                    </View>
                </View>

            </View>
        )
    }

    _renderEmptyMerchandise  =()=>{
        return (
            <View style={{ height: 400, width: '100%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', }}>
                <Image source={require('../../../../../assets/icons/ic_merchandise_empty.png')} style={{height:100,width:100,resizeMode:'contain'}}/>
                    <Text style={{ fontSize: 16, color: "#d2d2d2", fontWeight: 'bold' }}>Empty Data</Text>
                </View>
        )
    }

    _onRefresh = () =>{
        this.setState({
            refreshing:true,
        })
        const { fetchAllMerchandiseData } = this.props;
        fetchAllMerchandiseData(false,'',()=>console.log('Get Data for all merchandise. On Refresh!'));
        //todo page by page
        this.setMerchandiseData();
        this.setState({
            refreshing:false,
        })
        
    }

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

    _renderData = () => {
        let dummyData = this.getDataMechandise();

        return dummyData.length > 0 ?<FlatList
            refreshControl={
                <RefreshControl
                    colors={['#9Bd35A', '#689F38']}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh.bind(this)}
                />
            }
            showsVerticalScrollIndicator={false}
            data={dummyData}
            onEndReached={
                this.onLoadMore
            }
            renderItem={({ item, index }) => (
                <View>
                    <TouchableOpacity
                        style={[
                            styles.item,
                            { marginBottom: index === dummyData.length - 1 ? 230 : 0 },
                        ]}
                        key={index}
                        onPress={() =>

                            this.props.navigation.navigate('Item Details', {
                                item: item,
                            })

                        }>
                        {
                            item.img[0] ?
                                <ImageLoad
                                    style={{
                                        height: '75%',
                                        width: '100%',
                                        // borderWidth:1,
                                        // borderColor:'#f2f2f2'
                                    }}
                                    loadingStyle={{ size: "small", color: "white" }}
                                    borderRadius={10}
                                    placeholderStyle={{
                                        borderRadius: 10,
                                        height: '75%',
                                        width: '100%',
                                    }}
                                    source={{ uri: item.img[0], cache: 'force-cache' }}
                                    placeholderSource={require("../../../../../assets/images/placeholder_image.png")}
                                /> : <Image source={
                                    require("../../../../../assets/images/placeholder_image.png")
                                } style={{
                                    height: '75%',
                                    width: '100%',
                                    borderWidth: 1,
                                    borderColor: '#f2f2f2',
                                    borderRadius: 10,
                                }} />
                        }
                        <Space height={7} />
                        <TextTicker disabled>{item.name}</TextTicker>
                        <Space height={10} />
                        <View
                            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>{`S$${item.price.toFixed(2)}`}</Text>
                            <AntDesign
                                name="shoppingcart"
                                size={20}
                                color={configs.colors.primaryColor}
                            />
                        </View>
                        {/* {item.isnew && (
                        <View style={styles.isNew}>
                            <Text style={{color: 'white'}}>New</Text>
                        </View>
                    )} */}
                    </TouchableOpacity>
                    {
                        index === dummyData.length - 1 && <Space height={20} />
                    }
                </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            style={{ width: '100%' }}
            //contentContainerStyle={styles.contentContainer}
        /> : this._renderEmptyMerchandise()
    }

    render() {

        let dummyData = this.getDataMechandise();
        return (
            <View>
                {
                    (this.props.is_loading_all_merchandise_data || this.props.isLoading) && dummyData.length === 0 ? this._renderLoading() : this._renderData()
                }

                {
                    this.state.isLoadMore || this.state.isTypeLoadMore ? <View style={{ width: 'auto', alignItems: 'center', justifyContent: 'center' }}>
                        <DotIndicator size={5} color={configs.colors.grey}/>
                    </View> : null
                }
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.authState.userInfo,
        merchandise_data: state.homeState.merchandise_data,
        all_merchandise_data: state.homeState.all_merchandise_data,
        merchandise_types: state.homeState.merchandise_types,
        all_merchandise_data_next_url: state.homeState.all_merchandise_data_next_url,
        is_loading_all_merchandise_data: state.homeState.is_loading_all_merchandise_data,
        isLoading: state.homeState.isLoading,
        merchandise_data_by_type_next_url: state.homeState.merchandise_data_by_type_next_url,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchMerchandiseDetails: (id) => dispatch(homeAction.fetchMerchandiseDetails(id)),
        fetchMerchandiseType: () => dispatch(homeAction.fetchMerchandiseType()),
        fetchAllMerchandiseData: (isNext, all_merchandise_data_next_url, handleCallback) => dispatch(homeAction.fetchAllMerchandiseData(isNext, all_merchandise_data_next_url, handleCallback)),
        fetchMerchandiseDataByType: (merchandise_type_id, size, merchandise_data_by_type_next_url, isNext, handleCallback) => dispatch(homeAction.fetchMerchandiseDataByType(merchandise_type_id, size, merchandise_data_by_type_next_url, isNext, handleCallback))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);


const styles = StyleSheet.create({
    item: {
        height: 250,
        borderRadius: 10,
        width: width / 2 - 16,
        marginHorizontal: 8,
        marginVertical: 15,
        alignSelf: 'flex-start',
        //backgroundColor:'blue',
    },
    isNew: {
        position: 'absolute',
        left: 0,
        top: 10,
        backgroundColor: "#F3B329",
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        paddingLeft: 3,
        paddingRight: 7,
        paddingVertical: 1,
    },

});
