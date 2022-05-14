import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import NaverMapView, {Marker} from 'react-native-nmap';
import {PLACE_STATUS} from '../config/constants';
import {PlaceModalDetail} from '../components';

const PlaceMap = ({data}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [placeItem, setPlaceItem] = useState({});
  const [coordinate, setCoordinate] = useState({
    longitude: 126.97601589994,
    latitude: 37.5632555012193,
  });

  const openModal = item => {
    setModalVisible(!isModalVisible);
    setPlaceItem(item);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View>
      <PlaceModalDetail
        placeItem={placeItem}
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}
      />
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
            onClick={() => openModal(item)}
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
