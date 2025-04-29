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
  TextInput,
} from "react-native";
import { useSelector } from "react-redux";
import { Post as PostInterface } from "@/types/Post";
import { User } from "@/types/User";
import { Ionicons } from "@expo/vector-icons";
import { storage } from "@/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { ResizeMode, Video } from "expo-av";
import { apiUrl } from "@/API/apiUrl";

interface PostProps {
  post: PostInterface;
}
// зробити карточку коментаря в кожному коментарі зробити забит по юзера звідти треба юзернейм і пфп піктуре ==> на фаєрбейз дістав зображення і вдобразив
//press modal, зробив запит на бек, дістати всі коментарі по посту, закинув їх в юзстейт, якщо додаєш коментарій то робиш запит якщо запит повернув ок то додаєш власний комент в юз стейт після цього як закрив модалку очистив стейт
const Post = ({ post }: PostProps) => {
  const sel = useSelector((state: RootState) => state.user.userData);
  const acces = useSelector((state: RootState) => state.user.accessToken);
  const [isLiked, setIsLiked] = useState(post.is_liked);

  // const [author, setAuthor] = useState<User | null>(null);
  useEffect(() => {}, [post]);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  const openModal = async () => {
    setModalVisible(true);
    await fetchComments();
  };

  const closeModal = () => {
    setModalVisible(false);
    setComments([]);
  };

  useEffect(() => {
    const fetchPfpUrl = async () => {
      if (sel?.pfp_url) {
        try {
          const storageRef = ref(storage, sel.pfp_url);
          const url = await getDownloadURL(storageRef);
          if (
            url.includes(
              "https://storage.googleapis.com/sfy-firebase.appspot.com/publications/photos"
            )
          )
            console.log("URL:", url);
          setMediaUrl(url);
        } catch (error) {
          console.error("Failed to fetch avatar:", error);
        }
      }
    };

    fetchPfpUrl();
  }, [post.media]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/user/${sel?.id}/publications/`
      );
      const publications = response.data.data || [];
      // console.log("Publications:", publications);
      const currentPost = publications.find((pub: any) => pub.id === post.id);
      if (currentPost && currentPost.comments) {
        setComments(currentPost.comments);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const addComment = async () => {
    if (newComment.trim()) {
      try {
        const response = await axios.patch(
          `${apiUrl}/comment/${sel?.id}/`,
          { content: newComment },
          {
            headers: {
              Authorization: `Bearer ${acces}`,
            },
          }
        );
        console.log("Comment added:", response.data);

        if (response.data) {
          const updatedComment = response.data;
          setComments([...comments, updatedComment]);
          setNewComment("");
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  return (
    <View key={post.id} style={styles.postCard}>
      <View style={styles.header}>
        <Image source={{ uri: mediaUrl || "" }} style={styles.profileImage} />
        <View style={styles.headerText}>
          <Text style={styles.username}>{post.creator_username}</Text>
        </View>
      </View>

      <Text style={styles.caption}>{post.caption}</Text>
      <Text style={styles.description}>{post.description}</Text>

      {post.media && (
        <View style={styles.mediaContainer}>
          {post.media.endsWith(".mp4") ? (
            <Video
              source={{ uri: post.media }}
              style={styles.media}
              resizeMode={ResizeMode.COVER}
              useNativeControls
              shouldPlay={false}
              isLooping
            />
          ) : (
            <Image
              source={{ uri: post.media }}
              style={styles.media}
              resizeMode="cover"
            />
          )}
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.likes}>
          <TouchableOpacity
            onPress={() => {
              setIsLiked(!isLiked);
            }}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={20}
              color="#AC591A"
            />
          </TouchableOpacity>
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
              {comments.length === 0 ? (
                <Text style={styles.noComments}>No comments yet...</Text>
              ) : (
                comments.map((comment, index) => (
                  <View key={index} style={styles.commentCard}>
                    <View style={styles.commentContent}>
                      <Image
                        source={{ uri: mediaUrl || "" }}
                        style={styles.commentAvatar}
                      />

                      <View style={styles.commentTextContainer}>
                        <Text style={styles.commentUsername}>
                          {comment.author_username || "Unknown"}
                        </Text>

                        <Text style={styles.commentText}>
                          {comment.content}
                        </Text>
                      </View>

                      <View style={styles.likeButton}>
                        <TouchableOpacity>
                          <Ionicons
                            name={isLiked ? "heart" : "heart-outline"}
                            size={20}
                            color="#AC591A"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            <View style={styles.addCommentContainer}>
              <TextInput
                style={styles.commentInput}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Write a comment..."
                placeholderTextColor="#AC591A"
              />
              <TouchableOpacity
                onPress={addComment}
                style={styles.addCommentButton}
              >
                <Ionicons name="send" size={24} color="#5B3400" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
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
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  caption: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#AC591A",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#5B3400",
    marginBottom: 12,
  },
  mediaContainer: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  media: {
    width: "100%",
    height: 250,
    borderRadius: 16,
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
    paddingBottom: 20,
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
  commentCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E0C097",
  },
  commentContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 12,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentUsername: {
    fontWeight: "bold",
    color: "#5B3400",
  },
  commentText: {
    color: "#AC591A",
    fontSize: 14,
  },
  addCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  commentInput: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F4F4F4",
    borderColor: "#E0C097",
    borderWidth: 1,
    marginRight: 8,
  },
  addCommentButton: {
    padding: 6,
  },
  likeButton: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});
