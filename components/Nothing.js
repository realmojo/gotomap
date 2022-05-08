import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from '@ui-kitten/components';

const Nothing = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>새로운 곳을 등록해보세요</Text>
      <Button status="warning" onPress={() => navigation.navigate('Map')}>
        등록하기
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export {Nothing};
