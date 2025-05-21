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
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { wsUrl as wsUrlApi } from "@/API/apiUrl";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
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
import { Ionicons } from "@expo/vector-icons";
import PopUp from "@/components/DeleteGroup";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import getChatroom from "@/API/chat/getChatroom";
import { Chatroom, Member } from "@/types/Chatroom";
import updateRole from "@/API/chat/updateRole";
import removeUsers from "@/API/chat/removeUsers";
import AddUserToGroup from "@/components/AddUserToGroup";
import addUsers from "@/API/chat/addUsers";

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
  const ourUserId =
    useSelector((state: RootState) => state.user.userData?.id) || 1;
  const route = useRoute<ChatScreenRouteProp>();
  const { chatId } = route.params;
  console.log("chatId", chatId);
  const { accessToken } = useSelector((state: RootState) => state.user);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [isRemoveUserFromGroupVisible, setIsRemoveUserFromGroupVisible] =
    useState(false);
  const [nameGroup, setNameGroup] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedGroupName, setEditedGroupName] = useState(nameGroup);
  const [isDeleteGroupVisible, setIsDeleteGroupVisible] = useState(false);
  const [isUpdateRoleVisible, setIsUpdateRoleVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserRole, setSelectedUserRole] = useState<string | null>(null);

  const [chatroom, setChatroom] = useState<Chatroom | null>(null);
  const [isAddUserToGroupVisible, setIsAddUserToGroupVisible] = useState(false);
  const [pfpUrls, setPfpUrls] = useState<Record<string, string>>({});
  // const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuAnimation = useSharedValue(0);
  const { width } = Dimensions.get("window");

  const currentUserRole = chatroom?.members.find(
    (member) => member.id.toString() === ourUserId.toString()
  )?.role;

  const isOwner = currentUserRole === "owner";
  const isAdmin = currentUserRole === "admin";
  const isMember = currentUserRole === "member";

  const canRemoveUser = (member: Member) => {
    if (isOwner) {
      // Owner може видалити будь-кого
      return true;
    }

    if (isAdmin) {
      // Admin може видалити тільки member'а
      return member.role === "member";
    }

    // Member нікого не може видалити
    return false;
  };

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

  const handleDeleteGroup = () => {
    setIsDeleteGroupVisible(true);
  };
  const handleSaveGroupName = () => {
    setNameGroup(editedGroupName);
  };
  const handleEditGroupName = () => {
    setIsEditing(true);
  };

  const fetchChatroom = async () => {
    const response = await getChatroom(chatId.toString(), accessToken);
    setChatroom(response);
    // console.log("response", response);
  };

  const handleAddUserToGroup = async (userIds: number[]) => {
    const response = await addUsers(accessToken, chatId.toString(), userIds);
    console.log("response", response);
    fetchChatroom();
    setIsAddUserToGroupVisible(false);
  };

  useEffect(() => {
    fetchChatroom();
  }, []);

  const handleUpdateRole = async (userId: number, role: string) => {
    const response = await updateRole(
      role,
      chatId.toString(),
      userId,
      accessToken
    );
    console.log("response", response);
    fetchChatroom();
  };

  const handleRemoveUserFromGroup = async (userId: number) => {
    const response = await removeUsers(chatId.toString(), userId, accessToken);
    // console.log("response", response);
    fetchChatroom();
  };

  useEffect(() => {
    const fetchProfilePictures = async () => {
      const urls: Record<string, string> = {};
      await Promise.all(
        chatroom?.members.map(async (user) => {
          if (user.pfp_url) {
            try {
              const url = await getDownloadURL(ref(storage, user.pfp_url));
              // console.log("Fetched URL:", url);
              urls[user.id.toString()] = url;
            } catch (err) {
              console.warn("Error loading image for", err);
            }
          }
        }) || []
      );
      setPfpUrls(urls);
      // console.log("Profile picture URLs:", urls);
    };
    fetchProfilePictures();
  }, [chatroom]);

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMyMessage = item.user._id !== ourUserId.toString();

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
      opacity: interpolate(menuAnimation.value, [0, 1], [0, 1]),
    };
  });
  const menuStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            menuAnimation.value,
            [0, 1],
            [width, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
      backgroundColor: interpolateColor(
        menuAnimation.value,
        [1, 0],
        ["#FFFBE4", "#803511"]
      ),
    };
  });

  return (
    <>
      {isDeleteGroupVisible && (
        <View
          style={{
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            width: "100%",
            height: "100%",
            zIndex: 1000,
          }}
        >
          <PopUp
            text="Are you sure you want to delete group?"
            button1Text="Yes"
            button2Text="No"
            action1={() => {}}
            title="Delete Group"
            action2={() => {
              setIsDeleteGroupVisible(false);
            }}
          />
        </View>
      )}

      {isRemoveUserFromGroupVisible && (
        <View
          style={{
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            width: "100%",
            height: "100%",
            zIndex: 1000,
          }}
        >
          <PopUp
            text="Are you sure you want to remove user from group?"
            button1Text="Yes"
            button2Text="No"
            action1={() => {
              if (selectedUserId !== null) {
                handleRemoveUserFromGroup(selectedUserId);
                setIsRemoveUserFromGroupVisible(false);
              }
            }}
            title="Remove User from Group"
            action2={() => {
              setIsRemoveUserFromGroupVisible(false);
            }}
          />
        </View>
      )}

      {isUpdateRoleVisible && (
        <View
          style={{
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            width: "100%",
            height: "100%",
            zIndex: 1000,
          }}
        >
          <PopUp
            text="Are you sure you want to update role of user?"
            button1Text="Yes"
            button2Text="No"
            action1={() => {
              if (selectedUserId !== null && selectedUserRole !== null) {
                handleUpdateRole(selectedUserId, selectedUserRole);
                setIsUpdateRoleVisible(false);
                fetchChatroom();
              }
            }}
            title="Update Role"
            action2={() => {
              setIsUpdateRoleVisible(false);
            }}
            isEditRole={true}
            setSelectedUserRole={setSelectedUserRole}
            setSelectedUserId={setSelectedUserId}
          />
        </View>
      )}

      {isAddUserToGroupVisible && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#FFFBE4",
            zIndex: 999,
          }}
        >
          <AddUserToGroup
            onBack={() => setIsAddUserToGroupVisible(false)}
            handleAddUserToGroup={handleAddUserToGroup}
          />
        </View>
      )}

      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require("../../../assets/Basketball2.png")}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          <View style={{ flex: 1, backgroundColor: "#FFFBE4AA" }}>
            {chatroom?.is_group && (
              <View style={styles.topBar}>
                <TouchableOpacity
                  onPress={toggleMenu}
                  style={styles.burgerButton}
                >
                  <View style={styles.burgerLine} />
                  <View style={styles.burgerLine} />
                  <View style={styles.burgerLine} />
                </TouchableOpacity>
              </View>
            )}

            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
              <View style={{ flex: 1 }}>
                {chatroom?.is_group && (
                  <Animated.View style={[styles.menu, menuStyle]}>
                    <Animated.View
                      style={[styles.menuContent, menuContentStyle]}
                    >
                      <View style={styles.menuHeader}>
                        {isEditing ? (
                          <TextInput
                            style={[
                              styles.menuHeaderText,
                              {
                                borderBottomWidth: 1,
                                borderColor: "#803511",
                                paddingVertical: 2,
                              },
                            ]}
                            value={editedGroupName}
                            onChangeText={setEditedGroupName}
                            onBlur={handleSaveGroupName}
                            autoFocus
                          />
                        ) : (
                          <Text style={styles.menuHeaderText}>
                            {chatroom?.name}
                          </Text>
                        )}
                        <View style={{ flexDirection: "row", gap: 10 }}>
                          {isOwner && (
                            <TouchableOpacity onPress={handleDeleteGroup}>
                              <Ionicons
                                name="trash-outline"
                                size={24}
                                color="rgb(179, 10, 10)"
                              />
                            </TouchableOpacity>
                          )}
                          {(isAdmin || isOwner) && (
                            <TouchableOpacity onPress={handleEditGroupName}>
                              <Ionicons
                                name="create-outline"
                                size={24}
                                color="rgb(179, 10, 10)"
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>

                      <View style={styles.menuParticipants}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text style={styles.menuParticipantsText}>
                            Group members
                          </Text>
                          {(isOwner || isAdmin) && (
                            <TouchableOpacity
                              onPress={() => setIsAddUserToGroupVisible(true)}
                              style={styles.plusButton}
                            >
                              <Ionicons
                                name="add"
                                size={20}
                                style={styles.plusButtonIcon}
                              />
                            </TouchableOpacity>
                          )}
                        </View>

                        <View style={styles.menuParticipantsList}>
                          <ScrollView
                            contentContainerStyle={{ gap: 10, flex: 1 }}
                          >
                            {chatroom?.members.map((member, index) => (
                              <View
                                key={index}
                                style={styles.menuParticipantsItem}
                              >
                                <Image
                                  source={{
                                    uri: pfpUrls[member.id.toString()],
                                  }}
                                  style={styles.avatar}
                                  resizeMode="cover"
                                />
                                <View style={{ flexDirection: "column" }}>
                                  <Text
                                    style={{ fontSize: 10, color: "#803511" }}
                                  >
                                    {member.role}
                                  </Text>
                                  <Text
                                    style={{ fontSize: 16, color: "#803511" }}
                                  >
                                    {member.username}
                                  </Text>
                                </View>
                                {(isOwner || isAdmin) && (
                                  <View
                                    style={{
                                      flex: 1,
                                      gap: 5,
                                      flexDirection: "row",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    {canRemoveUser(member) && (
                                      <TouchableOpacity
                                        onPress={() => {
                                          setSelectedUserId(member.id);
                                          setIsRemoveUserFromGroupVisible(true);
                                        }}
                                      >
                                        <Ionicons
                                          name="person-remove"
                                          size={20}
                                          color="black"
                                        />
                                      </TouchableOpacity>
                                    )}

                                    <TouchableOpacity
                                      onPress={() => {
                                        setSelectedUserId(member.id);
                                        setSelectedUserRole(member.role);
                                        setIsUpdateRoleVisible(true);
                                      }}
                                    >
                                      <Ionicons
                                        name="swap-vertical-outline"
                                        size={20}
                                        color="black"
                                      />
                                    </TouchableOpacity>
                                  </View>
                                )}
                              </View>
                            ))}
                          </ScrollView>
                        </View>
                      </View>
                    </Animated.View>
                  </Animated.View>
                )}

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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBE4",
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
    flex: 1,
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
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  menuHeaderText: {
    fontSize: 18,
    color: "#803511",
    fontWeight: "bold",
  },
  menuParticipants: {
    flex: 1,
    paddingVertical: 50,
  },
  menuParticipantsText: {
    fontSize: 18,
    color: "#803511",
  },
  menuParticipantsList: {
    flex: 1,
    paddingVertical: 15,
    flexDirection: "column",
    borderColor: "#803511",
    borderWidth: 1,
    borderRadius: 10,
    gap: 10,
    padding: 10,
  },
  menuHeaderButton: {
    backgroundColor: "#803511",
    padding: 10,
    borderRadius: 10,
  },
  menuHeaderButtonText: {
    color: "#FFFBE4",
    fontWeight: "bold",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 12,
  },
  menuParticipantsItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#803511",
    borderRadius: 10,
    padding: 10,
  },
  plusButton: {
    padding: 10,
  },
  plusButtonIcon: {
    color: "#803511",
  },
  iconsDelete: {
    color: "#803511",
    fontSize: 20,
    fontWeight: "bold",
  },
});
