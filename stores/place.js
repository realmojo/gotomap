import {observable, runInAction} from 'mobx';

const placeStore = observable({
  forceRefresh: true,
  setForceRefresh(value) {
    runInAction(() => {
      this.forceRefresh = value;
    });
  },
});

export {placeStore};
