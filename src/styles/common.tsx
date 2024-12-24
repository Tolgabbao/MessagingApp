import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, typography, layouts } from '../theme';

interface CommonStyles {
  screen: ViewStyle;
  listItem: ViewStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  input: TextStyle;
  header: ViewStyle;
  headerText: TextStyle;
    text: TextStyle;
}

export const commonStyles = StyleSheet.create<CommonStyles>({
    screen: {
        ...layouts.container,
      },
      listItem: {
        ...layouts.listItem,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      button: {
        backgroundColor: colors.primary,
        padding: 12,
        borderRadius: 4,
        alignItems: 'center',
      },
      buttonText: {
        ...typography.body,
        color: colors.white,
      },
      input: {
        borderWidth: 1,
        borderColor: colors.mediumGray,
        borderRadius: 4,
        padding: 12,
        marginVertical: 8,
        fontSize: 16,
      },
      header: {
        backgroundColor: colors.primary,
        padding: 16,
      },
      headerText: {
        ...typography.header,
      },
    text: {
      color: 'black',
      fontSize: 16
    },
    });
    
