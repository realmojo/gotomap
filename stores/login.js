import {observable, runInAction} from 'mobx';
import {getKakaoProfile, kakaoLogin, googleLogin, addUser} from '../api';
import {userStore} from './user';

const loginStore = observable({
  isLogin: false,
  userInfo: {},
  getProfile: {},
  async socialGoogleLogin() {
    const params = await googleLogin();
    if (params) {
      try {
        const user = await addUser(params);
        runInAction(() => {
          console.log('login success');
          this.userInfo = user;
          this.isLogin = true;
          userStore.setId(user.id);
        });
      } catch (e) {
        console.log(`user info error: ${e}`);
      }
    }
  },
  async socialKakaoLogin() {
    const res = await kakaoLogin();
    if (res.access_token) {
      // user가 없을 경우 백엔드에서 등록한다.
      const userInfo = await this.getUser();
      try {
        const user = await addUser(userInfo);
        runInAction(() => {
          console.log('login success');
          this.userInfo = user;
          this.isLogin = true;
          userStore.setId(user.id);
        });
      } catch (e) {
        console.log(`user info error: ${e}`);
      }
    }
  },
  async getUser() {
    // 카카오의 프로필읠 가져온다.
    const res = await getKakaoProfile();
    return res;
  },
  setIslogin(value) {
    runInAction(() => {
      this.isLogin = value;
    });
  },
});

export {loginStore};
