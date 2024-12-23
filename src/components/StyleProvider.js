import React from 'react';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';
import { commonStyles } from '../styles/common';
import { colors } from '../theme';

export const StyledComponents = {
  View: (props) => (
    <View {...props} style={[commonStyles.screen, props.style]} />
  ),
  TouchableOpacity: (props) => (
    <TouchableOpacity {...props} style={[commonStyles.listItem, props.style]} />
  ),
  TextInput: (props) => (
    <TextInput {...props} style={[commonStyles.input, props.style]} />
  ),
  Button: ({ style, textStyle, title, ...props }) => (
    <TouchableOpacity {...props} style={[commonStyles.button, style]}>
      <Text style={[commonStyles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  ),
  Text: (props) => (
    <Text {...props} style={[commonStyles.text, props.style]} />
  )
};

export function withCommonStyles(WrappedComponent) {
  return function WithCommonStylesComponent(props) {
    return <WrappedComponent {...props} StyledComponents={StyledComponents} />;
  };
}

export const navigationTheme = {
  dark: false,
  colors: {
    primary: colors.primary,
    background: 'transparent',
    card: colors.white,
    text: colors.black,
    border: colors.lightGray,
    notification: colors.secondary,
  },
};

export const withSafeArea = (WrappedComponent) => {
  return (props) => (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <WrappedComponent {...props} />
    </View>
  );
};
