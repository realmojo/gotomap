import React, {useState, useCallback, useRef, useEffect} from 'react';
import NaverMapView, {Marker} from 'react-native-nmap';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  ToastAndroid,
} from 'react-native';
import {
  List,
  Input,
  Layout,
  Divider,
  Spinner,
  ListItem,
} from '@ui-kitten/components';
import {debounce} from 'lodash';
import {getMapDetailInfo, getSearchPlaces, getPlaces} from '../api';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import {useQueryClient, useQuery} from 'react-query';
import {PLACE_STATUS, QUERY_KEY} from '../config/constants';
import {MapDetail, PlaceDetail, Admob} from '../components';

export const Map = ({navigation}) => {
  const queryClient = useQueryClient();
  const bottomSheet = useRef();
  const bottomSheetDetail = useRef();
  const [value, setValue] = useState('');
  const [id, setId] = useState(0);
  const [searchItem, setSearchItem] = useState({});
  const [placeItem, setPlaceItem] = useState({});
  const [places, setPlaces] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [coordinate, setCoordinate] = useState({
    latitude: 37.5632555012193,
    longitude: 126.97601589994,
  });

  const {data} = useQuery(QUERY_KEY.ALL, () => getPlaces(), {
    onSuccess: () => {
      console.log(`${QUERY_KEY.ALL} reload`);
      setId(0);
    },
    onError: () => {
      console.log(`${QUERY_KEY.ALL} failed`);
    },
  });

  useEffect(() => {
    const newData = navigation.addListener('tabLongPress', () => {
      queryClient.invalidateQueries(QUERY_KEY.ALL);
      ToastAndroid.show('데이터를 새로 가져옵니다.', ToastAndroid.SHORT);
    });

    return newData;
  }, [navigation]);

  const doClose = () => {
    setValue('');
    setPlaces([]);
  };

  const placeClick = async (id, latitude, longitude) => {
    setId(id);
    bottomSheet.current.show();

    setCoordinate({
      latitude: Number(latitude),
      longitude: Number(longitude),
    });
    setPlaces([]);
    const placeItem = await getMapDetailInfo(id);
    setSearchItem(placeItem);
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

  const doSearch = useCallback(
    debounce(async value => {
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
    bottomSheet.current.show();
  };

  const doPlaceDetail = item => {
    setPlaceItem(item);
    bottomSheetDetail.current.show();
  };

  return (
    <Layout style={{flex: 1, flexDirection: 'column'}} level="1">
      <Layout style={styles.layout} level="1">
        <Input
          style={styles.searchInput}
          placeholder="가보고 싶었던 곳을 검색하세요"
          value={value}
          status="warning"
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
        {places.length > 0 && (
          <>
            <List
              keyboardShouldPersistTaps="always"
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
              pinColor="green"
              onClick={() => doMapDetail()}
            />
          ) : null}
          {data !== undefined &&
            data.length > 0 &&
            data.map((item, index) => (
              <Marker
                key={index}
                caption={{
                  text: item.title,
                  color: '#ffaa00',
                  haloColor: '#000',
                  textSize: 12,
                }}
                coordinate={{
                  longitude: item.longitude,
                  latitude: item.latitude,
                }}
                pinColor={item.status === PLACE_STATUS.BACKLOG ? 'red' : 'blue'}
                onClick={() => {
                  doPlaceDetail(item);
                }}
              />
            ))}
        </NaverMapView>
        <Admob />
      </View>
      <Admob />
      <BottomSheet
        hasDraggableIcon
        ref={bottomSheet}
        onRequestClose={() => bottomSheet.current.close()}
        height={600}>
        <MapDetail searchItem={searchItem} />
      </BottomSheet>
      <BottomSheet
        hasDraggableIcon
        ref={bottomSheetDetail}
        onRequestClose={() => bottomSheetDetail.current.close()}
        height={600}>
        <PlaceDetail
          placeItem={placeItem}
          queryKey={
            placeItem.status === 'done' ? QUERY_KEY.DONE : QUERY_KEY.BACKLOG
          }
          setPlaceItem={setPlaceItem}
        />
      </BottomSheet>
    </Layout>
  );
};

const styles = StyleSheet.create({
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
});
