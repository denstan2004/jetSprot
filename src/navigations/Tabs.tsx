import { SignIn } from "@/screens/AuthFlow/SignIn";
import { SignUp } from "@/screens/AuthFlow/SignUp";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="SignIn" component={SignIn} />
      <Tab.Screen name="signUp" component={SignUp} />
    </Tab.Navigator>
  );
};

export default Tabs;