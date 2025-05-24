import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { styles } from "./style";
import allPublication from "@/API/publication/allPublication";
import getRecommendations from "@/API/publication/getRecommendations";
import { useEffect, useState } from "react";
import { Post as PostInterface } from "@/types/Post";
import Post from "@/components/Post";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
const AllPublication = () => {
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { accessToken } = useSelector((state: RootState) => state.user);

  // const fetchAllPublication = async () => {
  //   try {
  //     const response = await allPublication();
  //     if (Array.isArray(response)) {
  //       setPosts(response);
  //     } else {
  //       console.error("Invalid response format:", response);
  //       setPosts([]);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching publications:", err);
  //     setPosts([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchRecommendations = async () => {
    try {
      const response = await getRecommendations(accessToken);
      if (Array.isArray(response)) {
        setPosts(response);
      } else {
        console.error("Invalid response format:", response);
        setPosts([]);
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
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
