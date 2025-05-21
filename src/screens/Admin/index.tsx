import { View, Text, SafeAreaView, Settings } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Reports from "../Reports";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import UserVerification from "../UserVerification";
import VerificationEvent from "../VerificationEvent";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BannedUser from "../BannedUser";
const Admin = () => {
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
      initialRouteName="Reports"
    >
        <Tab.Screen
          name="Reports"
          component={Reports}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialIcons
                name={focused ? "report" : "report-gmailerrorred"}
                size={24}
                color="white"
              />
            ),
        }}
      />
      <Tab.Screen
        name="BannedUser"
        component={BannedUser}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account-cancel" : "account-cancel-outline"}
              size={24}
              color="white"
            />
          ),
        }}
      />
      <Tab.Screen
        name="UserVerification"
        component={UserVerification}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={
                focused
                  ? "account-multiple-remove"
                  : "account-multiple-remove-outline"
              }
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="VerificationEvent"
        component={VerificationEvent}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "calendar-month" : "calendar-month-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Admin;
