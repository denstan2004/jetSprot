import { Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const platformSelect = <T>(options: { ios: T; android: T }) => {
  return Platform.select(options);
};

export const getPlatformVersion = () => {
  return Platform.Version;
};

export const isPlatformVersionGreaterThan = (version: number) => {
  return Number(Platform.Version) > version;
}; 