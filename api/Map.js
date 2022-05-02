import axios from 'axios';

const API_URL = 'https://map.naver.com/v5/api';

const getSearchPlaces = text => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${API_URL}/instantSearch?lang=ko&caller=pcweb&types=place,address,bus&coords=37.51708600000052,126.899465946063&query=${encodeURI(
          text,
        )}`,
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
      .get(`${API_URL}/sites/summary/${id}?lang=ko`)
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

export {getSearchPlaces, getMapDetailInfo};
