import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Home, Map, Setting} from './screens';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: '#e91e63',
        }}>
        <Tab.Screen
          name="일정"
          options={{
            tabBarLabel: 'Homdde',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="contain-end"
                color={color}
                size={size}
              />
            ),
          }}
          component={Home}
        />
        <Tab.Screen
          name="지도"
          options={{
            tabBarLabel: 'Updates',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="weather-hail"
                color={color}
                size={size}
              />
            ),
          }}
          component={Map}
        />
        <Tab.Screen
          name="My"
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="bell-outline"
                color={color}
                size={size}
              />
            ),
          }}
          component={Setting}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
