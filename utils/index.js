import React from 'react';
import {Text} from '@ui-kitten/components';

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

const isEmpty = value => {
  return value !== undefined && value !== null && value !== '';
};
const isEmptyArray = value => {
  return (
    value !== 0 && value !== undefined && value !== null && value.length !== 0
  );
};

const Category = ({value}) => {
  if (isEmpty(value)) {
    return (
      <Text
        style={{
          fontSize: 12,
          color: '#aaa',
        }}>
        {value}
      </Text>
    );
  } else {
    return <Text></Text>;
  }
};

const Title = ({value}) => {
  if (isEmpty(value)) {
    return <Text category="h4">{value}</Text>;
  } else {
    return <Text></Text>;
  }
};

export {getSidoAndSigungu, isEmpty, isEmptyArray, Category, Title};
