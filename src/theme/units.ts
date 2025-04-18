import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const rem = (size = 0) => {
  const isLandscape = width > height;
  const base = isLandscape ? height : width;

  const magicNumber = 375;

  return Math.floor((base / magicNumber) * size);
};

export const spacing = (percentage: number) => {
  const magicNumber = rem(7.1);
  return percentage / magicNumber;
};
