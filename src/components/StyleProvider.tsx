import React from 'react';
import { View, TouchableOpacity, Text, TextInput, ViewStyle, TextStyle } from 'react-native';
import { commonStyles } from '../styles/common';
import { colors } from '../theme';
import { StyledComponentProps } from '../types/global';

interface ButtonProps extends StyledComponentProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
  title: string;
  onPress?: () => void;
}

export const StyledComponents = {
  View: (props: StyledComponentProps) => (
    <View {...props} style={[commonStyles.screen, props.style]} />
  ),
  TouchableOpacity: (props: StyledComponentProps) => (
    <TouchableOpacity {...props} style={[commonStyles.listItem, props.style]} />
  ),
  TextInput: (props: StyledComponentProps) => (
    <TextInput {...props} style={[commonStyles.input, props.style]} />
  ),
  Button: ({ style, textStyle, title, ...props }: ButtonProps) => (
    <TouchableOpacity {...props} style={[commonStyles.button, style]}>
      <Text style={[commonStyles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  ),
  Text: (props: StyledComponentProps) => (
    <Text {...props} style={[commonStyles.text, props.style]} />
  )
};

export function withCommonStyles<T extends object>(
  WrappedComponent: React.ComponentType<T & { StyledComponents: typeof StyledComponents }>
) {
  return function WithCommonStylesComponent(props: T) {
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

export const withSafeArea = <T extends object>(
  WrappedComponent: React.ComponentType<T>
): React.FC<T> => {
  return (props: T) => (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <WrappedComponent {...props} />
    </View>
  );
};
