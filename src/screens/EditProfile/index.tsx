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

export const EditProfile = () => {
  const user = useSelector((state: RootState) => state.user.userData);
  const token = useSelector((state: RootState) => state.user.accessToken);
  const state = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const [userData, setUserData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    pfp_url: "",
  });

  useEffect(() => {
    if (user?.id && token) {
      axios
        .get(`http://192.168.0.101:8000/api/user/${user.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setUserData(res.data))
        .catch((err) => console.error("GET error", err));
    }
  }, [user?.id, token]);


  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("username", userData.username);
      formData.append("first_name", userData.first_name);
      formData.append("last_name", userData.last_name);
      formData.append("date_of_birth", userData.date_of_birth);

      const updatedUser = await axios.patch<User>(
        `http://192.168.0.101:8000/api/user/${user?.id}/`,
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

  const hadleBack = () => {
    // console.log("back");
    navigation.navigate("Home");
  };
  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      style={styles.root}
    >
      <TouchableOpacity style={[styles.backButton]} onPress={hadleBack}>
        <View style={styles.backButtonInner} />
      </TouchableOpacity>

      <ImageBackground
        source={require("../../assets/Basketball2.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Text style={styles.title}>Edit Profile</Text>

        <TouchableOpacity>
          <View style={[styles.avatar, { backgroundColor: "#ddd" }]}>
            <Text style={{ color: "#555" }}>Choose Avatar</Text>
          </View>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder={userData.username}
          onChangeText={(text) => setUserData({ ...userData, username: text })}
        />

        <TextInput
          style={styles.input}
          placeholder={userData.first_name}
          onChangeText={(text) =>
            setUserData({ ...userData, first_name: text })
          }
        />

        <TextInput
          style={styles.input}
          placeholder={userData.last_name}
          onChangeText={(text) => setUserData({ ...userData, last_name: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Date of Birth (YYYY-MM-DD)"
          value={userData.date_of_birth}
          onChangeText={(text) =>
            setUserData({ ...userData, date_of_birth: text })
          }
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};
