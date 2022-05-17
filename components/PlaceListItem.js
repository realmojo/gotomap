import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {
  Card,
  Text,
  Icon,
  Input,
  Avatar,
  Button,
  ListItem,
} from '@ui-kitten/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {PLACE_STATUS} from '../config/constants';
import {TextDetail} from './index';
import {updatePlaceMemo, removePlace} from '../api';
import {useQueryClient, useMutation} from 'react-query';

const removeIcon = props => <Icon {...props} name="trash-2-outline" />;

const PlaceListItem = ({callbackModal, item, naviMapInfo, queryKey}) => {
  const queryClient = useQueryClient();
  const {fullAddress, latitude, longitude, memo, title, status} = item.item;
  const [isMemoInput, setIsMemoInput] = useState(false);
  const [value, setValue] = useState('');

  const doDelete = (title, _id) => {
    Alert.alert(
      `${title} 장소를 삭제합니다.`,
      '삭제를 하시면 복구를 하실 없습니다.',
      [
        {
          text: '취소',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: '삭제',
          onPress: () => {
            doDeletePlace(_id);
          },
        },
      ],
    );
  };

  const doPress = () => {
    naviMapInfo({latitude, longitude});
  };

  const doSave = _id => {
    setIsMemoInput(false);
    doUpdatePlaceMemo({_id, memo: value});
  };

  const doDeletePlace = useCallback(
    params => {
      deleteMutation.mutate(params);
    },
    [deleteMutation],
  );

  const doUpdatePlaceMemo = useCallback(
    params => {
      updateMutationMemo.mutate(params);
    },
    [updateMutationMemo],
  );

  const updateMutationMemo = useMutation(params => updatePlaceMemo(params), {
    onMutate: item => {
      const previousValue = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, places => {
        const findIndex = places.findIndex(place => {
          return place._id === item._id;
        });
        places[findIndex].memo = item.memo;
        return places;
      });

      return previousValue;
    },
  });

  const deleteMutation = useMutation(params => removePlace(params), {
    onMutate: item => {
      const previosValue = queryClient.setQueryData(queryKey, places => {
        const newPlaces = places.filter(place => {
          return place._id !== item;
        });
        return newPlaces;
      });
      return previosValue;
    },
  });

  const renderItemHeader = item => {
    const {_id, title, category, imageURL, status} = item;
    return (
      <ListItem
        title={() => (
          <View style={styles.itemHeader}>
            <Text style={styles.itemHeaderTitle} category="p2">
              {title}
            </Text>
            {status === PLACE_STATUS.DONE && (
              <MaterialCommunityIcons
                style={styles.itemHeaderIcon}
                name="check-circle"
                color="#00C2CB"
                size={16}
              />
            )}
          </View>
        )}
        description={category}
        onPress={() => {
          callbackModal(item);
        }}
        onLongPress={() => {
          doDelete(title, _id);
        }}
        accessoryLeft={() => (
          <Avatar
            style={styles.emptyLogo}
            source={
              imageURL
                ? {uri: imageURL}
                : queryKey === 'getPlaceBacklogs'
                ? require('../assets/images/logo.png')
                : require('../assets/images/logo-done.png')
            }
          />
        )}
        accessoryRight={() => (
          <Button
            size="small"
            appearance="ghost"
            status="basic"
            accessoryLeft={removeIcon}
            onPress={() => doDelete(title, _id)}
          />
        )}
      />
    );
  };
  return useMemo(
    () => (
      <View>
        <Card
          style={styles.item}
          status="basic"
          header={() => renderItemHeader(item.item)}>
          <TextDetail
            iconName="map-marker"
            text={fullAddress}
            doPress={doPress}
          />

          {isMemoInput ? (
            <>
              <Input
                style={styles.input}
                placeholder="입력하고 싶은 내용을 적어주세요"
                size="medium"
                status="warning"
                multiline={true}
                textStyle={{minHeight: 40}}
                value={value}
                // onBlur={() => doSave(item.item._id)}
                onChangeText={nextValue => setValue(nextValue)}
              />
              <Button
                style={styles.saveButton}
                size="small"
                status="warning"
                onPress={() => doSave(item.item._id)}>
                저장
              </Button>
            </>
          ) : (
            <TextDetail
              iconName="pencil-outline"
              text={memo ? memo : ''}
              doPress={() => {
                setIsMemoInput(true);
                setValue(memo);
              }}
            />
          )}
        </Card>
      </View>
    ),
    [item.item, memo, status, isMemoInput, value],
  );
};

const styles = StyleSheet.create({
  itemHeader: {flexDirection: 'row'},
  itemHeaderTitle: {paddingLeft: 8},
  itemHeaderIcon: {paddingLeft: 4, paddingTop: 1},
  emptyLogo: {marginLeft: 10},
  item: {
    marginVertical: 4,
  },
  saveButton: {
    marginHorizontal: 10,
  },
  input: {
    padding: 10,
  },
});

export {PlaceListItem};
