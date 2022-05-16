import React, {useState} from 'react';
import {StyleSheet, Image, View} from 'react-native';
import {Button, Layout, Text} from '@ui-kitten/components';
import useStore from '../stores';
import {useQuery} from 'react-query';
import {getId} from '../api';
import {LoadingIndicator} from '../components';

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
    return <LoadingIndicator />;
  }
  return (
    <Layout style={styles.container}>
      <View style={styles.imageWrap}>
        <View style={styles.logoWrap}>
          <Image
            style={styles.image}
            source={require('../assets/images/logo.png')}
          />
        </View>
        <Text style={styles.description}>
          가보고 싶은 곳을 일정에 등록해보세요
        </Text>
      </View>
      <View style={styles.buttonWrap}>
        <Button style={styles.button} onPress={() => doLogin()} status="basic">
          {isKakaoLoading ? <LoadingIndicator /> : '카카오로 로그인'}
        </Button>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffcb66',
  },
  description: {
    marginTop: 20,
    fontSize: 12,
    color: '#97690f',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  imageWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  logoWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    margin: 40,
    backgroundColor: '#fae100',
    borderColor: '#fae100',
    width: 300,
  },
});
