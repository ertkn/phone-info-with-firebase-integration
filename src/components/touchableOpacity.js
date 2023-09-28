import {TouchableOpacity} from 'react-native';
import React from 'react';

function CustomTouchableOpacity ({activeOpacity, onPress, buttonStyle, children}) {  
  return (
    <TouchableOpacity activeOpacity={activeOpacity} style={buttonStyle} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

export default CustomTouchableOpacity;