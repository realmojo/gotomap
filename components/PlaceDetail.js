import React, {useState, useCallback, useEffect} from 'react';
import {PlaceDetailText} from './';
import {isEmpty} from '../utils';
import {updatePlaceStatus, updatePlaceMemo} from '../api';
import {StyleSheet, View, ScrollView} from 'react-native';
import {
  Text,
  Input,
  Avatar,
  Button,
  Layout,
  ListItem,
} from '@ui-kitten/components';
import {PLACE_STATUS, PLACE_STATUS_KR, QUERY_KEY} from '../config/constants';
import {useQueryClient, useMutation} from 'react-query';
import {Category, Title} from '../utils';
import {placeStore} from '../stores/place';

export const PlaceDetail = ({placeItem, setPlaceItem, queryKey}) => {
  const queryClient = useQueryClient();
  const {
    _id,
    category,
    title,
    imageURL,
    fullAddress,
    fullRoadAddress,
    phone,
    created,
    description,
    options,
    keywords,
    bizhourInfo,
    status,
    memo,
  } = placeItem;

  const [isMemoInput, setIsMemoInput] = useState(false);
  const [value, setValue] = useState('');
  const [stateMemo, setStateMemo] = useState('');
  const [forceStatusText, setForceStatusText] = useState('');
  const [forceStatusAppearance, setForceStatusAppearance] = useState('');

  useEffect(() => {
    setStateMemo(memo);
  });

  const doSave = _id => {
    setIsMemoInput(false);
    setStateMemo(value);
    doUpdatePlaceMemo({_id, memo: value});
  };

  const doUpdatePlaceMemo = useCallback(
    params => {
      updateMutationMemo.mutate(params);
    },
    [updateMutationMemo],
  );

  const doUpdatePlaceStatus = useCallback(
    params => {
      updateMutationStatus.mutate(params);
    },
    [updateMutationStatus],
  );

  const updateMutationMemo = useMutation(params => updatePlaceMemo(params), {
    onMutate: item => {
      const previousValue = queryClient.setQueryData(queryKey, places => {
        const findIndex = places.findIndex(place => {
          return place._id === item._id;
        });
        places[findIndex].memo = item.memo;
        if (setPlaceItem) {
          setPlaceItem(places[findIndex]);
        }
        placeStore.setPlaceItemRefresh();
        return places;
      });
      return previousValue;
    },
    onSuccess: item => {
      queryClient.setQueryData(QUERY_KEY.ALL, places => {
        const findIndex = places.findIndex(place => {
          return place._id === item._id;
        });
        places[findIndex].memo = item.memo;
        return places;
      });
    },
  });

  const updateMutationStatus = useMutation(
    params => updatePlaceStatus(params),
    {
      onMutate: item => {
        if (forceStatusText === 'done') {
          queryKey = QUERY_KEY.DONE;
        } else if (forceStatusText === 'backlog') {
          queryKey = QUERY_KEY.BACKLOG;
        }

        placeStore.setForceBacklogRefresh(true);
        placeStore.setForceDoneRefresh(true);
        if (queryKey === QUERY_KEY.BACKLOG) {
          setForceStatusAppearance('filled');
          setForceStatusText('done');
        } else if (queryKey === QUERY_KEY.DONE) {
          setForceStatusAppearance('outline');
          setForceStatusText('backlog');
        }

        const previousValue = queryClient.setQueryData(queryKey, places => {
          const filterPlace = places.filter(place => {
            return place._id !== item._id;
          });
          return filterPlace;
        });

        return previousValue;
      },
      onSuccess: item => {
        // if (queryKey === QUERY_KEY.BACKLOG || (queryKey === QUERY_KEY.ALL && item.status === PLACE_STATUS.DONE)) {
        if (item.status === PLACE_STATUS.DONE) {
          queryClient.setQueryData(QUERY_KEY.DONE, places => {
            return [item, ...places];
          });
          // } else if (queryKey === QUERY_KEY.DONE || (queryKey === QUERY_KEY.ALL && item.status === PLACE_STATUS.BACKLOG)) {
        } else if (item.status === PLACE_STATUS.BACKLOG) {
          queryClient.setQueryData(QUERY_KEY.BACKLOG, places => {
            return [item, ...places];
          });
        }

        queryClient.invalidateQueries(QUERY_KEY.ALL);
        queryClient.setQueryData(QUERY_KEY.PLACE_COUNT, placeCount => {
          const {totalCount, backlogCount, doneCount} = placeCount;
          return {
            totalCount,
            backlogCount:
              queryKey === QUERY_KEY.BACKLOG
                ? backlogCount - 1
                : backlogCount + 1,
            doneCount:
              queryKey === QUERY_KEY.BACKLOG ? doneCount + 1 : doneCount - 1,
          };
        });
      },
    },
  );

  return (
    <View style={styles.modalContent}>
      <ScrollView>
        <Layout style={styles.modalContentBody}>
          <ListItem
            style={{backgroundColor: 'transparent'}}
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
            <PlaceDetailText
              iconName="map-marker"
              category="?????? ??????"
              title={fullAddress}
            />
          )}
          {isEmpty(fullRoadAddress) && (
            <PlaceDetailText
              iconName="map-marker"
              category="????????? ??????"
              title={fullRoadAddress}
            />
          )}
          {isEmpty(phone) && (
            <PlaceDetailText iconName="phone" category="?????????" title={phone} />
          )}
          {isEmpty(bizhourInfo) && (
            <PlaceDetailText
              iconName="clock-time-nine-outline"
              category="????????????"
              title={bizhourInfo}
            />
          )}
          {isEmpty(options) && (
            <PlaceDetailText iconName="cube" category="??????" title={options} />
          )}
          {isEmpty(keywords) && (
            <PlaceDetailText
              iconName="key"
              category="?????????"
              title={keywords}
            />
          )}
          {isEmpty(description) && (
            <PlaceDetailText
              iconName="note-outline"
              category="??????"
              title={description}
            />
          )}
          {isMemoInput ? (
            <>
              <Input
                style={{padding: 10}}
                placeholder="???????????? ?????? ????????? ???????????????"
                size="medium"
                status="warning"
                multiline={true}
                textStyle={{minHeight: 64}}
                value={value}
                onBlur={() => doSave(_id)}
                onChangeText={nextValue => setValue(nextValue)}
              />
              <Button
                style={{marginHorizontal: 10}}
                size="small"
                status="warning"
                onPress={() => doSave(_id)}>
                ??????
              </Button>
            </>
          ) : (
            <PlaceDetailText
              iconName="pencil-outline"
              category="??????"
              title={stateMemo ? stateMemo : ''}
              doPress={() => {
                setIsMemoInput(true);
                setValue(stateMemo);
              }}
            />
          )}
          {isEmpty(created) && (
            <PlaceDetailText
              iconName="check"
              category="????????????"
              title={created}
            />
          )}
        </Layout>
      </ScrollView>
      {!isMemoInput && (
        <View>
          <Button
            size="giant"
            appearance={
              forceStatusAppearance
                ? forceStatusAppearance
                : status === PLACE_STATUS.BACKLOG
                ? 'outline'
                : 'filled'
            }
            onPress={() =>
              doUpdatePlaceStatus({
                _id,
                status:
                  forceStatusText === 'done'
                    ? 'backlog'
                    : forceStatusText === 'backlog'
                    ? 'done'
                    : status === PLACE_STATUS.BACKLOG
                    ? PLACE_STATUS.DONE
                    : PLACE_STATUS.BACKLOG,
              })
            }
            status="warning">
            <Text>
              {forceStatusText
                ? PLACE_STATUS_KR[forceStatusText.toUpperCase()]
                : status === PLACE_STATUS.BACKLOG
                ? PLACE_STATUS_KR.BACKLOG
                : PLACE_STATUS_KR.DONE}
            </Text>
          </Button>
        </View>
      )}
    </View>
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
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContentBody: {
    padding: 10,
    backgroundColor: 'transparent',
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
