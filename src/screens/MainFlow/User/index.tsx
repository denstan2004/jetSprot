import React, { useEffect, useState, useCallback } from "react";
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
  Alert,
} from "react-native";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { styles } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import getUserFollowers from "@/API/user/getUserFollowers";
import {
  NavigationProp,
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
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
import follow from "@/API/user/Follows/follow";
import unFollow from "@/API/user/Follows/unFollow";
import usersSporst from "@/API/sport/user'sSprosts";
import { Sport } from "@/types/Sport";
import RatingPopup from "@/components/RatingPopup";
import getReviewBy2IDs from "@/API/review/By2IDs";
import { Review } from "@/types/Review";
import createReview from "@/API/review/createReview";
import changeReview from "@/API/review/changeReview";
import getAllReviews from "@/API/review/getAllReviews";
import deleteReview from "@/API/review/deleteReview";
import createReport from "@/API/MODERATION/reports/createReport";
import ReportPopup from "@/components/ReportPopup";

type UserRouteProp = RouteProp<AuthStackParamList, "User">;
//TODO розділити на два скріни які використовую один і той самй компонент юезр який приймає юзер інфо і булку із курент юзер
export const UserPage = () => {
  const route = useRoute<UserRouteProp>();
  const userId =
    route.params?.userId ||
    useSelector((state: RootState) => state.user.userData?.id.toString());
  const sel = useSelector((state: RootState) => state.user.userData);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const [followers, setFollowers] = useState<User[]>([]);
  const [follows, setFollows] = useState<User[]>([]);
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showDopInfo, setShowDopInfo] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const isFollowing = followers.some((f) => f.id === sel?.id);
  const [sports, setSports] = useState<Sport[]>([]);

  const [isFriends, setIsFriends] = useState(false);
  const account_type = currentUser?.account_type;

  // --- rating ---
  const [isRatingVisible, setRatingVisible] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null); //  це review, який (можливо) залишив поточний користувач цьому профілю.
  const [isUpdatingRating, setIsUpdatingRating] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const isOurUser = userId === sel?.id.toString(); // check if the user is the current user
  console.log("userId:", userId);
  // --- report ---
  const [isReportVisible, setReportVisible] = useState(false);

  // --- визначити чи є review від поточного користувача
  const hasUserReview =
    !!userReview && userReview.creator?.toString() === sel?.id?.toString();

  // navigate
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
  const handleNavigateToUserSettings = () => {
    navigation.navigate("UserSettings");
  };

  // --- rating ---
  const handleAddRating = () => {
    if (hasUserReview && userReview.status === "open") {
      setIsUpdatingRating(true);
    } else {
      setIsUpdatingRating(false);
      setUserReview(null);
    }
    setRatingVisible(true);
  };
  const getReview = async () => {
    const response = await getReviewBy2IDs(
      sel?.id.toString() || "",
      userId?.toString() || ""
    );
    setUserReview(response);
  };
  useEffect(() => {
    if (!isOurUser) {
      getReview();
    }
  }, []);

  const handleCreateReview = async (rating: number, review: string) => {
    try {
      const response = await createReview(
        accessToken,
        Number(userId),
        rating,
        review
      );
      console.log("[UserPage] Review created successfully:", response);
      setUserReview(response);
      setRatingVisible(false);
    } catch (error) {
      console.error("[UserPage] Error creating review:", error);
      Alert.alert("Error", "Failed to create review. Please try again.");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await deleteReview(reviewId, accessToken);
      console.log("[UserPage] Review deleted successfully:", response);
      setUserReview(null);
      await getReview();
    } catch (error) {
      console.error("[UserPage] Error deleting review:", error);
      Alert.alert("Error", "Failed to delete review. Please try again.");
    }
  };

  const handleUpdateRating = async (rating: number, description: string) => {
    try {
      const response = await changeReview(
        accessToken,
        userReview?.id.toString() || "",
        rating,
        description
      );
      console.log("[UserPage] Review updated successfully:", response);
      setUserReview(response);
      setIsUpdatingRating(false);
      setRatingVisible(false);
      getReview();
    } catch (error) {
      console.error("[UserPage] Error updating review:", error);
      Alert.alert("Error", "Failed to update review. Please try again.");
    }
  };

  // const handleDeletePost = (id: number) => {
  //   setPosts(posts.filter((post) => post.id !== id));
  // };

  const handleReport = async (report: string, selectedReason: string) => {
    try {
      const response = await createReport(
        accessToken,
        Number(userId),
        selectedReason,
        report
      );
      console.log("[UserPage] Report created successfully:", response);
      setReportVisible(false);
      Alert.alert("Success", "Report submitted successfully");
    } catch (error) {
      console.error("[UserPage] Error creating report:", error);
      Alert.alert("Error", "Failed to submit report. Please try again.");
    }
  };

  // --- get followers and follows ---
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

  // --- get user by id ---
  const getUserById = async (userId: string) => {
    const response = await axios.get(`${apiUrl}/user/${userId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setIsFriends(response.data.is_friends);
    return response.data;
  };

  const hasMissingInfo = () => {
    return (
      !sel?.birth_date || !sel?.first_name || !sel.last_name || !sel?.username
    );
  };

  const getUsersSports = async (userId: string) => {
    const respone = await usersSporst(userId);

    setSports(respone);
  };

  useEffect(() => {
    if (!userId) {
      return;
    }
    getUsersSports(userId?.toString());
  }, []);

  // Combine all data fetching into a single function
  const fetchAllData = useCallback(async () => {
    if (!userId) {
      console.error("[UserPage] fetchAllData: No userId provided");
      return;
    }

    try {
      // Fetch user data
      const user: User = await getUserById(userId);
      setCurrentUser(user);
      setUserName(user.username);
      setFirstName(user.first_name);

      // Only update the global user state if it's the current user's profile
      if (userId === sel?.id.toString()) {
        dispatch(updateUser(user));
      }

      // Fetch followers and follows
      try {
        const [followersData, followsData] = await Promise.all([
          getFollowersCount(),
          getFollowsCount(),
        ]);
        setFollowers(followersData || []);
        setFollows(followsData || []);
      } catch (error) {
        console.error("[UserPage] Error fetching followers/follows:", error);
      }

      // Fetch posts
      try {
        const postsData = await getPostUserApi(userId, accessToken);
        console.log("[UserPage] Fetched posts:", postsData);
        setPosts(postsData || []);
      } catch (error) {
        console.error("[UserPage] Error fetching posts:", error);
      }

      // Fetch user's sports
      try {
        const sportsData = await usersSporst(userId.toString());
        setSports(sportsData);
      } catch (error) {
        console.error("[UserPage] Error fetching sports:", error);
      }

      // Fetch user's review if not current user
      if (!isOurUser) {
        try {
          const reviewData = await getReviewBy2IDs(
            sel?.id.toString() || "",
            userId.toString()
          );
          setUserReview(reviewData);
        } catch (error) {
          console.error("[UserPage] Error fetching review:", error);
        }
      }
    } catch (error) {
      console.error("[UserPage] Error in fetchAllData:", error);
    }
  }, [userId, sel?.id, accessToken, isOurUser]);

  // Use useFocusEffect to refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAllData();
    }, [fetchAllData])
  );

  // Fetch profile picture URL when currentUser changes
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

  // Animation effect
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
      outputRange: [0, 75],
    }),
  };

  const openModal = async () => {
    const response = await getAllReviews();
    // Фільтруємо лише ті відгуки, які належать цьому користувачу
    const filteredReviews = response.filter(
      (review: Review) =>
        review.reviewed_user?.toString() === userId?.toString() // check if the review is for the current user
    );
    setReviews(filteredReviews);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const toggleFollow = async () => {
    try {
      if (!userId) {
        console.error("[UserPage] toggleFollow: No userId provided");
        return;
      }

      if (isFollowing) {
        const response = await unFollow(accessToken, userId);
        console.log("[UserPage] Unfollow successful:", response);

        const [updatedFollowers, updatedFollows] = await Promise.all([
          getFollowersCount(),
          getFollowsCount(),
        ]);
        setFollowers(updatedFollowers || []);
        setFollows(updatedFollows || []);
      } else {
        const response = await follow(accessToken, userId);
        console.log("[UserPage] Follow successful:", response);

        const [updatedFollowers, updatedFollows] = await Promise.all([
          getFollowersCount(),
          getFollowsCount(),
        ]);
        setFollowers(updatedFollowers || []);
        setFollows(updatedFollows || []);
      }
    } catch (error) {
      console.error("[UserPage] Follow/unfollow error:", error);
      Alert.alert("Error", "Failed to update follow status. Please try again.");
    }
  };

  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  const animatedOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <>
      {isRatingVisible && (
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
          <RatingPopup
            text="Rate this user"
            title="Select a rating from 1 to 5"
            initialRating={isUpdatingRating ? userReview?.rating : undefined}
            isUpdatingRating={isUpdatingRating}
            onSubmit={handleCreateReview}
            onUpdate={handleUpdateRating}
            onCancel={() => {
              setIsUpdatingRating(false);
              setRatingVisible(false);
            }}
          />
        </View>
      )}
      {isReportVisible && (
        <ReportPopup
          onSubmit={handleReport}
          onCancel={() => setReportVisible(false)}
          text="Report this user"
          title="Report description:"
        />
      )}
      <SafeAreaView style={styles.container}>
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

        <View style={styles.headerTopRow}>
          <View style={styles.leftHeaderGroup}>
            {userId !== sel?.id.toString() && (
              <TouchableOpacity
                style={styles.reportButton}
                onPress={() => setReportVisible(true)}
              >
                <MaterialIcons name="report" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.iconGroup}>
            {/* Rating + Star */}
            <TouchableOpacity
              style={styles.ratingContainer}
              onPress={openModal}
            >
              <Text style={styles.ratingText}>
                <Ionicons name="list" size={20} color="white" />
              </Text>
            </TouchableOpacity>
            <Modal
              transparent
              visible={modalVisible}
              animationType="slide"
              onRequestClose={closeModal}
            >
              <View style={styles.bottomModalContainer}>
                <View style={styles.bottomModalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>All Reviews</Text>
                    <TouchableOpacity
                      onPress={closeModal}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={20} color="black" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.modalBody}>
                    {reviews.length === 0 || reviews.length === undefined ? (
                      <Text style={styles.noReviews}>No reviews yet...</Text>
                    ) : (
                      reviews.map((review, index) => (
                        <View key={index} style={styles.reviewCard}>
                          <View style={styles.reviewContent}>
                            <TouchableOpacity>
                              <Image
                                source={{ uri: mediaUrl || sel?.pfp_url }}
                                style={styles.reviewAvatar}
                              />
                            </TouchableOpacity>

                            <View style={styles.reviewTextContainer}>
                              <Text style={styles.reviewUsername}>
                                Creator: {review.creator}
                              </Text>
                              <Text style={styles.reviewText}>
                                Description:{" "}
                                {review.description || "No description"}
                              </Text>
                              <Text style={styles.reviewText}>
                                Rating: {review.rating}
                              </Text>
                            </View>
                            {userReview?.creator && (
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <TouchableOpacity
                                  onPress={() =>
                                    handleDeleteReview(review.id.toString())
                                  }
                                >
                                  <Ionicons
                                    name="trash-outline"
                                    size={24}
                                    color="rgb(179, 10, 10)"
                                  />
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        </View>
                      ))
                    )}
                  </ScrollView>
                </View>
              </View>
            </Modal>
            <TouchableOpacity
              style={styles.ratingContainer}
              onPress={handleAddRating}
              disabled={isOurUser}
            >
              <Ionicons
                name="star"
                size={20}
                color={
                  hasUserReview && userReview.status === "open"
                    ? "#FFD700"
                    : "#ccc"
                }
              />
              {userReview && userReview.status === "open" && (
                <Text style={styles.ratingText}>
                  {userReview?.rating + "⭐"}
                </Text>
              )}
            </TouchableOpacity>

            {/* settings icon */}
            {userId === sel?.id.toString() && (
              <>
                <TouchableOpacity
                  onPress={handleNavigateToUserSettings}
                  style={styles.icon}
                >
                  <Ionicons name="settings-outline" size={20} color="white" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        <View style={styles.headerBackground}>
          <View style={styles.avatarSection}>
            <View style={styles.leftSide}>
              <View>
                <Text style={styles.username}>
                  {firstName} {lastName}
                </Text>
              </View>
              <View style={styles.avatarContainer}>
                <TouchableOpacity
                  onPress={handleNavigateToEditProfile}
                  // style={styles.addIconContainer}
                >
                  <Image
                    source={{ uri: mediaUrl || sel?.pfp_url }}
                    style={styles.profileImage}
                  />
                  {currentUser?.is_verified && (
                    <MaterialCommunityIcons
                      style={styles.verificationIcon}
                      name="check-decagram"
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.rightSide}>
              <View style={styles.statsRow}>
                <TouchableOpacity onPress={handleNavigateToFolowers}>
                  <View style={styles.statsItem}>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
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
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      {follows.length}
                    </Text>
                    <Text style={{ color: "white", fontSize: 16 }}>
                      Follows
                    </Text>
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
              <TouchableOpacity
                style={styles.followButton}
                onPress={toggleFollow}
              >
                <Text style={styles.buttonText}>
                  {isFollowing ? "Unfollow" : "Follow"}
                </Text>
              </TouchableOpacity>

              {(account_type === "private" || account_type === "open") && (
                <TouchableOpacity
                  style={[
                    styles.messageButton,
                    {
                      opacity:
                        account_type === "private" ? (isFriends ? 1 : 0.5) : 1,
                    },
                  ]}
                  disabled={account_type === "private" && !isFriends}
                  // onPress={...} // тут додайте вашу навігацію до чату
                >
                  <Text style={styles.buttonText}>Message</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <Animated.View
            style={{
              height: animatedHeight,
              opacity: animatedOpacity,
              overflow: "hidden",
              paddingHorizontal: 20,
              justifyContent: "center",
              alignItems: "flex-start",
              // backgroundColor: 'red',
              gap: 10,
            }}
          >
            <View style={{ flexDirection: "row", gap: 6 }}>
              <Text style={{ color: "white", fontSize: 15 }}>
                {currentUser?.first_name}
              </Text>
              <Text style={{ color: "white", fontSize: 15 }}>
                {currentUser?.last_name}
              </Text>
            </View>

            <Text style={{ color: "white", fontSize: 15 }}>
              Birth Date: {currentUser?.birth_date || "Not specified"}
            </Text>

            <View style={{ flexDirection: "row", gap: 6 }}>
              <Text style={{ fontWeight: "bold", color: "white" }}>
                Sports:{" "}
                {sports.map((s) => s.name).join(", ") || "Not specified"}
              </Text>
            </View>
          </Animated.View>
        </View>
        <Animated.View style={[styles.profileBody, profileBodyStyle]}>
          <ImageBackground
            source={require("../../../assets/Basketball2.png")}
            style={styles.profileBodyBackground}
            resizeMode="cover"
          >
            <View
              style={{
                padding: 10,
                flexDirection: "row",
                justifyContent:
                  userId === sel?.id.toString() ? "space-between" : "center",
              }}
            >
              <TouchableOpacity onPress={() => setShowDopInfo(!showDopInfo)}>
                <View
                  style={{
                    backgroundColor: showDopInfo ? "#803511" : "transparent",
                    borderRadius: 15,
                    justifyContent: "center",

                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name={showDopInfo ? "arrow-up" : "arrow-down"}
                    size={28}
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
                      size={28}
                      color={showDopInfo ? "white" : "#803511"}
                    />
                  </View>
                </TouchableOpacity>
              )}
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}
            >
              {posts.map((post, index) => (
                <View key={index}>
                  <Post post={post} />
                </View>
              ))}
            </ScrollView>
          </ImageBackground>
        </Animated.View>
      </SafeAreaView>
    </>
  );
};
