import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from '@ui-kitten/components';
import {QUERY_KEY} from '../config/constants';

const Nothing = ({navigation, queryKey}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {queryKey === QUERY_KEY.BACKLOG ? '가보고싶은' : '가봤던'} 곳을
        등록해보세요
      </Text>
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
