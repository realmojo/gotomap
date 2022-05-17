import React, {useState, useCallback, useMemo, useRef} from 'react';
import {StyleSheet, View, RefreshControl, ScrollView} from 'react-native';
import {
  List,
  Text,
  Layout,
  Select,
  IndexPath,
  SelectItem,
} from '@ui-kitten/components';
import {SIDO, SIGUNGU} from '../config/constants';
import {useQueryClient} from 'react-query';
import {PlaceListItem} from './index';
import {Nothing} from './Nothing';
import {PlaceDetail} from './PlaceDetail';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import useStore from '../stores';

const defaultSigungu = {
  name_en: 'All',
  name_kr: '전체(시/군/구)',
};

const PlaceList = ({allData, data = [], navigation, naviMapInfo, queryKey}) => {
  const queryClient = useQueryClient();
  const bottomSheet = useRef();
  const {placeStore} = useStore();
  const [placeItem, setPlaceItem] = useState({});
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

  const openModal = item => {
    setPlaceItem(item);
    bottomSheet.current.show();
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    placeStore.setForceRefresh(true);
    queryClient.invalidateQueries(queryKey);
    setSelectedSido(SIDO[0]);
    setSelectedSigungu(defaultSigungu);
    wait(1000).then(() => {
      setRefreshing(false);
    });
  }, []);

  const filterListData = useCallback(({name_en, name_kr}, type) => {
    if (type === 'sido') {
      queryClient.setQueryData(queryKey, () => {
        if (name_en !== 'All') {
          return allData.filter(item => item.sido === name_kr);
        }
        return allData;
      });
    } else if (type === 'sigungu') {
      queryClient.setQueriesData(queryKey, () => {
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
      <View>
        <Text style={styles.none}>{data.length}</Text>
        <BottomSheet hasDraggableIcon ref={bottomSheet} height={600}>
          <PlaceDetail placeItem={placeItem} queryKey={queryKey} />
        </BottomSheet>
        <Layout style={styles.layoutContainer} level="2">
          <Select
            style={styles.select}
            value={selectedSido.name_kr}
            selectedIndex={selectedSidoIndex}
            onSelect={index => doSidoSelect(index)}>
            {SIDO.map((item, index) => (
              <SelectItem key={index} title={`${item.name_kr}`} />
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
                callbackModal={openModal}
                naviMapInfo={naviMapInfo}
                queryKey={queryKey}
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
    [
      data,
      data.length,
      selectedSido.name_kr,
      selectedSigungu.name_kr,
      placeItem,
      placeItem.memo,
      placeItem.status,
      refreshing,
    ],
  );
};
const styles = StyleSheet.create({
  none: {
    display: 'none',
  },
  image: {
    width: '100%',
    height: 200,
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
  layoutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingTop: 6,
    paddingBottom: 4,
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
    paddingBottom: 114,
  },
  item: {
    marginVertical: 4,
  },
});
export {PlaceList};
