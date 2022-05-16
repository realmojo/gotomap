import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Avatar, TopNavigation} from '@ui-kitten/components';
import {getPlaceByStatus} from '../api';
import {PlaceList, LoadingIndicator, Error} from '../components';
import {PLACE_STATUS, PLACE_STATUS_KR} from '../config/constants';
import {useQuery} from 'react-query';
import useStore from '../stores';

export const PlaceDone = ({navigation}) => {
  const [allData, setAllData] = useState([]);
  const {placeStore} = useStore();
  const renderTitle = props => (
    <View style={styles.titleContainer}>
      <Avatar
        style={styles.logo}
        source={require('../assets/images/logo-done.png')}
      />
      <Text {...props}>{PLACE_STATUS_KR.DONE}</Text>
    </View>
  );

  const {isLoading, data, error} = useQuery(
    'getPlaceDones',
    () => getPlaceByStatus(PLACE_STATUS.DONE),
    {
      onSuccess: items => {
        console.log('forceRefresh: ', placeStore.forceRefresh);
        if (placeStore.forceRefresh) {
          console.log(
            'getPlaceDones items all loading: ',
            items ? items.length : '',
          );
          setAllData(items);
          placeStore.setForceRefresh(false);
        }
        console.log('getPlaceDones getPlaces reload');
      },
      onError: () => {
        console.log('getPlaceDones failed');
      },
    },
  );

  const naviMapInfo = coordinate => {
    navigation.push('mapInfo', {coordinate});
  };

  useEffect(() => {
    placeStore.setForceRefresh(true);
  }, []);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <View>
      <TopNavigation title={renderTitle} />
      <PlaceList
        allData={allData}
        data={data}
        navigation={navigation}
        naviMapInfo={naviMapInfo}
        queryKey="getPlaceDones"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
  },
  buttonGroup: {
    margin: 2,
  },
  searchInput: {
    margin: 4,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#222B45',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginHorizontal: 16,
  },
});
