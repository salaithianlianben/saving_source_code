import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';
import styleConstructor from './style';

const Dot = ({theme, marked, disabled, color, today, selected,index}) => {
  const style = styleConstructor(theme);
  const dotStyle = [style.dot,{zIndex:100 - (index*10)}];

  if (marked) {
    dotStyle.push(style.visibleDot);

    if (today) {
      dotStyle.push(style.todayDot);
    }

    if (disabled) {
      dotStyle.push(style.disabledDot);
    }

    if (selected) {
      dotStyle.push(style.selectedDot);
    }

    if (color) {
      dotStyle.push({backgroundColor: color});
    }
  }
  
  return <View style={dotStyle}/>;
};

export default Dot;

Dot.propTypes = {
  theme: PropTypes.object,
  color: PropTypes.string,
  marked: PropTypes.bool,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  today: PropTypes.bool
};
