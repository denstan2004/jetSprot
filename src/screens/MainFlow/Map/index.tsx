import React from "react";
import { Marker } from "react-native-maps";
import MapView from "react-native-maps";
import { styles } from "./styles";
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
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
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
import { getFillteredAnnouncement } from "@/API/announcement/getFillteredAnnouncement";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import { EventType } from "@/API/announcement/createAnnouncement";
import { Badge } from "react-native-paper";
import { getAllRequests, RequestType } from "@/API/announcement/getAllRequests";
import { getMyRequests } from "@/API/announcement/getMyRequests";
import { getUserMarkers } from "@/API/announcement/markers/getUserMarkers";
import { rem } from "@/theme/units";
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
  const [userMarkers, setUserMarkers] = useState<MarkerType[]>([]);
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<RequestType[]>([]);
  const [sports, setSports] = useState<SportInterface[]>([]);
  const [filterdMarkers, setFilterdMarkers] = useState<MarkerType[]>([]);
  const [mapKey, setMapKey] = useState(0);
  const menuAnimation = useSharedValue(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMarkers, setShowUserMarkers] = useState(false);
  const { width, height } = Dimensions.get("window");
  const [filters, setFilters] = useState({
    event_type: undefined as number | undefined,
    status: undefined as number | undefined,
    min_required_amount: undefined as number | undefined,
  });
  const [isFiltered, setIsFiltered] = useState(false);
  const sel = useSelector((state: RootState) => state.user);
  const handleSportSelect = (sport: number) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };
  const updateMapKey = () => {
    setMapKey((prev) => prev + 1);
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          // Fetch markers
          const markersResponse = await getAllMarkers();
          setMarkers(markersResponse.results.filter((e) => e.status !== 0));
          updateMapKey();

          // Fetch user markers
          const userMarkersResponse = await getUserMarkers(sel.accessToken);
          setUserMarkers(userMarkersResponse.results);

          // Fetch sports
          const sportsRes = await getSports();
          setSports(sportsRes);

          // Fetch requests if user is logged in
          if (sel.accessToken) {
            const [requestsRes, outgoingRequestsRes] = await Promise.all([
              getAllRequests(sel.accessToken),
              getMyRequests(sel.accessToken),
            ]);
            setRequests(requestsRes);
            setOutgoingRequests(outgoingRequestsRes);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }, [sel.accessToken])
  );

  useEffect(() => {
    if (selectedMarker) {
      if (sel?.accessToken) {
        getAnnouncementById(selectedMarker.announcement, sel.accessToken).then(
          (announcement) => {
            setAnnouncement(announcement);
          }
        );
      }
    }
  }, [selectedMarker]);

  useEffect(() => {
    if (selectedSports.length > 0) {
      setFilterdMarkers(
        markers.filter((marker) =>
          marker.sports.some((sport) => selectedSports.includes(sport.id))
        )
      );
    } else {
      setFilterdMarkers([]);
    }
  }, [selectedSports]);
  useEffect(() => {
    markers.forEach((element) => {});
  }, [filterdMarkers, selectedMarker, markers]);
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
            [0, -220],
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

  const handleFilterApply = async () => {
    if (!sel?.accessToken) return;
    setShowUserMarkers(false);
    try {
      const filterParams = {
        ...filters,
        sport_id: selectedSports.length > 0 ? selectedSports[0] : undefined,
      };

      const response = await getFillteredAnnouncement(
        sel.accessToken,
        filterParams
      );
      setFilterdMarkers(response.results);
      setIsFiltered(true);
    } catch (error) {}
  };

  const handleClearFilters = async () => {
    setFilters({
      event_type: undefined,
      status: undefined,
      min_required_amount: undefined,
    });
    setSelectedSports([]);
    setIsFiltered(false);
    const response = await getAllMarkers();
    setMarkers(response.results);
    setFilterdMarkers([]);
  };

  const renderFilterControls = () => (
    <View style={styles.filterControls}>
      <Text style={styles.filterTitle}>Filters</Text>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Event Type</Text>
        <View style={styles.filterOptions}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filters.event_type === EventType.playerSearch &&
                styles.filterButtonActive,
            ]}
            onPress={() =>
              setFilters((prev) => ({
                ...prev,
                event_type:
                  prev.event_type === EventType.playerSearch
                    ? undefined
                    : EventType.playerSearch,
              }))
            }
          >
            <Text
              style={[
                styles.filterButtonText,
                filters.event_type === EventType.playerSearch &&
                  styles.filterButtonTextActive,
              ]}
            >
              Player Search
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filters.event_type === EventType.announcement &&
                styles.filterButtonActive,
            ]}
            onPress={() =>
              setFilters((prev) => ({
                ...prev,
                event_type:
                  prev.event_type === EventType.announcement
                    ? undefined
                    : EventType.announcement,
              }))
            }
          >
            <Text
              style={[
                styles.filterButtonText,
                filters.event_type === EventType.announcement &&
                  styles.filterButtonTextActive,
              ]}
            >
              Announcement
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Required Amount</Text>
        <View style={styles.filterOptions}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filters.min_required_amount === 1 && styles.filterButtonActive,
            ]}
            onPress={() =>
              setFilters((prev) => ({
                ...prev,
                min_required_amount:
                  prev.min_required_amount === 1 ? undefined : 1,
              }))
            }
          >
            <Text
              style={[
                styles.filterButtonText,
                filters.min_required_amount === 1 &&
                  styles.filterButtonTextActive,
              ]}
            >
              1+
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filters.min_required_amount === 5 && styles.filterButtonActive,
            ]}
            onPress={() =>
              setFilters((prev) => ({
                ...prev,
                min_required_amount:
                  prev.min_required_amount === 5 ? undefined : 5,
              }))
            }
          >
            <Text
              style={[
                styles.filterButtonText,
                filters.min_required_amount === 5 &&
                  styles.filterButtonTextActive,
              ]}
            >
              5+
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterActions}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearFilters}
        >
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleFilterApply}
        >
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
        {selectedSports.length > 0
          ? filterdMarkers.map((marker) => (
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
            ))
          : showUserMarkers
          ? userMarkers.map((marker) => (
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
            ))
          : markers.map((marker) => (
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
        onPress={() => {
          toggleMenu();
        }}
      >
        <Animated.View style={[styles.MenuButton, menuButtonStyle]}>
          <Animated.View style={menuIconStyle}>
            <AnimatedIonicons
              name={isMenuOpen ? "close" : "menu"}
              size={24}
              style={menuIconStyle}
            />
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.viewAll}
        onPress={() => {
          navigation.navigate("AnouncementList");
        }}
      >
        <Ionicons name="open-outline" size={24} color="#803511" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.notifications}
        onPress={() => {
          navigation.navigate("Requests");
        }}
      >
        <Ionicons name="notifications" size={24} color="#803511" />
        <Badge
          style={{ fontSize: rem(12), position: "absolute", top: 0, right: 0 }}
        >
          {requests.length}
        </Badge>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.outgoingRequests}
        onPress={() => {
          navigation.navigate("OutgoingRequests");
        }}
      >
        <Ionicons name="paper-plane" size={24} color="#803511" />
        <Badge
          style={{ fontSize: rem(12), position: "absolute", top: 0, right: 0 }}
        >
          {outgoingRequests.length}
        </Badge>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.outgoingRequests}
        onPress={() => {
          navigation.navigate("OutgoingRequests");
        }}
      >
        <Ionicons name="paper-plane" size={24} color="#803511" />
        <Badge
          style={{ fontSize: rem(12), position: "absolute", top: 0, right: 0 }}
        >
          {outgoingRequests.length}
        </Badge>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.userMarkers}
        onPress={() => {
          setShowUserMarkers(!showUserMarkers);
        }}
      >
        <Ionicons  name={showUserMarkers ? "map" : "map-outline"} size={24} color="#803511" />
      
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          navigation.navigate("AddAnnouncement");
        }}
      >
        <Ionicons name="add" size={24} color="#AC591A" />
      </TouchableOpacity>
      <Animated.View style={[styles.menu, menuStyle]}>
        <ScrollView showsVerticalScrollIndicator={true}>
          {renderFilterControls()}
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
        </ScrollView>
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
                        {sport.name}
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

