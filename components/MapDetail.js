import React, {useState} from 'react';
import {LoadingIndicator, PlaceDetailText} from '.';
import {addPlace} from '../api';
import {PLACE_STATUS, QUERY_KEY} from '../config/constants';
import {
  Category,
  Title,
  isEmpty,
  isEmptyArray,
  optionText,
  getSidoAndSigungu,
} from '../utils';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Avatar, Layout, Button, ListItem} from '@ui-kitten/components';
import {useQueryClient, useMutation} from 'react-query';
import {placeStore} from '../stores/place';
import {userStore} from '../stores/user';

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'orange'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 24,
        fontWeight: '800',
      }}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
};

export const MapDetail = ({searchItem}) => {
  const queryClient = useQueryClient();
  const [isGo, setIsGo] = useState(false);

  const addMutation = useMutation(addPlace, {
    onMutate: () => {
      placeStore.setForceBacklogRefresh(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.ALL);
      queryClient.invalidateQueries(QUERY_KEY.BACKLOG);
      queryClient.invalidateQueries(QUERY_KEY.PLACE_COUNT);
    },
  });

  const doGo = async () => {
    showToast();
    const {
      id: placeId,
      name: title,
      y: latitude,
      x: longitude,
      imageURL,
      phone,
      category,
      fullAddress,
      addressAbbr,
      fullRoadAddress,
      description,
      options,
      keywords,
      bizhourInfo,
    } = searchItem;
    const {sido, sigungu} = getSidoAndSigungu(fullAddress, addressAbbr);
    const params = {
      placeId,
      userId: userStore.userId,
      latitude, // ??????
      longitude, // ??????
      title,
      description,
      fullAddress,
      fullRoadAddress,
      imageURL,
      category,
      phone,
      options: optionText(options),
      keywords: keywords ? keywords.join('/') : '',
      bizhourInfo: bizhourInfo ? bizhourInfo : '',
      status: PLACE_STATUS.BACKLOG,
      memo: '',
      sido,
      sigungu,
      created: moment().format('YYYY-MM-DD HH:mm:ss'),
      updated: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    try {
      setIsGo(!isGo);
      addMutation.mutate(params);
    } catch (e) {
      console.log(e);
    }
  };

  // Toast ????????? ??????
  const showToast = () => {
    Toast.show({
      text1: '????????????',
      text2: '????????? ??? ???????????? ??????! ???????????? ?????????????????? ????',
      position: 'bottom',
      bottomOffset: 0,
    });
  };

  return (
    <View style={styles.contentBody}>
      {!searchItem.name ? (
        <LoadingIndicator />
      ) : (
        <>
          <ScrollView>
            <ListItem
              style={{backgroundColor: 'transparent'}}
              title={() => <Category value={searchItem.category} />}
              description={() => <Title value={searchItem.name} />}
              accessoryRight={() => (
                <Avatar
                  source={
                    searchItem.imageURL
                      ? {uri: searchItem.imageURL}
                      : require('../assets/images/logo.png')
                  }
                />
              )}
            />
            {searchItem.imageURL && (
              <View style={styles.imageWrap}>
                <Image
                  style={styles.image}
                  source={{
                    uri: searchItem.imageURL,
                  }}
                />
              </View>
            )}
            {isEmpty(searchItem.phone) && (
              <PlaceDetailText
                iconName="phone"
                category="?????????"
                title={searchItem.phone}
              />
            )}
            {isEmpty(searchItem.fullRoadAddress) && (
              <PlaceDetailText
                iconName="map-marker"
                category="???????????????"
                title={searchItem.fullRoadAddress}
              />
            )}
            {isEmptyArray(searchItem.options) && (
              <PlaceDetailText
                iconName="cube"
                category="??????"
                title={optionText(searchItem.options)}
              />
            )}
            {isEmptyArray(searchItem.keywords) && (
              <PlaceDetailText
                iconName="key"
                category="?????????"
                title={searchItem.keywords.join('/')}
              />
            )}
            {isEmpty(searchItem.bizhourInfo) && (
              <PlaceDetailText
                iconName="clock-time-nine-outline"
                category="????????????"
                title={searchItem.bizhourInfo}
              />
            )}
            {isEmpty(searchItem.description) && (
              <PlaceDetailText
                iconName="note-outline"
                category="??????"
                title={searchItem.description}
              />
            )}
          </ScrollView>
          <Layout level="1">
            <Button status="warning" size="large" onPress={() => doGo()}>
              <Text style={styles.goText}>???????????? </Text>
              {isGo ? <MaterialCommunityIcons name="check" size={16} /> : ''}
            </Button>
          </Layout>
          <Toast config={toastConfig} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  contentBody: {
    flex: 1,
    padding: 10,
  },
  imageWrap: {
    width: Dimensions.get('screen').width,
    height: 250,
  },
  image: {
    width: '100%',
    minHeight: 250,
  },
  goText: {
    color: 'white',
  },
});
