import { useEffect, useState } from "react";
import getAllEventRequest from "@/API/MODERATION/permanentEventRequest/getAllEventRequest";
import { RootState } from "@/store/redux/store";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Modal,
  Button,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import Mapa from "@/components/Mapa";
import { Ionicons } from "@expo/vector-icons";
import acceptEventRequest from "@/API/MODERATION/permanentEventRequest/acceptEventRequest";
import rejectEventRequest from "@/API/MODERATION/permanentEventRequest/rejectEvent.Request";
import { Event } from "@/types/Event";

const VerificationEvent = () => {
  const token = useSelector((state: RootState) => state.user.accessToken);
  const [eventRequest, setEventRequest] = useState<Event[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const fetchEventRequest = async () => {
    const response = await getAllEventRequest(token);
    setEventRequest(Array.isArray(response) ? response : []);
  };
  useEffect(() => {
    fetchEventRequest();
  }, []);

  const openMap = (latitude: string, longitude: string) => {
    setSelectedCoords({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });
    setModalVisible(true);
  };

  const handleAcceptVerification = async (Id: string) => {
    try {
      const response = await acceptEventRequest(token, Id);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectVerification = async (Id: string) => {
    try {
      const response = await rejectEventRequest(token, Id);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {eventRequest.map((event) => (
          <View key={event.id} style={styles.eventContainer}>
            <Text style={styles.eventText}>
              Creator: {event.marker.creator.username}
            </Text>
            <Text style={styles.eventText}>
              Sports:{" "}
              {event.marker.sports.map((sport: any) => sport.name).join(", ")}
            </Text>
            <Text style={styles.eventText}>
              Description: {JSON.stringify(event.announcement.description)}
            </Text>
            <Text style={styles.eventText}>Status: {event.status}</Text>
            <Button
              title="Show on map"
              onPress={() =>
                openMap(event.marker.latitude, event.marker.longitude)
              }
            />
            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={() => handleAcceptVerification(event.id.toString())}
                style={styles.iconButton}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={24}
                  color="green"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleRejectVerification(event.id.toString())}
                style={styles.iconButton}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={24}
                  color="orange"
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View style={{ flex: 1 }}>
          {selectedCoords && (
            <Mapa
              latitude={selectedCoords.latitude}
              longitude={selectedCoords.longitude}
              onBack={() => setModalVisible(false)}
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default VerificationEvent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    padding: 10,
  },
  eventContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  eventText: {
    fontSize: 16,
    padding: 3,
  },
  actionsRow: {
    flexDirection: "row",
    paddingTop: 10,
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
});
