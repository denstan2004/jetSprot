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
} from "react-native";
import { useSelector } from "react-redux";
import { wsUrl as wsUrlApi } from "@/API/apiUrl";

interface ChatMessage {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
  };
}

const ChatScreen = () => {
  const { userId, userName } = { userId: 1, userName: "John Doe" };
  const { accessToken } = useSelector((state: RootState) => state.user);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const wsUrl = `${wsUrlApi}/chat/1/?token=${accessToken}`;

  const connectWebSocket = useCallback(() => {
    const socket = new WebSocket(wsUrl);

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
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            _id: data._id,
            text: data.text,
            createdAt: new Date(data.createdAt),
            user: {
              _id: data.user._id,
              name: data.user.name,
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
        setMessages(loadedMessages);
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

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          _id: Date.now().toString(),
          text: newMessage.trim(),
          createdAt: new Date(),
          user: {
            _id: userId.toString(),
            name: userName,
          },
        },
      ]);

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
    const isMyMessage = item.user._id === userId.toString();

    return (
      <TouchableOpacity
        onLongPress={() => markRead(item._id)}
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.otherMessage,
        ]}
      >
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
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
          {isConnected ? "Connected" : "Disconnected"}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
  },
  messageText: {
    color: "#000",
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: "#666",
    alignSelf: "flex-end",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#007AFF",
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
  },
  connectionStatusText: {
    fontSize: 12,
    color: "#666",
  },
});

export default ChatScreen;
