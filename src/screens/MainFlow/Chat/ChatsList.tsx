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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
import CreateGroupChat from "@/screens/ChatGroup";
import React from "react";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const ChatsList = () => {
  const [chats, setChats] = useState<ChatInterface[]>([]);
  const [pfpUrls, setPfpUrls] = useState<Record<string, string>>({});
  const token = useSelector((state: RootState) => state.user.accessToken);
  const navigation = useNavigation<NavigationProp>();
  const [searchUsersVisible, setSearchUsersVisible] = useState(false);
  const currentUserId = useSelector(
    (state: RootState) => state.user.userData?.id
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchChats = async () => {
        const chats = await getAllChats(token);
        console.log(chats);
        setChats(chats);
        const urls: Record<string, string> = {};
        for (const chat of chats) {
          for (const user of chat.members) {
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
    }, [currentUserId])
  );

  const getOtherUser = (chat: ChatInterface) => {
    return chat.members.find((user) => user.id !== currentUserId);
  };
  if (searchUsersVisible) {
    return <CreateGroupChat onBack={() => setSearchUsersVisible(false)} />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => setSearchUsersVisible(true)}
        >
          <Ionicons name="add" size={24} color="#5B3400" />
        </TouchableOpacity>
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
                  chatId: chat.id,
                })
              }
            >
              <Image
                source={{ uri: pfpUrls[otherUser.id] }}
                style={styles.avatar}
              />
              <View style={styles.chatInfo}>
                <Text style={styles.chatName}>
                  {chat.is_group && chat.members.length > 2
                    ? chat.members
                        .filter((user) => user.id !== currentUserId)
                        .map((user) => user.username)
                        .join(", ")
                    : otherUser?.username}
                </Text>

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

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  plusButton: {
    borderRadius: 10,
    marginRight: 10,
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
    borderBottomColor: "rgba(225, 185, 134, 0.39)",
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
    alignItems: "center",
    justifyContent: "center",
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
