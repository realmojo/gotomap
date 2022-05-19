import {observable, runInAction} from 'mobx';

const userStore = observable({
  userId: '',
  setId(userId) {
    runInAction(() => {
      this.userId = userId;
    });
  },
});

export {userStore};
