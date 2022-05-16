// import React, {useState, useRef, useCallback} from 'react';
// import {StyleSheet, View, BackHandler, ToastAndroid} from 'react-native';
// import {
//   Icon,
//   Text,
//   Avatar,
//   MenuItem,
//   OverflowMenu,
//   TopNavigation,
//   TopNavigationAction,
// } from '@ui-kitten/components';
// import {useQueryClient} from 'react-query';
// import {useFocusEffect} from '@react-navigation/native';
// import {getPlaces} from '../api';
// import {observer} from 'mobx-react';
// import {PlaceList, PlaceMap, LoadingIndicator, Error} from '../components';
// import {PLACE_STATUS, VIEW_TYPE} from '../config/constants';
// import {useQuery} from 'react-query';
// import useStore from '../stores';

// const MenuIcon = props => (
//   <Icon {...props} fill="#d2d2d2" name="more-vertical" />
// );
// const StarIcon = (color, name) => {
//   return <Icon style={styles.icon} fill={color} name={name} />;
// };
// const mapIcon = props => <Icon {...props} fill="#8F9BB3" name="map-outline" />;
// const listIcon = props => (
//   <Icon {...props} fill="#8F9BB3" name="list-outline" />
// );

// export const Place = observer(({navigation}) => {
//   const queryClient = useQueryClient();
//   const {placeStore} = useStore();
//   const [allData, setAllData] = useState([]);
//   // const [isFirst, setIsFirst] = useState(true);
//   const [statusValue, setStatusValue] = useState(PLACE_STATUS.BACKLOG);
//   const [syncIconColor, setSyncIconColor] = useState('#d2d2d2');
//   // const [starIconColor, setStarIconColor] = useState('#d2d2d2');
//   // const [starIconName, setStarIconName] = useState('checkmark-circle-2');
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [forceRefresh, setForceRefresh] = useState(true);
//   const pulseIconRef = useRef();
//   const toggleMenu = () => {
//     setMenuVisible(!menuVisible);
//   };
//   const [exitApp, setExitApp] = useState(0);

//   useFocusEffect(
//     useCallback(() => {
//       const backAction = () => {
//         setTimeout(() => {
//           setExitApp(0);
//         }, 2000);
//         if (exitApp === 0) {
//           setExitApp(1);
//           ToastAndroid.show(
//             '한 번 더 누르시면 앱을 종료합니다.',
//             ToastAndroid.SHORT,
//           );
//         } else if (exitApp === 1) {
//           console.log('종료해랏');
//           BackHandler.exitApp();
//         }
//         return true;
//       };
//       const backHandler = BackHandler.addEventListener(
//         'hardwareBackPress',
//         backAction,
//       );
//       return () => backHandler.remove();
//     }),
//   );

//   const SyncIcon = () => (
//     <Icon
//       style={styles.icon}
//       fill={syncIconColor}
//       animation="pulse"
//       name="sync-outline"
//       ref={pulseIconRef}
//       onPress={() => iconPress()}
//     />
//   );

//   const iconPress = () => {
//     setSyncIconColor('#ffaa00');
//     refreshData();
//     setTimeout(() => {
//       setSyncIconColor('#d2d2d2');
//     }, 2200);
//   };

//   const {isLoading, data, error} = useQuery('getPlaces', getPlaces, {
//     onSuccess: items => {
//       if (forceRefresh) {
//         console.log('items all loading: ', items ? items.length : '');
//         setAllData(items);
//         // setIsFirst(false);
//         setForceRefresh(false);
//       }
//       console.log('getPlaces reload');
//     },
//     select: useCallback(
//       items => {
//         console.log('select filter item: ', items ? items.length : '');

//         const filterItems = items.filter(item => {
//           if (statusValue === PLACE_STATUS.BACKLOG) {
//             return item.status === PLACE_STATUS.BACKLOG;
//           } else if (statusValue === PLACE_STATUS.DONE)
//             return item.status === PLACE_STATUS.DONE;
//         });
//         return filterItems;
//       },
//       [statusValue, forceRefresh],
//     ),
//     onError: () => {
//       console.log('getPlaces failed');
//     },
//   });

//   const renderMenuAction = () => (
//     <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
//   );

//   const doViewType = value => {
//     if (value === VIEW_TYPE.LIST) {
//       placeStore.setViewType(VIEW_TYPE.LIST);
//     } else if (value === VIEW_TYPE.MAP) {
//       placeStore.setViewType(VIEW_TYPE.MAP);
//     }
//     toggleMenu();
//   };

//   const refreshData = () => {
//     queryClient.refetchQueries('getPlaces');
//     switch (statusValue) {
//       case PLACE_STATUS.ALL:
//         setStatusValue(PLACE_STATUS.ALL);
//         break;
//       case PLACE_STATUS.DONE:
//         setStatusValue(PLACE_STATUS.DONE);
//         break;
//       case PLACE_STATUS.BACKLOG:
//         setStatusValue(PLACE_STATUS.BACKLOG);
//         break;
//     }
//     setForceRefresh(true);
//     ToastAndroid.show('데이터를 새로 가져옵니다.', ToastAndroid.SHORT);
//   };

//   // const filterData = () => {
//   //   switch (statusValue) {
//   //     case PLACE_STATUS.ALL:
//   //       setStatusValue(PLACE_STATUS.DONE);
//   //       setStarIconColor('#ffaa00');
//   //       setStarIconName('checkmark-circle-2');
//   //       break;
//   //     case PLACE_STATUS.DONE:
//   //       setStatusValue(PLACE_STATUS.BACKLOG);
//   //       setStarIconColor('#d2d2d2');
//   //       setStarIconName('checkmark-circle-2-outline');
//   //       break;
//   //     case PLACE_STATUS.BACKLOG:
//   //       setStatusValue(PLACE_STATUS.ALL);
//   //       setStarIconColor('#d2d2d2');
//   //       setStarIconName('checkmark-circle-2');
//   //       break;
//   //   }
//   // };

//   const renderOverflowMenuAction = () => (
//     <React.Fragment>
//       <TopNavigationAction icon={() => SyncIcon()} />
//       {/* <TopNavigationAction
//         onPress={() => filterData()}
//         icon={() => StarIcon(starIconColor, starIconName)}
//       /> */}
//       <OverflowMenu
//         anchor={renderMenuAction}
//         visible={menuVisible}
//         onBackdropPress={toggleMenu}>
//         <MenuItem
//           accessoryLeft={listIcon}
//           onPress={() => doViewType(VIEW_TYPE.LIST)}
//           title="목록으로 보기"
//         />
//         <MenuItem
//           accessoryLeft={mapIcon}
//           onPress={() => doViewType(VIEW_TYPE.MAP)}
//           title="지도로 보기"
//         />
//       </OverflowMenu>
//     </React.Fragment>
//   );

//   const renderTitle = props => (
//     <View style={styles.titleContainer}>
//       <Avatar
//         style={styles.logo}
//         source={require('../assets/images/logo.png')}
//       />
//       <Text {...props}>
//         {statusValue === PLACE_STATUS.ALL
//           ? '가봐야지도'
//           : statusValue === PLACE_STATUS.DONE
//           ? '가봤지'
//           : '가봐야지'}
//       </Text>
//     </View>
//   );

//   const naviMapInfo = coordinate => {
//     navigation.push('mapInfo', {coordinate});
//   };

//   if (isLoading) {
//     return <LoadingIndicator />;
//   }

//   if (error) {
//     return <Error />;
//   }

//   return (
//     <View>
//       <TopNavigation
//         title={renderTitle}
//         accessoryRight={renderOverflowMenuAction}
//       />
//       {placeStore.viewType === VIEW_TYPE.LIST ? (
//         <PlaceList
//           allData={allData}
//           data={data}
//           navigation={navigation}
//           refreshData={refreshData}
//           naviMapInfo={naviMapInfo}
//           setStatusValue={setStatusValue}
//         />
//       ) : (
//         <PlaceMap data={data} setStatusValue={setStatusValue} />
//       )}
//     </View>
//   );
// });

// const styles = StyleSheet.create({
//   image: {
//     width: 80,
//     height: 80,
//   },
//   buttonGroup: {
//     margin: 2,
//   },
//   searchInput: {
//     margin: 4,
//   },
//   icon: {
//     width: 24,
//     height: 24,
//     tintColor: '#222B45',
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   logo: {
//     marginHorizontal: 16,
//   },
// });
