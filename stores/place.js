import {observable, runInAction} from 'mobx';

const placeStore = observable({
  forceBacklogRefresh: true,
  forceDoneRefresh: true,
  placeItemRefresh: true,
  setForceBacklogRefresh(value) {
    runInAction(() => {
      this.forceBacklogRefresh = value;
    });
  },
  setForceDoneRefresh(value) {
    runInAction(() => {
      this.forceDoneRefresh = value;
    });
  },
  setPlaceItemRefresh() {
    runInAction(() => {
      this.placeItemRefresh = !this.placeItemRefresh;
    });
  },
});

export {placeStore};
