import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {BottomTab, Detail, MapDetail, Login} from './screens';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import useStore from './stores';
import {observer} from 'mobx-react';
import {QueryClient, QueryClientProvider} from 'react-query';
const queryClient = new QueryClient();

const Stack = createStackNavigator();

const TotalStack = observer(() => {
  const {loginStore} = useStore();
  const doClick = () => {
    loginStore.setIslogin(true);
  };
  return (
    <>
      {!loginStore.isLogin ? (
        <Login />
      ) : (
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
    <>
      <IconRegistry icons={EvaIconsPack} />
      <QueryClientProvider client={queryClient}>
        <ApplicationProvider {...eva} theme={eva.light}>
          <NavigationContainer>
            <TotalStack />
          </NavigationContainer>
        </ApplicationProvider>
      </QueryClientProvider>
    </>
  );
}
