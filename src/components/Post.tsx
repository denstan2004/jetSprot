import { RootState } from "@/store/redux/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSelector } from "react-redux";

interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
}

const Post = async () => {
  const sel = useSelector((state: RootState) => state.user.userData);
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "http://192.168.0.105:8000/api/user/1/publications/"
      );
      setPosts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {posts.map((post) => {
        const isAuthor = sel?.id === post.id;

        if (!isAuthor) return null;

        return (
          <View key={post.id} style={styles.postCard}>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.content}>{post.content}</Text>
            <Text style={styles.author}>Author: {post.author}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  postCard: {
    backgroundColor: "#fdf6ec",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#AC591A",
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: "#5B3400",
  },
  author: {
    fontSize: 12,
    marginTop: 8,
    color: "#AC591A",
  },
});
