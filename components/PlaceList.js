import React, {useState, useCallback, useMemo, useRef} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {
  List,
  Text,
  Layout,
  Select,
  Button,
  IndexPath,
  SelectItem,
} from '@ui-kitten/components';
import {
  PLACE_STATUS,
  PLACE_STATUS_KR,
  SIDO,
  SIGUNGU,
} from '../config/constants';
import {useQueryClient} from 'react-query';
import {PlaceListItem} from './index';
import {Nothing} from './Nothing';
import {PlaceDetail} from './PlaceDetail';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import {PlaceTab} from './PlaceTab';

const {width, height} = Dimensions.get('window');

const defaultSigungu = {
  name_en: 'All',
  name_kr: '전체(시/군/구)',
};

const PlaceList = ({
  allData,
  data = [],
  navigation,
  naviMapInfo,
  refreshData,
  setStatusValue,
}) => {
  const queryClient = useQueryClient();
  const bottomSheet = useRef();
  const [statusButton, setStatusButton] = useState(PLACE_STATUS.ALL);
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
  // console.log(
  //   `Place list: `,
  //   placeItem.title,
  //   placeItem.memo,
  //   placeItem.status,
  // );
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  // const filterStatusData = value => {
  //   setStatusButton(value);
  //   setTimeout(() => {
  //     setStatusValue(value);
  //   }, 10);
  // };

  const openModal = item => {
    setPlaceItem(item);
    bottomSheet.current.show();
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setStatusButton(PLACE_STATUS.ALL);
    setStatusValue(PLACE_STATUS.ALL);
    // queryClient.refetchQueries('getPlaces');
    setSelectedSido(SIDO[0]);
    setSelectedSigungu(defaultSigungu);
    refreshData();
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
        <BottomSheet hasDraggableIcon ref={bottomSheet} height={600}>
          <PlaceDetail placeItem={placeItem} />
        </BottomSheet>
        {/* <Layout style={{flexDirection: 'row', marginHorizontal: 6}} level="2">
          <Button
            style={
              statusButton === PLACE_STATUS.ALL
                ? styles.buttonActive
                : styles.button
            }
            appearance={
              statusButton === PLACE_STATUS.ALL ? 'filled' : 'outline'
            }
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
            appearance={
              statusButton === PLACE_STATUS.DONE ? 'filled' : 'outline'
            }
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
        </Layout> */}
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
    [data, placeItem.status, placeItem.memo, refreshing, statusButton],
  );
};
const styles = StyleSheet.create({
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
    paddingBottom: 4,
  },
  item: {
    marginVertical: 4,
  },
});
export {PlaceList};
