import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {Place, Map, My} from './index';

const Tab = createMaterialBottomTabNavigator();

export const BottomTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="Place"
      activeColor="#ff6721"
      inactiveColor="#7b7b7b"
      barStyle={{backgroundColor: '#fff'}}>
      <Tab.Screen
        name="Place"
        component={Place}
        options={{
          tabBarLabel: 'Place',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={Map}
        options={{
          tabBarLabel: 'Map',
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
        name="My"
        component={My}
        options={{
          tabBarLabel: 'My',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="account" color={color} size={20} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
