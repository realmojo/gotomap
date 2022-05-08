import {loginStore} from './login';
import {userStore} from './user';
import {placeStore} from './place';

const useStore = () => {
  return {loginStore, userStore, placeStore};
};

export default useStore;
