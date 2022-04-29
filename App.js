import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import {ApplicationProvider} from '@ui-kitten/components';
import {BottomTab, Detail, MapDetail} from './screens';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

const Stack = createStackNavigator();

const TotalStack = () => {
  return (
    <Stack.Navigator initialRouteName="bottom-tab">
      <Stack.Screen
        name="bottom-tab"
        component={BottomTab}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="detail"
        component={Detail}
        options={{
          title: 'Custom animation',
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name="mapDetail"
        component={MapDetail}
        options={{
          title: '상세정보',
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <NavigationContainer>
        <TotalStack />
      </NavigationContainer>
    </ApplicationProvider>
  );
}
