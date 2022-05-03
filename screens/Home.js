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
import {item} from '../mock/item';
import {kakaoLogin} from '../api/KakaoLogin';
import {observer} from 'mobx-react';
import {PlaceList, PlaceMap} from '../components';

const MenuIcon = props => <Icon {...props} name="more-vertical" />;

const InfoIcon = props => <Icon {...props} name="info" />;

const LogoutIcon = props => <Icon {...props} name="log-out" />;

// const getTestData = () => {
//   return new Promise(resolve => {
//     axios
//       .get('https://map.naver.com/v5/api/sites/summary/1496912473?lang=ko')
//       .then(res => {
//         resolve(res.data);
//       });
//   });
// };

const listIcon = props => (
  <Icon {...props} fill="#8F9BB3" name="list-outline" />
);

const mapIcon = props => <Icon {...props} fill="#8F9BB3" name="map-outline" />;

const StarIcon = () => <Icon style={styles.icon} fill="#8F9BB3" name="star" />;

const data = item;
export const Home = observer(({navigation}) => {
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

  const renderOverflowMenuAction = () => (
    <React.Fragment>
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
      {viewType === 'list' ? <PlaceList /> : <PlaceMap />}
    </View>
    // <View style={{backgroundColor: 'white'}}>
    //   <Text style={{display: 'none'}}>{login.number}</Text>
    //   <List
    //     style={styles.container}
    //     contentContainerStyle={styles.contentContainer}
    //     data={data}
    //     renderItem={renderItem}
    //   />
    // </View>
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
    width: 32,
    height: 32,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginHorizontal: 16,
  },
});
