import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Text} from '@ui-kitten/components';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const iconColor = '#dadbdd';
const iconSize = 18;

const TextDetail = ({iconName, text}) => {
  return (
    <View style={styles.textWrap}>
      <MaterialCommunityIcons
        style={styles.icon}
        name={iconName}
        color={iconColor}
        size={iconSize}
      />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textWrap: {
    flexDirection: 'row',
    paddingBottom: 10,
    paddingTop: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#dadbdd',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    paddingRight: 20,
    color: 'black',
  },
});

export {TextDetail};
