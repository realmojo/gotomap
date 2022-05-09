import axios from 'axios';
import {API_URL} from './index';
import useStore from '../stores';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {userStore} = useStore();

const getViewType = async () => {
  return await AsyncStorage.getItem('viewType');
};

const setViewType = async value => {
  AsyncStorage.setItem('viewType', value);
};

const getPlace = id => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}/place/${id}`)
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

const addPlace = params => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/place`, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

const updatePlaceStatus = async ({_id, status}) => {
  const userId = userStore.userId;
  return new Promise(resolve => {
    axios
      .patch(`${API_URL}/place/${_id}/status?userId=${userId}&status=${status}`)
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        console.log(e);
      });
  });
};

const getPlaces = () => {
  console.log('getPlace Api');
  const userId = userStore.userId;
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}/place/all?userId=${userId}`)
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

const getPlaceCount = () => {
  const userId = userStore.userId;
  console.log(userId);
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}/place/allCount?userId=${userId}`)
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

const removePlace = objecId => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${API_URL}/place/${objecId}`)
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

export {
  addPlace,
  getPlace,
  getPlaces,
  getPlaceCount,
  updatePlaceStatus,
  removePlace,
  setViewType,
  getViewType,
};
