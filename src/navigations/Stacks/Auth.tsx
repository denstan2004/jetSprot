import { screenOptions } from "@/navigations/options";
import { Authorization } from "@/screens/AuthFlow/Authorization";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SignIn } from "@/screens/AuthFlow/SignIn/";
import React from "react";
import { SignUp } from "@/screens/AuthFlow/SignUp";
import { Home } from "@/screens/MainFlow/Home";
import { ListUsers } from "@/screens/ListUsers";
import { User } from "@/types/User";

export type AuthStackParamList = {
  Authorization: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Home:undefined;
  ListUsers:{ followers: User[] };
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        options={screenOptions}
        name="Authorization"
        component={Authorization}
      />
      <AuthStack.Screen
        options={screenOptions}
        name="SignIn"
        component={SignIn}
      />

      <AuthStack.Screen
        options={screenOptions}
        name="SignUp"
        component={SignUp}
      />
  
       <AuthStack.Screen
        options={screenOptions}
        name="Home"
        component={Home}
      />
         <AuthStack.Screen
        options={screenOptions}
        name="ListUsers"
        component={ListUsers}
      />
    </AuthStack.Navigator>
  );
}
