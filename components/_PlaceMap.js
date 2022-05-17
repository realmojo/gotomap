import React, {useState, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import NaverMapView, {Marker} from 'react-native-nmap';
import {PLACE_STATUS, PLACE_STATUS_KR} from '../config/constants';
import {PlaceDetail} from '.';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import {Layout, Button} from '@ui-kitten/components';

const PlaceMap = ({data, setStatusValue}) => {
  const bottomSheet = useRef();
  const [placeItem, setPlaceItem] = useState({});
  const [statusButton, setStatusButton] = useState(PLACE_STATUS.ALL);
  const [coordinate, setCoordinate] = useState({
    longitude: 126.97601589994,
    latitude: 37.5632555012193,
  });

  const openModal = item => {
    setPlaceItem(item);
    bottomSheet.current.show();
  };

  const filterStatusData = value => {
    setStatusButton(value);
    setTimeout(() => {
      setStatusValue(value);
    }, 10);
  };

  return (
    <View>
      <BottomSheet hasDraggableIcon ref={bottomSheet} height={600}>
        <PlaceDetail placeItem={placeItem} />
      </BottomSheet>
      <Layout
        style={{flexDirection: 'row', marginHorizontal: 6, marginBottom: 6}}
        level="2">
        <Button
          style={
            statusButton === PLACE_STATUS.ALL
              ? styles.buttonActive
              : styles.button
          }
          appearance={statusButton === PLACE_STATUS.ALL ? 'filled' : 'outline'}
          status={statusButton === PLACE_STATUS.ALL ? 'warning' : 'basic'}
          size="small"
          onPress={() => filterStatusData(PLACE_STATUS.ALL)}>
          {PLACE_STATUS_KR.ALL}
        </Button>
        <Button
          style={
            statusButton === PLACE_STATUS.DONE
              ? styles.buttonActive
              : styles.button
          }
          appearance={statusButton === PLACE_STATUS.DONE ? 'filled' : 'outline'}
          status={statusButton === PLACE_STATUS.DONE ? 'warning' : 'basic'}
          size="small"
          onPress={() => filterStatusData(PLACE_STATUS.DONE)}>
          {PLACE_STATUS_KR.DONE}
        </Button>
        <Button
          style={
            statusButton === PLACE_STATUS.BACKLOG
              ? styles.buttonActive
              : styles.button
          }
          appearance={
            statusButton === PLACE_STATUS.BACKLOG ? 'filled' : 'outline'
          }
          status={statusButton === PLACE_STATUS.BACKLOG ? 'warning' : 'basic'}
          size="small"
          onPress={() => filterStatusData(PLACE_STATUS.BACKLOG)}>
          {PLACE_STATUS_KR.BACKLOG}
        </Button>
      </Layout>
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
  button: {
    flex: 1,
    marginTop: 6,
    marginHorizontal: 2,
    height: 40,
    borderColor: '#e4e9f2',
    backgroundColor: 'transparent',
  },
  buttonActive: {
    flex: 1,
    marginTop: 6,
    marginHorizontal: 2,
  },
});

export {PlaceMap};
