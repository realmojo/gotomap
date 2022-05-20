import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {PlaceBacklog, PlaceDone, Map, My} from './index';

const Tab = createMaterialTopTabNavigator();

export const BottomTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="PlaceBacklog"
      screenOptions={{
        tabBarActiveTintColor: '#7b7b7b',
        tabBarInactiveTintColor: '#dedede',
        tabBarLabelStyle: {fontSize: 12},
        tabBarIcon: {focused: true, color: '#aaa'},
        tabBarStyle: {backgroundColor: 'white'},
        tabBarPressColor: '#dedede',
      }}
      tabBarPosition="bottom">
      <Tab.Screen
        name="Map"
        component={Map}
        options={{
          lazy: true,
          tabBarLabel: '검색',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="magnify" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="PlaceBacklog"
        component={PlaceBacklog}
        options={{
          lazy: true,
          lazyPreloadDistance: 1,
          tabBarLabel: '가봐야지',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="map-marker-outline"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="PlaceDone"
        component={PlaceDone}
        options={{
          lazy: true,
          lazyPreloadDistance: 1,
          tabBarLabel: '가봤지',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="map-marker" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="My"
        component={My}
        options={{
          lazy: true,
          tabBarLabel: '설정',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="cog-outline"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
