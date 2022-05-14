import {observable, runInAction} from 'mobx';
import {getViewType, setViewType} from '../api';
import {VIEW_TYPE} from '../config/constants';

const placeStore = observable({
  viewType: '',
  setViewType(value) {
    runInAction(() => {
      this.viewType = value;
      setViewType(value);
    });
  },
  initViewType() {
    runInAction(async () => {
      const viewType = await getViewType();
      if (viewType) {
        this.viewType = viewType;
      } else {
        this.viewType = VIEW_TYPE.MAP;
        this.setViewType(VIEW_TYPE.MAP);
      }
    });
  },
});

export {placeStore};
