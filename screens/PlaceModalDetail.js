import React, {useEffect} from 'react';
import Modal from 'react-native-modal';
import {PlaceModalDetailText} from '../components';
import {isEmpty} from '../utils';
import {
  StyleSheet,
  View,
  Dimensions,
  BackHandler,
  ScrollView,
} from 'react-native';
import {
  Icon,
  Text,
  Layout,
  Button,
  ListItem,
  Avatar,
} from '@ui-kitten/components';
import {PLACE_STATUS, PLACE_STATUS_KR} from '../config/constants';
import {LoadingIndicator} from '../components';

const deviceWidth = Dimensions.get('window').width;
const closeIcon = props => <Icon {...props} name="close-outline" />;
export const PlaceModalDetail = ({
  placeItem,
  modalLoading,
  isModalVisible,
  toggleModal,
  doUpdatePlaceStatus,
  naviMapInfo,
}) => {
  const {
    category,
    title,
    imageURL,
    fullAddress,
    fullRoadAddress,
    phone,
    regdate,
    description,
    options,
    keywords,
    bizhourInfo,
    status,
    memo,
  } = placeItem;

  useEffect(() => {
    const backAction = () => {
      console.log('back');
      // if (isModalVisible) {
      //   setModalVisible(!isModalVisible);
      // }
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
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
                <ListItem
                  title={() =>
                    category && (
                      <Text style={styles.categoryText}>{category}</Text>
                    )
                  }
                  description={() =>
                    title && <Text category="h4">{title}</Text>
                  }
                  accessoryRight={() => (
                    <Avatar
                      source={
                        imageURL
                          ? {uri: imageURL}
                          : require('../assets/images/logo.png')
                      }
                    />
                  )}
                />
                {isEmpty(fullAddress) && (
                  <PlaceModalDetailText
                    iconName="map-marker"
                    category="지번 주소"
                    title={fullAddress}
                  />
                )}
                {isEmpty(fullRoadAddress) && (
                  <PlaceModalDetailText
                    iconName="map-marker"
                    category="도로명 주소"
                    title={fullRoadAddress}
                  />
                )}
                {isEmpty(phone) && (
                  <PlaceModalDetailText
                    iconName="phone"
                    category="연락처"
                    title={phone}
                  />
                )}
                {isEmpty(options) && (
                  <PlaceModalDetailText
                    iconName="cube"
                    category="옵션"
                    title={options}
                  />
                )}
                {isEmpty(keywords) && (
                  <PlaceModalDetailText
                    iconName="key"
                    category="키워드"
                    title={keywords}
                  />
                )}
                {isEmpty(bizhourInfo) && (
                  <PlaceModalDetailText
                    iconName="clock-time-nine-outline"
                    category="영업시간"
                    title={bizhourInfo}
                  />
                )}
                {isEmpty(description) && (
                  <PlaceModalDetailText
                    iconName="note-outline"
                    category="설명"
                    title={description}
                  />
                )}
                {isEmpty(regdate) && (
                  <PlaceModalDetailText
                    iconName="check"
                    category="등록날짜"
                    title={regdate}
                  />
                )}
                {/* 
                {memo && (
                  <PlaceModalDetailText
                    iconName="clock-time-nine-outline"
                    category="메모"
                    title={memo}
                  />
                )} */}
              </Layout>
            </ScrollView>
            <View style={styles.modalContentFooter}>
              <Button
                size="giant"
                appearance={
                  status === PLACE_STATUS.BACKLOG ? 'outline' : 'filled'
                }
                onPress={() => doUpdatePlaceStatus(placeItem)}
                status="warning">
                <Text>
                  {status === PLACE_STATUS.BACKLOG
                    ? PLACE_STATUS_KR.BACKLOG
                    : PLACE_STATUS_KR.DONE}
                </Text>
              </Button>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    padding: 10,
  },
  modalContentFooter: {},
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
  modalIcon: {
    marginRight: 4,
  },
  modalText: {
    paddingRight: 20,
  },
  categoryText: {
    fontSize: 12,
    color: '#aaa',
  },
});
