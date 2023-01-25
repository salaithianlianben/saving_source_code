import React, { Component } from 'react';
import { Image,View,SafeAreaView,Text,StyleSheet ,TouchableOpacity, FlatList, ActivityIndicator,RefreshControl, Alert} from 'react-native';
import configs from '../../../utils/configs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import homeAction from '../../../actions/homeAction';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import utilities from '../../../utils/utilities';
import moment from 'moment';
import { FlowFlags } from 'typescript';
import {
    DotIndicator,
  } from 'react-native-indicators';

class DigitalForms extends Component {
    constructor(props) {
        super(props);
    }

    state={
        isLoadMore:false,
        refreshing:false,
    }

    _onRefresh = () => {
        this.setState({
            refreshing:true,
        })

        this._fetchDigitalForms ("", false, ()=> this.setState({
            refreshing:false,
        }));
    }
    
    componentDidMount() {
      this._fetchDigitalForms ("", false, ()=> console.log("Hello"));
    }

    _fetchDigitalForms (nextUrl, isNext, handleCallback){
        const  {userInfo, studentInfo, selected_class_index} = this.props;

        var status = 'Open';    
        var user_role = userInfo.user_type;
        var class_id = user_role === "parent" 
          ? studentInfo.class_id[0]
          : userInfo.class[selected_class_index].id;
        var valid_date = moment().format('YYYY-MM-DD');
        // var valid_from_date = moment().format("YYYY-MM-DD");
        // var valid_to_date = moment().add(30,'days').format("YYYY-MM-DD");
        //console.log('FETCH DIGITAL FROM : date => '+ valid_date);
        
        this.props.fetchDigitalForms(
            status,
            class_id,
            userInfo.id, 
            user_role,
            valid_date,
            valid_date, 
            10,
            nextUrl,
            isNext,
            handleCallback);
    }

    getAllDigitalForm = () => {

        return this.props.digital_forms;
        /*if(this.props.userInfo.user_type === "parent") {
         const IsOutdated = this.props.digital_forms.filter(d => moment().isBetween(
            moment(d.valid_from_date),
            moment(d.valid_to_date),
           
        ));
          
        const centreFilter = IsOutdated.filter(ce => (ce.centre_id.findIndex(v => v == this.props.studentInfo.centre_id[0])) != -1 );

        const classFilter =  centreFilter.filter(cl =>  (cl.class_id.findIndex(v => v == this.props.studentInfo.class_id[0])) != -1);

        return classFilter.filter(s => s.status == "Open");
        } else {
 
           // return this.props.digital_forms;
            const IsOutdated1 = this.props.digital_forms.filter(d => moment().isBetween(
                moment(d.valid_from_date),
                moment(d.valid_to_date),
               
            ));
              
            const centreFilter1 = IsOutdated1.filter(ce => (ce.centre_id.findIndex(v => v == this.props.userInfo.centre_id[0])) != -1 );
    
            const classFilter1 =  centreFilter1.filter(cl =>  (cl.class_id.findIndex(v => v == this.props.userInfo.class_id[this.props.selected_class_index])) != -1);
    
            return classFilter1.filter(s => s.status == "Open");

        }*/
      
    }

    _renderLoading = () => {
        return (
            <View style={{height:configs.height,width:configs.width,backgroundColor:configs.colors.backgroundColor,paddingVertical:10}}>
                <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item flexDirection="row" marginHorizontal={10} marginVertical={5} alignItems='center' paddingHorizontal={10} borderRadius={20} borderWidth={1} borderColor="#EAEAEA" height={90} width={configs.width * 0.95}>
                        <SkeletonPlaceholder.Item height={10} width={10} borderRadius={10} />
                        <SkeletonPlaceholder.Item flexDirection="column" marginLeft={10}>
                            <SkeletonPlaceholder.Item height={10} width={configs.width * 0.7} margin={2} borderRadius={5}/>
                            <SkeletonPlaceholder.Item height={10} width={"60%"} margin={2} borderRadius={5}/>
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>

                    <SkeletonPlaceholder.Item flexDirection="row" marginHorizontal={10} marginVertical={5} alignItems='center' paddingHorizontal={10} borderRadius={20} borderWidth={1} borderColor="#EAEAEA" height={90} width={configs.width * 0.95}>
                        <SkeletonPlaceholder.Item height={10} width={10} borderRadius={10} />
                        <SkeletonPlaceholder.Item flexDirection="column" marginLeft={10}>
                            <SkeletonPlaceholder.Item height={10} width={configs.width * 0.7} margin={2} borderRadius={5}/>
                            <SkeletonPlaceholder.Item height={10} width={"60%"} margin={2} borderRadius={5}/>
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>

                    <SkeletonPlaceholder.Item flexDirection="row" marginHorizontal={10} marginVertical={5} alignItems='center' paddingHorizontal={10} borderRadius={20} borderWidth={1} borderColor="#EAEAEA" height={90} width={configs.width * 0.95}>
                        <SkeletonPlaceholder.Item height={10} width={10} borderRadius={10} />
                        <SkeletonPlaceholder.Item flexDirection="column" marginLeft={10}>
                            <SkeletonPlaceholder.Item height={10} width={configs.width * 0.7} margin={2} borderRadius={5}/>
                            <SkeletonPlaceholder.Item height={10} width={"60%"} margin={2} borderRadius={5}/>
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>

                    <SkeletonPlaceholder.Item flexDirection="row" marginHorizontal={10} marginVertical={5} alignItems='center' paddingHorizontal={10} borderRadius={20} borderWidth={1} borderColor="#EAEAEA" height={90} width={configs.width * 0.95}>
                        <SkeletonPlaceholder.Item height={10} width={10} borderRadius={10} />
                        <SkeletonPlaceholder.Item flexDirection="column" marginLeft={10}>
                            <SkeletonPlaceholder.Item height={10} width={configs.width * 0.7} margin={2} borderRadius={5}/>
                            <SkeletonPlaceholder.Item height={10} width={"60%"} margin={2} borderRadius={5}/>
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>

                    <SkeletonPlaceholder.Item flexDirection="row" marginHorizontal={10} marginVertical={5} alignItems='center' paddingHorizontal={10} borderRadius={20} borderWidth={1} borderColor="#EAEAEA" height={90} width={configs.width * 0.95}>
                        <SkeletonPlaceholder.Item height={10} width={10} borderRadius={10} />
                        <SkeletonPlaceholder.Item flexDirection="column" marginLeft={10}>
                            <SkeletonPlaceholder.Item height={10} width={configs.width * 0.7} margin={2} borderRadius={5}/>
                            <SkeletonPlaceholder.Item height={10} width={"60%"} margin={2} borderRadius={5}/>
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>

                    <SkeletonPlaceholder.Item flexDirection="row" marginHorizontal={10} marginVertical={5} alignItems='center' paddingHorizontal={10} borderRadius={20} borderWidth={1} borderColor="#EAEAEA" height={90} width={configs.width * 0.95}>
                        <SkeletonPlaceholder.Item height={10} width={10} borderRadius={10} />
                        <SkeletonPlaceholder.Item flexDirection="column" marginLeft={10}>
                            <SkeletonPlaceholder.Item height={10} width={configs.width * 0.7} margin={2} borderRadius={5}/>
                            <SkeletonPlaceholder.Item height={10} width={"60%"} margin={2} borderRadius={5}/>
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
            </View>
        );
    }

    onLoadMore = () =>{

        let {digital_forms_next} = this.props;
        if(digital_forms_next !== undefined && digital_forms_next !== "" && digital_forms_next !== null){
            this.setState({
                isLoadMore:true,
            })
            this._fetchDigitalForms (digital_forms_next, true, ()=> this.setState({
                isLoadMore:false,
            }));
            
        }
    }

    _renderEmpty  = () =>{
        return <View style={{justifyContent:'center',alignItems:'center',height:configs.height * 0.8}}>
            <Image source={require('../../../assets/icons/ic_empty_forms.png')} style={{height:100,width:100,resizeMode:'contain'}} />
            <Text style={{color:configs.colors.grey,paddingTop:10,}}>No forms</Text>
        </View>
    }

    getSubmittedFormData = (item) =>{
        const { userInfo } = this.props;
        // submitted_by_user
        let form_submitted = item.submitted_forms != undefined && item.submitted_forms != {} && item.submitted_forms.length > 0 ? item.submitted_forms : [] ;
        let tempData = form_submitted.filter((e)=> e.submitted_by_user.id == userInfo.id)[0];
        return tempData != undefined ? tempData : undefined;
    }

    render() {


        const renderItem = ({ item, index }) => {
            
           let form_settings = item.submitted_forms.length > 0 ? JSON.parse(item.submitted_forms[0].form_settings) : item.form_settings != "" ? JSON.parse(item.form_settings) : [];

           let temp =[];

           form_settings.map(x=> {
               if(x.value == undefined){
                   var y = {
                       ...x,
                       value:null,
                   }
                   temp.push(y);
               }

           });
        var last_updated = item.submitted_forms.length > 0 ? item.submitted_forms[0].last_updated  :item.last_updated;

           return <TouchableOpacity key={item.id}  style={styles.card} onPress={()=> 
                {
                    if(form_settings.length > 0){
                        this.props.navigation.navigate("DigitalFormsDetail", 
                            {  
                                id:item.id,
                                item:item,
                            }
                        )
                    }else{
                        utilities.showToastMessage("Sorry,can't load form data from server","warning");
                    }
                }
            }
            >
               {
                   item.submitted_forms.length > 0 ?
                   <View style={{flex:1,}}>
                        <Ionicons name="md-checkmark-circle" size={18} color="#7CD227" />
                   </View> :
                   <View style={{flex:1,}}>
                        <Ionicons name="md-checkmark-circle" size={18} color="#DADADA" />
                    </View>
               }

                <View style={{flex:10,paddingLeft:5,}}>
                    <Text style={{fontWeight:'600'}}>{item.name}</Text>
                    { item.submitted_forms.length > 0 ? <Text style={{color:configs.colors.grey,fontSize:12}}>{ "Completed on " + moment(last_updated, 'YYYY MMM DD HH:mm:ss').format("YYYY MMM DD hh:mm a") }</Text> : null }
                </View>
                <View style={{flex:1,alignItems:'flex-end'}}>
                    <Ionicons name="chevron-forward-outline" size={18} color={configs.colors.primaryColor} />
                </View>
            
            </TouchableOpacity>
        }
        return this.props.digital_forms_loading ? this._renderLoading() : (
            <SafeAreaView style={styles.container}>
                {
                   this.getAllDigitalForm() && this.getAllDigitalForm().length > 0 ?
                    <FlatList
                        refreshControl={
                            <RefreshControl
                            colors={['#9Bd35A', '#689F38']}
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            />
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.body}
                        ListFooterComponent={()=>{
                            if(this.state.isLoadMore){
                                return (
                                    <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                                        <DotIndicator size={5} color={configs.colors.grey}/>
                                    </View>
                                )
                            }else{
                                return null;
                            }
                        }}
                        data={this.getAllDigitalForm()}
                        renderItem={renderItem}
                        keyExtractor={(item) =>  item.id.toString()}
                        onEndReached={
                            this.onLoadMore
                        }
                        onEndReachedThreshold={0.5}
                    /> : this._renderEmpty()
                }               
            </SafeAreaView>
        )
    }
}
const bindDispatch = dispatch => {
    return {
        fetchDigitalForms: (status, class_id, user_id, user_role, valid_from_date, valid_to_date, size, next,isNext, handleCallback) => 
          dispatch(homeAction.fetchDigitalForms(status, class_id, user_id, user_role, valid_from_date, valid_to_date, size, next, isNext, handleCallback)),
    };
  };
  const bindState = state => {
    return {
        digital_forms: state.homeState.digital_forms,
        digital_forms_next: state.homeState.digital_forms_next,
        digital_forms_loading: state.homeState.digital_forms_loading,
        userInfo: state.authState.userInfo,
        studentInfo: state.userState.studentInfo,
        selected_class_index: state.homeState.selected_class_index,
    };
  };
export default connect(bindState, bindDispatch)(DigitalForms);
const styles = StyleSheet.create({
    container:{
        flex:1,
        // padding:10,
        paddingVertical:10,
        backgroundColor:configs.colors.backgroundColor
    },
    card:{
        height:90,
        borderColor: configs.colors.borderColor,
        // borderWidth:1,
        borderRadius:20,
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:10,
        marginVertical:5,
        marginHorizontal:5,
        backgroundColor:'white',
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    body:{
        paddingHorizontal:10,
    }
})