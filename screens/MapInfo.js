import React from 'react';
import {StyleSheet} from 'react-native';
import NaverMapView, {Marker} from 'react-native-nmap';

export const MapInfo = ({route: {params}}) => {
  const {coordinate} = params;
  return (
    <NaverMapView style={styles.maps} center={{...coordinate, zoom: 14}}>
      <Marker coordinate={coordinate} pinColor="blue" />
    </NaverMapView>
  );
};

const styles = StyleSheet.create({
  maps: {
    width: '100%',
    height: '100%',
  },
});
