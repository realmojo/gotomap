import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Spinner} from '@ui-kitten/components';

const getSidoAndSigungu = (fullAddress, addressAbbr) => {
  const address = fullAddress.replace(addressAbbr, '');
  const splitAddress = address.split(' ');

  const sido = splitAddress[0];
  const sigungu = splitAddress[2]
    ? `${splitAddress[1]} ${splitAddress[2]}`
    : splitAddress[1];

  return {
    sido,
    sigungu,
  };
};

const LoadingIndicator = () => (
  <View style={styles.indicator}>
    <Spinner size="small" status="control" />
  </View>
);

const styles = StyleSheet.create({
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export {LoadingIndicator, getSidoAndSigungu};
