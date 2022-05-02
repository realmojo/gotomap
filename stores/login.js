import {observable} from 'mobx';
import {getProfile, kakaoLogin} from '../api/KakaoLogin';

const login = observable({
  isLogin: false,
  userInfo: {},
  getProfile: {},
  async socialKakaoLogin() {
    const res = await kakaoLogin();
    console.log(res);
    if (res.access_token) {
      this.isLogin = true;
    }
    this.getProfile();
  },
  async getProfile() {
    if (this.isLogin) {
      const res = await getProfile();
      this.userInfo = res;
      console.log(this.userInfo);
    }
  },
  number: 1,
  setIslogin(value) {
    this.isLogin = value;
  },
  increase() {
    this.number++;
  },
  decrease() {
    this.number--;
  },
});

export {login};
