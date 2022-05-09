import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  BackHandler,
} from 'react-native';
import {
  Icon,
  Text,
  Avatar,
  Layout,
  Button,
  Divider,
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {getPlaces, getPlace, updatePlaceStatus} from '../api';
import {observer} from 'mobx-react';
import {PlaceList, PlaceMap, LoadingIndicator, Error} from '../components';
import {PLACE_STATUS, PLACE_STATUS_KR, VIEW_TYPE} from '../config/constants';
import {useQuery} from 'react-query';
import useStore from '../stores';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const iconColor = '#dadbdd';
const iconSize = 18;
const deviceWidth = Dimensions.get('window').width;
const closeIcon = props => <Icon {...props} name="close-outline" />;
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
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  useEffect(() => {
    const backAction = () => {
      if (isModalVisible) {
        setModalVisible(!isModalVisible);
      }
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const {isLoading, data, error} = useQuery('getPlaces', getPlaces, {
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
      <Modal
        style={styles.bottomModal}
        isVisible={isModalVisible}
        deviceWidth={deviceWidth}
        onBackdropPress={toggleModal}>
        <View style={styles.closeIcon}>
          <Button
            appearance="ghost"
            status="control"
            accessoryLeft={closeIcon}
            onPress={toggleModal}
          />
        </View>
        <View style={styles.modalContent}>
          {modalLoading ? (
            <LoadingIndicator />
          ) : (
            <View style={{flex: 1}}>
              <ScrollView>
                <Layout style={styles.modalContentBody}>
                  <Text style={{fontSize: 12, color: '#aaa'}}>
                    {placeItem.category}
                  </Text>
                  <Text category="h3">{placeItem.title}</Text>

                  <View style={styles.modalTextWrap}>
                    <MaterialCommunityIcons
                      style={styles.modalIcon}
                      name="clock-time-nine-outline"
                      color={iconColor}
                      size={iconSize}
                    />
                    <Text style={styles.modalText}>
                      <Text>{placeItem.fullAddress}</Text>
                    </Text>
                  </View>
                  <Text>{placeItem.fullAddress}</Text>
                  <Divider />
                  <Text>{placeItem.fullRoadAddress}</Text>
                  <Divider />
                  <Divider />
                  <Text>{placeItem.phone}</Text>
                  <Divider />
                  <Text>{placeItem.regdate}</Text>
                  <Divider />
                  <Text>{placeItem.description}</Text>
                  <Divider />
                  <Text>{placeItem.options}</Text>
                  <Divider />
                  <Text>{placeItem.keywords}</Text>
                  <Divider />
                  <Text>{placeItem.openHour}</Text>
                  <Divider />
                  <Text>{placeItem.closeHour}</Text>
                  <Divider />
                  <Text>{placeItem.memo}</Text>
                </Layout>
              </ScrollView>
              <View style={styles.modalContentFooter}>
                <Button
                  size="giant"
                  appearance={
                    placeItem.status === PLACE_STATUS.BACKLOG
                      ? 'outline'
                      : 'filled'
                  }
                  onPress={() => doUpdatePlaceStatus(placeItem)}
                  status="warning">
                  <Text>
                    {placeItem.status === PLACE_STATUS.BACKLOG
                      ? PLACE_STATUS_KR.BACKLOG
                      : PLACE_STATUS_KR.DONE}
                  </Text>
                </Button>
              </View>
            </View>
          )}
        </View>
      </Modal>
      {placeStore.viewType === VIEW_TYPE.LIST ? (
        <PlaceList
          allData={allData}
          data={data}
          navigation={navigation}
          callbackModal={callbackModal}
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
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    flex: 1,
    minHeight: 300,
    backgroundColor: 'white',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContentBody: {
    // flex: 1,
    // alignItems: 'flex-end',
    padding: 20,
  },
  modalContentFooter: {
    // flex: 1,
    // justifyContent: 'flex-end',
    // alignItems: 'flex-end',
  },
  closeIcon: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  modalTextWrap: {
    flexDirection: 'row',
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dadbdd',
  },
  // icon: {
  //   marginRight: 4,
  // },
  modalIcon: {
    marginRight: 4,
  },
  modalText: {
    paddingRight: 20,
  },
});
