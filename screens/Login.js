import React, {useState, useCallback, useRef} from 'react';
import {StyleSheet, Image, View} from 'react-native';
import {Button, Input, Layout, Text, Spinner} from '@ui-kitten/components';
import useStore from '../stores';
import {useQuery} from 'react-query';
import {addUser, getId, getName} from '../api';
import {getUniqueId} from 'react-native-device-info';
import {LoadingIndicator} from '../components';

const LoadingIcon = () => (
  <View>
    <Spinner status="control" size="small" />
  </View>
);

export const Login = () => {
  const inputRef = useRef();
  const {loginStore, userStore} = useStore();
  const [value, setValue] = useState('');
  const [isStartLoading, setIsStartLoading] = useState(false);
  const doLogin = useCallback(async () => {
    const uniqueId = await getUniqueId();

    if (value === '') {
      inputRef.current.focus();
      return;
    }

    setIsStartLoading(true);
    const params = {
      id: uniqueId,
      name: value,
    };
    const res = await addUser(params);

    if (res && res.id) {
      setIsStartLoading(false);
      userStore.setName(res.name);
      userStore.setId(res.id);
      loginStore.setIslogin(true);
    }
  }, [value]);
  const {isLoading} = useQuery('login', getId, {
    // 성공시 호출
    onSuccess: async data => {
      console.log('logon data: ', data);
      if (data) {
        const userName = await getName();
        userStore.setName(userName);
        userStore.setId(data);
        loginStore.setIslogin(true);
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
          가봐야지도에 오신 것을 환영합니다. 사용하실 닉네임을 간단하게
          적어주세요.
        </Text>
      </View>
      <View style={styles.buttonWrap}>
        <Input
          style={styles.input}
          ref={inputRef}
          size="large"
          placeholder="닉네임을 입력해주세요"
          value={value}
          status="warning"
          onChangeText={setValue}
        />
        <Button
          style={styles.button}
          loading
          size="large"
          status="warning"
          accessoryRight={isStartLoading ? LoadingIcon : null}
          onPress={() => doLogin()}
        >
          시작하기
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
    width: 200,
    textAlign: 'center',
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
    marginTop: 20,
    width: 200,
    justifyContent: 'flex-start',
  },
  googleButton: {
    borderColor: '#e1494d',
    backgroundColor: '#e1494d',
  },
  button: {
    marginTop: 20,
  },
});
