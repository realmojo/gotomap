import React, {useState, useCallback, useRef} from 'react';
import NaverMapView, {Marker} from 'react-native-nmap';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
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
import {getMapDetailInfo, getSearchPlaces} from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import {MapDetail} from './MapDetail';

export const Map = () => {
  const bottomSheet = useRef();
  const [value, setValue] = useState('');
  const [id, setId] = useState(0);
  const [searchItem, setSearchItem] = useState({});
  const [places, setPlaces] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [historyWord, setHistoryWord] = useState([]);
  // const [isFocus, setIsFocus] = useState(false);
  const [coordinate, setCoordinate] = useState({
    latitude: 37.5632555012193,
    longitude: 126.97601589994,
  });

  const doClose = () => {
    setValue('');
    // setIsFocus(false);
    setPlaces([]);
  };

  // const doFocus = async () => {
  //   const words = await getHistoryWords();
  //   setHistoryWord(words);
  //   setIsFocus(true);
  // };

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

  // const getHistoryWords = async () => {
  //   const words = await AsyncStorage.getItem('words');
  //   return words ? JSON.parse(words) : [];
  // };

  const placeClick = async (id, latitude, longitude, title) => {
    setId(id);
    bottomSheet.current.show();

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
    bottomSheet.current.show();
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
      <BottomSheet hasDraggableIcon ref={bottomSheet} height={600}>
        <MapDetail searchItem={searchItem} />
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
