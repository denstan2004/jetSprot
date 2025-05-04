import { ChatInterface, getAllChats } from "@/API/chat/getAllChats";
import { RootState } from "@/store/redux/store";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/firebase";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const ChatsList = () => {
  const [chats, setChats] = useState<ChatInterface[]>([]);
  const [pfpUrls, setPfpUrls] = useState<Record<string, string>>({});
  const token = useSelector((state: RootState) => state.user.accessToken);
  const navigation = useNavigation<NavigationProp>();

  const currentUserId = useSelector(
    (state: RootState) => state.user.userData?.id
  );

  useEffect(() => {
    const fetchChats = async () => {
      const chats = await getAllChats(token);
      console.log(chats);
      setChats(chats);
      const urls: Record<string, string> = {};
      for (const chat of chats) {
        for (const user of chat.users) {
          if (user.pfp_url && user.id !== currentUserId) {
            try {
              const url = await getDownloadURL(ref(storage, user.pfp_url));
              urls[user.id] = url;
            } catch (err) {
              console.warn("Error loading image for user", user.id, err);
            }
          }
        }
      }
      setPfpUrls(urls);
    };
    fetchChats();
  }, [currentUserId]);

  const getOtherUser = (chat: ChatInterface) => {
    return chat.users.find((user) => user.id !== currentUserId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      <ScrollView style={styles.chatList}>
        {chats.map((chat) => {
          const otherUser = getOtherUser(chat);
          console.log(otherUser);
          if (!otherUser) return null;

          return (
            <TouchableOpacity
              key={chat.id}
              style={styles.chatItem}
              onPress={() =>
                navigation.navigate("UserChat", {
                  userId: otherUser.id,
                  userName: otherUser.username,
                  // userPfpUrl: pfpUrls[otherUser.id],
                })
              }
            >
              <Image
                source={{ uri: pfpUrls[otherUser.id] }}
                style={styles.avatar}
              />
              <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{otherUser.username}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {chat.last_message?.content || "No messages yet"}
                </Text>
              </View>
              <View style={styles.chatMeta}>
                <Text style={styles.timestamp}>
                  {chat.last_message?.timestamp
                    ? new Date(chat.last_message.timestamp).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : ""}
                </Text>
                {chat.unread_count > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>{chat.unread_count}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBE4",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0C097",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5B3400",
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0C097",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5B3400",
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: "#AC591A",
  },
  chatMeta: {
    alignItems: "flex-end",
  },
  timestamp: {
    fontSize: 12,
    color: "#AC591A",
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: "#AC591A",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadCount: {
    color: "#FFFBE4",
    fontSize: 12,
    fontWeight: "bold",
  },
});
