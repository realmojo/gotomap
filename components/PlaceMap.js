import React, {useState, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import NaverMapView, {Marker} from 'react-native-nmap';
import {PLACE_STATUS} from '../config/constants';

const PlaceMap = ({data, navigation, callbackModal}) => {
  const [coordinate, setCoordinate] = useState({
    longitude: 126.97601589994,
    latitude: 37.5632555012193,
  });

  const doMapDetail = id => {
    navigation.push('mapDetail', {id});
  };
  return (
    <View>
      <NaverMapView style={styles.maps} center={{...coordinate, zoom: 10}}>
        {data.map((item, index) => (
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
            pinColor={item.status === PLACE_STATUS.DONE ? 'red' : 'blue'}
            onClick={() => callbackModal(item._id)}
          />
        ))}
      </NaverMapView>
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    color: 'black',
  },
  maps: {
    width: '100%',
    height: '100%',
  },
  container: {
    maxHeight: 400,
    opacity: 1,
  },
});

export {PlaceMap};
