import React, { useState, useEffect, useRef } from 'react';
import ModalDropdown from 'react-native-modal-dropdown';
import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
} from 'react-native';

function dropdownV2({
  selectedValue,
  style,
  dropDownStyle,
  textStyle,
  activeArColor,
  options, // dropdown data
  onChangeSelected,
  datas, // for filtering current selected data
  dropdownTextHighlightStyle,
  dropdownTextStyle,
  containerText,
  iconStyle,
}) {
  const modalRef = useRef();
  const [activeArrowColor, setActiveArrowColor] = useState(false);
  const [getData, setGetData] = useState(null);
  const [showDownIcon, setShowDownIcon] = useState(false);

  useEffect(() => {
    if (activeArColor) {
      setActiveArrowColor(activeArColor);
    }
    setGetData(datas.find((t) => t.value == selectedValue));
  }, []);

  useEffect(() => {
    console.log('drop down v2 useeffect : '+ selectedValue);
    if (selectedValue) {
      modalRef && modalRef.current && modalRef.current.hide();
      setGetData(datas.find((t) => t.value == selectedValue));
    }
  }, [selectedValue]);

  const displayRow = (data) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onChangeSelected(data);
          setGetData(data);
        }}>
        <View style={containerText}>
          <Text style={dropdownTextStyle}>{`${data.label || data.name} `}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  function _defaultValue() {
    return getData.label || getData.name;
  }

  return (
    <View>
      {getData && datas && options && (
        <ModalDropdown
          ref={modalRef}
          defaultIndex={-1}
          defaultValue={_defaultValue()}
          dropdownStyle={dropDownStyle}
          textStyle={textStyle}
          options={options}
          renderRow={(row) => displayRow(row)}
          onSelect={(item) => console.log(item)}
          dropdownTextStyle={dropdownTextStyle}
          style={style}
          dropdownTextHighlightStyle={dropdownTextHighlightStyle}
          onSelect={(idx, dat) => setGetData(dat)}
          onDropdownWillShow={() => setShowDownIcon(true)}
          onDropdownWillHide={() => setShowDownIcon(false)}
          renderRightComponent={() => (
            <View>
              {showDownIcon ? (
                <Image
                  source={require('../assets/icons/ic_arrow_up_blue_thick.png')}
                  style={iconStyle}
                />
              ) : (
                <Image
                  source={require('../assets/icons/ic_arrow_under_blue_thick.png')}
                  style={iconStyle}
                />
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

export default dropdownV2;
