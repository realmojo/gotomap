import {observable, runInAction} from 'mobx';
import {getProfile, kakaoLogin, addUser} from '../api';

const login = observable({
  isLogin: false,
  userInfo: {},
  getProfile: {},
  async socialKakaoLogin() {
    const res = await kakaoLogin();
    if (res.access_token) {
      // user 적재
      const userInfo = await this.getUser();
      console.log(userInfo);
      const user = await addUser(userInfo);
      runInAction(() => {
        this.isLogin = true;
      });
      console.log(user);
    }

    // token 적재
    // try {
    //   await saveToken(res);
    // } catch (e) {
    //   console.log(e);
    // }
    // try {
    //   await addUser(userInfo);
    // } catch (e) {
    //   console.log(e);
    // }
  },
  async getUser() {
    // if (this.isLogin) {
    const res = await getProfile();
    this.userInfo = res;
    console.log(this.userInfo);

    return res;
    // }
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
