import axios from 'axios';
import {API_URL} from './index';

const addPlace = params => {
  return new Promise((resolve, reject) => {
    console.log(`${API_URL}/place`, params);
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

export {addPlace};
