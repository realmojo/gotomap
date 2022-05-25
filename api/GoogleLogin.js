// import {
//   GoogleSignin,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';

// const getGoogleSignin = () => {
//   return GoogleSignin;
// };

// const googleSigninConfigure = () => {
//   GoogleSignin.configure({
//     webClientId:
//       '350541454372-u3u3mcbeeb5ack92ea241qo7pa1bceg0.apps.googleusercontent.com',
//   });
// };

// const googleLogin = async () => {
//   try {
//     const {
//       user: {familyName, givenName, id, photo},
//     } = await GoogleSignin.signIn();
//     return {
//       id,
//       name: `${familyName}${givenName}`,
//       profileImage: photo,
//     };
//   } catch (error) {
//     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//       // user cancelled the login flow
//       alert('err1: ', statusCodes.SIGN_IN_CANCELLED);
//     } else if (error.code === statusCodes.IN_PROGRESS) {
//       // operation (e.g. sign in) is in progress already
//       alert('err2: ', statusCodes.IN_PROGRESS);
//     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//       // play services not available or outdated
//       alert('err3: ', statusCodes.PLAY_SERVICES_NOT_AVAILABLE);
//     } else {
//       alert('err4: ', error);
//       // some other error happened
//     }
//   }
// };

// export {googleLogin, getGoogleSignin, googleSigninConfigure};
