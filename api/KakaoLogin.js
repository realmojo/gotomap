import KakaoSDK from '@actbase/react-kakaosdk';
// import RNConfigReader from "react-native-config-reader"

const kakaoLogin = async () => {
  try {
    await KakaoSDK.init('fcef10c79a13ca86b4404f1eccff93a9');
    const result = await KakaoSDK.login();
    return result;
  } catch (e) {
    console.log(e);
  }
};

const getProfile = async () => {
  try {
    const response = await KakaoSDK.getProfile();
    // console.log(response);
    return response;
  } catch (e) {
    console.log(e);
  }
};

export {kakaoLogin, getProfile};
