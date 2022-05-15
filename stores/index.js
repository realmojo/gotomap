import {loginStore} from './login';
import {userStore} from './user';
import {placeStore} from './place';
import {tabStore} from './tab';

const useStore = () => {
  return {loginStore, userStore, placeStore, tabStore};
};

export default useStore;
