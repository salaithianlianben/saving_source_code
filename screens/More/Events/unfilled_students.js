import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import configs from '../../../utils/configs';

const UnfilledStudents = ({students, color, onClose,isFuture,futureStudents,sendNotification}) => {
  const displayFutureText = (students,student_id,futureStudents)=>{
    const getFuture = futureStudents.filter(data => data.student_id === student_id);

      if(getFuture!==undefined&& getFuture.length !== 0){
      return (<>
        {getFuture[0].reason!=="" && <Text style={{fontSize:12,fontFamily:configs.fontFamily.OPS600,color:configs.colors.primaryColor}}>{getFuture[0].reason}</Text>}
        {getFuture[0].details!=="" && <Text style={{fontSize:12,fontFamily:configs.fontFamily.OPS600,color:configs.colors.primaryColor}}>{getFuture[0].details}</Text>}
      </>
      )
    }
  }

  const displayDot = (students,student_id,futureStudents)=>{
    
    const getFuture = futureStudents.filter(data => data.student_id === student_id);

    if(getFuture!==undefined && getFuture.length !== 0){
      const dotcolor = getFuture[0].will_attend===1?"#7CD227":"#F3B329";
      return   <View style={[styles.dot, {backgroundColor: dotcolor}]}/>
    }

  }

  const [onStudents, setOnStudents] = useState(students);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={{flexDirection: 'row', alignItems: 'center',marginBottom:15,}}>
        <View style={styles.dots}></View>
        <Text style={{paddingLeft: 10, fontFamily: configs.fontFamily.OPS700, fontSize: 16}}>
          Not Indicated
        </Text>
      </View>

      <FlatList
        data={students}
        renderItem={({item,index}) => (

          <View key={item.id} style={styles.card}>
            <View style={{flex: 1, marginLeft: 3}}>
              
              <Image source={onStudents[index].fail?require("../../../assets/icons/ic_account.png"): {uri:item.img}} 
              
              style={styles.image} 
              key={onStudents[index].fail}

              onError={(ev)=>{

                let newMarkers = onStudents.map(el => (
                  el.id ===item.id? {...el, fail: true}: el
                  
                 ))
                 setOnStudents(newMarkers);
                
              }}/>
              {displayDot(students,item.id,futureStudents)}
            </View>
            <View style={{flex: 4}}>
              <Text style={styles.nameText}>{item.name}</Text>
              {displayFutureText(students,item.id,futureStudents)}
            </View>
            {/* <TouchableOpacity style={{flex: 1, alignItems: 'flex-end', paddingRight: 5}}>
              <Image source={require('../../../assets/icons/ic_sended.png')} style={{height:20,width:20,resizeMode:'contain'}} />
        </TouchableOpacity>*/}
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      {!isFuture &&  <View style={{flexDirection:"row",}}>
       
        <TouchableOpacity style={[styles.button,{borderColor:configs.colors.primaryColor,}]} onPress={onClose} >
            <Text style={{color: configs.colors.primaryColor,fontSize:14,fontFamily:configs.fontFamily.OPS700}}>Back</Text>
        </TouchableOpacity>
        <View style={{width:10}}></View>
        <TouchableOpacity style={[styles.button,{ backgroundColor:configs.colors.primaryColor,borderColor:configs.colors.primaryColor,}]} onPress={()=>sendNotification(students,futureStudents)} >
            <Text style={{color: configs.colors.white,fontSize:14,fontFamily:configs.fontFamily.OPS700}}>Send notification</Text>
        </TouchableOpacity>

      </View>}

      {isFuture &&  <View style={{flexDirection:"row",}}>
        <TouchableOpacity style={[styles.button,{ backgroundColor:configs.colors.primaryColor,borderColor:configs.colors.primaryColor,}]} onPress={onClose} >
            <Text style={{color: configs.colors.white,fontFamily:configs.fontFamily.OPS700,fontSize:14}}>Ok</Text>
        </TouchableOpacity>
      </View>}
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    minHeight: 48,
    borderColor: configs.colors.borderColor,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
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
  button: {
    marginTop: 20,
    height: 48,
    borderRadius: 20,
    borderWidth: 1,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    width:'100%',
    flex:1
    // alignSelf:'center'
  },
  nameText: {
    fontSize: 14,
    color: '#121941',
    fontWeight: '700',
  },
  image: {
    height: 36,
    width: 36,
    borderRadius: 30,
  },
  dot: {
    height: 10,
    width: 10,
    position: 'absolute',
    bottom: 1,
    right: 10,
    borderRadius: 12,
    // backgroundColor:"blue"
  },
  container: {
    flex: 1,
  },
});

export default UnfilledStudents;
