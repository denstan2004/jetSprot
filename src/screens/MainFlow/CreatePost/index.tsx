import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
import postFoto from "@/API/publication/postPost";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import deletePublication from "@/API/publication/deletePublication";

type CreatePostNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "CreatePost"
>;

export const CreatePost = () => {
  const navigation = useNavigation<CreatePostNavigationProp>();

  const token = useSelector((state: RootState) => state.user.accessToken);
  const userId = useSelector((state: RootState) => state.user.userData?.id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<string[]>([]);
  const [mediaType, setMediaType] = useState<"photo" | "video" | null>(null);
  const [hashtags, setHashtags] = useState("");
  const [hashtagList, setHashtagList] = useState<string[]>([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickMedia = async (type: "photo" | "video") => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          type === "photo"
            ? ImagePicker.MediaTypeOptions.Images
            : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        allowsMultipleSelection: true,
        selectionLimit: 10,
      });

      if (!result.canceled) {
        const newMedia = result.assets.map((asset) => asset.uri);
        setMedia((prevMedia) => [...prevMedia, ...newMedia]);
        setMediaType(type);
      }
    } catch (error) {
      console.error("[CreatePost] Error picking media:", error);
      Alert.alert("Error", "Failed to pick media. Please try again.");
    }
  };

  // Add hashtag when input loses focus
  const handleHashtagBlur = () => {
    if (hashtags.trim() && hashtagList.length < 10) {
      const tag = hashtags.trim().replace(/^#/, ""); // Remove # if user added it
      if (tag && !hashtagList.includes(tag)) {
        setHashtagList([...hashtagList, tag]);
        setHashtags("");
      } else if (hashtagList.includes(tag)) {
        Alert.alert("Duplicate", "This hashtag already exists");
        setHashtags("");
      }
    } else if (hashtagList.length >= 10) {
      Alert.alert("Limit Reached", "You can only add up to 10 hashtags");
      setHashtags("");
    }
  };

  // Handle hashtag input changes
  const handleHashtagInput = (text: string) => {
    // Remove spaces and special characters except #
    const cleanedText = text.replace(/[^a-zA-Z0-9#]/g, "");
    setHashtags(cleanedText);
  };

  // Видаляємо хештег при натисканні на хрестик
  const removeHashtag = (tag: string) => {
    setHashtagList(hashtagList.filter((t) => t !== tag));
  };

  // Відправляємо публікацію
  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (!title || !description) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }

      if (media.length === 0) {
        Alert.alert("Error", "Please add at least one photo or video");
        return;
      }

      const hashtagsString = hashtagList.join(" ");

      console.log("[CreatePost] Submitting post with data:", {
        title,
        description,
        mediaCount: media.length,
        hashtags: hashtagsString,
      });

      const response = await postFoto(
        {
          description,
          media,
          caption: title,
          hashtags: hashtagsString,
        },
        token
      );

      console.log("[CreatePost] Post created successfully:", response);
      Alert.alert("Success", "Your post has been created!");
      navigation.goBack();
    } catch (error) {
      console.error("[CreatePost] Error creating post:", error);
      Alert.alert(
        "Error",
        "Failed to create post. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const selectedIndex = Math.floor(contentOffset / viewSize);
    setCurrentMediaIndex(selectedIndex);
  };

  const renderPaginationDots = () => {
    if (media.length <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        {media.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentMediaIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
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
        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.postButton, isSubmitting && styles.postButtonDisabled]}
          disabled={isSubmitting}
        >
          <Text style={styles.postButtonText}>
            {isSubmitting ? "Posting..." : "Post"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Title *"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
          placeholderTextColor="#AC591A"
        />

        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Description *"
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
              <Text style={styles.hashtagText}>#{tag}</Text>
              <TouchableOpacity onPress={() => removeHashtag(tag)}>
                <Ionicons name="close" size={16} color="#E08B2F" />
              </TouchableOpacity>
            </View>
          ))}
          {hashtagList.length < 10 && (
            <TextInput
              style={styles.hashtagInput}
              placeholder={`Add hashtag (${hashtagList.length}/10)`}
              value={hashtags}
              onChangeText={handleHashtagInput}
              onBlur={handleHashtagBlur}
              placeholderTextColor="#E08B2F"
              autoCapitalize="none"
            />
          )}
        </View>

        <View style={styles.mediaButtons}>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => pickMedia("photo")}
          >
            <Ionicons name="image-outline" size={24} color="#AC591A" />
            <Text style={styles.mediaBtnText}>Add Photos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => pickMedia("video")}
          >
            <Ionicons name="videocam-outline" size={24} color="#AC591A" />
            <Text style={styles.mediaBtnText}>Add Videos</Text>
          </TouchableOpacity>
        </View>

        {media.length > 0 && (
          <View style={styles.mediaPreview}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScroll}
              style={styles.scrollView}
            >
              {media.map((mediaUri, index) => (
                <View key={index} style={styles.mediaContainer}>
                  {mediaType === "photo" ? (
                    <Image
                      source={{ uri: mediaUri }}
                      style={styles.previewImage}
                    />
                  ) : (
                    <Video
                      source={{ uri: mediaUri }}
                      style={styles.previewImage}
                      useNativeControls
                      resizeMode={ResizeMode.CONTAIN}
                      isLooping={false}
                      shouldPlay={false}
                    />
                  )}
                </View>
              ))}
            </ScrollView>
            {renderPaginationDots()}
            <TouchableOpacity
              style={styles.removeMedia}
              onPress={() => {
                setMedia([]);
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
  postButtonDisabled: {
    opacity: 0.7,
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
  mediaContainer: {
    width: Dimensions.get("window").width - 40,
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
  },
  scrollView: {
    flex: 1,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#AC591A",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
