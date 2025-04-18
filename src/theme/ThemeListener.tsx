// import {AppCommonActions} from '@store/modules/AppCommon/actions';
// import {
//   appThemeModeSelector,
//   systemThemeActiveSelector,
// } from '@store/modules/AppCommon/selectors';
// import {AppThemeMode} from '@theme/useTheme';
// import {useEffect} from 'react';
// import {Appearance} from 'react-native';
// import {useDispatch, useSelector} from 'react-redux';

// export const ThemeListener = () => {
//   const dispatch = useDispatch();

//   const themeMode = useSelector(appThemeModeSelector);
//   const isSystemThemeActive = useSelector(systemThemeActiveSelector);

//   useEffect(() => {
//     if (!isSystemThemeActive) {
//       return;
//     }
//     const subscription = Appearance.addChangeListener(({colorScheme}) => {
//       if (themeMode !== colorScheme) {
//         dispatch(
//           AppCommonActions.UPDATE_THEME_MODE.STATE.create(
//             (colorScheme as AppThemeMode) || 'dark',
//           ),
//         );
//       }
//     });
//     return () => subscription.remove();
//   }, [dispatch, isSystemThemeActive, themeMode]);

//   return null;
// };
