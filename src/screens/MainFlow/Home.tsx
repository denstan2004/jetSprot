import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UserPage } from "./User";
import { SignUp } from "../AuthFlow/SignUp";
import { SafeAreaView } from "react-native-safe-area-context";
import { Map } from "./Map";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Chat } from "./Chat/Chat";
export const Home = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#AC591A",
          borderTopWidth: 1,
          borderTopColor: "#FFFBE4",
        },
        tabBarActiveTintColor: "#FFFBE4",
        tabBarInactiveTintColor: "#FFFBE4",
      }}
      initialRouteName="UserPage"
    >
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
        component={Chat}
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
    </Tab.Navigator>
  );
};
