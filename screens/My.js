import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Avatar,
  Layout,
  Text,
  List,
  ListItem,
  Divider,
  Button,
} from '@ui-kitten/components';
import useStore from '../stores';
import {observer} from 'mobx-react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const datda = new Array(8).fill({
  title: 'Item',
  description: 'Description for Item',
});

const removeId = async () => {
  await AsyncStorage.removeItem('id');
};

const renderItem = ({item, index}) => (
  <ListItem
    title={`${item.title} ${index + 1}`}
    description={`${item.description} ${index + 1}`}
  />
);

export const My = observer(() => {
  const {loginStore, userStore} = useStore();
  const {name, profileImage} = loginStore.userInfo;
  const doLogout = async () => {
    await removeId();
    loginStore.setIslogin(false);
  };

  // const {data} = useQuery('getPlaceCount', getPlaceCount, {
  //   onSuccess: item => {
  //     console.log(item);
  //   },
  // });

  useEffect(() => {
    userStore.getPlaceCount();
  }, []);

  return (
    <Layout style={{flex: 1}}>
      <ListItem
        title={() => <Text category="h3">{name}</Text>}
        description="A set of React Native components"
        accessoryLeft={() => (
          <Avatar
            style={styles.avatar}
            source={{
              uri: profileImage ? profileImage : '',
            }}
          />
        )}
      />
      <Layout style={styles.countContainer} level="1">
        <View style={styles.countWrap}>
          <Text style={styles.countTitle}>전체</Text>
          <Text style={styles.countText}>10</Text>
        </View>
        <View style={styles.countWrap}>
          <Text style={styles.countTitle}>가봤지</Text>
          <Text style={styles.countText}>10</Text>
        </View>
        <View style={styles.countWrap}>
          <Text style={styles.countTitle}>가봐야지</Text>
          <Text style={styles.countText}>10</Text>
        </View>
      </Layout>

      <ListItem
        title="로그아웃"
        description="계정을 로그아웃 합니다."
        onPress={() => doLogout()}
      />
      <Divider />
      {/* <List
        style={styles.container}
        data={datda}
        ItemSeparatorComponent={Divider}
        renderItem={renderItem}
      /> */}
      {/* <Button onPress={() => doLogout()}>Logout</Button> */}
    </Layout>
  );
});

const styles = StyleSheet.create({
  avatar: {
    margin: 8,
    width: 100,
    height: 100,
  },
  countContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 10,
  },
  countWrap: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#dadada',
    // width: '33.3%',
  },
  countTitle: {
    textAlign: 'center',
  },
  countText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
