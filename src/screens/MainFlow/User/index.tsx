import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Modal,
  ScrollView,
  Image,
  Animated,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import getUserFollowers from "@/API/user/getUserFollowers";
import {
  NavigationProp,
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
import { User } from "@/types/User";
import axios from "axios";
import { updateUser } from "@/store/redux/slices/userSlice";
import { getUserPosts as getPostUserApi } from "@/API/user/getPostUser";
import { Post as PostInterface } from "@/types/Post";
import Post from "@/components/Post";
import { apiUrl } from "@/API/apiUrl";
import getUserFollows from "@/API/user/getUserFollows";
import { storage } from "@/firebase";
import { getDownloadURL, ref } from "firebase/storage";

type UserRouteProp = RouteProp<AuthStackParamList, "User">;

export const UserPage = () => {
  const route = useRoute<UserRouteProp>();
  const userId =
    route.params?.userId ||
    useSelector((state: RootState) => state.user.userData?.id.toString());
  const sel = useSelector((state: RootState) => state.user.userData);
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const [followers, setFollowers] = useState<User[]>([]);
  const [follows, setFollows] = useState<User[]>([]);
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showDopInfo, setShowDopInfo] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const handleNavigateToFolowers = () => {
    navigation.navigate("ListUsers", { followers });
  };
  const handleNavigateToFollows = () => {
    navigation.navigate("ListUsers", { followers: follows });
  };
  const handleNavigateToEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const handleNavigateToSearchCountry = () => {
    navigation.navigate("FoundCountry");
  };

  // const handleDeletePost = (id: number) => {
  //   setPosts(posts.filter((post) => post.id !== id));
  // };

  const getFollowersCount = async () => {
    if (userId) {
      return await getUserFollowers(parseInt(userId));
    }
    return [];
  };

  const getFollowsCount = async () => {
    if (userId) {
      return await getUserFollows(parseInt(userId));
    }
    return [];
  };

  const getUserById = async (userId: string) => {
    const response = await axios.get(`${apiUrl}/user/${userId}/`);
    return response.data;
  };

  const hasMissingInfo = () => {
    return (
      !sel?.birth_date || !sel?.first_name || !sel.last_name || !sel?.username
    );
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const user: User = await getUserById(userId);
        setCurrentUser(user);
        setUserName(user.username);
        setFirstName(user.first_name);

        // Only update the global user state if it's the current user's profile
        if (userId === sel?.id.toString()) {
          dispatch(updateUser(user));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchFollowers = async () => {
      try {
        const follow = await getFollowsCount();
        const followers = await getFollowersCount();
        setFollowers(followers || []);
        setFollows(follow || []);
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    const fetchPosts = async () => {
      if (userId) {
        try {
          const response = await getPostUserApi(userId);
          setPosts(response || []);
        } catch (error) {
          console.error("Error fetching posts:", error);
          console.error("Error fetching posts:", error);
        }
      }
    };

    fetchUserData();
    fetchFollowers();
    fetchPosts();
  }, [userId]);

  useEffect(() => {
    const fetchPfpUrl = async () => {
      if (currentUser?.pfp_url) {
        try {
          const storageRef = ref(storage, currentUser.pfp_url);
          const url = await getDownloadURL(storageRef);
          setMediaUrl(url);
        } catch (error) {
          console.error("Failed to fetch avatar:", error);
        }
      }
    };

    fetchPfpUrl();
  }, [currentUser]);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: showDopInfo ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showDopInfo]);

  const profileBodyStyle = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 75], // Adjust this value based on your needs
        }),
      },
    ],
  };

  const additionalInfoStyle = {
    opacity: animation,
    height: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 75], // Should match the translateY value above
    }),
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerTopRow}>
        <View style={styles.iconGroup}>
          <TouchableOpacity style={styles.icon}>
            <Ionicons name="heart-outline" size={24} color="white" />
          </TouchableOpacity>
          {userId === sel?.id.toString() && (
            <TouchableOpacity
              onPress={handleNavigateToEditProfile}
              style={styles.icon}
            >
              <MaterialIcons name="edit" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.headerBackground}>
        {/* {hasMissingInfo() && ( */}
          <TouchableOpacity
            style={styles.warningContainer}
            onPress={handleNavigateToSearchCountry}
          >
            <Text style={styles.warningText}>
              Please complete your profile by adding your country, city and sport.
            </Text>
          </TouchableOpacity>
        {/* )} */} 

        <View style={styles.avatarSection}>
          <View style={styles.leftSide}>
            <Text style={styles.username}>
              {firstName} {lastName}
            </Text>

            <View style={styles.avatarContainer}>
              <TouchableOpacity
                onPress={handleNavigateToEditProfile}
                // style={styles.addIconContainer}
              >
                <Image
                  source={{ uri: mediaUrl || "" }}
                  style={styles.profileImage}
                />
                {/* {userId === sel?.id.toString() && (
                  <Text style={styles.addIcon}>+</Text>
                )} */}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rightSide}>
            <View style={styles.statsRow}>
              <TouchableOpacity onPress={handleNavigateToFolowers}>
                <View style={styles.statsItem}>
                  <Text
                    style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                  >
                    {followers.length}
                  </Text>
                  <Text style={{ color: "white", fontSize: 16 }}>
                    Followers
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNavigateToFollows}>
                <View style={styles.statsItem}>
                  <Text
                    style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                  >
                    {follows.length}
                  </Text>
                  <Text style={{ color: "white", fontSize: 16 }}>Follows</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>


          {/* <Text style={styles.statusText}>
            {currentUser?.status || "No status"}
          </Text> */}
          {userId !== sel?.id.toString() && (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.buttonText}>Follow</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.messageButton}>
                <Text style={styles.buttonText}>Message</Text>
              </TouchableOpacity>
            </View>
          )}

      </View>

      <Animated.View style={[styles.profileBody, profileBodyStyle]}>
        <ImageBackground
          source={require("../../../assets/Basketball2.png")}
          style={styles.profileBodyBackground}
          resizeMode="cover"
        >
          <View
            style={{ flexDirection: "row",  justifyContent:
              userId === sel?.id.toString() ? "space-between" : "center", }}
          >

            <TouchableOpacity onPress={() => setShowDopInfo(!showDopInfo)}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: showDopInfo ? "#803511" : "transparent",
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              > 
                <Ionicons
                  name={showDopInfo ? "arrow-up" : "arrow-down"}
                  size={24}
                  color={showDopInfo ? "white" : "#803511"}
                />
              </View>
            </TouchableOpacity>

            {userId === sel?.id.toString() && (
              <TouchableOpacity
                onPress={() => navigation.navigate("CreatePost")}
              >
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: showDopInfo ? "#803511" : "transparent",
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="add-sharp"
                    size={24}
                    color={showDopInfo ? "white" : "#803511"}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 10 }}
          >
            {posts.map((post, index) => (
              <View key={index} style={{ marginVertical: 10 }}>
                <Post post={post} />
              </View>
            ))}
          </ScrollView>
        </ImageBackground>
      </Animated.View>
    </SafeAreaView>
  );
};
