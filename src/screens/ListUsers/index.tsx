import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { User } from "@/types/User";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/firebase";
import { useEffect, useState } from "react";
import UserCard from "@/components/UserListCard";

type RootStackParamList = {
  listUsers: { followers: User[] };
};

export const ListUsers = () => {
  const route = useRoute<RouteProp<RootStackParamList, "listUsers">>();
  const { followers } = route.params;
  const [pfpUrls, setPfpUrls] = useState<Record<string, string>>({});
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfilePictures = async () => {
      const urls: Record<string, string> = {};
      await Promise.all(
        followers.map(async (user) => {
          if (user.pfp_url) {
            try {
              const url = await getDownloadURL(ref(storage, user.pfp_url));
              // console.log("Fetched URL:", url);
              urls[user.id] = url;
            } catch (err) {
              console.warn("Error loading image for", err);
            }
          }
        })
      );
      setPfpUrls(urls);
      // console.log("Profile picture URLs:", urls);
    };
    fetchProfilePictures();
  }, [followers]);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFBE4" }}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 100 }}
      >
        {followers.map((user) => (
          <UserCard
            key={user.id}
            username={user.username}
            first_name={user.first_name}
            last_name={user.last_name}
            rating={user.rating}
            pfpUrl={pfpUrls[user.id]}
            userId={user.id.toString()}
            isSelected={false}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
