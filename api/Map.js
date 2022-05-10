import axios from 'axios';
import {API_URL} from './index';
import Geolocation from '@react-native-community/geolocation';

const getCurrentGeoInfo = () => {
  return new Promise(resolve => {
    Geolocation.getCurrentPosition(info => {
      resolve({
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      });
    });
  });
};

const getSearchPlaces = async text => {
  const {latitude, longitude} = await getCurrentGeoInfo();
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${API_URL}/map/search/place/${text}?latitude=${latitude}&longitude=${longitude}`,
      )
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

const getMapDetailInfo = id => {
  return new Promise(resolve => {
    axios
      .get(`${API_URL}/map/search/${id}`)
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

export {getSearchPlaces, getMapDetailInfo};
