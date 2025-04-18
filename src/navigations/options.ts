import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {isIOS} from '@/services/platform';

import {HeaderWithTitle} from './Headers/HeaderWithTitle';
import {SimpleGoBack} from './Headers/SimpleGoBack';

export const screenOptions = {
  headerShown: false,
  animation: isIOS ? 'simple_push' : 'slide_from_right',
} as NativeStackNavigationOptions;

export const screenWithGoBack = {
  header: SimpleGoBack,
  fullScreenGestureEnabled: true,
  headerShown: true,
} as NativeStackNavigationOptions;

export const fadeScreenWithGoBack = {
  ...screenWithGoBack,
  animation: 'fade_from_bottom',
} as NativeStackNavigationOptions;

export const pushScreenWithGoBack = {
  ...screenWithGoBack,
  animation: 'simple_push',
} as NativeStackNavigationOptions;

export const tabOptions = {
  headerShown: false,
  lazy: true,
};

export const titleScreenOptions = {
  ...screenOptions,
  header: HeaderWithTitle,
  headerShown: true,
} as NativeStackNavigationOptions;
