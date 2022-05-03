import React, {useState} from 'react';
import {StyleSheet, Image, View} from 'react-native';
import {
  Card,
  Layout,
  List,
  Icon,
  Text,
  Spinner,
  ButtonGroup,
  Button,
  Avatar,
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {item} from '../mock/item';
import axios from 'axios';
import {kakaoLogin} from '../api/KakaoLogin';
import useStore from '../stores';
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
  const {login} = useStore();
  const doClick = async () => {
    // console.log(login);
    // login.increase();
    // const data = await getTestData();
    // console.log(data);
  };
  const renderItemHeader = (headerProps, name) => (
    <View {...headerProps}>
      <Text category="h6">{name}</Text>
    </View>
  );

  const doStack = () => {
    kakaoLogin();
    // navigation.navigate('detail');
  };

  const renderItem = info => {
    const {name, category, fullAddress, imageURL} = info.item;
    return (
      <Card
        style={styles.item}
        status="basic"
        header={headerProps => renderItemHeader(headerProps, name)}
        onPress={() => doStack()}
        // footer={renderItemFooter}
      >
        <View style={{flexDirection: 'row'}}>
          <Image
            style={styles.image}
            source={{
              uri: imageURL,
            }}
          />
          <View style={{paddingLeft: 10, paddingRight: 10, color: 'tomato'}}>
            <Text
              style={{
                letterSpacing: -0.8,
                fontSize: 14,
                color: 'tomato',
              }}>
              {category}
            </Text>
            <Text
              style={{
                letterSpacing: -1,
                fontSize: 14,
              }}>
              {fullAddress}
            </Text>
          </View>
        </View>

        <Button onPress={() => doClick()}>Click</Button>
        <Text>{login.number}</Text>
      </Card>
    );
  };

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

      {/* <View>
        <ButtonGroup style={styles.buttonGroup} status="warning">
          <Button>지도로 보기</Button>
          <Button>지역으로 보기</Button>
        </ButtonGroup>
        <Button
          status="warning"
          size="small"
          appearance="outline"
          accessoryLeft={mapIcon}
        />
      </View>
      <View>
        <Text>123</Text>
      </View> */}
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
  container: {
    maxHeight: '100%',
  },
  image: {
    width: 80,
    height: 80,
  },
  buttonGroup: {
    margin: 2,
  },
  contentContainer: {
    // paddingHorizontal: 8,
    // paddingVertical: 4,
  },
  item: {
    padding: 0,
    marginVertical: 4,
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
