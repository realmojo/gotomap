import axios from 'axios';
import {API_URL, getId} from './index';
import {placeData} from '../mock/getPlace';

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

const getPlaces = async () => {
  const userId = await getId();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(placeData);
    }, 400);
    // axios
    //   .get(`${API_URL}/place/all?userId=${userId}`)
    //   .then(res => {
    //     resolve(res.data);
    //   })
    //   .catch(e => {
    //     reject(e);
    //   });
  });
};

export {addPlace, getPlaces};
