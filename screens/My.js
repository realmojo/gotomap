import React, {useEffect} from 'react';
import {StyleSheet, View, Linking, Image} from 'react-native';
import {Layout, Text, ListItem, Divider} from '@ui-kitten/components';
import useStore from '../stores';
import {observer} from 'mobx-react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const removeId = async () => {
  await AsyncStorage.removeItem('id');
};

export const My = observer(() => {
  const {loginStore, userStore} = useStore();
  const {name, profileImage} = loginStore.userInfo;
  const doLogout = async () => {
    await removeId();
    loginStore.setIslogin(false);
  };

  useEffect(() => {
    userStore.getPlaceCount();
  }, []);

  return (
    <Layout level="2">
      <View style={styles.container}>
        <View style={styles.logoWrap}>
          <Image
            style={styles.avatar}
            source={
              profileImage
                ? {uri: profileImage}
                : require('../assets/images/logo.png')
            }
          />
          <Text category="h3">{name}</Text>
        </View>
        <Layout style={styles.countContainer} level="1">
          <View style={styles.countWrap}>
            <Text style={styles.countTitle}>전체</Text>
            <Text style={styles.countText}>
              {userStore.countInfo.totalCount}
            </Text>
          </View>
          <View style={styles.countWrap}>
            <Text style={styles.countTitle}>가봤지</Text>
            <Text style={styles.countText}>
              {userStore.countInfo.doneCount}
            </Text>
          </View>
          <View style={styles.countWrap}>
            <Text style={styles.countTitle}>가봐야지</Text>
            <Text style={styles.countText}>
              {userStore.countInfo.backlogCount}
            </Text>
          </View>
        </Layout>
      </View>
      <Layout level="2" style={{height: '100%'}}>
        <ListItem
          style={styles.listItem}
          title="피드백을 주세요"
          onPress={() =>
            Linking.openURL(
              'https://play.google.com/store/apps/details?id=com.f5game.gotomap',
            )
          }
        />
        <Divider />
        <ListItem
          style={styles.listItem}
          title="로그아웃"
          onPress={() => doLogout()}
        />
        <Divider />
      </Layout>
    </Layout>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffcb66',
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatar: {
    borderRadius: 90,
    marginTop: 40,
    marginBottom: 20,
    width: 130,
    height: 130,
  },
  listItem: {
    paddingVertical: 20,
  },
  countContainer: {
    backgroundColor: '#ffcb66',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 10,
  },
  countWrap: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#ffb629',
    paddingVertical: 10,
  },
  countTitle: {
    textAlign: 'center',
  },
  countText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
