import React from 'react';
import NaverMapView, {
  Circle,
  Marker,
  Path,
  Polyline,
  Polygon,
} from 'react-native-nmap';

import axios from 'axios';
import {config} from '../config';

const headers = {
  'X-NCP-APIGW-API-KEY-ID': config.clientId,
  'X-NCP-APIGW-API-KEY': config.secretId,
};

const getPlace = () => {
  const url = `https://map.naver.com/v5/api/instantSearch?lang=ko&caller=pcweb&types=place,address,bus&coords=37.5148384,126.8942304&query=${encodeURI(
    '그믐족발',
  )}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
};

const getAddress = () => {
  const url = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURI(
    '문래동2가 48-6',
  )}`;
  console.log(url, headers);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {headers})
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
};

export const NaverMap = () => {
  const P0 = {latitude: 37.564362, longitude: 126.977011};
  const P1 = {latitude: 37.565051, longitude: 126.978567};
  const P2 = {latitude: 37.565383, longitude: 126.976292};

  const getData = async () => {
    // const res = await getAddress();
    const res = await getPlace();
    console.log(res.data);
  };

  return (
    <NaverMapView
      style={{width: '100%', height: '100%'}}
      showsMyLocationButton={true}
      center={{...P0, zoom: 16}}
      onTouch={e => console.warn('onTouch', JSON.stringify(e.nativeEvent))}
      onCameraChange={e => console.warn('onCameraChange', JSON.stringify(e))}
      onMapClick={() => getData()}>
      <Marker coordinate={P0} onClick={() => console.warn('onClick! p0')} />
      <Marker
        coordinate={P1}
        pinColor="blue"
        onClick={() => console.warn('onClick! p1')}
      />
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
      />
    </NaverMapView>
  );
};
