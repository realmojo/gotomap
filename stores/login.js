import {observable, runInAction} from 'mobx';

const loginStore = observable({
  isLogin: false,
  setIslogin(value) {
    runInAction(() => {
      this.isLogin = value;
    });
  },
});

export {loginStore};
