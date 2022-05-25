import {observable, runInAction} from 'mobx';

const userStore = observable({
  userId: '',
  userName: {},
  setId(userId) {
    runInAction(() => {
      this.userId = userId;
    });
  },
  setName(userName) {
    runInAction(() => {
      this.userName = userName;
    });
  },
});

export {userStore};
