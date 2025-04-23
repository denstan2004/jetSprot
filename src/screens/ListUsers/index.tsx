import { SafeAreaView, ScrollView, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
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

  useEffect(() => {
    const fetchProfilePictures = async () => {
      const urls: Record<string, string> = {};
      await Promise.all(
        followers.map(async (user) => {
          if (user.pfp_url) {
            try {
              const url = await getDownloadURL(ref(storage, user.pfp_url));
              urls[user.id] = url;
            } catch (err) {
              console.warn("Error loading image for", user.username);
            }
          }
        })
      );
      setPfpUrls(urls);
    };

    fetchProfilePictures();
  }, [followers]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFBE4" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 10 }}>
        {followers.map((user) => (
          <UserCard
            key={user.id}
            username={user.username}
            first_name={user.first_name}
            last_name={user.last_name}
            rating={user.rating}
            pfpUrl={pfpUrls[user.id] || ""}
            userId={user.id.toString()}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
