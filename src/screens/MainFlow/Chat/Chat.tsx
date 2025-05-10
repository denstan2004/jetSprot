import { RootState } from "@/store/redux/store";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { wsUrl as wsUrlApi } from "@/API/apiUrl";
import { RouteProp, useRoute } from "@react-navigation/native";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
import { storage } from "@/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  interpolate,
  Extrapolate,
  interpolateColor,
  withTiming,
} from "react-native-reanimated";

interface ChatMessage {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
  };
}

type ChatScreenRouteProp = RouteProp<AuthStackParamList, "UserChat">;

export const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const ourUserId =
    useSelector((state: RootState) => state.user.userData?.id) || 1;
  const { chatId } = route.params;
  console.log("chatId", chatId);
  const { accessToken } = useSelector((state: RootState) => state.user);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const [pfpUrls, setPfpUrls] = useState<Record<string, string>>({});
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuAnimation = useSharedValue(0);
  const { width } = Dimensions.get("window");

  const wsUrl = `${wsUrlApi}/chat/${chatId}/?token=${accessToken}`;
  const connectWebSocket = useCallback(() => {
    const socket = new WebSocket(wsUrl);
    console.log("connecting to", socket);
    socket.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket Connected");
    };

    socket.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket Disconnected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "chat_message") {
        console.log("data", data);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            _id: data.message._id,
            text: data.message.text,
            createdAt: new Date(data.message.createdAt),
            user: {
              _id: data.message.user._id,
              name: data.message.user.name,
            },
          },
        ]);
      } else if (data.type === "load_messages") {
        const loadedMessages = data.messages.map((msg: ChatMessage) => ({
          _id: msg._id,
          text: msg.text,
          createdAt: new Date(msg.createdAt),
          user: {
            _id: msg.user._id,
            name: msg.user.name,
          },
        }));
        setMessages(loadedMessages.reverse());
      }
    };

    setWs(socket);
  }, [wsUrl]);

  const sendMessage = () => {
    if (ws && newMessage.trim()) {
      ws.send(
        JSON.stringify({
          message: newMessage.trim(),
        })
      );

      //   setMessages((prevMessages) => [
      //     ...prevMessages,
      //     {
      //       _id: Date.now().toString(),
      //       text: newMessage.trim(),
      //       createdAt: new Date(),
      //       user: {
      //         _id: userId.toString(),
      //         name: userName,
      //       },
      //     },
      //   ]
      // );

      setNewMessage("");
    }
  };

  const markRead = (messageId: string) => {
    if (ws) {
      ws.send(
        JSON.stringify({
          type: "mark_read",
          message_id: messageId,
        })
      );
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      ws?.close();
    };
  }, [connectWebSocket]);

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMyMessage = item.user._id !== ourUserId.toString();

    // useEffect(() => {
    //   const fetchPfpUrl = async () => {
    //     if (item.user.pfp_url) {
    //       try {
    //         const storageRef = ref(storage, item.user.pfp_url);
    //         const url = await getDownloadURL(storageRef);
    //         setMediaUrl(url);
    //       } catch (error) {
    //         console.error("Failed to fetch avatar:", error);
    //       }
    //     }
    //   };

    //   fetchPfpUrl();
    // }, [currentUser]);

    return (
      <TouchableOpacity
        onLongPress={() => markRead(item._id)}
        style={[
          styles.messageContainer,
          isMyMessage ? styles.otherMessage : styles.myMessage,
        ]}
      >
        {/* {item.user._id === userId.toString() && (
          <View style={styles.messageHeader}>
            <Image source={{ uri: pfpUrls[item.user._id] || "" }} style={styles.profileImage} />
            <Text style={[styles.messageText, {color: "#000", fontWeight: "bold",}]}>{item.user.name}</Text>
          </View>
        )} */}

        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>
    );
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    menuAnimation.value = withTiming(isMenuOpen ? 0 : 1, {
      duration: 1000,
    });
  };
  const menuContentStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(menuAnimation.value, [0, 1], [1, 0]),
    };
  });
  const menuStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            menuAnimation.value,
            [0, 1],
            [0, width],
            Extrapolate.CLAMP
          ),
        },
      ],
      backgroundColor: interpolateColor(
        menuAnimation.value,
        [0, 1],
        ["#FFFBE4", "#803511"]
      ),
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../../assets/Basketball2.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={{ flex: 1, backgroundColor: "#FFFBE4AA" }}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={toggleMenu} style={styles.burgerButton}>
              <View style={styles.burgerLine} />
              <View style={styles.burgerLine} />
              <View style={styles.burgerLine} />
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
          >
            <View style={{ flex: 1 }}>
              <Animated.View style={[styles.menu, menuStyle]}>
                <Animated.View style={[styles.menuContent, menuContentStyle]}>
                  <Text>Hello</Text>
                </Animated.View>
              </Animated.View>

              <View style={styles.messagesContainer}>
                <FlatList
                  ref={flatListRef}
                  data={messages}
                  renderItem={renderMessage}
                  keyExtractor={(item) => item._id}
                  onContentSizeChange={() =>
                    flatListRef.current?.scrollToEnd({ animated: true })
                  }
                  onLayout={() =>
                    flatListRef.current?.scrollToEnd({ animated: true })
                  }
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Type a message..."
                multiline
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={sendMessage}
                disabled={!newMessage.trim()}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.connectionStatus}>
              <Text style={styles.connectionStatusText}>
                {isConnected ? "Connected" : "Chat is not available"}
              </Text>
            </View>
            
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: "#FFFBE4",
    justifyContent: "center",
    alignItems: "center",
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  myMessage: {
    minWidth: 120,
    alignSelf: "flex-end",
    backgroundColor: "rgb(192, 78, 25)",
    color: "#FFFBE4",
  },
  otherMessage: {
    minWidth: 120,
    alignSelf: "flex-start",
    backgroundColor: "rgb(148, 62, 22)",
  },
  messageText: {
    color: "#FFFBE4",
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: "#FFFBE4",
    alignSelf: "flex-end",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    backgroundColor: "",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#803511",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  connectionStatus: {
    padding: 5,
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  connectionStatusText: {
    fontSize: 12,
    color: "#803511",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 15,
    backgroundColor: "#803511",
  },
  burgerButton: {
    width: 30,
    height: 24,
    justifyContent: "space-between",
    marginRight: 15,
  },
  burgerLine: {
    width: "100%",
    height: 3,
    backgroundColor: "#FFFBE4",
    borderRadius: 2,
  },
  chatTitle: {
    fontSize: 20,
    color: "#FFFBE4",
    fontWeight: "bold",
  },
  menu: {
    position: "absolute",
    zIndex: 1000,
    top: 0,
    right: 0,
    width: "80%",
    height: "100%",
    backgroundColor: "#FFFBE4",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#80351133",
  },
  menuText: {
    fontSize: 18,
    color: "#803511",
  },
});
