import {loginStore} from './login';
import {userStore} from './user';

const useStore = () => {
  return {loginStore, userStore};
};

export default useStore;
