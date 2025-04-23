import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthNavigator } from "./Stacks/Auth";
import { Provider } from "react-redux";
import store, { persistor } from "@/store/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export type RootRouterParamList = {
  AuthNavigator: undefined;
  SignIn: undefined;
};

export const navigationRef =
  createNavigationContainerRef<RootRouterParamList>();
const RootRouterStack = createNativeStackNavigator<RootRouterParamList>();

export function Router() {
  return (
    <PersistGate loading={null} persistor={persistor}>
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  </PersistGate>
  );
}
