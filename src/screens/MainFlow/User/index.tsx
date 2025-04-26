import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Modal,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { styles } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import getUserFollowers from "@/API/user/getUserFollowers";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
import { User } from "@/types/User";
import axios from "axios";
import { updateUser } from "@/store/redux/slices/userSlice";
import { getPostUser as getPostUserApi } from "@/API/user/getPostUser";
import Post from "@/components/Post";

interface Props {
  userId?: string;
}
export const UserPage = ({ userId }: Props) => {
  const sel = useSelector((state: RootState) => state.user.userData);
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const [followers, setFollowers] = useState<User[]>([]);
  const [userName, setUserName] = useState(sel?.username);
  const [firstName, setFirstName] = useState(sel?.first_name);
  const [modalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const handleNavigateToFolowers = () => {
    navigation.navigate("ListUsers", { followers });
  };
  const handleNavigateToEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const getFollowersCount = async () => {
    const id = userId || sel?.id.toString();
    if (id) {
      return await getUserFollowers(id);
    }
    return [];
  };

  const getUserById = async (userId: string) => {
    const response = await axios(
      `http://192.168.0.101:8000/api/user/${userId}/`
    );
    return response.data;
  };
  useEffect(() => {
    const fetchFollowers = async () => {
      const followers = await getFollowersCount();
      setFollowers(followers || []);
    };

    const fetchUser = async () => {
      if (!userId) return;
      const user: User = await getUserById(userId);
      setUserName(user.username);
      setFirstName(user.first_name);
      dispatch(updateUser(user));
    };

    const fetchPosts = async () => {
      const id = userId || sel?.id.toString();
      if (id) {
        const posts: Post[] = await getPostUserApi(id);

        setPosts(posts)
      }
      return [];
    };


    fetchPosts();
    fetchUser();
    fetchFollowers();
  }, []);

  // const getPostUser = async () => {
  //   const id = userId || sel?.id.toString();
  //   if (id) {
  //     return await getPostUserApi(id);
  //   }
  //   return [];
  // };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBackground}>
        <View style={styles.headerTopRow}>
          <View style={styles.iconGroup}>
            <TouchableOpacity style={styles.icon}>
              <Ionicons name="heart-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNavigateToEditProfile}
              style={styles.icon}
            >
              <MaterialIcons name="edit" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.leftSide}>
            <Text style={styles.username}>{userName}</Text>
            <View style={styles.avatar}>
              <FontAwesome5 name="user-alt" size={40} color="white" />
            </View>
            <Text style={styles.name}>
              {firstName} {sel?.last_name}
            </Text>
          </View>

          <View style={styles.rightSide}>
            <Text style={styles.role}>basketball/football player</Text>
            <View style={styles.statsRow}>
              <TouchableOpacity onPress={handleNavigateToFolowers}>
                <View style={styles.statsItem}>
                  <Ionicons name="people-outline" size={18} color="white" />
                  <Text style={styles.text}>{followers.length}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.statsItem}>
                <Ionicons name="time-outline" size={18} color="white" />
                <Text style={styles.text}>{sel?.rating}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <ImageBackground
        source={require("../../../assets/Basketball2.png")}
        style={styles.profileBody}
        resizeMode="cover"
      />
{/* 
      <View>
        {posts.map((posts) => {
          return (
            <View key={posts.id} style={styles.postContainer}>
              <Post
                postImage={posts.image}
                postText={posts.text}
              />
            </View>
          );
        })}
      </View> */}
      

      {/* <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
          }} 
        >
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              height: 300,
            }}
          >
            <TouchableOpacity
              onPress={closeModal}
              style={{ alignSelf: "flex-end", padding: 4 }}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>

          </View>
        </View>
      </Modal>  */}
    </SafeAreaView>
  );
};
