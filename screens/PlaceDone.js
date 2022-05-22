import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Avatar, Layout, TopNavigation} from '@ui-kitten/components';
import {getPlaceByStatus} from '../api';
import {PlaceList, LoadingIndicator, Error, Admob} from '../components';
import {PLACE_STATUS, PLACE_STATUS_KR, QUERY_KEY} from '../config/constants';
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
    QUERY_KEY.DONE,
    () => getPlaceByStatus(PLACE_STATUS.DONE),
    {
      onSuccess: items => {
        console.log('forceDoneRefresh: ', placeStore.forceDoneRefresh);
        if (placeStore.forceDoneRefresh) {
          console.log(`${QUERY_KEY.DONE} items all loading: `, items.length);
          setAllData(items);
          placeStore.setForceDoneRefresh(false);
        }
        console.log(`${QUERY_KEY.DONE} reload`);
      },
      onError: () => {
        console.log(`${QUERY_KEY.DONE} failed`);
      },
    },
  );

  const naviMapInfo = coordinate => {
    navigation.push('mapInfo', {coordinate});
  };

  useEffect(() => {
    placeStore.setForceDoneRefresh(true);
  }, []);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <Layout level="2" style={styles.layoutContainer}>
      <TopNavigation title={renderTitle} />
      <View style={{flex: 1}}>
        <PlaceList
          allData={allData}
          data={data}
          navigation={navigation}
          naviMapInfo={naviMapInfo}
          queryKey={QUERY_KEY.DONE}
        />
      </View>
      <Admob />
    </Layout>
  );
};

const styles = StyleSheet.create({
  layoutContainer: {
    height: '100%',
  },
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
