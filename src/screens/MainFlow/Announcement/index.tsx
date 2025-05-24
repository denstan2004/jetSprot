import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Announcement as AnnouncementType } from "@/types/Announcement";
import { Ionicons } from "@expo/vector-icons";
import { rem } from "@/theme/units";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
// import getComment from "@/API/announcement/comments/getComment";
import { useEffect } from "react";
import { useState } from "react";
import { AnnouncementComment } from "@/types/AnnouncmentComment";
import getAnnouncmentComment from "@/API/announcement/comments/getAnnouncmentComment";
import addComment from "@/API/announcement/comments/addComent";
import { RootState } from "@/store/redux/store";
import { useSelector } from "react-redux";
import deleteComment from "@/API/announcement/comments/deleteComment";
import retractComment from "@/API/announcement/comments/retractComment";
import likeComment from "@/API/announcement/comments/likeComment";
interface Sport {
  id: number;
  name: string;
}

export const Announcement = () => {
  const route = useRoute<RouteProp<AuthStackParamList, "Announcement">>();
  const navigation = useNavigation();
  const { announcement } = route.params;
  const { accessToken } = useSelector((state: RootState) => state.user);

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<AnnouncementComment[]>([]);

  const getComments = async () => {
    try {
      const response = await getAnnouncmentComment(
        announcement.id.toString(),
        accessToken
      );
      console.log("API response for comments:", response);
      setComments(response || []);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };
  useEffect(() => {
    getComments();
  }, []);

  const handleCommentSubmit = async () => {
    try {
      const response = await addComment(comment, announcement.id, accessToken);
      setComment("");
      getComments();
    } catch (error) {
      console.error("Error submitting comment", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    console.log("Deleting comment with ID:", commentId);
    try {
      const response = await deleteComment(commentId, accessToken);
      getComments();
    } catch (error) {
      console.error("Error deleting comment", error);
    }
  };

  const toggleLikePost = async (commentId: number) => {
    try {
      const isLiked = comments.find(
        (comment) => comment.id === commentId
      )?.is_liked;
      if (isLiked) {
        const res = await retractComment(commentId.toString(), accessToken);
        setComments(
          comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, is_liked: false, likes: comment.likes - 1 }
              : comment
          )
        );
        console.log("RetractLike res:", res);
      } else {
        const res = await likeComment(commentId.toString(), accessToken);
        console.log("PostLike res:", res);
        setComments(
          comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, is_liked: true, likes: comment.likes + 1 }
              : comment
          )
        );
      }
    } catch (err) {
      console.log("Like toggle error:", err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFBE4" }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#5B3400" />
        </TouchableOpacity>
      </View>
      <View>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.sportsContainer}>
              {Array.isArray(announcement?.sports) &&
                announcement.sports.map((sport: any, index) => (
                  <View key={sport.id ?? index} style={styles.sportTag}>
                    <Text style={styles.sportText}>
                      {typeof sport === "string" ? sport : sport.name}
                    </Text>
                  </View>
                ))}
            </View>
            <View style={styles.statusContainer}>
              <Ionicons
                name={announcement.status === 1 ? "checkmark-circle" : "time"}
                size={24}
                color={announcement.status === 1 ? "#4CAF50" : "#FF763F"}
              />
              <Text style={styles.statusText}>
                {announcement.status === 1 ? "Active" : "Pending"}
              </Text>
            </View>
          </View>

          <Text style={styles.caption}>{announcement.caption}</Text>
          <ScrollView style={{ maxHeight: 100 }}>
            <Text style={styles.description}>{announcement.description}</Text>
          </ScrollView>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Ionicons name="people" size={20} color="#5B3400" />
              <Text style={styles.detailText}>
                Required: {announcement.required_amount} people
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={20} color="#5B3400" />
              <Text style={styles.detailText}>
                Valid until:{" "}
                {new Date(announcement.end_date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time" size={20} color="#5B3400" />
              <Text style={styles.detailText}>
                Created:{" "}
                {new Date(announcement.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.commentsSection}>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 10 }}
            ListEmptyComponent={
              <Text style={styles.noCommentsText}>No comments yet.</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <View style={styles.commentContent}>
                  <Text style={styles.detailText}>{item.author_username}</Text>
                  <Text style={styles.detailText}>{item.content}</Text>
                  <Text style={styles.detailText}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: rem(8) }}>
                  <View style={{ alignItems: "center" }}>
                    <TouchableOpacity onPress={() => toggleLikePost(item.id)}>
                      <Ionicons
                        name={item.is_liked ? "heart" : "heart-outline"}
                        size={24}
                        color="#AC591A"
                      />
                    </TouchableOpacity>
                    <Text style={{ fontSize: rem(10), color: "#AC591A" }}>
                      {item.likes}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteIcon}
                    onPress={() => handleDeleteComment(item.id.toString())}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={24}
                      color="rgb(179, 10, 10)"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={comment}
              onChangeText={setComment}
              placeholderTextColor="#AC591A"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleCommentSubmit}
            >
              <Ionicons name="send" size={24} color="#5B3400" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFBE4",
    margin: rem(16),
    padding: rem(20),
    borderRadius: rem(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: rem(16),
    paddingVertical: rem(8),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rem(16),
    paddingVertical: rem(8),
  },
  backButton: {
    padding: rem(8),
    borderRadius: rem(8),
  },
  sportsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: rem(8),
  },
  sportTag: {
    backgroundColor: "#AC591A",
    paddingHorizontal: rem(12),
    paddingVertical: rem(6),
    borderRadius: rem(16),
  },
  sportText: {
    color: "#FFFBE4",
    fontSize: rem(14),
    fontWeight: "600",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: rem(4),
  },
  statusText: {
    color: "#5B3400",
    fontSize: rem(14),
    fontWeight: "600",
  },
  caption: {
    fontSize: rem(24),
    fontWeight: "700",
    color: "#5B3400",
    marginBottom: rem(12),
  },
  description: {
    fontSize: rem(16),
    color: "#5B3400",
    lineHeight: rem(24),
    marginBottom: rem(20),
  },
  detailsContainer: {
    gap: rem(12),
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: rem(8),
  },
  detailText: {
    fontSize: rem(14),
    color: "#5B3400",
  },
  commentsSection: {
    flex: 1,
    justifyContent: "space-between",
  },
  comment: {
    flexDirection: "row",
    padding: rem(12),
    borderRadius: rem(8),
    marginBottom: rem(10),
    gap: rem(10),
  },
  commentContent: {
    flex: 1,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rem(10),
    paddingVertical: rem(8),
    borderTopWidth: 1,
    borderColor: "#AC591A",
  },
  commentInput: {
    flex: 1,
    padding: rem(10),
    borderRadius: rem(8),
    borderWidth: 1,
    borderColor: "#AC591A",
    color: "#5B3400",
  },
  sendButton: {
    padding: rem(8),
    borderRadius: rem(8),
  },
  noCommentsText: {
    color: "#AC591A",
    textAlign: "center",
    paddingVertical: rem(10),
  },
  deleteIcon: {},
});
