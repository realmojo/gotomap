import React, {useState, useEffect, useLayoutEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Avatar, Layout, Text, ListItem, Button} from '@ui-kitten/components';
import useStore from '../stores';
import {observer} from 'mobx-react';

export const Setting = observer(() => {
  const {login} = useStore();
  const {nickname, profile_image} = login.userInfo.properties;
  const doLogout = () => {
    login.setIslogin(false);
  };
  return (
    <Layout style={{flex: 1}}>
      <ListItem
        title={() => <Text category="h3">{nickname}</Text>}
        // description="A set of React Native components"
        accessoryLeft={() => (
          <Avatar
            style={styles.avatar}
            source={{
              uri: profile_image ? profile_image : '',
            }}
          />
        )}
      />
      <Text>{login.number}</Text>
      <Button onPress={() => doLogout()}>Logout</Button>
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
