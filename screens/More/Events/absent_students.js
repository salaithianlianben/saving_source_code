import React,{ useState } from 'react';
import {View,Text,StyleSheet,FlatList,Image,TouchableOpacity,Dimensions,TextInput} from 'react-native';
import configs from '../../../utils/configs';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Space from '../../../components/space';
import ModalBox from '../../../components/modal';

const { width } = Dimensions.get("window");

const AbsentStudents = ({ students,color,onClose,isFuture,futureStudents}) =>{

    const displayFutureText = (students,student_id,futureStudents)=>{
        const getFuture = futureStudents.filter(data => data.student_id === student_id);
    
          if(getFuture!==undefined&& getFuture.length !== 0){
          return (<>
          {getFuture[0].reason!=="" && <Text style={{fontSize:12,fontFamily:configs.fontFamily.OPS600,color:configs.colors.primaryColor}}>{getFuture[0].reason}</Text>}
          {getFuture[0].details!=="" && <Text style={{fontSize:12,fontFamily:configs.fontFamily.OPS600,color:configs.colors.primaryColor}}>{getFuture[0].details}</Text>}
          {getFuture[0].details==="" && getFuture[0].reason==="" && <Text style={{fontSize:12,fontFamily:configs.fontFamily.OPS600,color:configs.colors.primaryColor}}>-</Text>}

          </>
          )
        }
    }
      

    const [isMessage, setIsMessage] = useState(false);
    const [message, setMessage] = useState("Have a speedy recovery!");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [ isVisibleModal , setVisibleModal ] = useState(false);
    const [onStudents, setOnStudents] = useState(students);

    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center',marginBottom:15,}}>
                <View style={styles.dots}></View>
                <Text style={{paddingLeft: 10, fontFamily: configs.fontFamily.OPS700, fontSize: 16}}>
                    { isFuture?"Will Absent":"Absent" }
                </Text>
            </View>
             <View>
                        
                        <FlatList 
                            data={students}
                            renderItem={({item,index})=><View key={item.id} style={styles.card}>
                                <View style={{flex:1,marginLeft:3,}}>
                                  <Image source={onStudents[index].fail?require("../../../assets/icons/ic_account.png"): {uri:item.img}} 
              
                                    style={styles.image} 
                                    key={onStudents[index].fail}

                                     onError={(ev)=>{

                                      let newMarkers = onStudents.map(el => (
                                      el.id ===item.id? {...el, fail: true}: el
                  
                                     ))
                                     setOnStudents(newMarkers);
                
                                     }}/>
                                    {/*<View style={[styles.dot,{ backgroundColor:color}]}/>*/}
                                </View>
                                <View style={{flex:4,}}>
                                    <Text style={styles.nameText}>{item.name}</Text>
                                    {isFuture && displayFutureText(students,item.id,futureStudents)}
                                </View>
                            </View>}
                            keyExtractor={ (item) => item.id.toString()}
                        />
                        
                        <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={{color: configs.colors.white,fontFamily:configs.fontFamily.OPS700,fontSize:14}}>Ok</Text>
                        </TouchableOpacity>
                    </View>
            {/*
                !isMessage ? (
                    <View>
                        
                        <FlatList 
                            data={students}
                            renderItem={({item})=><View key={item.id} style={styles.card}>
                                <View style={{flex:1,marginLeft:3,}}>
                                    <Image source={{uri:item.img}} style={styles.image} />
                                    <View style={[styles.dot,{ backgroundColor:color}]}></View>
                                </View>
                                <View style={{flex:4,}}>
                                    <Text style={styles.nameText}>{item.name}</Text>
                                    {isFuture && displayFutureText(students,item.id,futureStudents)}
                                </View>
                                {isFuture &&<View style={{flex:1,alignItems:'flex-end',paddingRight:6,}}>
                                    <TouchableOpacity onPress={()=>{
                                        setIsMessage(!isMessage);
                                        setSelectedStudent(item);
                                        setMessage("");
                                    }}>
                                        <Image source={require('../../../assets/icons/ic_message.png')} style={{height:18,width:18,resizeMode:'contain'}} />
                                    </TouchableOpacity>
                                    
                                </View>}
                            </View>}
                            keyExtractor={ (item) => item.id.toString()}
                        />
                        
                        <TouchableOpacity style={styles.button} onPress={onClose}>
                            <Text style={{color:'white',}}>Ok</Text>
                        </TouchableOpacity>
                    </View>
                ):(
                    <View>
                        <View style={[styles.messageCard,{ height:64,flexDirection:'row',paddingHorizontal:10}]}>
                            <Image style={{height:40,width:40,borderColor:configs.colors.primaryColor,borderRadius:40,borderWidth:1,}} source={{uri:selectedStudent.uri}}/>
                            <View style={{width:10}}/>
                            <View>
                                <Text style={{fontFamily:configs.fontFamily.OPS700}}>Hellen Cho</Text>
                                <Text style={{fontFamily:configs.fontFamily.OPS600,color:configs.colors.grey}}>(hello{"'s"} parents)</Text>
                            </View>
                        </View>
                        <View style={{height:10}} />
                        <View style={[styles.messageCard,{ height:97,alignItems:'flex-start'}]}>
                            <TextInput value={message} placeholder="Message" style={{width:'100%',marginHorizontal:10,}} onChangeText={(value)=> setMessage(value)}/>
                        </View>
                        <View style={{height:20}}/>
                        <View style={{flexDirection:'row',justifyContent:'space-around',alignContent:'stretch',alignSelf:'stretch'}}>
                            <TouchableOpacity style={{flex:1,height:46,borderRadius:20,borderColor:configs.colors.primaryColor,borderWidth:1,alignItems:'center',justifyContent:'center'}} onPress={()=>setIsMessage(!isMessage)} >
                                <Text style={{color:configs.colors.primaryColor}}>Cancel</Text>
                            </TouchableOpacity>
                            <View style={{width:10}}/>
                            <TouchableOpacity style={{flex:1,height:46,borderRadius:20,backgroundColor:configs.colors.primaryColor,justifyContent:'center',alignItems:'center',}} onPress={()=>setVisibleModal(true)}>
                                <Text style={{color:configs.colors.white}}>Send</Text>
                            </TouchableOpacity>
                        </View>
                        <ModalBox isVisible={isVisibleModal} onCloseModals={()=>setVisibleModal(false)} messageText="Send Successful" buttonOneText="Ok" onClickButtonOneAction={()=>setVisibleModal(false)}/>
                    </View>
                )
                */}
            
        </View>
    );
}

const styles = StyleSheet.create({
    dots:{
        height:12,
        width:12,
        borderRadius:12,
        backgroundColor:configs.colors.primaryColor
        },
        title:{
            fontSize:16,
            fontWeight:'bold',
            paddingLeft:10,
        },
    messageCard:{
        borderColor:configs.colors.borderColor,
        borderRadius:8,
        borderWidth:1,
        flexDirection:'row',
        alignItems:'center',
    },
    card:{
        minHeight:48,
        borderColor:configs.colors.borderColor,
        borderRadius:8,
        borderWidth:1,
        marginVertical:4,
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:10,
        paddingVertical:10,
    },
    button:{
        marginTop:20,
        height:48,
        borderColor:"white",
        borderRadius:20,
        borderWidth:1,
        marginVertical:4,
        backgroundColor:configs.colors.primaryColor,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        alignContent:'center',
        // alignSelf:'center'
    },
    nameText:{
        fontSize:14,
        color:'#121941',
        fontFamily: configs.fontFamily.OPS700
    },
    image:{
        height:36,
        width:36,
        borderRadius:30,
    },
    dot:{
        height:10,
        width:10,
        position: 'absolute',
        bottom:1,
        right:10,
        borderRadius:12,
        // backgroundColor:"blue"
    },
    container:{
        flex:1,
    }
})

export default AbsentStudents;