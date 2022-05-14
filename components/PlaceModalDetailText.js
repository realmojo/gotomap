import React from 'react';
import {StyleSheet, Linking} from 'react-native';
import {ListItem, Text} from '@ui-kitten/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const iconColor = '#dadbdd';
const iconSize = 18;
const PhontText = ({title}) => (
  <Text
    style={{
      color: '#FFAA00',
      textDecorationLine: 'underline',
      fontSize: 13,
      marginLeft: 10,
    }}
    onPress={() => Linking.openURL(`tel:${title}`)}>
    {title}
  </Text>
);

export const PlaceModalDetailText = ({iconName, category, title, doPress}) => {
  return (
    <ListItem
      onPress={doPress ? doPress : null}
      title={() => (
        <Text style={{fontSize: 12, marginLeft: 10, color: '#aaa'}}>
          {category}
        </Text>
      )}
      description={() =>
        iconName === 'phone' ? (
          <PhontText title={title} />
        ) : (
          <Text style={[styles.text, title === '' ? styles.color : '']}>
            {title ? title : '간단한 메모를 작성하세요.'}
          </Text>
        )
      }
      accessoryLeft={() => (
        <MaterialCommunityIcons
          name={iconName}
          color={iconColor}
          size={iconSize}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    marginLeft: 10,
  },
  color: {
    color: '#ddd',
  },
});
