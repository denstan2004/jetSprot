import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { styles } from "./styles";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";

interface Props {
  userId?: string;
}

export const UserPage = (userId: Props) => {
  const sel = useSelector((state: RootState) => state.user.userData);

  const [isLocalUser, setIsLocalUser] = useState(userId === undefined);

  useEffect(() => {
    if (userId !== undefined) {
      // take user by id
    }else {
      // take user state by id
    }
  }, []);

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
            <Ionicons name="people-outline" size={18} color="white" />
            <Text style={styles.text}>485</Text>
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

