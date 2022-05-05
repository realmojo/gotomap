import React, {useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, Text, ListItem, Avatar, Button} from '@ui-kitten/components';
import {PLACE_STATUS} from '../config/constants';
import {TextDetail} from './index';
import {updatePlaceStatus} from '../api';
import {useQueryClient, useMutation} from 'react-query';

const PlaceListItem = ({item, navigation}) => {
  const {fullAddress, placeId} = item.item;
  const queryClient = useQueryClient();

  const mutation = useMutation(params => updatePlaceStatus(params), {
    onMutate: item => {
      const previosValue = queryClient.getQueryData('getPlaces');
      queryClient.setQueryData('getPlaces', places => {
        const findIndex = places.findIndex(place => {
          return place._id === item.id;
        });
        places[findIndex].status = item.status;
        return places;
      });
      return previosValue;
    },
  });

  const doUpdatePlaceStatus = useCallback(
    params => {
      mutation.mutate(params);
    },
    [mutation],
  );
  const doStack = id => {
    navigation.push('mapDetail', {id});
  };

  const renderItemHeader = item => {
    const {_id: id, title, category, imageURL, status} = item;
    return (
      <ListItem
        style={{padding: 10}}
        title={title}
        description={category}
        accessoryLeft={() => (
          <Avatar
            source={
              imageURL ? {uri: imageURL} : require('../assets/images/logo.png')
            }
          />
        )}
        accessoryRight={() => (
          <Button
            style={{margin: 10}}
            size="small"
            appearance={status === PLACE_STATUS.BACKLOG ? 'outline' : 'filled'}
            onPress={() =>
              doUpdatePlaceStatus({
                id,
                status:
                  status === PLACE_STATUS.BACKLOG
                    ? PLACE_STATUS.DONE
                    : PLACE_STATUS.BACKLOG,
              })
            }
            status="warning">
            <Text style={{fontSize: 19}}>
              {status === PLACE_STATUS.BACKLOG ? '가봐야지' : '가봤지'}
            </Text>
          </Button>
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
          header={() => renderItemHeader(item.item)}
          onPress={() => doStack(placeId)}>
          <TextDetail iconName="map-marker" text={fullAddress} />
        </Card>
      </View>
    ),
    [item.item.status],
  );
};

const styles = StyleSheet.create({
  item: {
    marginVertical: 4,
  },
});

export {PlaceListItem};
