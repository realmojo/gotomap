import axios from 'axios';
import {API_URL, getId} from './index';
import {placeData} from '../mock/getPlace';
import useStore from '../stores';

const {userStore} = useStore();

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

const updatePlaceStatus = async ({id, status}) => {
  const userId = userStore.userId;
  return new Promise(resolve => {
    axios
      .patch(`${API_URL}/place/${id}/status?userId=${userId}&status=${status}`)
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

export {addPlace, getPlaces, getPlaceCount, updatePlaceStatus, removePlace};
