import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UserPage } from "./User";
import { SignUp } from "../AuthFlow/SignUp";
import { SafeAreaView } from "react-native-safe-area-context";
import { Map } from "./Map";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ChatsList } from "./Chat/ChatsList";
import AllPublication from "../AllPublication";
import SearchUser from "../SearchUser";

export const Home = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#803511",
          borderTopWidth: 1,
          borderTopColor: "#FFFBE4",
        },
        tabBarActiveTintColor: "#FFFBE4",
        tabBarInactiveTintColor: "#FFFBE4",
      }}
      initialRouteName="Publication"
    >
      <Tab.Screen
        name="Publication"
        component={AllPublication}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "ballot" : "ballot-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="SearchUser"
        component={SearchUser}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account-search" : "account-search-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "chat" : "chat-outline"}
              color={color}
              size={size}
            />
          ),
        }}
        name="Chat"
        component={ChatsList}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "map-marker" : "map-marker-outline"}
              color={color}
              size={size}
            />
          ),
        }}
        name="Map"
        component={Map}
      />

      <Tab.Screen
        name="UserPage"
        component={UserPage}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account" : "account-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
