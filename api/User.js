import AsyncStorage from '@react-native-async-storage/async-storage';

const getId = () => {
  return new Promise(resolve => {
    setTimeout(async () => {
      const id = await AsyncStorage.getItem('id');
      resolve(id);
    }, 100);
  });
};

export {getId};
