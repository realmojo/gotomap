import React, {useState, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  List,
  ListItem,
  Avatar,
  Card,
  Button,
  Text,
  IndexPath,
  Icon,
  Layout,
  Select,
  SelectItem,
} from '@ui-kitten/components';
import {getPlaces} from '../api';
import {SIDO, SIGUNGU} from '../config/constants';
import {useQuery, useQueryClient, useMutation} from 'react-query';
import {PLACE_STATUS} from '../config/constants';
import {TextDetail} from './index';

const defaultSigungu = {
  name_en: 'All',
  name_kr: '전체(시/군/구)',
};
const mapIcon = props => <Icon {...props} name="map" />;

const PlaceList = () => {
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
    },
  });

  const filterData = ({name_en, name_kr}, type) => {
    if (type === 'sido') {
      queryClient.setQueryData('getPlaces', () => {
        if (name_en !== 'All') {
          return allData.filter(item => item.sido === name_kr);
        }
        return allData;
      });
    } else if (type === 'sigungu') {
      console.log(selectedSido);
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
  };

  const renderItemHeader = (headerProps, item) => {
    const {title, category, imageURL, status} = item;
    return (
      <ListItem
        style={{padding: 10}}
        title={title}
        description={category}
        accessoryLeft={() => (
          <Avatar
            source={
              imageURL ? {uri: imageURL} : require('../assets/images/logo.png')
            }
          />
        )}
        accessoryRight={() => (
          <Button
            style={{margin: 10}}
            size="small"
            appearance={status === PLACE_STATUS.BACKLOG ? 'outline' : 'filled'}
            status="warning">
            <Text style={{fontSize: 19}}>
              {status === PLACE_STATUS.BACKLOG ? '가봐야지' : '가봤지'}
            </Text>
          </Button>
        )}
      />
    );
  };
  const doStack = () => {};
  const renderItem = item => {
    const {fullAddress} = item.item;
    return (
      <View>
        <Card
          style={styles.item}
          status="basic"
          header={headerProps => renderItemHeader(headerProps, item.item)}
          onPress={() => doStack()}>
          <TextDetail iconName="map-marker" text={fullAddress} />
        </Card>
      </View>
    );
  };

  const doSidoSelect = index => {
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
  };

  const doSigunguSelect = index => {
    setSelectedSigunguIndex(index);
    setSelectedSigungu(sigunguOptions[index.row]);

    filterData(sigunguOptions[index.row], 'sigungu');
  };

  if (isLoading) {
    return (
      <View>
        <Text style={styles.text}>Data Loading...</Text>
      </View>
    );
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
        {/* <Button size="small" status="control" accessoryLeft={mapIcon} /> */}
        {/* <Text>{selectedIndex}</Text> */}
      </Layout>
      <List
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        data={data}
        renderItem={renderItem}
      />
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
