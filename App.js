import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, Button, Layout} from '@ui-kitten/components';
import {BottomTab, Detail, MapDetail, Login} from './screens';
import {View, Text} from 'react-native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import useStore from './stores';
import {observer} from 'mobx-react';

const Stack = createStackNavigator();

const TotalStack = observer(() => {
  const {login} = useStore();
  const doClick = () => {
    console.log(login.isLogin);
    login.setIslogin(true);
    console.log(login.isLogin);
  };
  return (
    <>
      {!login.isLogin ? (
        <Login />
      ) : (
        // <View>
        //   <Text style={{color: 'black'}}>
        //     {login.isLogin ? 'true' : 'false'}
        //   </Text>
        //   <Button onPress={() => doClick()}>Click</Button>
        // </View>
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
      )}
    </>
  );
});

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <NavigationContainer>
        <TotalStack />
      </NavigationContainer>
    </ApplicationProvider>
  );
}
