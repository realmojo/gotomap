import React, {useState, useLayoutEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Layout, Spinner} from '@ui-kitten/components';
import useStore from '../stores';
import {useQuery} from 'react-query';
import {getId} from '../api';

const LoadingIndicator = () => (
  <View style={styles.indicator}>
    <Spinner size="small" status="control" />
  </View>
);

export const Login = () => {
  const [isKakaoLoading, setIsKakaoLoading] = useState(false);
  const {login} = useStore();
  const doLogin = () => {
    setIsKakaoLoading(true);
    login.socialKakaoLogin();
  };
  const {isLoading} = useQuery('login', getId, {
    onSuccess: data => {
      // 성공시 호출
      if (data) {
        console.log(data);
        login.setIslogin(true);
        login.socialKakaoLogin();
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
      <Button
        onPress={() => doLogin()}
        accessoryRight={isKakaoLoading ? LoadingIndicator : ''}>
        Login
      </Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: '#3366FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
