import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import configs from '../../../utils/configs';

const ArrivedStudents = ({students, color, onClose,isFuture,futureStudents}) => {
  
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
  const [onStudents, setOnStudents] = useState(students);

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center',marginBottom:15,}}>
        <View style={styles.dots}></View>
        <Text style={{paddingLeft: 10, fontFamily: configs.fontFamily.OPS700, fontSize: 16}}>
          {isFuture?"Will Attend" :" Arrived"}
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
              {/*<View style={[styles.dot,{ backgroundColor:color}]}/>*/}
            </View>
            <View style={{flex: 4}}>
              <Text style={styles.nameText}>{item.name}</Text>
              {isFuture && displayFutureText(students,item.id,futureStudents)}
            </View>
            <View style={{flex: 1, alignItems: 'flex-end', paddingRight: 10}}>
              <Text style={{color: configs.colors.primaryColor}}>
                {item.temperature}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <TouchableOpacity style={styles.button} onPress={onClose}>
      <Text style={{color: configs.colors.white,fontFamily:configs.fontFamily.OPS700,fontSize:14}}>Ok</Text>
      </TouchableOpacity>
    </View>
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
    paddingVertical:10
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
    borderColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    marginVertical: 4,
    backgroundColor: configs.colors.primaryColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    // alignSelf:'center'
  },
  nameText: {
    fontSize: 14,
    color: configs.colors.black,
    fontFamily: configs.fontFamily.OPS700,
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

export default ArrivedStudents;
