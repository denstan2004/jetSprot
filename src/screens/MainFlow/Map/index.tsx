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
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import { Badge } from "react-native-paper";
import { getAllRequests, RequestType } from "@/API/announcement/getAllRequests";
import { getMyRequests } from "@/API/announcement/getMyRequests";
import { getUserMarkers } from "@/API/announcement/markers/getUserMarkers";
import { rem } from "@/theme/units";
import { filterMarkers } from "@/API/announcement/markers/filterMarkers";
import { FilterControls } from "./filters";
import MarkerIcon from "./markerIcon";
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
  const { height } = Dimensions.get("window");
  const [filters, setFilters] = useState({
    event_type: undefined as number | undefined,
    status: undefined as number | undefined,
    min_required_amount: undefined as number | undefined,
    country: undefined as string | undefined,
    city: undefined as number | undefined,
    start_date: undefined as string | undefined,
    end_date: undefined as string | undefined,
    creator_username: undefined as string | undefined,
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
        event_type: filters.event_type,
        status: filters.status,
        min_required_amount: filters.min_required_amount,
        sports_id: selectedSports.length > 0 ? selectedSports : undefined,
        country: filters.country,
        city: filters.city,
        start_date: filters.start_date,
        end_date: filters.end_date,
        creator_username: filters.creator_username,
      };
      console.log(filterParams);
      const response = await filterMarkers(sel.accessToken, filterParams);
      setFilterdMarkers(response.results);
      setIsFiltered(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearFilters = async () => {
    setFilters({
      event_type: undefined,
      status: undefined,
      min_required_amount: undefined,
      country: undefined,
      city: undefined,
      start_date: undefined,
      end_date: undefined,
      creator_username: undefined,
    });
    setSelectedSports([]);
    setIsFiltered(false);
    const response = await getAllMarkers();
    setMarkers(response.results);
    setFilterdMarkers([]);
  };

  const renderFilterControls = () => (
    <FilterControls
      filters={filters}
      setFilters={setFilters}
      onClearFilters={handleClearFilters}
      onApplyFilters={handleFilterApply}
      sports={sports}
      selectedSports={selectedSports}
      onSportSelect={handleSportSelect}
    />
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
        {isFiltered
          ? filterdMarkers.map((marker) => (
              <Marker
                key={marker.id}
                onPress={() => handleMarkerPress(marker)}
                coordinate={{
                  latitude: parseFloat(marker.latitude),
                  longitude: parseFloat(marker.longitude),
                }}
                children={MarkerIcon(marker, sports, sel.userData?.id || 0)}
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
                pinColor="blue"
                children={MarkerIcon(marker, sports, sel.userData?.id || 0)}
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
                children={MarkerIcon(marker, sports, sel.userData?.id || 0)}
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
        <Ionicons
          name={showUserMarkers ? "map" : "map-outline"}
          size={24}
          color="#803511"
        />
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
        {renderFilterControls()}
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
