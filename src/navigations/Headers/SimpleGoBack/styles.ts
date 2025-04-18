import {StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {rem} from 'src/theme/rn-units';
import {useTheme} from 'src/theme/useTheme';

export const useStyles = () => {
  const {top} = useSafeAreaInsets();
  const {Colors} = useTheme();
  return StyleSheet.create({
    wrapper: {
      backgroundColor: Colors.white.light,
      paddingTop: rem(top + 12),
      alignItems: 'center',
      gap: rem(12),
      paddingBottom: rem(12),
      flexDirection: 'row',
    },
    text: {
      color: Colors.text.dark,
      fontWeight: '700',
      lineHeight: rem(26),
      fontSize: rem(22),
    },
    container: {
      transform: [{rotate: '180deg'}],
    },
    inner_container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
    },
  });
};
