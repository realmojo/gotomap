import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';

const url = `https://map.naver.com/v5/api/sites/summary/11721719?lang=ko`;

const getMapDetailInfo = id => {
  return new Promise(resolve => {
    axios
      .get(`https://map.naver.com/v5/api/sites/summary/${id}?lang=ko`)
      .then(res => {
        resolve(res.data);
      });
  });
};

export const MapDetail = ({route: {params}}) => {
  const {id} = params;
  const [item, setItem] = useState({});

  useEffect(() => {
    async function fetchAndSetUser() {
      const data = await getMapDetailInfo(id);
      setItem(data);
    }
    fetchAndSetUser();
  }, []);
  return (
    <View>
      <Text style={{color: 'black'}}>
        ddd{item.address} {item.fullAddress}
      </Text>
    </View>
  );
};
