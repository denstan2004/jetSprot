import React from "react";
import { Marker } from "react-native-maps";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Modal, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useEffect, useState } from "react";
import { getAllMarkers } from "@/API/announcement/markers/getAllMarkers";
import { Marker as MarkerType } from "@/types/Marker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getAnnouncementById } from "@/API/announcement/getAnnouncementById";
import { Announcement as AnnouncementType } from "@/types/Announcement";

type RootStackParamList = {
  Publication: { id: number };
  Announcement: { announcement: AnnouncementType };
  AddAnnouncement: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const Map = () => {
  const navigation = useNavigation<NavigationProp>();
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);
  const [announcement, setAnnouncement] = useState<AnnouncementType | null>(
    null
  );
  const [mapKey, setMapKey] = useState(0);

  const updateMapKey = () => {
    setMapKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (selectedMarker) {
      getAnnouncementById(selectedMarker.announcement).then((announcement) => {
        setAnnouncement(announcement);
      });
    }
  }, [selectedMarker]);

  const handleMarkerPress = (marker: MarkerType) => {
    setSelectedMarker(marker);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMarker(null);
  };

  const handleAnnouncementNavigate = () => {
    if (announcement) {
      navigation.navigate("Announcement", { announcement });
      closeModal();
    }
  };
  useEffect(() => {
    const fetchMarkers = async () => {
      const response = await getAllMarkers();
      setMarkers(response.results);
      updateMapKey();
    };
    fetchMarkers();
  }, []);

  useEffect(() => {
    console.log("markers", markers);
  }, [markers]);

  return (
    <>
      <MapView
        key={`map-${markers.length}-${mapKey}`}
        style={styles.map}
        initialRegion={{
          latitude: 50.450001,
          longitude: 30.523333,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            onPress={() => handleMarkerPress(marker)}
            coordinate={{
              latitude: parseFloat(marker.latitude),
              longitude: parseFloat(marker.longitude),
            }}
            title={marker.city}
            description={marker.country}
          />
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          navigation.navigate("AddAnnouncement");
        }}
      >
        <Ionicons name="add" size={24} color="#AC591A" />
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={handleAnnouncementNavigate}
                style={styles.navigationButton}
              >
                <Ionicons name="open-outline" size={24} color="#AC591A" />
              </TouchableOpacity>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {selectedMarker && (
              <View style={styles.markerInfo}>
                <Text style={styles.title}>
                  {selectedMarker.city}, {selectedMarker.country}
                </Text>
                <Text style={styles.creator}>
                  Created by: {selectedMarker.creator.username}
                </Text>

                <Text style={styles.sectionTitle}>Sports:</Text>
                <View style={styles.sportsContainer}>
                  {selectedMarker.sports.length > 0 ? (
                    selectedMarker.sports.map((sport, index) => (
                      <Text key={index} style={styles.sportItem}>
                        {sport}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.noSports}>No sports specified</Text>
                  )}
                </View>

                <Text style={styles.dates}>
                  Valid until:{" "}
                  {new Date(selectedMarker.valid_until).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: 300,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  closeButton: {
    padding: 4,
  },
  navigationButton: {
    padding: 4,
  },
  markerInfo: {
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  creator: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sportsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  sportItem: {
    backgroundColor: "#E8E8E8",
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  noSports: {
    color: "#666",
    fontStyle: "italic",
  },
  dates: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    zIndex: 10000,
    position: "absolute",
    top: 50,
    right: 10,
    backgroundColor: "white",
    width: 70,
    height: 70,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
