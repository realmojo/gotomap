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
import {PLACE_STATUS, PLACE_STATUS_KR} from '../config/constants';
import {TextDetail} from './index';
import {updatePlaceStatus, updatePlaceMemo, removePlace} from '../api';
import {useQueryClient, useMutation} from 'react-query';

const removeIcon = props => <Icon {...props} name="trash-2-outline" />;
const checkIcon = props => <Icon {...props} name="check-circle" />;

const PlaceListItem = ({callbackModal, item, naviMapInfo}) => {
  const queryClient = useQueryClient();
  const {fullAddress, latitude, longitude, memo} = item.item;
  const [isMemoInput, setIsMemoInput] = useState(false);
  const [value, setValue] = useState('');
  const [stateMemo, setStateMemo] = useState('');

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
            doDeletePlaceStatus(_id);
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

  const doUpdatePlaceStatus = useCallback(
    params => {
      updateMutation.mutate(params);
    },
    [updateMutation],
  );

  const doDeletePlaceStatus = useCallback(
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
      const previousValue = queryClient.setQueryData('getPlaces', places => {
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
      const previosValue = queryClient.setQueryData('getPlaces', places => {
        const newPlaces = places.filter(place => {
          return place._id !== item;
        });
        return newPlaces;
      });
      return previosValue;
    },
  });

  const updateMutation = useMutation(params => updatePlaceStatus(params), {
    onMutate: item => {
      const previousValue = queryClient.setQueryData('getPlaces', places => {
        const findIndex = places.findIndex(place => {
          return place._id === item._id;
        });
        places[findIndex].status = item.status;
        return places;
      });
      return previousValue;
    },
  });

  const renderItemHeader = item => {
    const {_id, title, category, imageURL, status} = item;
    return (
      <ListItem
        title={() => (
          <View style={{flexDirection: 'row'}}>
            <Text style={{paddingLeft: 8}} category="p2">
              {title}
            </Text>
            {status === PLACE_STATUS.DONE && (
              <MaterialCommunityIcons
                style={{paddingLeft: 4, paddingTop: 1}}
                name="check-circle"
                color="#ffaa00"
                size={16}
              />
            )}
          </View>
        )}
        // title={title}
        description={category}
        onPress={() => {
          callbackModal(item);
        }}
        onLongPress={() => {
          doDelete(title, _id);
        }}
        accessoryLeft={() => (
          <Avatar
            style={{marginLeft: 10}}
            source={
              imageURL ? {uri: imageURL} : require('../assets/images/logo.png')
            }
          />
        )}
        accessoryRight={() => (
          <>
            {/* <Button
              style={{marginRight: 10}}
              size="tiny"
              appearance={
                status === PLACE_STATUS.BACKLOG ? 'outline' : 'filled'
              }
              onPress={() =>
                doUpdatePlaceStatus({
                  _id,
                  status:
                    status === PLACE_STATUS.BACKLOG
                      ? PLACE_STATUS.DONE
                      : PLACE_STATUS.BACKLOG,
                })
              }
              status="warning">
              <Text style={{fontSize: 19}}>
                {status === PLACE_STATUS.BACKLOG
                  ? PLACE_STATUS_KR.BACKLOG
                  : PLACE_STATUS_KR.DONE}
              </Text>
            </Button> */}
            <Button
              size="small"
              appearance="ghost"
              status="basic"
              accessoryLeft={removeIcon}
              onPress={() => doDelete(title, _id)}
            />
          </>
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
                style={{padding: 10}}
                placeholder="입력하고 싶은 내용을 적어주세요"
                size="medium"
                status="warning"
                multiline={true}
                textStyle={{minHeight: 64}}
                value={value}
                onBlur={() => doSave(item.item._id)}
                onChangeText={nextValue => setValue(nextValue)}
              />
              <Button
                style={{marginHorizontal: 10}}
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
    [item.item.status, item.item.title, item.item.memo, isMemoInput, value],
  );
};

const styles = StyleSheet.create({
  item: {
    marginVertical: 4,
  },
});

export {PlaceListItem};
