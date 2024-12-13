import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_DATA_KEY = 'user_data';

export const storeAuthData = async (token, userData) => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error storing auth data:', error);
    return false;
  }
};

export const getAuthData = async () => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    const userDataString = await AsyncStorage.getItem(USER_DATA_KEY);
    
    if (!token || !userDataString) {
      return { token: null, userData: null };
    }
    
    const userData = JSON.parse(userDataString);
    return { token, userData };
  } catch (error) {
    console.error('Error getting auth data:', error);
    return { token: null, userData: null };
  }
};

export const updateAuthData = async (userData) => {
  try {
    const { token } = await getAuthData();
    if (!token) {
      throw new Error('No authentication token found');
    }
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error updating auth data:', error);
    return false;
  }
};

export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
    return true;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return false;
  }
}; 