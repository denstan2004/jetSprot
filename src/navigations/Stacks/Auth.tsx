import { screenOptions } from "@/navigations/options";
import { Authorization } from "@/screens/AuthFlow/Authorization";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SignIn } from "@/screens/AuthFlow/SignIn/";
import React from "react";
import { SignUp } from "@/screens/AuthFlow/SignUp";
import { Home } from "@/screens/MainFlow/Home";
import { ListUsers } from "@/screens/ListUsers";
import { User } from "@/types/User";
import { EditProfile } from "@/screens/EditProfile";
import { Announcement } from "@/screens/MainFlow/Announcement";
import { Announcement as AnnouncementType } from "@/types/Announcement";
import AddAnnouncement from "@/screens/MainFlow/AddAnouncement";
import { CreatePost } from "@/screens/MainFlow/CreatePost";
import { UserPage } from "@/screens/MainFlow/User";
import { ChatScreen } from "@/screens/MainFlow/Chat/Chat";
import FoundCountry from "@/screens/FoundCountry";
import SearchUser from "@/screens/SearchUser";
import CreateGroupChat from "@/screens/ChatGroup";

export type AuthStackParamList = {
  Authorization: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
  ListUsers: { followers: User[] };
  EditProfile: undefined;
  Announcement: { announcement: AnnouncementType };
  AddAnnouncement: undefined;
  CreatePost: undefined;
  User: { userId: string };
  UserChat: { chatId: number };
  FoundCountry: undefined;
  SearchUser: undefined;
  // GroupChat: { groupId: number; groupName: string };
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

      <AuthStack.Screen options={screenOptions} name="Home" component={Home} />

      <AuthStack.Screen
        options={screenOptions}
        name="ListUsers"
        component={ListUsers}
      />

      <AuthStack.Screen
        options={screenOptions}
        name="EditProfile"
        component={EditProfile}
      />
      <AuthStack.Screen
        options={screenOptions}
        name="Announcement"
        component={Announcement}
      />
      <AuthStack.Screen
        options={screenOptions}
        name="AddAnnouncement"
        component={AddAnnouncement}
      />
      <AuthStack.Screen
        options={screenOptions}
        name="CreatePost"
        component={CreatePost}
      />
      <AuthStack.Screen
        options={screenOptions}
        name="User"
        component={UserPage}
      />
      <AuthStack.Screen
        options={screenOptions}
        name="UserChat"
        component={ChatScreen}
      />

      <AuthStack.Screen
        options={screenOptions}
        name="FoundCountry"
        component={FoundCountry}
      />

      <AuthStack.Screen
        options={screenOptions}
        name="SearchUser"
        component={SearchUser}
      />

     
    </AuthStack.Navigator>
  );
}
