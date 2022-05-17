import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import {API_URL} from './index';

const setStorageId = async id => {
  try {
    await AsyncStorage.setItem('id', id);
  } catch (e) {
    console.log(e);
  }
};

const addUser = params => {
  const param = {
    id: params.id,
    name: params.properties.nickname,
    profileImage: params.properties.profile_image,
    created: moment().format('YYYY-MM-DD HH:mm:ss'),
  };
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/user`, param)
      .then(res => {
        setStorageId(res.data.id);
        resolve(res.data);
      })
      .catch(e => {
        console.log(e);
        reject(e);
      });
  });
};

export {addUser};
