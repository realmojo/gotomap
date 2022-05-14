import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Image, Dimensions, ScrollView} from 'react-native';
import {Carousel, PlaceModalDetailText} from '../components';
import {Text, Button, Layout, ListItem} from '@ui-kitten/components';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getMapDetailInfo, addPlace} from '../api';
import moment from 'moment';
import useStore from '../stores';
import {PLACE_STATUS} from '../config/constants';
import {LoadingIndicator} from '../components';
import {
  getSidoAndSigungu,
  isEmpty,
  isEmptyArray,
  Category,
  Title,
  optionText,
} from '../utils';

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
      bizhourInfo,
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
      bizhourInfo: bizhourInfo ? bizhourInfo : '',
      status: PLACE_STATUS.BACKLOG,
      memo: '',
      sido,
      sigungu,
      regdate: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    try {
      const res = await addPlace(params);
      if (res) {
        setIsGo(!isGo);
      }
    } catch (e) {
      console.log(e);
    }
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
      {!item.name ? (
        <LoadingIndicator />
      ) : (
        <>
          <ScrollView>
            <Layout style={styles.container} level="1">
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
              <ListItem
                title={() => <Category value={item.category} />}
                description={() => <Title value={item.name} />}
              />
              {isEmpty(item.phone) && (
                <PlaceModalDetailText
                  iconName="phone"
                  category="연락처"
                  title={item.phone}
                />
              )}
              {isEmpty(item.fullRoadAddress) && (
                <PlaceModalDetailText
                  iconName="map-marker"
                  category="도로명주소"
                  title={item.fullRoadAddress}
                />
              )}

              {isEmptyArray(item.options) && (
                <PlaceModalDetailText
                  iconName="cube"
                  category="옵션"
                  title={optionText(item.options)}
                />
              )}
              {isEmptyArray(item.keywords) && (
                <PlaceModalDetailText
                  iconName="key"
                  category="키워드"
                  title={item.keywords.join('/')}
                />
              )}
              {isEmpty(item.bizhourInfo) && (
                <PlaceModalDetailText
                  iconName="clock-time-nine-outline"
                  category="영업시간"
                  title={item.bizhourInfo}
                />
              )}
              {isEmpty(item.description) && (
                <PlaceModalDetailText
                  iconName="note-outline"
                  category="설명"
                  title={item.description}
                />
              )}
            </Layout>
          </ScrollView>
          <Toast config={toastConfig} />
          <View>
            <Button status="warning" size="large" onPress={() => doGo()}>
              <Text style={styles.goText}>등록 </Text>
              {isGo ? <MaterialCommunityIcons name="check" size={16} /> : ''}
            </Button>
          </View>
        </>
      )}
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
  title: {
    // color: 'black',
  },
  goText: {
    color: 'white',
  },
});
