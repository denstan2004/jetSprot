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
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [eventType, setEventType] = useState(EventType.announcement);
  const sel = useSelector((state: RootState) => state.user);
  const isVerified = sel?.userData?.is_verified;
  const isStaff = sel?.userData?.is_staff;
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

  const renderEventTypeOptions = () => {
    return (
      <View style={styles.eventTypeContainer}>
        <Text style={styles.label}>Event Type</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setEventType(EventType.playerSearch)}
          >
            <View style={styles.radioButton}>
              {eventType === EventType.playerSearch && (
                <View style={styles.radioButtonSelected} />
              )}
            </View>
            <Text style={styles.radioLabel}>Player Search</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setEventType(EventType.announcement)}
          >
            <View style={styles.radioButton}>
              {eventType === EventType.announcement && (
                <View style={styles.radioButtonSelected} />
              )}
            </View>
            <Text style={styles.radioLabel}>Announcement</Text>
          </TouchableOpacity>

          {(isVerified || isStaff) && (
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setEventType(EventType.permanent)}
            >
              <View style={styles.radioButton}>
                {eventType === EventType.permanent && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
              <Text style={styles.radioLabel}>Permanent</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
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
            event_type: eventType,
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
          setShowLocationPicker(false);
          navigation.goBack();
          console.log(markerResponse);
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

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={true}
          indicatorStyle="black"
          contentContainerStyle={styles.scrollViewContent}
        >
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
            {eventType !== EventType.permanent && (
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
            )}

            {renderEventTypeOptions()}

            <View style={styles.sportsSection}>
              <Text style={styles.label}>Sports</Text>
              <View style={styles.sportsContainer}>
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
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={{}}>
          <TouchableOpacity style={styles.createButton} onPress={handleSubmit}>
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
              style={styles.createButton}
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
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
  createButton: {
    width: "90%",
    backgroundColor: "#AC591A",
    padding: rem(16),
    borderRadius: rem(20),
    alignItems: "center",
    alignSelf: "center",
  },
  submitButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
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
  eventTypeContainer: {
    marginBottom: rem(16),
  },
  radioGroup: {
    gap: rem(12),
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: rem(8),
  },
  radioButton: {
    width: rem(20),
    height: rem(20),
    borderRadius: rem(10),
    borderWidth: 2,
    borderColor: "#AC591A",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    width: rem(12),
    height: rem(12),
    borderRadius: rem(6),
    backgroundColor: "#AC591A",
  },
  radioLabel: {
    fontSize: rem(16),
    color: "#5B3400",
  },
});

export default AddAnnouncement;
