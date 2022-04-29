import React from 'react';
import {StyleSheet, Image, View} from 'react-native';
import {Button, ButtonGroup, Input} from '@ui-kitten/components';
import {Card, List, Text} from '@ui-kitten/components';
import {item} from '../mock/item';
import axios from 'axios';

// const data = new Array(8).fill({
//   title: '그믐족발',
// });

const getTestData = () => {
  return new Promise(resolve => {
    axios
      .get('https://map.naver.com/v5/api/sites/summary/1496912473?lang=ko')
      .then(res => {
        resolve(res.data);
      });
  });
};

const data = item;
export const Home = ({navigation}) => {
  console.log(navigation);
  const doClick = async () => {
    const data = await getTestData();
    console.log(data);
  };
  const renderItemHeader = (headerProps, name) => (
    <View {...headerProps}>
      <Text category="h6">{name}</Text>
    </View>
  );

  const renderItemFooter = footerProps => (
    <Text {...footerProps}>By Wikipedia</Text>
  );

  const doStack = () => {
    navigation.navigate('detail');
  };

  const renderItem = info => {
    const {name, category, fullAddress, imageURL} = info.item;
    return (
      <Card
        style={styles.item}
        status="basic"
        header={headerProps => renderItemHeader(headerProps, name)}
        onPress={() => doStack()}
        // footer={renderItemFooter}
      >
        <View style={{flexDirection: 'row'}}>
          <Image
            style={styles.image}
            source={{
              uri: imageURL,
            }}
          />
          <View style={{paddingLeft: 10, paddingRight: 10, color: 'tomato'}}>
            <Text
              style={{
                letterSpacing: -0.8,
                fontSize: 14,
                color: 'tomato',
              }}>
              {category}
            </Text>
            <Text
              style={{
                letterSpacing: -1,
                fontSize: 14,
              }}>
              {fullAddress}
            </Text>
          </View>
          {/* <Text>123</Text>
          <Text>123</Text>
          <Text>123</Text> */}
        </View>
        {/* <Button onPress={() => doClick()}>Click</Button> */}
      </Card>
    );
  };

  return (
    <View style={{backgroundColor: 'white'}}>
      {/* <Input
        style={styles.searchInput}
        placeholder="Place your Text"
        value={value}
        onChangeText={nextValue => setValue(nextValue)}
        size="large"
      /> */}
      {/* <ButtonGroup
        style={styles.buttonGroup}
        appearance="outline"
        status="warning">
        <Button>L</Button>
        <Button>R</Button>
      </ButtonGroup> */}
      <List
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        data={data}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: '100%',
  },
  image: {
    width: 80,
    height: 80,
  },
  buttonGroup: {
    margin: 2,
  },
  contentContainer: {
    // paddingHorizontal: 8,
    // paddingVertical: 4,
  },
  item: {
    padding: 0,
    marginVertical: 4,
  },
  searchInput: {
    margin: 4,
  },
});
