import foundUser from "@/API/user/foundUser";
import React, { useEffect, useCallback, useRef } from "react";
import { RootState } from "@/store/redux/store";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";
import UserCard from "@/components/UserListCard";
import getAllUsers from "@/API/user/getAllUsers";
import { User } from "@/types/User";
import { useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/firebase";
import { createChat } from "@/API/chat/createChat";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";

const CreateGroupChat = ({ onBack }: { onBack: () => void }) => {
  const token = useSelector((state: RootState) => state.user.accessToken);
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  //   const navigation = useNavigation();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pfpUrls, setPfpUrls] = useState<Record<string, string>>({});
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

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

  const toggleUserSelection = (user: User) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  const createGroup = async () => {
    const response = await createChat(
      token,
      selectedUsers.map((user) => user.id),
      selectedUsers.length > 1
    );
    console.log(response);

    if (response?.id) {
      navigation.navigate("UserChat", { chatId: response.id });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFBE4" }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
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
      <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedUsers.map((user) => (
            <View
              key={user.id}
              style={{ marginRight: 10, alignItems: "center" }}
            >
              <Image
                source={{ uri: pfpUrls[user.id] }}
                style={{ width: 50, height: 50, borderRadius: 25 }}
              />
              <Text style={{ fontSize: 12, color: "#5B3400" }}>
                {user.username}
              </Text>
            </View>
          ))}
        </ScrollView>
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
            onCardPress={() => toggleUserSelection(user)}
            isSelected={!!selectedUsers.find((u) => u.id === user.id)}
            isVerified={user.is_verified || false}
          />
        ))}
      </ScrollView>
      {selectedUsers.length > 1 && (
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={createGroup}
            style={styles.createGroupButton}
          >
            <Text style={styles.createGroupButtonText}>Create Group</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CreateGroupChat;
