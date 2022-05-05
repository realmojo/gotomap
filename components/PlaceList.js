import React, {useState, useCallback} from 'react';
import {StyleSheet, View, RefreshControl} from 'react-native';
import {
  List,
  IndexPath,
  Layout,
  Text,
  Select,
  SelectItem,
} from '@ui-kitten/components';
import {getPlaces} from '../api';
import {PLACE_STATUS, SIDO, SIGUNGU} from '../config/constants';
import {useQuery, useQueryClient} from 'react-query';
import {PlaceListItem} from './index';
import {LoadingIndicator} from '../utils';
import {Nothing} from './Nothing';

const defaultSigungu = {
  name_en: 'All',
  name_kr: '전체(시/군/구)',
};
// const mapIcon = props => <Icon {...props} name="map" />;

const PlaceList = ({statusType, navigation}) => {
  const [refreshing, setRefreshing] = useState(false);

  const queryClient = useQueryClient();
  const [selectedSido, setSelectedSido] = useState(SIDO[0]);
  const [selectedSigungu, setSelectedSigungu] = useState(defaultSigungu);
  const [selectedSidoIndex, setSelectedSidoIndex] = useState(new IndexPath(0));
  const [selectedSigunguIndex, setSelectedSigunguIndex] = useState(
    new IndexPath(0),
  );
  const [sigunguOptions, setSigunguOptions] = useState([]);

  const [allData, setAllData] = useState([]);
  const [isFirst, setIsFirst] = useState(true);

  const {isLoading, data} = useQuery('getPlaces', getPlaces, {
    onSuccess: items => {
      if (isFirst) {
        console.log('items all loading');
        setAllData(items);
        setIsFirst(false);
      }
      console.log('getPlaces reload');
    },
    select: items => {
      console.log('select filter item');
      const filterItems = items.filter(item => {
        if (statusType === PLACE_STATUS.ALL) {
          return true;
        } else if (statusType === PLACE_STATUS.DONE) {
          return item.status === PLACE_STATUS.DONE;
        } else if (statusType === PLACE_STATUS.BACKLOG)
          return item.status === PLACE_STATUS.BACKLOG;
      });
      return filterItems;
    },
    onError: () => {
      console.log('getPlaces failed');
    },
  });

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    queryClient.refetchQueries('getPlaces');
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const filterData = useCallback(({name_en, name_kr}, type) => {
    if (type === 'sido') {
      queryClient.setQueryData('getPlaces', () => {
        if (name_en !== 'All') {
          return allData.filter(item => item.sido === name_kr);
        }
        return allData;
      });
    } else if (type === 'sigungu') {
      queryClient.setQueriesData('getPlaces', () => {
        if (name_en !== 'All') {
          return allData.filter(
            item =>
              item.sido === selectedSido.name_kr && item.sigungu === name_kr,
          );
        } else {
          return allData.filter(item => item.sido === selectedSido.name_kr);
        }
      });
    }
  });

  const doSidoSelect = useCallback(index => {
    setSelectedSidoIndex(index);
    setSelectedSido(SIDO[index.row]);
    if (SIDO[index.row].name_en === 'All') {
      setSigunguOptions([]);
    } else {
      setSigunguOptions(SIGUNGU[SIDO[index.row].name_en.toLocaleLowerCase()]);
      setSelectedSigunguIndex(new IndexPath(0));
    }
    setSelectedSigungu(defaultSigungu);

    filterData(SIDO[index.row], 'sido');
  });

  const doSigunguSelect = index => {
    setSelectedSigunguIndex(index);
    setSelectedSigungu(sigunguOptions[index.row]);

    filterData(sigunguOptions[index.row], 'sigungu');
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={{marginBottom: 210}}>
      <Layout style={styles.layoutContainer} level="2">
        <Select
          style={styles.select}
          value={selectedSido.name_kr}
          selectedIndex={selectedSidoIndex}
          onSelect={index => doSidoSelect(index)}>
          {SIDO.map((item, index) => (
            <SelectItem key={index} title={item.name_kr} />
          ))}
        </Select>
        <Select
          style={styles.select}
          value={selectedSigungu.name_kr}
          selectedIndex={selectedSigunguIndex}
          onSelect={index => doSigunguSelect(index)}>
          {selectedSido !== 'All' &&
            sigunguOptions.map((item, index) => (
              <SelectItem key={index} title={item.name_kr} />
            ))}
        </Select>
      </Layout>
      {data !== null && data.length > 0 ? (
        <List
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          data={data}
          renderItem={item => (
            <PlaceListItem item={item} navigation={navigation} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Nothing navigation={navigation} />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
  },
  text: {
    color: 'black',
  },

  layoutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingTop: 6,
  },
  select: {
    flex: 1,
    margin: 2,
  },
  container: {
    maxHeight: '100%',
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
  },
});
export {PlaceList};
