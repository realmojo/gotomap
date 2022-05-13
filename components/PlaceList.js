import React, {useState, useCallback, useMemo} from 'react';
import {StyleSheet, View, RefreshControl, ScrollView} from 'react-native';
import {
  List,
  IndexPath,
  Layout,
  Select,
  SelectItem,
} from '@ui-kitten/components';
import {SIDO, SIGUNGU} from '../config/constants';
import {useQueryClient} from 'react-query';
import {PlaceListItem} from './index';
import {Nothing} from './Nothing';

const defaultSigungu = {
  name_en: 'All',
  name_kr: '전체(시/군/구)',
};

const PlaceList = ({
  allData,
  data = [],
  navigation,
  callbackModal,
  naviMapInfo,
  setForceRefresh,
}) => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSido, setSelectedSido] = useState(SIDO[0]);
  const [selectedSigungu, setSelectedSigungu] = useState(defaultSigungu);
  const [selectedSidoIndex, setSelectedSidoIndex] = useState(new IndexPath(0));
  const [selectedSigunguIndex, setSelectedSigunguIndex] = useState(
    new IndexPath(0),
  );
  const [sigunguOptions, setSigunguOptions] = useState([]);
  console.log('Place list');
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setForceRefresh(true);
    queryClient.refetchQueries('getPlaces');
    setSelectedSido(SIDO[0]);
    setSelectedSigungu(defaultSigungu);
    wait(1000).then(() => {
      setRefreshing(false);
    });
  }, []);

  const filterListData = useCallback(({name_en, name_kr}, type) => {
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

    filterListData(SIDO[index.row], 'sido');
  });

  const doSigunguSelect = index => {
    setSelectedSigunguIndex(index);
    setSelectedSigungu(sigunguOptions[index.row]);

    filterListData(sigunguOptions[index.row], 'sigungu');
  };

  return useMemo(
    () => (
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
        {data !== null && data.length !== 0 ? (
          <List
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            data={data}
            renderItem={item => (
              <PlaceListItem
                item={item}
                callbackModal={callbackModal}
                naviMapInfo={naviMapInfo}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <Nothing navigation={navigation} />
          </ScrollView>
        )}
      </View>
    ),
    [data, refreshing],
  );
};
const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
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
