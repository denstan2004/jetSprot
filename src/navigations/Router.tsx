import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthNavigator } from "./Stacks/Auth";
import { Provider } from "react-redux";
import store from "@/store/redux/store";

export type RootRouterParamList = {
  AuthNavigator: undefined;
  SignIn: undefined;
};

export const navigationRef =
  createNavigationContainerRef<RootRouterParamList>();
const RootRouterStack = createNativeStackNavigator<RootRouterParamList>();

export function Router() {
  return (
    <NavigationContainer>
      <Provider store={store}>
      <RootRouterStack.Navigator screenOptions={{ headerShown: false }}>
        <RootRouterStack.Screen
          name="AuthNavigator"
          component={AuthNavigator}
        />
      </RootRouterStack.Navigator>
      </Provider>
    </NavigationContainer>
  );
}
