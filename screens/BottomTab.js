import React, {useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {Place, Map, My} from './index';

const Tab = createMaterialBottomTabNavigator();

export const BottomTab = () => {
  const [currentScreen, setCurrentScreen] = useState('Map');
  const [togglePlace, setTogglePlace] = useState(true);
  return (
    <Tab.Navigator
      initialRouteName="Map"
      activeColor="#ff6721"
      inactiveColor="#7b7b7b"
      barStyle={{backgroundColor: '#fff'}}>
      <Tab.Screen
        name="Place"
        component={Place}
        listeners={{
          tabPress: () => {
            if (currentScreen === 'Place') {
              setTogglePlace(!togglePlace);
            }
            setCurrentScreen('Place');
          },
        }}
        options={{
          tabBarLabel: '가봐야지',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="map-marker-outline"
              color={color}
              size={20}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={Map}
        options={{
          tabBarLabel: '검색',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="magnify" color={color} size={20} />
          ),
        }}
        listeners={{
          tabPress: e => {
            // e.preventDefault();
            setCurrentScreen('Map');
          },
        }}
      />
      <Tab.Screen
        name="My"
        component={My}
        options={{
          tabBarLabel: '설정',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="cog-outline"
              color={color}
              size={20}
            />
          ),
        }}
        listeners={{
          tabPress: e => {
            // e.preventDefault();
            setCurrentScreen('My');
          },
        }}
      />
    </Tab.Navigator>
  );
};
