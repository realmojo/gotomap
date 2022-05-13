import React, {useEffect} from 'react';
import Modal from 'react-native-modal';
import {PlaceModalDetailText} from '../components';
import {isEmpty} from '../utils';
import {StyleSheet, View, Dimensions, ScrollView} from 'react-native';
import {
  Icon,
  Text,
  Layout,
  Button,
  ListItem,
  Avatar,
} from '@ui-kitten/components';
import {PLACE_STATUS, PLACE_STATUS_KR} from '../config/constants';
import {Category, Title} from '../utils';

const deviceWidth = Dimensions.get('window').width;
const closeIcon = props => <Icon {...props} name="close-outline" />;
export const PlaceModalDetail = ({
  placeItem,
  isModalVisible,
  toggleModal,
  doUpdatePlaceStatus,
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

  return (
    <Modal
      style={styles.bottomModal}
      onBackButtonPress={toggleModal}
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
        <View style={{flex: 1}}>
          <ScrollView>
            <Layout style={styles.modalContentBody}>
              <ListItem
                title={() => <Category value={category} />}
                description={() => <Title value={title} />}
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
              {isEmpty(bizhourInfo) && (
                <PlaceModalDetailText
                  iconName="clock-time-nine-outline"
                  category="영업시간"
                  title={bizhourInfo}
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
              {isEmpty(description) && (
                <PlaceModalDetailText
                  iconName="note-outline"
                  category="설명"
                  title={description}
                />
              )}
              <PlaceModalDetailText
                iconName="pencil-outline"
                category="메모"
                title={memo}
              />
              {isEmpty(regdate) && (
                <PlaceModalDetailText
                  iconName="check"
                  category="등록날짜"
                  title={regdate}
                />
              )}
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
