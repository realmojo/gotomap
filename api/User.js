import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from './index';
import useStore from '../stores';

const {userStore} = useStore();

const getId = () => {
  return new Promise(resolve => {
    setTimeout(async () => {
      const id = await AsyncStorage.getItem('id');
      resolve(id);
    }, 100);
  });
};
const getName = async () => {
  const name = await AsyncStorage.getItem('name');
  return name;
};

const patchUsername = params => {
  const userId = userStore.userId;
  return new Promise((resolve, reject) => {
    axios
      .patch(`${API_URL}/user/name?userId=${userId}`, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

export {getId, getName, patchUsername};
