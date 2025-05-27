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
import searchUserBySports from "@/API/sport/getUserBySport";
import Slider from "@react-native-community/slider";
import { Icon } from "react-native-paper";

const Users = () => {
  const token = useSelector((state: RootState) => state.user.accessToken);
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pfpUrls, setPfpUrls] = useState<Record<string, string>>({});
  const [minRating, setMinRating] = useState(0);
  const [minAge, setMinAge] = useState(0);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const foundUsers = async () => {
    try {
      const response = await foundUser(
        token,
        searchQuery || undefined,
        minRating > 0 ? minRating : undefined,
        minAge > 0 ? minAge : undefined
      );
      setUsers(response);
      setFilteredUsers(response);
    } catch (error) {
      console.log("error search users", error);
    }
  };

  const doUserFilter = (query: string) => {
    setSearchQuery(query);
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    if (!query && minRating === 0 && minAge === 0) {
      fetchUsers();
      return;
    }

    filterTimeoutRef.current = setTimeout(() => {
      foundUsers();
    }, 500);
  };

  const applyFilters = () => {
    foundUsers();
  };

  const clearFilters = () => {
    setMinRating(0);
    setMinAge(0);
    if (!searchQuery) {
      fetchUsers();
    } else {
      foundUsers();
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers(token);
      setUsers(response);
      setFilteredUsers(response);
    } catch (error) {
      console.log("error fetch users", error);
    }
  };

  // const searchUserBySport = async () => {
  //   const response = await searchUserBySports()
  // }

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
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterMenu(!showFilterMenu)}
        >
          <Icon source="filter" size={20} color="rgb(179, 119, 15)" />
        </TouchableOpacity>
      </View>

      {showFilterMenu && (
        <View style={styles.filterMenu}>
          <View style={styles.filterInputContainer}>
            <Text style={styles.filterLabel}>Minimum Rating: {minRating}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={5}
              step={1}
              value={minRating}
              onValueChange={setMinRating}
              minimumTrackTintColor="#AC591A"
              maximumTrackTintColor="#D3D3D3"
              thumbTintColor="#AC591A"
            />
          </View>
          <View style={styles.filterInputContainer}>
            <Text style={styles.filterLabel}>Minimum Age: {minAge}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={minAge}
              onValueChange={setMinAge}
              minimumTrackTintColor="#AC591A"
              maximumTrackTintColor="#D3D3D3"
              thumbTintColor="#AC591A"
            />
          </View>
          <View style={{ gap: 10 }}>
            <TouchableOpacity style={styles.applyButton} onPress={clearFilters}>
              <Text style={styles.applyButtonText}>Clear Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor="#AC591A"
          value={searchQuery}
          onChangeText={doUserFilter}
          maxLength={100}
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
            isVerified={user.is_verified || false}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Users;
