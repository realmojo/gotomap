import {observable} from 'mobx';

const tabStore = observable({
  tabCount: 0,
  placeCount: 0,
  placeViewType: '',
});

export {tabStore};
