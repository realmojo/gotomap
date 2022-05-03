import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const PlaceList = () => {
  return (
    <View>
      <Text style={styles.text}>Place List</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    color: 'black',
  },
});
export {PlaceList};
