import React from 'react';
import {Linking} from 'react-native';
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
export const PlaceModalDetailText = ({iconName, category, title}) => {
  return (
    <ListItem
      // onPress={() => doUpdatePlaceMemo(title)}
      title={() => (
        <Text style={{fontSize: 12, marginLeft: 10, color: '#aaa'}}>
          {category}
        </Text>
      )}
      description={() =>
        iconName === 'phone' ? (
          <PhontText title={title} />
        ) : (
          <Text style={{fontSize: 13, marginLeft: 10}}>{title}</Text>
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
