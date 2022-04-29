import React, {useState, useMemo, useCallback} from 'react';
import NaverMapView, {
  Circle,
  Marker,
  Path,
  Polyline,
  Polygon,
} from 'react-native-nmap';
import {StyleSheet, View, Text} from 'react-native';
import {Layout, Input, Divider, List, ListItem} from '@ui-kitten/components';
import {debounce} from 'lodash';
import axios from 'axios';

const API_URL = 'https://map.naver.com/v5/api';

const getSearchData = text => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${API_URL}/instantSearch?lang=ko&caller=pcweb&types=place,address,bus&coords=37.51708600000052,126.899465946063&query=${encodeURI(
          text,
        )}`,
      )
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

export const Map = ({navigation}) => {
  const [value, setValue] = useState('');
  const [id, setId] = useState(0);
  const [places, setPlaces] = useState([]);
  const [coordinate, setCoordinate] = useState({
    latitude: 37.564362,
    longitude: 126.977011,
  });
  // const P0 = {latitude: 37.564362, longitude: 126.977011};
  // const P1 = {latitude: 37.565051, longitude: 126.978567};
  // const P2 = {latitude: 37.565383, longitude: 126.976292};

  const doClose = () => {
    setValue('');
    setPlaces([]);
  };

  const placeClick = (id, latitude, longitude) => {
    console.log(id, latitude, longitude);
    setId(id);
    setCoordinate({
      latitude: Number(latitude),
      longitude: Number(longitude),
    });
    setPlaces([]);
  };

  const renderItem = ({item}) => {
    const {title, roadAddress, id, x: longitude, y: latitude} = item.place;
    return (
      <ListItem
        title={title}
        description={roadAddress}
        onPress={() => placeClick(id, latitude, longitude)}
      />
    );
  };

  const doSearch = useCallback(
    debounce(async value => {
      if (value === '') {
        setPlaces([]);
        return;
      }
      const {all: items} = await getSearchData(value);
      setPlaces(items);
    }, 500),
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
        {/* <Marker coordinate={P0} onClick={() => console.warn('onClick! p0')} />
        <Marker
          coordinate={P2}
          pinColor="red"
          onClick={() => console.warn('onClick! p2')}
        />
        <Path
          coordinates={[P0, P1]}
          onClick={() => console.warn('onClick! path')}
          width={10}
        />
        <Polyline
          coordinates={[P1, P2]}
          onClick={() => console.warn('onClick! polyline')}
        />
        <Circle
          coordinate={P0}
          color={'rgba(255,0,0,0.3)'}
          radius={200}
          onClick={() => console.warn('onClick! circle')}
        />
        <Polygon
          coordinates={[P0, P1, P2]}
          color={`rgba(0, 0, 0, 0.5)`}
          onClick={() => console.warn('onClick! polygon')}
        /> */}
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
