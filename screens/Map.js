import React, {useState, useCallback} from 'react';
import NaverMapView, {Marker} from 'react-native-nmap';
import {
  View,
  Text,
  FlatList,
  Animated,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import useStore from '../stores';
import moment from 'moment';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  List,
  Icon,
  Input,
  Avatar,
  Layout,
  Button,
  Divider,
  Spinner,
  ListItem,
} from '@ui-kitten/components';
import {PLACE_STATUS} from '../config/constants';
import {debounce} from 'lodash';
import {getMapDetailInfo, getSearchPlaces, addPlace} from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Category,
  Title,
  isEmpty,
  isEmptyArray,
  optionText,
  getSidoAndSigungu,
} from '../utils';
import {PlaceModalDetailText} from '../components';

const removeIcon = props => <Icon {...props} name="close-outline" />;
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

export const Map = ({navigation}) => {
  const {loginStore} = useStore();
  const [value, setValue] = useState('');
  const [id, setId] = useState(0);
  const [isGo, setIsGo] = useState(false);
  const [searchItem, setSearchItem] = useState({});
  const [places, setPlaces] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [historyWord, setHistoryWord] = useState([]);
  // const [isFocus, setIsFocus] = useState(false);
  const [coordinate, setCoordinate] = useState({
    latitude: 37.5632555012193,
    longitude: 126.97601589994,
  });

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
    } = searchItem;
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

  // Toast 메세지 출력
  const showToast = () => {
    Toast.show({
      text1: '등록완료',
      text2: '언젠간 꼭 가보기로 해요! 일정에서 확인해보세요 👏',
      position: 'bottom',
      bottomOffset: 0,
    });
  };

  // const doFocus = async () => {
  //   const words = await getHistoryWords();
  //   setHistoryWord(words);
  //   setIsFocus(true);
  // };

  const doClose = () => {
    setValue('');
    // setIsFocus(false);
    setPlaces([]);
  };

  // const removeWord = async id => {
  //   const words = await getHistoryWords();
  //   const filterWords = words.filter(item => item.id !== id);
  //   AsyncStorage.setItem('words', JSON.stringify(filterWords));
  //   setHistoryWord(filterWords);
  // };

  // AsyncStorage.removeItem('words');

  // const wordRenderItem = item => {
  //   const {id, title, latitude, longitude} = item.item;
  //   if (id) {
  //     return (
  //       <ListItem
  //         style={{height: 40}}
  //         title={title}
  //         onPress={() => placeClick(id, latitude, longitude, title, true)}
  //         accessoryRight={() => (
  //           <Button
  //             status="basic"
  //             size="small"
  //             appearance="ghost"
  //             onPress={() => removeWord(id)}
  //             accessoryLeft={removeIcon}
  //           />
  //         )}
  //       />
  //     );
  //   }
  // };

  const placeClick = async (id, latitude, longitude, title) => {
    setId(id);
    setCoordinate({
      latitude: Number(latitude),
      longitude: Number(longitude),
    });
    setPlaces([]);
    const placeItem = await getMapDetailInfo(id);
    setSearchItem(placeItem);
    // if (!isWordClick) {
    //   const words = await getHistoryWords();
    //   words.push({
    //     id,
    //     title,
    //     longitude,
    //     latitude,
    //   });
    //   AsyncStorage.setItem('words', JSON.stringify(words));
    // }
    doClose();
  };

  const renderItem = ({item}) => {
    if (item.place !== null) {
      const {title, roadAddress, id, x: longitude, y: latitude} = item.place;
      return (
        <ListItem
          title={title}
          description={roadAddress}
          onPress={() => placeClick(id, latitude, longitude, title)}
        />
      );
    }
  };

  const getHistoryWords = async () => {
    const words = await AsyncStorage.getItem('words');
    return words ? JSON.parse(words) : [];
  };

  const doSearch = useCallback(
    debounce(async value => {
      setHistoryWord([]);
      setIsSearch(true);
      if (value === '') {
        setPlaces([]);
        setIsSearch(false);
        return;
      }
      const {all: items} = await getSearchPlaces(value);

      setPlaces(items);
      setIsSearch(false);
    }, 300),
    [],
  );

  const onDebounceChange = text => {
    setValue(text);
    doSearch(text);
  };

  const doMapDetail = () => {
    navigation.push('mapDetail', {id});
  };

  return (
    <Layout style={{flex: 1, flexDirection: 'column'}} level="1">
      <Layout style={styles.layout} level="4">
        <Input
          style={styles.searchInput}
          placeholder="가고 싶었던 곳을 검색하세요"
          value={value}
          status="warning"
          // onFocus={() => doFocus()}
          onChangeText={text => onDebounceChange(text)}
          size="large"
          accessoryRight={() =>
            isSearch && (
              <TouchableWithoutFeedback style={{margin: 20}}>
                <Spinner size="tiny" status="warning" />
              </TouchableWithoutFeedback>
            )
          }
        />
        {/* {isFocus && historyWord.length > 0 && (
          <>
            <FlatList
              style={styles.container}
              data={historyWord}
              ItemSeparatorComponent={Divider}
              renderItem={wordRenderItem}
              keyExtractor={(item, index) => index.toString()}
            />
            <Text
              style={{padding: 4, color: 'black'}}
              onPress={() => doClose()}>
              닫기
            </Text>
          </>
        )} */}
        {places.length > 0 && (
          <>
            <List
              style={styles.container}
              data={places}
              ItemSeparatorComponent={Divider}
              renderItem={renderItem}
            />
            <Text
              style={{padding: 4, color: 'black'}}
              onPress={() => doClose()}>
              닫기
            </Text>
          </>
        )}
      </Layout>
      <View style={{flex: 1}}>
        <NaverMapView style={styles.maps} center={{...coordinate, zoom: 14}}>
          {id !== 0 ? (
            <Marker
              coordinate={coordinate}
              pinColor="blue"
              onClick={() => doMapDetail()}
            />
          ) : null}
        </NaverMapView>
      </View>
      {id !== 0 && (
        <View style={styles.contentBody}>
          <ScrollView>
            <Layout level="4">
              <ListItem
                title={() => <Category value={searchItem.category} />}
                description={() => <Title value={searchItem.name} />}
                accessoryRight={() => (
                  <Avatar
                    source={
                      searchItem.imageURL
                        ? {uri: searchItem.imageURL}
                        : require('../assets/images/logo.png')
                    }
                  />
                )}
              />
              {isEmpty(searchItem.phone) && (
                <PlaceModalDetailText
                  iconName="phone"
                  category="연락처"
                  title={searchItem.phone}
                />
              )}
              {isEmpty(searchItem.fullRoadAddress) && (
                <PlaceModalDetailText
                  iconName="map-marker"
                  category="도로명주소"
                  title={searchItem.fullRoadAddress}
                />
              )}
              {isEmptyArray(searchItem.options) && (
                <PlaceModalDetailText
                  iconName="cube"
                  category="옵션"
                  title={optionText(searchItem.options)}
                />
              )}
              {isEmptyArray(searchItem.keywords) && (
                <PlaceModalDetailText
                  iconName="key"
                  category="키워드"
                  title={searchItem.keywords.join('/')}
                />
              )}
              {isEmpty(searchItem.bizhourInfo) && (
                <PlaceModalDetailText
                  iconName="clock-time-nine-outline"
                  category="영업시간"
                  title={searchItem.bizhourInfo}
                />
              )}
              {isEmpty(searchItem.description) && (
                <PlaceModalDetailText
                  iconName="note-outline"
                  category="설명"
                  title={searchItem.description}
                />
              )}
            </Layout>
          </ScrollView>
          <Layout style={styles.buttonContainer} level="1">
            <Button
              style={styles.button}
              status="warning"
              appearance="outline"
              size="large"
              onPress={() => setId(0)}>
              <Text style={styles.goText}>닫기</Text>
            </Button>
            <Button
              style={styles.button}
              status="warning"
              size="large"
              onPress={() => doGo()}>
              <Text style={styles.goText}>등록 </Text>
              {isGo ? <MaterialCommunityIcons name="check" size={16} /> : ''}
            </Button>
          </Layout>
          <Toast config={toastConfig} />
        </View>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    flex: 1,
    marginHorizontal: 2,
  },
  maps: {
    width: '100%',
    height: '100%',
  },
  container: {
    maxHeight: Dimensions.get('screen').height / 2 - 150,
    opacity: 1,
  },
  searchInput: {
    padding: 6,
    backgroundColor: 'white',
  },
  contentBody: {
    flex: 1,
    padding: 10,
  },
  imageWrap: {
    width: Dimensions.get('screen').width,
    height: 250,
  },
  image: {
    width: '100%',
    minHeight: 250,
  },
  goText: {
    color: 'white',
  },
});
