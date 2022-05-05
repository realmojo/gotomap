import React, {useState} from 'react';
import {StyleSheet, Image} from 'react-native';
import {Button, Layout, Spinner, Text} from '@ui-kitten/components';
import useStore from '../stores';
import {useQuery} from 'react-query';
import {getId} from '../api';
import {LoadingIndicator} from '../utils';

export const Login = () => {
  const [isKakaoLoading, setIsKakaoLoading] = useState(false);
  const {loginStore, userStore} = useStore();
  const doLogin = () => {
    setIsKakaoLoading(true);
    loginStore.socialKakaoLogin();
  };
  const {isLoading} = useQuery('login', getId, {
    onSuccess: data => {
      // 성공시 호출
      console.log('logon data: ', data);
      if (data) {
        loginStore.setIslogin(true);
        loginStore.socialKakaoLogin();
        userStore.setId(data);
      }
    },
  });
  if (isLoading) {
    return (
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Spinner status="warning" />
      </Layout>
    );
  }
  return (
    <Layout style={{flex: 1, justifyContent: 'center'}}>
      <Image
        style={styles.image}
        source={require('../assets/images/logo.png')}
      />
      <Button
        style={styles.button}
        onPress={() => doLogin()}
        appearance="ghost"
        status="basic"
        accessoryRight={isKakaoLoading ? LoadingIndicator : ''}>
        <Text style={styles.buttonText} category="h3">
          카카오로 로그인
        </Text>
      </Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    margin: 40,
    backgroundColor: '#fae100',
    borderColor: '#fae100',
  },
  buttonText: {
    color: 'black',
  },
});
