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
  const [hashtags, setHashtags] = useState("");
  const [hashtagList, setHashtagList] = useState<string[]>([]);

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

  // Додаємо хештег при натисканні пробілу або коми
  const handleHashtagInput = (text: string) => {
    setHashtags(text);
    if (text.endsWith(" ") || text.endsWith(",")) {
      const tag = text.trim().replace(",", "");
      if (tag && !hashtagList.includes(tag)) {
        setHashtagList([...hashtagList, tag]);
      }
      setHashtags("");
    }
  };

  // Видаляємо хештег при натисканні на хрестик
  const removeHashtag = (tag: string) => {
    setHashtagList(hashtagList.filter((t) => t !== tag));
  };

  // Відправляємо публікацію
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#5B3400" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.postButton}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
          placeholderTextColor="#AC591A"
        />

        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          maxLength={300}
          placeholderTextColor="#5B3400"
        />

        <View style={styles.hashtagsContainer}>
          {hashtagList.map((tag, idx) => (
            <View key={idx} style={styles.hashtagChip}>
              <Text style={styles.hashtagText}>{tag}</Text>
              <TouchableOpacity onPress={() => removeHashtag(tag)}>
                <Ionicons name="close" size={16} color="#E08B2F" />
              </TouchableOpacity>
            </View>
          ))}
          <TextInput
            style={styles.hashtagInput}
            placeholder="Add hashtags"
            value={hashtags}
            onChangeText={handleHashtagInput}
            placeholderTextColor="#E08B2F"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.mediaButtons}>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => pickMedia("photo")}
          >
            <Ionicons name="image-outline" size={24} color="#AC591A" />
            <Text style={styles.mediaBtnText}>Add Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => pickMedia("video")}
          >
            <Ionicons name="videocam-outline" size={24} color="#AC591A" />
            <Text style={styles.mediaBtnText}>Add Video</Text>
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
              <Ionicons name="close-circle" size={24} color="#E08B2F" />
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
    backgroundColor: "#FFFBE4",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#E0C097",
    backgroundColor: "#FFF3E0",
  },
  backBtn: {
    padding: 4,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#AC591A",
    letterSpacing: 1,
  },
  postButton: {
    backgroundColor: "#AC591A",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#AC591A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  postButtonText: {
    color: "#FFFBE4",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  form: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0C097",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#FFF",
    color: "#5B3400",
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  hashtagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  hashtagChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#E08B2F",
  },
  hashtagText: {
    color: "#E08B2F",
    fontWeight: "600",
    marginRight: 4,
    fontSize: 15,
  },
  hashtagInput: {
    borderWidth: 1,
    borderColor: "#E0C097",
    borderRadius: 12,
    padding: 10,
    minWidth: 90,
    fontSize: 15,
    backgroundColor: "#FFF",
    color: "#E08B2F",
  },
  mediaButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    marginTop: 8,
  },
  mediaButton: {
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#FFF3E0",
    borderWidth: 1,
    borderColor: "#E0C097",
    flexDirection: "row",
    gap: 6,
  },
  mediaBtnText: {
    color: "#AC591A",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 4,
  },
  mediaPreview: {
    marginTop: 16,
    position: "relative",
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#AC591A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
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
    backgroundColor: "#FFFBE4",
    borderRadius: 12,
    padding: 2,
  },
});
