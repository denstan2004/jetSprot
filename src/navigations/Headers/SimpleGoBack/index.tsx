// import {Typography} from '@components/core/Typography';
// import {MainStackParamList} from '@navigation/Stacks/Main';
// import {MainTabsParamList} from '@navigation/Stacks/Tab';
// import {
//   NavigationProp,
//   RouteProp,
//   useNavigation,
//   useRoute,
// } from '@react-navigation/native';
// import {toUpperCase} from '@screens/MainFlow/DeviceDetails/screens/AddLocation/hooks/useAddLocation';
// import {storage} from '@services/mmkv';
// import {resetNavigate} from '@services/navigation';
// import {FlowActions} from '@store/modules/Flow/actions';
// import {isGoBackShown, wasOnMainPage} from '@store/modules/Flow/selectors';
// import {RecorderActions} from '@store/modules/Recorder/actions';
// import React, {useCallback, useMemo} from 'react';
// import {TouchableOpacity, View} from 'react-native';
// import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
// import {useDispatch, useSelector} from 'react-redux';
// import {ArrowIcon} from 'src/assets/icons/ArrowIcon';
// import {CrossIcon} from 'src/assets/icons/CrossIcon';
// import {QRCodeIcon} from 'src/assets/icons/QRCodeIcon';
// import {TutorialButton} from 'src/assets/icons/TutorialButton';
// import {MIDDLE_ICON_HIT_SLOP} from 'src/constants/hitSlop';
// import {rem} from 'src/theme/rn-units';

// import {useStyles} from './styles';

// const getName = (name: keyof MainStackParamList) => {
//   if (
//     [
//       'SuccessScreen',
//       'SuccessScreen',
//       'TypeManually',
//       'Scanner',
//       'DeviceDetails',
//       'AddDevice',
//     ].includes(name)
//   ) {
//     return 'Add Device';
//   }
//   if (name === 'FindHelp') {
//     return 'Find a QR code?';
//   }
//   if (name === 'DevicePlacement') {
//     return 'Device Placement';
//   }
//   if (name === 'RecorderName') {
//     return 'Recorder Name';
//   }
//   if (name === 'RecorderType') {
//     return 'Recorder Type';
//   }
//   if (name === 'InstallDevice') {
//     return 'Install the Device';
//   }
//   if (name === 'ConnectInternet') {
//     return 'Connect to Internet';
//   }
//   if (name === 'WiFi') {
//     return 'Connection Type';
//   }
//   if (
//     ['RecorderLocation', 'SelectLocation', 'SelectExistingLocation'].includes(
//       name,
//     )
//   ) {
//     return 'Location';
//   }
//   if (name === 'AddLocation') {
//     return 'Add Location';
//   }
//   if (name === 'UploadPlacement') {
//     return 'Mic Placement';
//   }
//   if (name === 'NearbyDevices') {
//     return 'Nearby Devices';
//   }
//   if (name === 'CurrentDevice') {
//     return 'Device Details';
//   }
// };

// interface SimpleGoBackIE {
//   title?: string;
//   isLoading?: boolean;
// }

// export const SimpleGoBack = ({title, isLoading = false}: SimpleGoBackIE) => {
//   const {name} = useRoute<RouteProp<MainStackParamList>>();
//   const {goBack, canGoBack} = useNavigation();
//   const {navigate} = useNavigation<NavigationProp<MainStackParamList>>();
//   const dispatch = useDispatch();

//   const header = getName(name);
//   const styles = useStyles();
//   const wasOnMainScreen = useSelector(wasOnMainPage);

//   const isIntro = useMemo(() => name === 'OnboardingIntro', [name]);
//   const showArrow = useSelector(isGoBackShown) && !isIntro;
//   const showTutorialButton = useMemo(() => name === 'AddDevice', [name]);
//   const showCloseButton = isIntro && storage.getBoolean('seenTutorial');
//   const showScannerButton = (
//     [
//       'AlreadyExists',
//       'NotFound',
//       'ConnectBluetooth',
//     ] as (keyof MainStackParamList)[]
//   ).includes(name);

//   const startTutorial = useCallback(() => {
//     dispatch(FlowActions.WAS_ON_MAIN_PAGE.SET.create(false));
//     navigate('OnboardingIntro');
//   }, [dispatch, navigate]);

//   const endTutorial = useCallback(() => {
//     if (wasOnMainScreen) {
//       resetNavigate<MainStackParamList, MainTabsParamList>({
//         stack: 'MainNavigator',
//         innerStack: 'MainTabs',
//       });
//       return;
//     }
//     goBack();
//   }, [goBack, wasOnMainScreen]);

//   const modifiedGoBack = useCallback(() => {
//     if (name === 'SuccessScreen') {
//       dispatch(RecorderActions.GET_RECORDER_STATUS.RESET.create());
//     }

//     if (name === 'UploadPlacement') {
//       goBack();
//     }

//     goBack();
//   }, [name, goBack, dispatch]);

//   const goToScanner = useCallback(() => {
//     dispatch(FlowActions.SET_LEGACY_FLOW.START.create(true));
//     navigate('Scanner');
//   }, [dispatch, navigate]);

//   return (
//     <View style={styles.wrapper}>
//       {showArrow && canGoBack() && (
//         <TouchableOpacity
//           hitSlop={MIDDLE_ICON_HIT_SLOP}
//           style={styles.container}
//           onPress={modifiedGoBack}>
//           <ArrowIcon fill="#05274A" />
//         </TouchableOpacity>
//       )}
//       {isLoading ? (
//         <SkeletonPlaceholder>
//           <SkeletonPlaceholder.Item
//             height={rem(24)}
//             width={rem(200)}
//             borderRadius={rem(12)}
//           />
//         </SkeletonPlaceholder>
//       ) : (
//         <View style={styles.inner_container}>
//           <Typography.Text customStyles={styles.text}>
//             {title ? toUpperCase(title) : header}
//           </Typography.Text>
//           {showTutorialButton && (
//             <TouchableOpacity onPress={startTutorial}>
//               <TutorialButton />
//             </TouchableOpacity>
//           )}
//           {showCloseButton && (
//             <TouchableOpacity onPress={endTutorial}>
//               <CrossIcon stroke="#000" />
//             </TouchableOpacity>
//           )}
//           {showScannerButton && (
//             <TouchableOpacity onPress={goToScanner}>
//               <QRCodeIcon height={24} width={24} />
//             </TouchableOpacity>
//           )}
//         </View>
//       )}
//     </View>
//   );
// };

export const SimpleGoBack = () => {
  return null;
};
