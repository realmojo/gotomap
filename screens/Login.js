import React from 'react';

import {Button, Layout} from '@ui-kitten/components';
import useStore from '../stores';

export const Login = () => {
  const {login} = useStore();
  const doLogin = () => {
    console.log(login.isLogin);
    login.socialKakaoLogin();
  };
  return (
    <Layout style={{flex: 1, justifyContent: 'center'}}>
      <Button onPress={() => doLogin()}>Login</Button>
    </Layout>
  );
};
