// import {colorPlate, ColorPlateType} from './colors/colorPlate';
// import {useSelector} from 'react-redux';

// export enum AppThemeMode {
//   DARK = 'dark',
//   LIGHT = 'light',
// }

// export type FontType = keyof typeof fonts;

// export const fonts = {
//   outfit: 'Outfit-VariableFont_wght',
//   manrope: 'Manrope-VariableFont_wght',
//   manropeLight: 'Manrope-Light',
//   smRegular: 'SpaceMono-Regular',
//   smBold: 'SpaceMono-Bold',
//   smItalic: 'SpaceMono-Italic',
//   smBoldItalic: 'SpaceMono-BoldItalic',
// };

// interface ThemeType {
//   colors: ColorPlateType;
//   fonts: Record<FontType, string>;
//   currentThemeMode: AppThemeMode;
// }

// export const useTheme = (): ThemeType => {
//   const appThemeMode =AppThemeMode.DARK;
//   return {colors: colorPlate, fonts, currentThemeMode: appThemeMode};
//   // return {colors: colorPlate, fonts, currentThemeMode: AppThemeMode.LIGHT};
// };
