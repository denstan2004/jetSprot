import { RootState } from "@/store/redux/store";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import { Post as PostInterface, Media } from "@/types/Post";
import { User } from "@/types/User";
import { Ionicons } from "@expo/vector-icons";
import { storage } from "@/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { ResizeMode, Video } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
import { Comment } from "@/types/Comments";
import getComments from "@/API/comments/getComments";
import addComments from "@/API/comments/addComments";
import PostLike from "@/API/publication/postLikes";
import RetractLike from "@/API/publication/retractlike";
import CommRetractLikeLikes from "@/API/comments/commentsRetractlike";
import CommentsLikes from "@/API/comments/commentsLikes";
import deleteComments from "@/API/comments/deleteComent";
import getUserById from "@/API/user/getUserById";
interface PostProps {
  // onDelete: (id: number) => void;
  post: PostInterface;
}

const Post = ({ post }: PostProps) => {
  const sel = useSelector((state: RootState) => state.user.userData);
  const access = useSelector((state: RootState) => state.user.accessToken);
  // console.log(access)
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [author, setAuthor] = useState<User | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const creator = async () => {
    try {
      console.log(post.creator);
      const response = await getUserById(post.creator.toString());
      setAuthor(response);
      // Fetch profile photo URL if it exists
      if (response.pfp_url) {
        console.log(response.pfp_url);
        const storageRef = ref(storage, response.pfp_url);
        const url = await getDownloadURL(storageRef);
        setMediaUrl(url);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    creator();
  }, [post.creator]);

  const handleProfilePress = () => {
    navigation.navigate("User", { userId: post.creator.toString() });
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(post.id.toString());
      setComments(response.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };

  const openModal = async () => {
    setModalVisible(true);
    await fetchComments();
    console.log(comments);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const addComment = async () => {
    try {
      console.log(post.id);
      console.log(newComment);
      const response = await addComments(newComment, access, post.id);
      console.log(response.data);

      setComments((prevComments) => {
        if (Array.isArray(prevComments)) {
          return [...prevComments, response.data];
        }
        return [response.data];
      });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // const handleDeletePost = async () => {
  //   try {
  //     console.log(post.creator);
  //     console.log(sel?.id);
  //     const id = post.id.toString();
  //     const response = await deletePublication(
  //       id,
  //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ2MDMwNzY4LCJpYXQiOjE3NDU5NDQzNjgsImp0aSI6ImU5N2M3ZjU5NTE5YTQ4ZTdiYWZkMTZlNDA0YTRkMzc1IiwidXNlcl9pZCI6MX0.Cr1dH_iyTAZmnkUuP0p6LqI7x__KAXCa5W1-ZghXnVA"
  //     );
  //     // console.log(response);
  //     if (response.status === 204) {
  //       console.log("Post deleted");
  //       onDelete(post.id);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const toggleLikePost = async () => {
    try {
      if (isLiked) {
        const res = await RetractLike(post.id.toString(), access);
        console.log("RetractLike res:", res);
        setIsLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        const res = await PostLike(post.id.toString(), access);
        console.log("PostLike res:", res);
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (err) {
      console.log("Like toggle error:", err);
    }
  };

  const toggleLikeComments = async (commentId: string) => {
    try {
      // const IS_CURRENT_USER=TRUE
      const targetComment = comments.find((c) => c.id.toString() === commentId);

      if (targetComment?.is_liked) {
        await CommRetractLikeLikes(commentId, access);
      } else {
        await CommentsLikes(commentId, access);
      }
    } catch (err) {
      console.log("Like toggle error:", err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await deleteComments(commentId, access);
      console.log(response);
      fetchComments();
    } catch (err) {
      console.log(err);
    }
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const selectedIndex = Math.floor(contentOffset / viewSize);
    setCurrentMediaIndex(selectedIndex);
  };

  const renderMediaItem = (item: Media, index: number) => {
    return (
      <View key={index} style={styles.mediaContainer}>
        {item.media_url.endsWith(".mp4") ? (
          <Video
            source={{ uri: item.media_url }}
            style={styles.media}
            resizeMode={ResizeMode.COVER}
            useNativeControls
            shouldPlay={false}
            isLooping
          />
        ) : (
          <Image
            source={{ uri: item.media_url }}
            style={styles.media}
            resizeMode="cover"
          />
        )}
      </View>
    );
  };

  const renderPaginationDots = () => {
    if (!post.media_files || post.media_files.length <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        {post.media_files.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentMediaIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View key={post.id} style={styles.postCard}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleProfilePress}>
          <Image
            source={{ uri: mediaUrl || "https://via.placeholder.com/40" }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.username}>{post.creator_username}</Text>
        </View>
      </View>

      {/* <TouchableOpacity>
        <Text>Delete</Text>
      </TouchableOpacity>  */}

      <Text style={styles.caption}>{post.caption}</Text>
      <Text style={styles.description}>{post.description}</Text>

      {post.media_files && post.media_files.length > 0 && (
        <View style={styles.mediaWrapper}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            style={styles.scrollView}
          >
            {post.media_files.map((item, index) =>
              renderMediaItem(item, index)
            )}
          </ScrollView>
          {renderPaginationDots()}
        </View>
      )}
      <View style={styles.hashtagsContainer}>
        {post.hashtags && <Text style={styles.hashtag}>{post.hashtags}</Text>}
      </View>
      <View style={styles.footer}>
        <View style={styles.likes}>
          <TouchableOpacity onPress={toggleLikePost}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={20}
              color="#AC591A"
            />
          </TouchableOpacity>
          <Text style={styles.footerText}>{likesCount}</Text>
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          // keyboardVerticalOffset={10}
        >
          <View style={styles.bottomModalContainer}>
            <View style={styles.bottomModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Comments</Text>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {comments.length === 0 || comments.length === undefined ? (
                  <Text style={styles.noComments}>No comments yet...</Text>
                ) : (
                  comments.map((comment, index) => (
                    <View key={index} style={styles.commentCard}>
                      <View style={styles.commentContent}>
                        <TouchableOpacity onPress={handleProfilePress}>
                          <Image
                            source={{ uri: mediaUrl || "" }}
                            style={styles.commentAvatar}
                          />
                        </TouchableOpacity>

                        <View style={styles.commentTextContainer}>
                          <Text style={styles.commentUsername}>
                            {comment.author_username}
                          </Text>

                          <Text style={styles.commentText}>
                            {comment.content}
                          </Text>
                        </View>

                        <View style={styles.likeButton}>
                          <TouchableOpacity
                            onPress={() =>
                              toggleLikeComments(comment.id.toString())
                            }
                          >
                            <Ionicons
                              name={
                                comment.is_liked ? "heart" : "heart-outline"
                              }
                              size={20}
                              color="#AC591A"
                            />
                          </TouchableOpacity>
                          {comment.author_username === sel?.username && (
                            <TouchableOpacity
                              onPress={() =>
                                handleDeleteComment(comment.id.toString())
                              }
                            >
                              <Ionicons
                                name="trash-outline"
                                size={20}
                                color="rgb(179, 10, 10)"
                              />
                            </TouchableOpacity>
                          )}
                          <Text style={styles.footerText}>{comment.likes}</Text>
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
                  maxLength={100}
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
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  postCard: {
    borderRadius: 16,
    marginBottom: 24,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 3 },
    shadowOpacity: 0,
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#5B3400",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
  },
  caption: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#AC591A",
    marginBottom: 4,
  },
  hashtagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
    gap: 6,
  },
  hashtag: {
    color: "#E08B2F",
    fontWeight: "600",
    marginRight: 8,
    fontSize: 15,
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: "#5B3400",
    marginBottom: 16,
  },
  mediaWrapper: {
    position: "relative",
    height: 300,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  mediaContainer: {
    width: Dimensions.get("window").width - 40,
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
  },
  media: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E0C097",
    paddingTop: 16,
    marginTop: 8,
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
    marginBottom: 10,
  },
  noComments: {
    fontSize: 14,
    color: "#AC591A",
    textAlign: "center",
    marginTop: 20,
  },
  commentCard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    paddingVertical: 10,
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 8,
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
    color: "#5B3400",
    fontSize: 16,
  },
  addCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  commentInput: {
    flex: 1,
    padding: 8,
    paddingLeft: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    marginRight: 8,
  },
  addCommentButton: {
    padding: 6,
  },
  likeButton: {
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#AC591A",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
