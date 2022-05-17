import axios from 'axios';
import {API_URL} from './index';
import useStore from '../stores';

const {userStore} = useStore();

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

const getPlaces = () => {
  console.log(`getPlaces Api`);
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

const updatePlaceMemo = async ({_id, memo}) => {
  const userId = userStore.userId;
  return new Promise(resolve => {
    axios
      .patch(`${API_URL}/place/${_id}/memo?userId=${userId}`, {
        memo,
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        console.log(e);
      });
  });
};

const getPlaceByStatus = status => {
  console.log(`getPlace ${status} Api`);
  const userId = userStore.userId;
  if (userId) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API_URL}/place/all/${status}?userId=${userId}`)
        .then(res => {
          resolve(res.data);
        })
        .catch(e => {
          reject(e);
        });
    });
  }
};

const getPlaceCount = () => {
  const userId = userStore.userId;
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

const removePlace = _id => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${API_URL}/place/${_id}`)
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
  getPlaceByStatus,
  getPlaceCount,
  updatePlaceStatus,
  updatePlaceMemo,
  removePlace,
};
