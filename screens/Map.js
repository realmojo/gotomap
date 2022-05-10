import React, {useState, useMemo, useCallback} from 'react';
import NaverMapView, {Marker} from 'react-native-nmap';
import {StyleSheet, View, Text} from 'react-native';
import {Layout, Input, Divider, List, ListItem} from '@ui-kitten/components';
import {debounce} from 'lodash';
import {getSearchPlaces} from '../api';

export const Map = ({navigation}) => {
  const [value, setValue] = useState('');
  const [id, setId] = useState(11718044);
  const [places, setPlaces] = useState([]);
  const [coordinate, setCoordinate] = useState({
    latitude: 37.5632555012193,
    longitude: 126.97601589994,
  });

  const doClose = () => {
    setValue('');
    setPlaces([]);
  };

  const placeClick = (id, latitude, longitude) => {
    setId(id);
    setCoordinate({
      latitude: Number(latitude),
      longitude: Number(longitude),
    });
    setPlaces([]);
  };

  const renderItem = ({item}) => {
    if (item.place !== null) {
      const {title, roadAddress, id, x: longitude, y: latitude} = item.place;
      return (
        <ListItem
          title={title}
          description={roadAddress}
          onPress={() => placeClick(id, latitude, longitude)}
        />
      );
    }
  };

  const doSearch = useCallback(
    debounce(async value => {
      if (value === '') {
        setPlaces([]);
        return;
      }
      const {all: items} = await getSearchPlaces(value);
      setPlaces(items);
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
    <View>
      <Layout style={styles.layout} level="4">
        <Input
          style={styles.searchInput}
          placeholder="가고 싶었던 곳을 검색하세요"
          value={value}
          status="warning"
          onChangeText={text => onDebounceChange(text)}
          size="large"
        />
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
      <NaverMapView
        style={styles.maps}
        // showsMyLocationButton={true}
        center={{...coordinate, zoom: 14}}
        // onTouch={e => console.warn('onTouch', JSON.stringify(e.nativeEvent))}
        // onCameraChange={e => console.warn('onCameraChange', JSON.stringify(e))}
        onMapClick={e => console.warn('onMapClick', JSON.stringify(e))}>
        <Marker
          coordinate={coordinate}
          pinColor="blue"
          onClick={() => doMapDetail()}
        />
      </NaverMapView>
    </View>
  );
};

const styles = StyleSheet.create({
  maps: {
    width: '100%',
    height: '100%',
  },
  container: {
    maxHeight: 400,
    opacity: 1,
  },
  searchInput: {
    padding: 6,
    // margin: 2,
    backgroundColor: 'white',
  },
});
