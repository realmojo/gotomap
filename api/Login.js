import axios from 'axios';

const API_URL = 'https://soft-bags-tie-116-38-134-229.loca.lt';

const addUser = params => {
  const param = {
    id: params.id,
    name: params.properties.nickname,
    profileImage: params.properties.profile_image,
  };
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/user`, param)
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        console.log(e);
        reject(e);
      });
  });
};

export {addUser};
