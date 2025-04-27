import { RootState } from "@/store/redux/store";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useSelector } from "react-redux";
import { Post as PostInterface } from "@/types/Post";
import { User } from "@/types/User";
import { Ionicons } from "@expo/vector-icons";
import { storage } from "@/firebase";
import { getDownloadURL, ref } from "firebase/storage";

interface PostProps {
  post: PostInterface;
}

const Post = ({ post }: PostProps) => {
  const sel = useSelector((state: RootState) => state.user.userData);
  // const [author, setAuthor] = useState<User | null>(null);
  useEffect(() => {}, [post]);

  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const [pfpUrl, setPfpUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPfpUrl = async () => {
      if (sel?.pfp_url) {
        try {
          const storageRef = ref(storage, sel.pfp_url);
          const url = await getDownloadURL(storageRef);
          setPfpUrl(url);
        } catch (error) {
          console.error("Failed to fetch avatar:", error);
        }
      }
    };

    fetchPfpUrl();
  }, [sel?.pfp_url]);

  return (
    <View key={post.id} style={styles.postCard}>
      <View style={styles.header}>
        {/* <Image
          source={{ uri: pfpUrl || '' }}
          style={styles.image}
        /> */}
        <View style={styles.headerText}>
          <Text style={styles.username}>{post.creator_username}</Text>
        </View>
      </View>

      <Text style={styles.title}>{post.caption}</Text>
      <Text style={styles.content}>{post.description}</Text>

      <View style={styles.footer}>
        <View style={styles.likes}>
          <Ionicons name="heart-outline" size={20} color="#AC591A" />
          <Text style={styles.footerText}>{post.likes}</Text>
        </View>
        <TouchableOpacity style={styles.comments} onPress={openModal}>
          <Ionicons name="chatbubble-outline" size={20} color="#5B3400" />
          <Text style={styles.footerText}>Comments</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.bottomModalContainer}>
          <View style={styles.bottomModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comments</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.noComments}>No comments yet...</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  postCard: {
    backgroundColor: "#FFFBE4",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  headerText: {
    justifyContent: "center",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5B3400",
  },
  createdAt: {
    fontSize: 12,
    color: "#AC591A",
    marginTop: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#AC591A",
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: "#5B3400",
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E0C097",
    paddingTop: 12,
  },
  likes: {
    flexDirection: "row",
    alignItems: "center",
  },
  comments: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#5B3400",
  },
  bottomModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bottomModalContent: {
    height: "55%",
    backgroundColor: "#FFFBE4",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0C097",
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5B3400",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    marginTop: 10,
  },
  noComments: {
    fontSize: 14,
    color: "#AC591A",
    textAlign: "center",
    marginTop: 20,
  },
});
