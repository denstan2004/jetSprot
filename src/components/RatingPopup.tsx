import { rem } from "@/theme/units";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Rating } from "react-native-ratings";

type RatingPopupProps = {
  onSubmit: (rating: number, review: string) => void;
  onCancel: () => void;
  text: string;
  title: string;
  initialRating?: number;
  isUpdatingRating?: boolean;
  onUpdate?: (rating: number, review: string) => void;
};

const RatingPopup = ({
  onSubmit,
  onCancel,
  text,
  title,
  initialRating,
  isUpdatingRating,
  onUpdate,
}: RatingPopupProps) => {
  const [selectedRating, setSelectedRating] = useState(initialRating);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    onSubmit(selectedRating || 0, review);
  };

  const handleUpdate = () => {
    onUpdate?.(selectedRating || 0, review);
  };

  return (
    <>
      {isUpdatingRating ? (
        // Popup for updating rating
        <View style={styles.container}>
          <Text style={styles.title}>{text}</Text>
          <Text style={styles.subtitle}>{title}</Text>

          <Rating
            type="star"
            startingValue={initialRating}
            imageSize={rem(25)}
            ratingCount={5}
            fractions={0}
            tintColor="#FFFBE4"
            onFinishRating={(rating: number) => setSelectedRating(rating)}
            style={{ paddingVertical: rem(5) }}
          />

          <TextInput
            placeholder="Add a review"
            value={review}
            onChangeText={setReview}
            style={styles.reviewInput}
          />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={onCancel} style={styles.buttonCancel}>
              <Text style={styles.buttonTextCancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleUpdate}
              style={styles.buttonSubmit}
            >
              <Text style={styles.buttonTextSubmit}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Popup for creating rating
        <View style={styles.container}>
          <Text style={styles.title}>{text}</Text>
          <Text style={styles.subtitle}>{title}</Text>

          <Rating
            type="star"
            minValue={1}
            startingValue={initialRating}
            imageSize={rem(25)}
            ratingCount={5}
            fractions={0}
            tintColor="#FFFBE4"
            onFinishRating={(rating: number) => setSelectedRating(rating)}
            style={{ paddingVertical: rem(5) }}
          />

          <TextInput
            placeholder="Add a review"
            value={review}
            onChangeText={setReview}
            style={styles.reviewInput}
          />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={onCancel} style={styles.buttonCancel}>
              <Text style={styles.buttonTextCancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.buttonSubmit}
            >
              <Text style={styles.buttonTextSubmit}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default RatingPopup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFBE4",
    padding: rem(40),
    borderRadius: rem(12),
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: rem(2) },
    // shadowRadius: rem(6),
    // elevation: 5,
    position: "absolute",
    top: "40%",
    left: "8%",
    right: "8%",
    zIndex: 1000,
    alignItems: "center",
  },
  title: {
    fontSize: rem(18),
    fontWeight: "700",
    color: "#5B3400",
    paddingBottom: rem(12),
    textAlign: "center",
  },
  subtitle: {
    fontSize: rem(15),
    fontWeight: "500",
    color: "#AC591A",
    paddingBottom: rem(10),
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: rem(15),
    paddingTop: rem(15),
  },
  buttonSubmit: {
    flex: 1,
    backgroundColor: "#AC591A33",
    paddingVertical: rem(10),
    borderRadius: rem(10),
    alignItems: "center",
  },
  buttonTextSubmit: {
    color: "#5B3400",
    fontSize: rem(12),
    fontWeight: "600",
  },
  buttonCancel: {
    flex: 1,
    backgroundColor: "#D04545",
    paddingVertical: rem(10),
    borderRadius: rem(10),
    alignItems: "center",
  },
  buttonTextCancel: {
    color: "#FFFBE4",
    fontSize: rem(12),
    fontWeight: "600",
  },
  reviewInput: {
    width: "100%",
    height: rem(40),
    borderWidth: 1,
    borderColor: "#AC591A",
    borderRadius: rem(10),
    // marginTop: rem(10),
    padding: rem(10),
  },
});
