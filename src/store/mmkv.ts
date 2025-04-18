import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/User';
export const getStoredUser = async () => {
  const user = await AsyncStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = async (user: User) => {
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

export const removeStoredUser = async () => {
  await AsyncStorage.removeItem('user');
};
