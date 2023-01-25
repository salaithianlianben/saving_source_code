import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {View, Text} from 'react-native';

export default function DropdownSelect({
  selectedValue,
  onChangeSelected,
  data,
  containerStyle,style,itemStyle,dropDownStyle,placeholder,selectedLabelStyle,
  labelStyle,
  zIndex,
  activeArColor,
  // style,
}) 

{
  const [activeArrowColor, setActiveArrowColor] = useState(false)
  useEffect(() => {
  if(activeArColor) {
      setActiveArrowColor(activeArColor)
  }
  }, [])

  return (
    <View>
      <DropDownPicker
        autoScrollToDefaultValue={true}
        zIndex={zIndex}
        placeholder={placeholder}
        items={data}
        defaultValue={selectedValue}
        labelStyle={labelStyle}
        containerStyle={containerStyle}
        itemStyle={itemStyle}
        selectedLabelStyle={selectedLabelStyle}
        style={style}
        dropDownStyle={dropDownStyle}
        arrowColor={ activeArrowColor ? "#2190DC" : "#000" }
        onChangeItem={(item) => onChangeSelected(item) }
      />
    </View>
  );
}
