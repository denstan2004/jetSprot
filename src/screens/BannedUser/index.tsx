import React, { useEffect } from "react";
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import getBannedUser from "@/API/MODERATION/getBannedUser";
import { useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
import { NavigationProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getDownloadURL } from "firebase/storage";
import { ref } from "firebase/storage";
import { storage } from "@/firebase";
import unBanUser from "@/API/MODERATION/unBanUser";

const BannedUser = () => {
  const token = useSelector((state: RootState) => state.user.accessToken);
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const [bannedUsers, setBannedUsers] = useState<any[]>([]);

  const handleNavigateToUser = (userId: string) => {
    navigation.navigate("User", { userId });
  };

  useEffect(() => {
    const fetchPfpUrl = async () => {
      if (currentUser?.pfp_url) {
        try {
          const storageRef = ref(storage, currentUser.pfp_url);
          const url = await getDownloadURL(storageRef);
          setMediaUrl(url);
        } catch (error) {
          console.error("Failed to fetch avatar:", error);
        }
      }
    };

    fetchPfpUrl();
  }, [currentUser]);

  const searchBannedUsers = async () => {
    const response = await getBannedUser(token);
    // console.log("Banned users API response:", response);
    setBannedUsers(Array.isArray(response) ? response : []);
  };
  useEffect(() => {
    searchBannedUsers();
  }, []);

  const handleUnbanUser = async (userId: string) => {
    const response = await unBanUser(token, userId);
    console.log("Unbanned user API response:", response);
    searchBannedUsers();
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.modalBody}>
        {Array.isArray(bannedUsers) && bannedUsers.length === 0 ? (
          <Text style={styles.noReviews}>No banned users yet...</Text>
        ) : (
          Array.isArray(bannedUsers) &&
          bannedUsers.map((bannedUser, index) => (
            <View key={index} style={styles.reviewCard}>
              <View style={styles.reviewContent}>
                <TouchableOpacity
                  onPress={() => handleNavigateToUser(bannedUser.id.toString())}
                >
                  <Image
                    source={{ uri: mediaUrl || "" }}
                    style={styles.reviewAvatar}
                  />
                </TouchableOpacity>

                <View style={styles.reviewTextContainer}>
                  <Text style={styles.reviewUsername}>
                    Banned user: {bannedUser.id}
                  </Text>
                  <Text style={styles.reviewText}>
                    Username: {bannedUser.username || "No username"}
                  </Text>
                  <Text style={styles.reviewText}>
                    Full name:{" "}
                    {bannedUser.first_name && bannedUser.last_name
                      ? `${bannedUser.first_name} ${bannedUser.last_name}`
                      : "No full name"}
                  </Text>
                  <Text style={styles.reviewText}>
                    Rating: {bannedUser.rating}
                  </Text>

                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      onPress={() => handleUnbanUser(bannedUser.id.toString())}
                      style={styles.iconButton}
                    >
                      <MaterialCommunityIcons
                        name="account-lock-open-outline"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BannedUser;

const styles = StyleSheet.create({
  modalBody: {
    padding: 20,
  },
  reviewCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  reviewContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  reviewAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  reviewTextContainer: {
    flex: 1,
    gap: 10,
  },
  reviewUsername: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 4,
  },
  reviewText: {
    fontSize: 14,
    color: "#333",
  },
  noReviews: {
    fontSize: 16,
    textAlign: "center",
  },
  actionsRow: {
    flexDirection: "row",
    paddingTop: 10,
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
});
