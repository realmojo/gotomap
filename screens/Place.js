import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, BackHandler, ToastAndroid} from 'react-native';
import {
  Icon,
  Text,
  Avatar,
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {useFocusEffect} from '@react-navigation/native';
import {getPlaces, getPlace, updatePlaceStatus} from '../api';
import {observer} from 'mobx-react';
import {PlaceList, PlaceMap, LoadingIndicator, Error} from '../components';
import {PLACE_STATUS, VIEW_TYPE} from '../config/constants';
import {useQuery} from 'react-query';
import useStore from '../stores';
import {PlaceModalDetail} from './PlaceModalDetail';

const MenuIcon = props => <Icon {...props} name="more-vertical" />;
const StarIcon = (color, name) => {
  return <Icon style={styles.icon} fill={color} name={name} />;
};
const mapIcon = props => <Icon {...props} fill="#8F9BB3" name="map-outline" />;
const listIcon = props => (
  <Icon {...props} fill="#8F9BB3" name="list-outline" />
);

export const Place = observer(({navigation}) => {
  const {placeStore} = useStore();
  const [allData, setAllData] = useState([]);
  const [isFirst, setIsFirst] = useState(true);
  const [statusValue, setStatusValue] = useState('all');
  const [starIconColor, setStarIconColor] = useState('#d2d2d2');
  const [starIconName, setStarIconName] = useState('star');
  const [menuVisible, setMenuVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [placeItem, setPlaceItem] = useState({});
  const [modalLoading, setModalLoading] = useState(true);
  const [forceRefresh, setForceRefresh] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const [exitApp, setExitApp] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        setTimeout(() => {
          setExitApp(0);
        }, 2000);
        if (exitApp === 0) {
          setExitApp(1);
          ToastAndroid.show(
            '한 번 더 누르시면 앱을 종료합니다.',
            ToastAndroid.SHORT,
          );
        } else if (exitApp === 1) {
          console.log('종료해랏');
          BackHandler.exitApp();
        }
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }),
  );

  const {isLoading, data, error} = useQuery('getPlaces', getPlaces, {
    onSuccess: items => {
      if (isFirst || forceRefresh) {
        console.log('items all loading');
        setAllData(items);
        setIsFirst(false);
        setForceRefresh(false);
      }
      console.log('getPlaces reload');
    },
    select: items => {
      console.log('select filter item');
      const filterItems = items.filter(item => {
        if (statusValue === PLACE_STATUS.ALL) {
          return true;
        } else if (statusValue === PLACE_STATUS.DONE) {
          return item.status === PLACE_STATUS.DONE;
        } else if (statusValue === PLACE_STATUS.BACKLOG)
          return item.status === PLACE_STATUS.BACKLOG;
      });
      return filterItems;
    },
    onError: () => {
      console.log('getPlaces failed');
    },
  });

  const renderMenuAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
  );

  const doViewType = value => {
    if (value === VIEW_TYPE.LIST) {
      placeStore.setViewType(VIEW_TYPE.LIST);
    } else if (value === VIEW_TYPE.MAP) {
      placeStore.setViewType(VIEW_TYPE.MAP);
    }
    toggleMenu();
  };

  const filterData = () => {
    switch (statusValue) {
      case PLACE_STATUS.ALL:
        setStatusValue(PLACE_STATUS.DONE);
        setStarIconColor('#ffaa00');
        setStarIconName('star');
        break;
      case PLACE_STATUS.DONE:
        setStatusValue(PLACE_STATUS.BACKLOG);
        setStarIconColor('#ffaa00');
        setStarIconName('star-outline');
        break;
      case PLACE_STATUS.BACKLOG:
        setStatusValue(PLACE_STATUS.ALL);
        setStarIconColor('#d2d2d2');
        setStarIconName('star');
        break;
    }
  };

  const renderOverflowMenuAction = () => (
    <React.Fragment>
      <TopNavigationAction
        onPress={() => filterData()}
        icon={() => StarIcon(starIconColor, starIconName)}
      />
      <OverflowMenu
        anchor={renderMenuAction}
        visible={menuVisible}
        onBackdropPress={toggleMenu}>
        <MenuItem
          accessoryLeft={listIcon}
          onPress={() => doViewType('list')}
          title="목록으로 보기"
        />
        <MenuItem
          accessoryLeft={mapIcon}
          onPress={() => doViewType('map')}
          title="지도로 보기"
        />
      </OverflowMenu>
    </React.Fragment>
  );

  const renderTitle = props => (
    <View style={styles.titleContainer}>
      <Avatar
        style={styles.logo}
        source={require('../assets/images/logo.png')}
      />
      <Text {...props}>가봐야지도</Text>
    </View>
  );

  const callbackModal = async id => {
    setModalLoading(true);
    setModalVisible(!isModalVisible);
    const item = await getPlace(id);
    setPlaceItem(item);
    setModalLoading(false);
  };

  const naviMapInfo = coordinate => {
    navigation.push('mapInfo', {coordinate});
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const doUpdatePlaceStatus = async placeItem => {
    const {_id, status} = placeItem;
    setPlaceItem({
      ...placeItem,
      status:
        status === PLACE_STATUS.BACKLOG
          ? PLACE_STATUS.DONE
          : PLACE_STATUS.BACKLOG,
    });
    try {
      await updatePlaceStatus({
        _id,
        status:
          status === PLACE_STATUS.BACKLOG
            ? PLACE_STATUS.DONE
            : PLACE_STATUS.BACKLOG,
      });
    } catch (e) {
      console.log(e);
      setPlaceItem({
        ...placeItem,
        status:
          status === PLACE_STATUS.BACKLOG
            ? PLACE_STATUS.BACKLOG
            : PLACE_STATUS.DONE,
      });
    }
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
        accessoryRight={renderOverflowMenuAction}
      />
      <PlaceModalDetail
        placeItem={placeItem}
        isModalVisible={isModalVisible}
        modalLoading={modalLoading}
        toggleModal={toggleModal}
        doUpdatePlaceStatus={doUpdatePlaceStatus}
      />
      {placeStore.viewType === VIEW_TYPE.LIST ? (
        <PlaceList
          allData={allData}
          data={data}
          navigation={navigation}
          callbackModal={callbackModal}
          setForceRefresh={setForceRefresh}
          naviMapInfo={naviMapInfo}
        />
      ) : (
        <PlaceMap
          allData={allData}
          data={data}
          navigation={navigation}
          callbackModal={callbackModal}
        />
      )}
    </View>
  );
});

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
