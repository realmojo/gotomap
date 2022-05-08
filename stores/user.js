import {observable, runInAction} from 'mobx';
import {getPlaceCount} from '../api';

const userStore = observable({
  userId: '',
  countInfo: {
    totalCount: 0,
    doneCount: 0,
    backlogCount: 0,
  },
  async getPlaceCount() {
    const response = await getPlaceCount();
    runInAction(() => {
      this.countInfo = response;
    });
  },
  setId(userId) {
    runInAction(() => {
      this.userId = userId;
    });
  },
});

export {userStore};
