import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from '@ui-kitten/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const iconColor = '#dadbdd';
const iconSize = 18;

const TextDetail = ({iconName, text, doPress}) => {
  return (
    <TouchableOpacity style={styles.textWrap} onPress={doPress}>
      <MaterialCommunityIcons
        style={styles.icon}
        name={iconName}
        color={iconColor}
        size={iconSize}
      />
      <Text style={[styles.text, text === '' ? styles.color : '']}>
        {text ? text : '간단한 메모를 작성하세요'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textWrap: {
    flexDirection: 'row',
    paddingBottom: 10,
    paddingTop: 10,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontSize: 13,
  },
  color: {
    color: '#ddd',
  },
});

export {TextDetail};
