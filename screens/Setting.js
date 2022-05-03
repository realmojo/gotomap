import React, {useState, useEffect, useLayoutEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Avatar, Layout, Text, ListItem, Button} from '@ui-kitten/components';
import useStore from '../stores';
import {observer} from 'mobx-react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const removeId = async () => {
  await AsyncStorage.removeItem('id');
};

export const Setting = observer(() => {
  const {login} = useStore();
  const {name, profileImage} = login.userInfo;
  const [id, setId] = useState('');
  const doLogout = async () => {
    await removeId();
    login.setIslogin(false);
  };
  const getId = async () => {
    const id = await AsyncStorage.getItem('id');
    setId(id);
  };
  return (
    <Layout style={{flex: 1}}>
      <ListItem
        title={() => <Text category="h3">{name}</Text>}
        // description="A set of React Native components"
        accessoryLeft={() => (
          <Avatar
            style={styles.avatar}
            source={{
              uri: profileImage ? profileImage : '',
            }}
          />
        )}
      />
      <Text>{login.number}</Text>
      <Button onPress={() => doLogout()}>Logout</Button>
      <Button onPress={() => getId()}>ID 가져오기</Button>
      <Text>{id}</Text>
    </Layout>
  );
});

const styles = StyleSheet.create({
  avatar: {
    margin: 8,
    width: 100,
    height: 100,
  },
});
