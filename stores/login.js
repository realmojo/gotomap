import {observable, runInAction} from 'mobx';
import {getKakaoProfile, kakaoLogin, addUser} from '../api';

const loginStore = observable({
  isLogin: false,
  userInfo: {},
  getProfile: {},
  async socialKakaoLogin() {
    const res = await kakaoLogin();
    if (res.access_token) {
      // user가 없을 경우 백엔드에서 등록한다.
      const userInfo = await this.getUser();
      try {
        const user = await addUser(userInfo);
        runInAction(() => {
          console.log('login success');
          this.isLogin = true;
          this.userInfo = user;
        });
      } catch (e) {
        console.log('user info error');
        console.log(e);
        // runInAction(() => {
        //   this.isLogin = false;
        // });
      }
    }
  },
  async getUser() {
    // 카카오의 프로필읠 가져온다.
    const res = await getKakaoProfile();
    return res;
  },
  number: 1,
  setIslogin(value) {
    runInAction(() => {
      this.isLogin = value;
    });
  },
});

export {loginStore};
