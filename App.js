import React, {useRef} from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {BottomTab, Login, MapInfo} from './screens';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import useStore from './stores';
import {observer} from 'mobx-react';
import {QueryClient, QueryClientProvider} from 'react-query';
import analytics from '@react-native-firebase/analytics';

const queryClient = new QueryClient();
const Stack = createStackNavigator();

const TotalStack = observer(() => {
  const {loginStore} = useStore();
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
            name="mapInfo"
            component={MapInfo}
            options={{
              title: '지도',
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
            }}
          />
        </Stack.Navigator>
      )}
    </>
  );
});

export default function App() {
  const routeNameRef = useRef();
  const navigationRef = useNavigationContainerRef();
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <QueryClientProvider client={queryClient}>
        <ApplicationProvider {...eva} theme={eva.light}>
          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              routeNameRef.current = navigationRef.current.getCurrentRoute()
                ? navigationRef.current.getCurrentRoute().name
                : undefined;
            }}
            onStateChange={async () => {
              const previousRouteName = routeNameRef.current;
              const currentRouteName =
                navigationRef.current.getCurrentRoute().name || 'Login';

              if (previousRouteName !== currentRouteName) {
                await analytics().logScreenView({
                  screen_name: currentRouteName,
                  screen_class: currentRouteName,
                });
              }
              routeNameRef.current = currentRouteName;
            }}>
            <TotalStack />
          </NavigationContainer>
        </ApplicationProvider>
      </QueryClientProvider>
    </>
  );
}
