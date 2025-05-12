import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { styles } from "./style";
import allPublication from "@/API/publication/allPublication";
import { useEffect, useState } from "react";
import { Post as PostInterface } from "@/types/Post";
import Post from "@/components/Post";
const AllPublication = () => {
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAllPublication = async () => {
    try {
      const response = await allPublication();
      if (Array.isArray(response)) {
        setPosts(response);
      } else {
        console.error("Invalid response format:", response);
        setPosts([]);
      }
    } catch (err) {
      console.error("Error fetching publications:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPublication();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/BasketballSide2.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <ScrollView
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <View key={index} style={styles.postContainer}>
                <Post post={post} />
              </View>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No publications found</Text>
            </View>
          )}
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default AllPublication;
