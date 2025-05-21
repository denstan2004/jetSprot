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
import { useNavigation } from "@react-navigation/native";
import UserCard from "@/components/UserListCard";
import getAllUsers from "@/API/user/getAllUsers";
import { User } from "@/types/User";
import { useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/firebase";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";

const AddUserToGroup = ({
  onBack,
  handleAddUserToGroup,
}: {
  onBack: () => void;
  handleAddUserToGroup: (userIds: number[]) => void;
}) => {
  const token = useSelector((state: RootState) => state.user.accessToken);
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
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
          />
        ))}
      </ScrollView>
      {selectedUsers.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() =>
              handleAddUserToGroup(selectedUsers.map((user) => user.id))
            }
            style={styles.createGroupButton}
          >
            <Text style={styles.createGroupButtonText}>Add User</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AddUserToGroup;

import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: width * 0.04,
  },

  backButton: {
    padding: 8,
    position: "absolute",
    top: 60,
    left: 10,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 16,
    color: "#5B3400",
    fontWeight: "bold",
  },
  container: {
    backgroundColor: "#FFFBE4",
    paddingHorizontal: width * 0.04,
    paddingTop: 10,
    paddingBottom: 20,
  },
  searchContainer: {
    paddingHorizontal: width * 0.04,
    paddingTop: 40,
    paddingBottom: 5,
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: width * 0.025,
    fontSize: 16,
    color: "#5B3400",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  //   selectedCard: {
  //     borderColor: "#007AFF",
  //     backgroundColor: "#E6F0FF",
  //   },
  footer: {
    paddingHorizontal: width * 0.04,
    paddingBottom: 30,
  },
  createGroupButton: {
    backgroundColor: "#AC591A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  createGroupButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
