import React from "react";
import { Marker } from "react-native-maps";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import { getAllMarkers } from "@/API/announcement/markers/getAllMarkers";
import { Marker as MarkerType } from "@/types/Marker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getAnnouncementById } from "@/API/announcement/getAnnouncementById";
import { Announcement as AnnouncementType } from "@/types/Announcement";
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { getSports, SportInterface } from "@/API/sport/getSports";
import { rem } from "@/theme/units";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
//TODO: adding marker as part of this screen
type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

export const Map = () => {
  const navigation = useNavigation<NavigationProp>();
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSports, setSelectedSports] = useState<number[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);
  const [announcement, setAnnouncement] = useState<AnnouncementType | null>(
    null
  );
  const [sports, setSports] = useState<SportInterface[]>([]);

  const [mapKey, setMapKey] = useState(0);
  const menuAnimation = useSharedValue(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { width, height } = Dimensions.get("window");
  const handleSportSelect = (sport: number) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };
  const updateMapKey = () => {
    setMapKey((prev) => prev + 1);
  };
  useEffect(() => {
    getSports().then((res) => {
      setSports(res);
    });
  }, []);
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

  useFocusEffect(
    React.useCallback(() => {
      const fetchMarkers = async () => {
        const response = await getAllMarkers();
        setMarkers(response.results);
        updateMapKey();
      };
      fetchMarkers();
    }, [])
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    menuAnimation.value = withTiming(isMenuOpen ? 0 : 1, {
      duration: 1000,
    });
  };

  const menuStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            menuAnimation.value,
            [0, 1],
            [-height, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
      backgroundColor: interpolateColor(
        menuAnimation.value,
        [0, 0.5, 1],
        ["#803511", "#803511", "#FFFBE4"]
      ),
    };
  });
  const menuButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            menuAnimation.value,
            [0, 1],
            [0, -320],
            Extrapolate.CLAMP
          ),
        },
      ],
      backgroundColor: interpolateColor(
        menuAnimation.value,
        [0, 1],
        ["#FFFBE4", "#803511"]
      ),
    };
  });
  const menuIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(menuAnimation.value, [0, 1], [0, 180])}deg`,
        },
      ],
      backgroundColor: interpolateColor(
        menuAnimation.value,
        [0, 1],
        ["#FFFBE4", "#803511"]
      ),
      color: interpolateColor(
        menuAnimation.value,
        [0, 1],
        ["#803511", "#FFFBE4"]
      ),
    };
  });
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
      <Animated.View style={[styles.MenuButton, menuButtonStyle]}>
        <TouchableOpacity
          onPress={() => {
            toggleMenu();
          }}
        >
          <Animated.View style={menuIconStyle}>
            <AnimatedIonicons
              name={isMenuOpen ? "close" : "menu"}
              size={24}
              style={menuIconStyle}
            />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          navigation.navigate("AddAnnouncement");
        }}
      >
        <Ionicons name="add" size={24} color="#AC591A" />
      </TouchableOpacity>
      <Animated.View style={[styles.menu, menuStyle]}>
        <View
          style={{ flexDirection: "row", gap: rem(10), alignItems: "center" }}
        >
          <Text style={styles.viewAll}>VIEW ALL ANNOUNCEMENTS</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("AnouncementList");
            }}
          >
            <Ionicons name="open-outline" size={24} color="#803511" />
          </TouchableOpacity>
        </View>
        <Text style={styles.sportsTitle}>FILTER BY SPORTS:</Text>
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
                  selectedSports.includes(sport.id) && styles.selectedSportText,
                ]}
              >
                {sport.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

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
  sportsContainer: {
    marginTop: rem(10),
    flexDirection: "row",
    display: "flex",
    flexWrap: "wrap",
    gap: rem(8),
  },
  sportButton: {
    paddingHorizontal: rem(12),
    paddingVertical: rem(6),
    borderRadius: rem(16),
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "#803511",
  },
  selectedSport: {
    backgroundColor: "#803511",
  },
  sportText: {
    fontWeight: "bold",

    color: "#803511",
  },
  sportsTitle: {
    marginTop: rem(30),
    marginLeft: rem(10),
    fontFamily: "Poppins-Bold",
    fontWeight: "bold",
    color: "#803511",
  },
  selectedSportText: {
    color: "white",
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
  sportItem: {
    backgroundColor: "#E8E8E8",
    padding: rem(5),
    borderRadius: rem(5),
    marginRight: rem(5),
    marginBottom: rem(5),
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
  MenuButton: {
    zIndex: 10000,
    position: "absolute",
    alignSelf: "center",
    bottom: 10,
    backgroundColor: "white",
    width: 50,
    height: 50,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  menu: {
    position: "absolute",
    zIndex: 1000,
    paddingTop: rem(20),
    bottom: 0,
    left: 0,
    width: "100%",
    height: rem(300),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#FFFBE4",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  viewAll: {
    marginLeft: rem(10),
    fontFamily: "Poppins-Bold",
    fontWeight: "bold",
    color: "#803511",
  },
});
