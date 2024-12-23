import { StyleSheet } from 'react-native';
import { colors, typography, layouts } from '../theme';

export const commonStyles = StyleSheet.create({
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
});
