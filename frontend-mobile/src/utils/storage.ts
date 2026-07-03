import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const Storage = {
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }

    await AsyncStorage.setItem(key, value);
  },

  async getItem(key: string) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }

    return await AsyncStorage.getItem(key);
  },

  async removeItem(key: string) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }

    await AsyncStorage.removeItem(key);
  },

  async clear() {
    if (Platform.OS === 'web') {
      localStorage.clear();
      return;
    }

    await AsyncStorage.clear();
  },
};

export default Storage;