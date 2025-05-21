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
import { useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
import { NavigationProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getDownloadURL } from "firebase/storage";
import { ref } from "firebase/storage";
import { storage } from "@/firebase";
import getAllRequest from "@/API/MODERATION/userVerification/getAllRequest";

const BannedUser = () => {
  const token = useSelector((state: RootState) => state.user.accessToken);
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const [verification, setVerification] = useState<any[]>([]);

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

  const searchVerification = async () => {
    const response = await getAllRequest(token);
    console.log("Verification users API response:", response);
    setVerification(Array.isArray(response) ? response : []);
  };
  useEffect(() => {
    searchVerification();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView style={styles.modalBody}>
        {Array.isArray(verification) && verification.length === 0 ? (
          <Text style={styles.noReviews}>No verification requests yet...</Text>
        ) : (
          Array.isArray(verification) &&
          verification.map((verification, index) => (
            <View key={index} style={styles.reviewCard}>
              <View style={styles.reviewContent}>
                <TouchableOpacity
                  onPress={() =>
                    handleNavigateToUser(verification.id.toString())
                  }
                >
                  <Image
                    source={{ uri: mediaUrl || "" }}
                    style={styles.reviewAvatar}
                  />
                </TouchableOpacity>

                <View style={styles.reviewTextContainer}>
                  <Text style={styles.reviewUsername}>
                    User ID: {verification.user}
                  </Text>
                  <Text style={styles.reviewText}>
                    Created at: {verification.created_at}
                  </Text>
                  <Text style={styles.reviewText}>
                    Status: {verification.status}
                  </Text>
                  {/* <View style={styles.actionsRow}>
                    <TouchableOpacity
                      onPress={() => handleVerifyUser(verification.id.toString())}
                      style={styles.iconButton}
                    >
                      <MaterialCommunityIcons
                        name="account-lock-open-outline"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View> */}
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
