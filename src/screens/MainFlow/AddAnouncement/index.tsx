import React, { useEffect, useState } from "react";
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
import {
  createAnnouncement,
  EventType,
} from "@/API/announcement/createAnnouncement";
import { createMarker } from "@/API/announcement/markers/createMarker";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import { CreateAnnouncementData } from "@/API/announcement/createAnnouncement";
import { deleteAnnouncement } from "@/API/announcement/deleteAnnouncement";
import { getSports, SportInterface } from "@/API/sport/getSports";
import * as Location from "expo-location";
// import { createMarker } from "@/API/announcement/markers/createMarker";

const AddAnnouncement = () => {
  const [sports, setSports] = useState<SportInterface[]>([]);
  const navigation = useNavigation();
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [requiredAmount, setRequiredAmount] = useState("");
  const [selectedSports, setSelectedSports] = useState<number[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const sel = useSelector((state: RootState) => state.user);
  const [announcementId, setAnnouncementId] = useState<number | null>(null);
  const [location, setLocation] = useState({
    latitude: 50.450001,
    longitude: 30.523333,
    country: "",
    city: "",
  });

  const handleSportSelect = (sport: number) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };
  useEffect(() => {
    console.log("selectedSports", selectedSports);
    getSports().then((res) => {
      setSports(res);
    });
  }, []);

  const handleSubmit = async () => {
    setShowLocationPicker(true);
  };

  const handleLocationSelect = async () => {
    try {
      if (selectedSports.length !== 0) {
        if (sel && sel.accessToken && sel.userData?.id) {
          const announcementData: CreateAnnouncementData = {
            sport_ids: selectedSports,
            caption,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            event_type: EventType.announcement,
            required_amount: parseInt(requiredAmount),
            status: 1,
            description: description,
          };
          const response = await createAnnouncement(
            announcementData,
            sel?.accessToken
          );
          const markerResponse = await createMarker(
            {
              latitude: location.latitude.toString(),
              longitude: location.longitude.toString(),
              country: location.country,
              city: location.city,
              announcement: response.id,
            },
            sel?.accessToken
          );
          console.log(markerResponse);
          console.log(response);
        }
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (response[0]) {
        console.log(response[0].country, response[0].city);
        setLocation((prev) => ({
          ...prev,
          country: response[0].country || "",
          city: response[0].city || response[0].region || "",
        }));
      }
    } catch (error) {
      console.error("Error getting address:", error);
    }
  };

  return (
    <>
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

        <View style={styles.content}>
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
            <Text style={styles.label}>Start Date</Text>

            <DateTimePicker
              minimumDate={new Date()}
              value={startDate}
              mode="datetime"
              style={{
                borderRadius: 17,
                justifyContent: "center",
                alignItems: "center",
              }}
              textColor="#ffffff"
              display="compact"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setStartDate(selectedDate);
                }
              }}
            />
            <Text style={styles.label}>End Date</Text>
            <DateTimePicker
              value={endDate}
              mode="datetime"
              minimumDate={startDate}
              style={{
                borderRadius: 17,
                justifyContent: "center",
                alignItems: "center",
              }}
              textColor="#ffffff"
              display="compact"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setEndDate(selectedDate);
                }
              }}
            />
          </View>

          <View style={styles.sportsSection}>
            <Text style={styles.label}>Sports</Text>
            <ScrollView
              showsVerticalScrollIndicator={true}
              indicatorStyle="black"
              contentContainerStyle={styles.sportsContainer}
          
          >
              {sports.map((sport) => (
                <TouchableOpacity
                  key={sport.id}
                  style={[
                    styles.sportButton,
                    selectedSports.includes(sport.id) && styles.selectedSport,
                  ]}
                  onPress={() => handleSportSelect(sport.id)}
                >
                  <Text
                    style={[
                      styles.sportText,
                      selectedSports.includes(sport.id) &&
                        styles.selectedSportText,
                    ]}
                  >
                    {sport.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Create Announcement</Text>
          </TouchableOpacity>
        </View>

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
              onPress={async (e) => {
                const newLocation = {
                  ...location,
                  latitude: e.nativeEvent.coordinate.latitude,
                  longitude: e.nativeEvent.coordinate.longitude,
                };
                setLocation(newLocation);
                await getAddressFromCoordinates(
                  newLocation.latitude,
                  newLocation.longitude
                );
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
                onChangeText={(text) =>
                  setLocation({ ...location, city: text })
                }
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(214, 186, 26, 0.13)",
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
    color: "rgb(151, 97, 27)",
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
    color: "rgb(159, 97, 17)",
    marginBottom: rem(8),
  },
  input: {
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: rem(8),
    padding: rem(12),
    fontSize: rem(16),
  },
  textArea: {
    height: rem(70),
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
  sportsSection: {
    flex: 1,
    marginBottom: rem(16),
  },
  sportsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: rem(8),
    paddingVertical: rem(16),
  },
  sportButton: {
    width: "30%",
    paddingHorizontal: rem(12),
    paddingVertical: rem(6),
    borderRadius: rem(16),
    backgroundColor: "hsla(31, 52.80%, 38.20%, 0.11)",
    marginBottom: rem(8),
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
    borderRadius: rem(20),
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
