import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Avatar, Layout, TopNavigation} from '@ui-kitten/components';
import {getPlaceByStatus} from '../api';
import {PlaceList, LoadingIndicator, Error} from '../components';
import {PLACE_STATUS, PLACE_STATUS_KR, QUERY_KEY} from '../config/constants';
import {useQuery} from 'react-query';
import useStore from '../stores';

export const PlaceBacklog = ({navigation}) => {
  const [allData, setAllData] = useState([]);
  const {placeStore} = useStore();
  const renderTitle = props => (
    <View style={styles.titleContainer}>
      <Avatar
        style={styles.logo}
        source={require('../assets/images/logo.png')}
      />
      <Text {...props}>{PLACE_STATUS_KR.BACKLOG}</Text>
    </View>
  );

  const {isLoading, data, error} = useQuery(
    QUERY_KEY.BACKLOG,
    () => getPlaceByStatus(PLACE_STATUS.BACKLOG),
    {
      onSuccess: items => {
        console.log('forceRefresh: ', placeStore.forceRefresh);
        if (placeStore.forceRefresh) {
          console.log(
            `${QUERY_KEY.BACKLOG} items all loading: `,
            items ? items.length : '',
          );
          setAllData(items ? items : []);
          placeStore.setForceRefresh(false);
        }
        console.log(`${QUERY_KEY.BACKLOG} reload`);
      },
      onError: () => {
        console.log(`${QUERY_KEY.BACKLOG} failed`);
      },
    },
  );

  const naviMapInfo = coordinate => {
    navigation.push('mapInfo', {coordinate});
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <Layout level="2" style={styles.layoutContainer}>
      <TopNavigation title={renderTitle} />
      <PlaceList
        allData={allData}
        data={data}
        navigation={navigation}
        naviMapInfo={naviMapInfo}
        queryKey={QUERY_KEY.BACKLOG}
      />
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
