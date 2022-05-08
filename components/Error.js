import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Text} from '@ui-kitten/components';

const Error = () => (
  <View style={styles.container}>
    <Image
      style={styles.image}
      source={require('../assets/images/error.png')}
    />
    <Text category="h6">인터넷 연결상태를 확인해주세요</Text>
  </View>
);

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export {Error};
