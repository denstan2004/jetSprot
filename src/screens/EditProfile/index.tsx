import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import { styles } from "./styles";
import { updateUser } from "@/store/redux/slices/userSlice";
import { User } from "@/types/User";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
import { apiUrl } from "@/API/apiUrl";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/firebase";
import uploadPFP from "@/API/user/uploadPFP";
import * as ImagePicker from "expo-image-picker";

export const EditProfile = () => {
  const user = useSelector((state: RootState) => state.user.userData);
  const token = useSelector((state: RootState) => state.user.accessToken);
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [pfp, setPfp] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"photo" | "video" | null>(null);

  const [userData, setUserData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    pfp_url: "",
  });

  const [initialUserData, setInitialUserData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    pfp_url: "",
  });

  const [isChanged, setIsChanged] = useState(false);

  const isValidateName = (name: string) => {
    return /^[A-Za-z]+$/.test(name);
  };

  const pickMedia = async (type: "photo" | "video") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        type === "photo"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPfp(result.assets[0].uri);
      setMediaType(type);
    }
  };

  const handleUpdateAvatar = async () => {
    if (!pfp) return;

    try {
      const response = await uploadPFP({ pfp }, token);
      console.log(response.firebase_url);
      const updatedUserPFP = {
        ...userData,
        pfp_url: response.firebase_url,
      };
      // console.log(userData)
      dispatch(updateUser({ ...userData, pfp_url: response.firebase_url }));
      setUserData(updatedUserPFP);

      setPfp(response.firebase_url);
    } catch (error) {
      console.error("Failed to upload avatar", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user/${user?.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        setInitialUserData(response.data);
      } catch (error) {
        console.error("GET error", error);
      }
    };

    if (user?.id && token) {
      fetchUserData();
    }
  }, [user?.id, token]);

  useEffect(() => {
    const changed =
      userData.username !== initialUserData.username ||
      userData.first_name !== initialUserData.first_name ||
      userData.last_name !== initialUserData.last_name ||
      userData.date_of_birth !== initialUserData.date_of_birth;
    setIsChanged(changed);
  }, [userData, initialUserData]);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("username", userData.username);
      formData.append("first_name", userData.first_name);
      formData.append("last_name", userData.last_name);
      formData.append("date_of_birth", userData.date_of_birth);

      const updatedUser = await axios.patch<User>(
        `${apiUrl}/user/${user?.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Updated user:", updatedUser.data.first_name);

      dispatch(updateUser(updatedUser.data));
    } catch (err) {
      console.error("PATCH error", err);
    }
  };

  useEffect(() => {
    const fetchPfpUrl = async () => {
      if (user?.pfp_url) {
        try {
          const storageRef = ref(storage, user?.pfp_url);
          const url = await getDownloadURL(storageRef);
          setMediaUrl(url);
        } catch (error) {
          console.error("Failed to fetch avatar:", error);
        }
      }
    };

    fetchPfpUrl();
  }, [user]);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      style={styles.root}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <ImageBackground
        source={require("../../assets/Basketball2.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Text style={styles.title}>Edit Profile</Text>

        <View style={styles.avatarContainer}>
          <TouchableOpacity
            style={styles.profileImageTouchable}
            onPress={() => pickMedia("photo")}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: pfp || mediaUrl || "" }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
        {pfp && (
          <TouchableOpacity
            style={styles.uploadAvatarButton}
            onPress={handleUpdateAvatar}
          >
            <Text style={styles.uploadAvatarButtonText}>Upload Avatar</Text>
          </TouchableOpacity>
        )}

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder={userData.username || "Username"}
            value={userData.username}
            onChangeText={(text) =>
              setUserData({ ...userData, username: text })
            }
            maxLength={30}
          />

          <TextInput
            style={styles.input}
            placeholder={userData.first_name || "First Name"}
            value={userData.first_name}
            onChangeText={(text) => {
              if (isValidateName(text)) {
                setUserData({ ...userData, first_name: text });
              }
            }}
            maxLength={20}
          />

          <TextInput
            style={styles.input}
            placeholder={userData.last_name || "Last Name"}
            value={userData.last_name}
            onChangeText={(text) => {
              if (isValidateName(text)) {
                setUserData({ ...userData, last_name: text });
              }
            }}
            maxLength={20}
          />

          <TextInput
            style={styles.input}
            placeholder="Date of Birth (YYYY-MM-DD)"
            value={userData.date_of_birth}
            onChangeText={(text) =>
              setUserData({ ...userData, date_of_birth: text })
            }
            maxLength={10}
          />
        </View>
        <TouchableOpacity
          style={[styles.saveButton, { opacity: isChanged ? 1 : 0.5 }]}
          onPress={handleSave}
          disabled={!isChanged}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};
