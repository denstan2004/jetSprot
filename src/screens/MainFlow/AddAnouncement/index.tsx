import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { rem } from "@/theme/units";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Marker } from "react-native-maps";
import { createAnnouncement } from "@/API/announcement/createAnnouncement";
import { createMarker } from "@/API/announcement/markers/createMarker";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import { CreateAnnouncementData } from "@/API/announcement/createAnnouncement";
import { deleteAnnouncement } from "@/API/announcement/deleteAnnouncement";
// import { createMarker } from "@/API/announcement/markers/createMarker";

const SPORTS = [
  "Football",
  "Basketball",
  "Tennis",
  "Volleyball",
  "Swimming",
  "Running",
  "Cycling",
  "Yoga",
];

const AddAnnouncement = () => {
  const navigation = useNavigation();
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [requiredAmount, setRequiredAmount] = useState("");
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [validUntil, setValidUntil] = useState(new Date());
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const sel = useSelector((state: RootState) => state.user);
  const [announcementId, setAnnouncementId] = useState<number | null>(null);
  const [location, setLocation] = useState({
    latitude: 50.450001,
    longitude: 30.523333,
    country: "",
    city: "",
  });

  const handleSportSelect = (sport: string) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const handleSubmit = async () => {
    try {
      if (sel && sel.accessToken && sel.userData?.id) {
        const announcementData: CreateAnnouncementData = {
          sports: selectedSports,
          caption,
          description,
          valid_until: validUntil.toISOString(),
          required_amount: parseInt(requiredAmount),
          creator: sel?.userData?.id,
          status: 1,
        };
        const response = await createAnnouncement(
          announcementData,
          sel?.accessToken
        );
        if (response.id !== undefined) {
          setAnnouncementId(response.id);
          setShowLocationPicker(true);
        }
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  const handleLocationSelect = async () => {
    try {
      if (!announcementId) {
        throw new Error("No announcement ID available");
      }

      const response = await createMarker(
        {
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString(),
          country: location.country,
          city: location.city,
          announcement: announcementId,
        },
        sel?.accessToken
      );
      console.log(response);
      if (response?.id) {
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error creating marker:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#5B3400" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Announcement</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Caption</Text>
          <TextInput
            style={styles.input}
            value={caption}
            onChangeText={setCaption}
            placeholder="Enter announcement caption"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter announcement description"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Required Amount</Text>
          <TextInput
            style={styles.input}
            value={requiredAmount}
            onChangeText={setRequiredAmount}
            placeholder="Enter number of people required"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Valid Until</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{validUntil.toLocaleDateString()}</Text>
            <Ionicons name="calendar" size={20} color="#5B3400" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Sports</Text>
          <View style={styles.sportsContainer}>
            {SPORTS.map((sport) => (
              <TouchableOpacity
                key={sport}
                style={[
                  styles.sportButton,
                  selectedSports.includes(sport) && styles.selectedSport,
                ]}
                onPress={() => handleSportSelect(sport)}
              >
                <Text
                  style={[
                    styles.sportText,
                    selectedSports.includes(sport) && styles.selectedSportText,
                  ]}
                >
                  {sport}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Announcement</Text>
        </TouchableOpacity>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={validUntil}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setValidUntil(selectedDate);
            }
          }}
        />
      )}

      <Modal
        visible={showLocationPicker}
        animationType="slide"
        onRequestClose={() => setShowLocationPicker(false)}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                if (announcementId) {
                  deleteAnnouncement(announcementId, sel?.accessToken);
                }
                setShowLocationPicker(false);
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#5B3400" />
            </TouchableOpacity>
            <Text style={styles.title}>Select Location</Text>
          </View>

          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={(e) => {
              setLocation({
                ...location,
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              });
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
            />
          </MapView>

          <View style={styles.locationInputs}>
            <TextInput
              style={styles.input}
              placeholder="Country"
              value={location.country}
              onChangeText={(text) =>
                setLocation({ ...location, country: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={location.city}
              onChangeText={(text) => setLocation({ ...location, city: text })}
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleLocationSelect}
          >
            <Text style={styles.submitButtonText}>Confirm Location</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
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
    padding: rem(16),
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  backButton: {
    padding: rem(8),
    borderRadius: rem(8),
  },
  title: {
    fontSize: rem(20),
    fontWeight: "bold",
    color: "#5B3400",
    marginLeft: rem(16),
  },
  content: {
    flex: 1,
    padding: rem(16),
  },
  inputContainer: {
    marginBottom: rem(16),
  },
  label: {
    fontSize: rem(16),
    color: "#5B3400",
    marginBottom: rem(8),
  },
  input: {
    backgroundColor: "white",
    borderRadius: rem(8),
    padding: rem(12),
    fontSize: rem(16),
  },
  textArea: {
    height: rem(100),
    textAlignVertical: "top",
  },
  dateButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: rem(8),
    padding: rem(12),
  },
  sportsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: rem(8),
  },
  sportButton: {
    paddingHorizontal: rem(12),
    paddingVertical: rem(6),
    borderRadius: rem(16),
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#AC591A",
  },
  selectedSport: {
    backgroundColor: "#AC591A",
  },
  sportText: {
    color: "#AC591A",
  },
  selectedSportText: {
    color: "white",
  },
  submitButton: {
    backgroundColor: "#AC591A",
    padding: rem(16),
    borderRadius: rem(8),
    alignItems: "center",
    marginTop: rem(16),
  },
  submitButtonText: {
    color: "white",
    fontSize: rem(16),
    fontWeight: "bold",
  },
  map: {
    flex: 1,
  },
  locationInputs: {
    padding: rem(16),
    gap: rem(8),
  },
});

export default AddAnnouncement;
