import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dimensions} from 'react-native';

export const APP_PRIMARY_COLOR = '#6eccae';
export const UPDATE_TOKEN = 'updateToken';
export const BLACK = 'black';
export const monthss = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
export const DEVICE_WIDTH = Dimensions.get('window').width;
export const DEVICE_HEIGHT = Dimensions.get('window').height;
export const ACCESSTOKEN = 'AccessToken ';
export const storeToken = async (token, navigation) => {
  try {
    await AsyncStorage.setItem(ACCESSTOKEN, token);
    navigation && navigation.navigate && navigation.navigate('HomeScreen');
  } catch (e) {
    console.log('error in storing token ', e);
  }
};
export const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem(ACCESSTOKEN).then(res => {
      return res;
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};
