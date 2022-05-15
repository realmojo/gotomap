import React, {useState, useCallback} from 'react';
import {View, StyleSheet, ToastAndroid} from 'react-native';
import {Text, Avatar, TopNavigation} from '@ui-kitten/components';
import {useQueryClient} from 'react-query';
import {getPlaces} from '../api';
import {PlaceList, LoadingIndicator, Error} from '../components';
import {PLACE_STATUS, PLACE_STATUS_KR} from '../config/constants';
import {useQuery} from 'react-query';

export const PlaceBacklog = ({navigation}) => {
  const queryClient = useQueryClient();
  const [allData, setAllData] = useState([]);
  const [forceRefresh, setForceRefresh] = useState(true);
  const [statusValue, setStatusValue] = useState(PLACE_STATUS.BACKLOG);
  const renderTitle = props => (
    <View style={styles.titleContainer}>
      <Avatar
        style={styles.logo}
        source={require('../assets/images/logo.png')}
      />
      <Text {...props}>{PLACE_STATUS_KR.BACKLOG}</Text>
    </View>
  );

  const {isLoading, data, error} = useQuery('getPlaces', getPlaces, {
    onSuccess: items => {
      if (forceRefresh) {
        console.log('items all loading: ', items ? items.length : '');
        setAllData(items);
        // setIsFirst(false);
        setForceRefresh(false);
      }
      console.log('getPlaces reload');
    },
    select: useCallback(
      items => {
        console.log('select filter item: ', items ? items.length : '');

        const filterItems = items.filter(item => {
          return item.status === PLACE_STATUS.BACKLOG;
        });
        return filterItems;
      },
      [statusValue, forceRefresh],
    ),
    onError: () => {
      console.log('getPlaces failed');
    },
  });

  const refreshData = () => {
    queryClient.refetchQueries('getPlaces');
    setStatusValue(PLACE_STATUS.BACKLOG);
    setForceRefresh(true);
    ToastAndroid.show('데이터를 새로 가져옵니다.', ToastAndroid.SHORT);
  };

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
    <View>
      <TopNavigation
        title={renderTitle}
        // accessoryRight={renderOverflowMenuAction}
      />
      <PlaceList
        allData={allData}
        data={data}
        navigation={navigation}
        refreshData={refreshData}
        naviMapInfo={naviMapInfo}
        setStatusValue={setStatusValue}
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
