import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  ScrollView,
  Linking,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {Text, Divider, Icon, Button} from '@ui-kitten/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const {width: viewportWidth} = Dimensions.get('window');

import {getMapDetailInfo} from '../api';

const wp = percentage => {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
};
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;
const iconColor = '#dadbdd';
const iconSize = 18;

export const MapDetail = ({route: {params}}) => {
  const {id} = params;
  const [item, setItem] = useState({});
  const [isGo, setIsGo] = useState(false);

  const doGo = () => {
    setIsGo(!isGo);
  };

  const bizInfoText = (item, number) => {
    const bizInfo = item[number];
    if (bizInfo) {
      return `${bizInfo.isDayOff ? '영업 중' : '영업 종료'}: ${bizInfo.type} ${
        bizInfo.startTime
      }~${bizInfo.endTime} ${bizInfo.description}`;
    }
    return '앗! 영업시간 정보가 없네요';
  };

  const optionText = items => {
    if (isItem(items)) {
      const t = [];
      for (const item of items) {
        t.push(item.name);
      }
      return t.join('/');
    }
    return '앗! 옵션 정보가 없네요';
  };

  const isItem = value => {
    return value !== undefined && value !== null;
  };

  const _renderItem = ({item}) => {
    const {url} = item;
    return (
      <View>
        <Image
          style={styles.image}
          source={{
            uri: url,
          }}
        />
      </View>
    );
  };

  useEffect(() => {
    async function fetchData() {
      const data = await getMapDetailInfo(id);
      setItem(data);
    }
    fetchData();
  }, []);
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <View style={styles.container}>
          {item.imageURL && (
            <Carousel
              layout={'stack'}
              layoutCardOffset={'18'}
              data={item.images}
              renderItem={_renderItem}
              sliderWidth={sliderWidth}
              itemWidth={itemWidth}
            />
          )}
          {item.categories !== undefined && item.categories.length === 2 && (
            <Text style={styles.category}>{item.categories[1]}</Text>
          )}
          <Text category="h1" style={styles.title}>
            {item.name}
          </Text>
          {isItem(item.phone) && (
            <View style={styles.textWrap}>
              <MaterialCommunityIcons
                style={styles.icon}
                name="phone"
                color={iconColor}
                size={iconSize}
              />

              {item.phone ? (
                <Text onPress={() => Linking.openURL(`tel:${item.phone}`)}>
                  {item.phone}
                </Text>
              ) : (
                <Text>앗! 전화번호가 없어요</Text>
              )}
            </View>
          )}
          {isItem(item.fullRoadAddress) && (
            <View style={styles.textWrap}>
              <MaterialCommunityIcons
                style={styles.icon}
                name="map-marker"
                color={iconColor}
                size={iconSize}
              />
              <Text style={styles.text}>{item.fullRoadAddress}</Text>
            </View>
          )}
          {isItem(item.options) && item.options.length > 0 && (
            <View style={styles.textWrap}>
              <MaterialCommunityIcons
                style={styles.icon}
                name="cube"
                color={iconColor}
                size={iconSize}
              />
              <Text style={styles.text}>{optionText(item.options)}</Text>
            </View>
          )}
          {item.keywords !== undefined && item.keywords.length > 0 && (
            <View style={styles.textWrap}>
              <MaterialCommunityIcons
                style={styles.icon}
                name="key"
                color={iconColor}
                size={iconSize}
              />
              <Text style={styles.text}>{item.keywords.join('/')}</Text>
            </View>
          )}
          {isItem(item.bizHour) && (
            <View style={styles.textWrap}>
              <MaterialCommunityIcons
                style={styles.icon}
                name="clock-time-eight-outline"
                color={iconColor}
                size={iconSize}
              />
              <Text style={styles.text}>{bizInfoText(item.bizHour, 0)}</Text>
            </View>
          )}
          {isItem(item.bizHour) && (
            <View style={styles.textWrap}>
              <MaterialCommunityIcons
                style={styles.icon}
                name="clock-time-eight-outline"
                color={iconColor}
                size={iconSize}
              />
              <Text style={styles.text}>{bizInfoText(item.bizHour, 1)}</Text>
            </View>
          )}

          {isItem(item.description) && (
            <View style={styles.textWrap}>
              <MaterialCommunityIcons
                style={styles.icon}
                name="note-outline"
                color={iconColor}
                size={iconSize}
              />
              <Text numberOfLines={20} style={styles.text}>
                {item.description !== ''
                  ? item.description
                  : '앗! 설명이 없네요'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View>
        <Button
          style={styles.button}
          status="warning"
          size="large"
          onPress={() => doGo()}>
          <Text style={styles.goText}>가봐야지 </Text>
          <MaterialCommunityIcons
            name={isGo ? 'check-circle' : 'check'}
            size={16}
          />
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  divider: {
    backgroundColor: '#dadbdd',
  },
  image: {
    width: '100%',
    minHeight: 250,
    margin: 10,
    borderRadius: 10,
  },
  category: {
    color: '#8f8f8f',
  },
  title: {
    color: 'black',
  },
  textWrap: {
    flexDirection: 'row',
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dadbdd',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    paddingRight: 20,
    color: 'black',
  },
  goText: {
    color: 'white',
  },
});
