// import {Typography} from '@components/core/Typography';
// import {NativeStackHeaderProps} from '@react-navigation/native-stack';
// import {ChainSelect} from '@screens/MainFlow/Devices/components/ChainSelect';
// import {isIOS} from '@services/platform';
// import {FlowActions} from '@store/modules/Flow/actions';
// import React, {useCallback} from 'react';
// import {TouchableOpacity, View} from 'react-native';
// import {useDispatch} from 'react-redux';
// import {PlusIcon} from 'src/assets/icons/PlusIcon';

// import {useStyles} from './styles';

// export const HeaderWithTitle = ({
//   route,
//   navigation,
// }: NativeStackHeaderProps) => {
//   const styles = useStyles();
//   const dispatch = useDispatch();

//   const handlePressAdd = useCallback(() => {
//     dispatch(FlowActions.RESET_FLOW.START.create());
//     navigation.navigate('AddDevice');
//   }, [dispatch, navigation]);

//   return (
//     <View style={styles.container}>
//       <Typography.Header>{route.name}</Typography.Header>
//       {route.name === 'Devices' && (
//         <View style={styles.buttonsContainer}>
//           <ChainSelect />
//           {isIOS && (
//             <TouchableOpacity onPress={handlePressAdd} style={styles.addButton}>
//               <PlusIcon />
//             </TouchableOpacity>
//           )}
//         </View>
//       )}
//     </View>
//   );
// };

export const HeaderWithTitle = () => {
  return null;
};
