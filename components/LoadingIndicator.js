import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Spinner} from '@ui-kitten/components';

const LoadingIndicator = () => (
  <View style={styles.indicator}>
    <Spinner size="small" status="warning" />
  </View>
);

const styles = StyleSheet.create({
  indicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export {LoadingIndicator};
