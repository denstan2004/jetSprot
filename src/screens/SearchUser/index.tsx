import foundUser from "@/API/user/foundUser";
import React, { useEffect, useCallback, useRef } from "react";
import { RootState } from "@/store/redux/store";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useSelector } from "react-redux";
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
import UserCard from "@/components/UserListCard";
import getAllUsers from "@/API/user/getAllUsers";
import { User } from "@/types/User";
import { useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/firebase";

const Users = () => {
  const token = useSelector((state: RootState) => state.user.accessToken);
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pfpUrls, setPfpUrls] = useState<Record<string, string>>({});
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const foundUsers = async () => {
    try {
      const response = await foundUser(searchQuery, token);
      setUsers(response);
      setFilteredUsers(response);
    } catch (error) {
      console.log(error);
    }
  };

  const doUserFilter = (query: string) => {
    setSearchQuery(query);
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    if (!query) return setFilteredUsers(users);

    filterTimeoutRef.current = setTimeout(() => {
      console.log("====>", query);
      setFilteredUsers(
        users.filter((user) =>
          user.username.toLowerCase().includes(query.toLowerCase())
        )
      );
    }, 500);
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response);
      setFilteredUsers(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProfilePictures = async () => {
      const urls: Record<string, string> = {};
      await Promise.all(
        users.map(async (user) => {
          if (user.pfp_url) {
            try {
              const url = await getDownloadURL(ref(storage, user.pfp_url));
              urls[user.id] = url;
            } catch (err) {
              console.warn("Error loading image for", err);
            }
          }
        })
      );
      setPfpUrls(urls);
    };
    fetchProfilePictures();
  }, [users, searchQuery]);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFBE4" }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor="#AC591A"
          value={searchQuery}
          onChangeText={doUserFilter}
        />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            username={user.username}
            first_name={user.first_name}
            last_name={user.last_name}
            rating={user.rating}
            pfpUrl={pfpUrls[user.id]}
            userId={user.id.toString()}
            isSelected={false}
            onCardPress={() =>
              navigation.navigate("User", { userId: user.id.toString() })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Users;
