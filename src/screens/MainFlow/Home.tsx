import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UserPage } from "./User";
import { SignUp } from "../AuthFlow/SignUp";
import { SafeAreaView } from "react-native-safe-area-context";
import { Map } from "./Map";

export const Home = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // 👈 hides the header for all tabs
      }}
      initialRouteName="UserPage"
    >
      <Tab.Screen name="UserPage" component={UserPage} />
      <Tab.Screen name="Map" component={Map} />
    </Tab.Navigator>
  );
};
