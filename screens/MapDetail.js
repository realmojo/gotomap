import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  ScrollView,
  Linking,
} from 'react-native';
import {Carousel} from '../components';

import {Text, Button, Layout} from '@ui-kitten/components';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getMapDetailInfo, addPlace} from '../api';
import moment from 'moment';
import useStore from '../stores';
import {PLACE_STATUS} from '../config/constants';
import {getSidoAndSigungu} from '../utils';

const iconColor = '#dadbdd';
const iconSize = 18;
const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'orange'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 24,
        fontWeight: '800',
      }}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  tomatoToast: ({text1, props}) => (
    <View style={{height: 60, width: '100%', backgroundColor: 'tomato'}}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};

export const MapDetail = ({route: {params}}) => {
  const {loginStore} = useStore();
  const {id} = params;
  const [item, setItem] = useState({});
  const [page, setPage] = useState(0);
  const [isGo, setIsGo] = useState(false);

  const doGo = async () => {
    showToast();
    const {
      id: placeId,
      name: title,
      y: latitude,
      x: longitude,
      imageURL,
      phone,
      category,
      fullAddress,
      addressAbbr,
      fullRoadAddress,
      description,
      options,
      keywords,
      bizHour,
    } = item;
    const {id: userId} = loginStore.userInfo;
    const {sido, sigungu} = getSidoAndSigungu(fullAddress, addressAbbr);
    const params = {
      placeId,
      userId,
      latitude, // 위도
      longitude, // 경도
      title,
      description,
      fullAddress,
      fullRoadAddress,
      imageURL,
      category,
      phone,
      options: optionText(options),
      keywords: keywords ? keywords.join('/') : '',
      openHour: bizInfoText(bizHour, 0),
      closeHour: bizInfoText(bizHour, 1),
      status: PLACE_STATUS.BACKLOG,
      memo: '',
      sido,
      sigungu,
      regdate: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    console.log(params);

    try {
      const res = await addPlace(params);
      if (res) {
        setIsGo(!isGo);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const bizInfoText = (item, number) => {
    if (item !== null) {
      const bizInfo = item[number];
      if (bizInfo) {
        return `${bizInfo.isDayOff ? '영업 중' : '영업 종료'}: ${
          bizInfo.type
        } ${bizInfo.startTime}~${bizInfo.endTime} ${bizInfo.description}`;
      }
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

  useEffect(() => {
    async function fetchData() {
      const data = await getMapDetailInfo(id);
      setItem(data);
    }
    fetchData();
  }, []);

  const _renderItem = ({item}) => (
    <View style={styles.imageWrap}>
      <Image
        style={styles.image}
        source={{
          uri: item.url,
        }}
      />
    </View>
  );
  // Toast 메세지 출력
  const showToast = () => {
    Toast.show({
      text1: '등록완료',
      text2: '언젠간 꼭 가보기로 해요! 일정에서 확인해보세요 👏',
      position: 'bottom',
      bottomOffset: 60,
    });
  };

  return (
    <Layout style={{flex: 1}}>
      <ScrollView>
        <Layout style={styles.container} level="1">
          {/* <View> */}
          {item.imageURL && (
            <Carousel
              page={page}
              setPage={setPage}
              gap={0}
              data={item.images}
              pageWidth={Dimensions.get('screen').width}
              RenderItem={_renderItem}
            />
          )}
          {item.categories !== undefined && item.categories.length === 2 && (
            <Text style={styles.category}>{item.categories[1]}</Text>
          )}

          <Text category="h3" style={styles.title}>
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
                <Text
                  style={styles.phoneText}
                  onPress={() => Linking.openURL(`tel:${item.phone}`)}>
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
                name="clock-time-nine-outline"
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
                name="clock-time-five-outline"
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
          {/* </View> */}
        </Layout>
      </ScrollView>
      <Toast config={toastConfig} />
      <View>
        <Button
          style={styles.button}
          status="warning"
          size="large"
          onPress={() => doGo()}>
          <Text style={styles.goText}>가봐야지 </Text>
          {isGo ? <MaterialCommunityIcons name="check" size={16} /> : ''}
        </Button>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  imageWrap: {
    width: Dimensions.get('screen').width,
    height: 250,
  },
  image: {
    width: '100%',
    minHeight: 250,
  },
  category: {
    marginTop: 12,
    color: '#aaa',
  },
  title: {
    // color: 'black',
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
  },
  goText: {
    color: 'white',
  },
  phoneText: {
    color: '#FFAA00',
    textDecorationLine: 'underline',
  },
});
