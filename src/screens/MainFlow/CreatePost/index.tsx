import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
import postFoto from "@/API/publication/postPhoto";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import deletePublication from "@/API/publication/deletePublication";
import postVideo from "@/API/publication/postVideo";

type CreatePostNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "CreatePost"
>;

export const CreatePost = () => {
  //   const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const navigation = useNavigation<CreatePostNavigationProp>();

  const token = useSelector((state: RootState) => state.user.accessToken);
  const userId = useSelector((state: RootState) => state.user.userData?.id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"photo" | "video" | null>(null);

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
      setMedia(result.assets[0].uri);
      setMediaType(type);
    }
  };

  const handleSubmit = async () => {
    try {
      const responseV = await postVideo(
        {
          description,
          media,
          caption: title,
          hashtags: "",
        },
        token
      );
      const responseF = await postFoto(
        { description, media, caption: title, hashtags: "" },
        token
      );
      //   console.log(response);
      //   console.log("Response status:", response.status);
      //   if (response.status === 200) {
      //     navigation.navigate("Home");
      //   }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.postButton}>Post</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <View style={styles.mediaButtons}>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => pickMedia("photo")}
          >
            <Ionicons name="image-outline" size={24} color="black" />
            <Text>Add Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => pickMedia("video")}
          >
            <Ionicons name="videocam-outline" size={24} color="black" />
            <Text>Add Video</Text>
          </TouchableOpacity>
        </View>

        {media && (
          <View style={styles.mediaPreview}>
            {mediaType === "photo" ? (
              <Image source={{ uri: media }} style={styles.previewImage} />
            ) : (
              <Video
                source={{ uri: media }}
                style={styles.previewImage}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping={false}
                shouldPlay={false}
              />
            )}
            <TouchableOpacity
              style={styles.removeMedia}
              onPress={() => {
                setMedia(null);
                setMediaType(null);
              }}
            >
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postButton: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  form: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  mediaButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  mediaButton: {
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  mediaPreview: {
    marginTop: 16,
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  removeMedia: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
    borderRadius: 12,
  },
});
