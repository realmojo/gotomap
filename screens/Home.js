import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Icon,
  Text,
  Avatar,
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {observer} from 'mobx-react';
import {PlaceList, PlaceMap} from '../components';
import {PLACE_STATUS} from '../config/constants';

const MenuIcon = props => <Icon {...props} name="more-vertical" />;

const StarIcon = (color, name) => {
  return <Icon style={styles.icon} fill={color} name={name} />;
};

const listIcon = props => (
  <Icon {...props} fill="#8F9BB3" name="list-outline" />
);

const mapIcon = props => <Icon {...props} fill="#8F9BB3" name="map-outline" />;

export const Home = observer(({navigation}) => {
  const [statusValue, setStatusValue] = useState('all');
  const [starIconColor, setStarIconColor] = useState('#d2d2d2');
  const [starIconName, setStarIconName] = useState('star');
  const [menuVisible, setMenuVisible] = useState(false);
  const [viewType, setViewType] = useState('list');
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const renderMenuAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
  );

  const doViewType = value => {
    setViewType(value);
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
          accessoryLeft={mapIcon}
          onPress={() => doViewType('map')}
          title="지도로 보기"
        />
        <MenuItem
          accessoryLeft={listIcon}
          onPress={() => doViewType('list')}
          title="목록으로 보기"
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

  return (
    <View>
      <TopNavigation
        title={renderTitle}
        accessoryRight={renderOverflowMenuAction}
      />
      {viewType === 'list' ? (
        <PlaceList statusType={statusValue} navigation={navigation} />
      ) : (
        <PlaceMap />
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
