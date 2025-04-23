import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { styles } from "./styles";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import getUserFollowers from "@/API/user/getUserFollowers";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
import { User } from "@/types/User";

interface Props {
  userId?: string;
}
// 2) listUsers(followers),
export const UserPage = ({ userId }: Props) => {
  const sel = useSelector((state: RootState) => state.user.userData);
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const [followers, setFollowers] = useState<User[]>([]);
  const handleNavigateToFolowers = () => {
    navigation.navigate("ListUsers", { followers: followers});
  };
  // const [isLocalUser, setIsLocalUser] = useState(userId === undefined);

  const getFollowersCount = async () => {
    if (userId !== undefined) {
      console.log("userId", userId);
      const response = await getUserFollowers(userId);
      return response 
    } else if (sel !== null) {
      console.log("sel.id", sel.id);
      const response = await getUserFollowers(sel.id.toString());
      return response 
    }
    return [];
  };

  useEffect(() => {
    const fetchFollowersCount = async () => {
      const followers = await getFollowersCount();
      setFollowers(followers || []);

    };

    fetchFollowersCount();
  }, [userId, sel]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBackground}>
        <View style={styles.headerTopRow}>
          <View style={styles.iconGroup}>
            <TouchableOpacity style={styles.icon}>
              <Ionicons name="heart-outline" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.icon}>
              <MaterialIcons name="edit" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <FontAwesome5 name="user-alt" size={40} color="white" />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.box}>
            <TouchableOpacity onPress={handleNavigateToFolowers}>
              <Ionicons name="people-outline" size={18} color="white" />
              <Text style={styles.text}>{followers.length}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.box}>
            <Ionicons name="time-outline" size={18} color="white" />
            <Text style={styles.text}>8 288 h</Text>
          </View>
        </View>
      </View>

      <View style={styles.profileBody}>
        <Text style={styles.username}>Name</Text>
        <Text style={styles.role}>football player</Text>
      </View>
    </SafeAreaView>
  );
};
