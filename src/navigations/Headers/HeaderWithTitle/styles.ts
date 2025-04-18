import {StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {rem} from 'src/theme/rn-units';
import {useTheme} from 'src/theme/useTheme';

export const useStyles = () => {
  const {top} = useSafeAreaInsets();
  const {Colors} = useTheme();
  return StyleSheet.create({
    icon_container: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: rem(12),
      width: rem(40),
      height: rem(40),
    },
    container: {
      alignItems: 'flex-end',
      backgroundColor: Colors.white.light,
      borderBottomWidth: rem(1),
      justifyContent: 'space-between',
      borderBottomColor: Colors.borders.light,
      paddingTop: rem(top + 12),
      paddingHorizontal: rem(24),
      paddingBottom: rem(20),
      flexDirection: 'row',
    },
    addButton: {
      aspectRatio: 1,
      width: rem(32),
      backgroundColor: '#FF763F',
      borderRadius: rem(16),
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: rem(8),
    },
  });
};
