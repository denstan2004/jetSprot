import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { rem } from "@/theme/units";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import { getMyRequests } from "@/API/announcement/getMyRequests";
import { RequestType } from "@/API/announcement/getAllRequests";
import { getAnnouncementById } from "@/API/announcement/getAnnouncementById";
import { Announcement as AnnouncementType } from "@/types/Announcement";

interface RequestWithDetails extends RequestType {
  announcementDetails?: AnnouncementType;
}

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const OutgoingRequests = () => {
  const navigation = useNavigation<NavigationProp>();
  const { accessToken } = useSelector((state: RootState) => state.user);
  const [requests, setRequests] = useState<RequestWithDetails[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!accessToken) return;
      try {
        const requestsData = await getMyRequests(accessToken);
        const requestsWithDetails = await Promise.all(
          requestsData.map(async (request: RequestType) => {
            try {
              const announcementDetails = await getAnnouncementById(
                request.announcement,
                accessToken
              );
              return {
                ...request,
                announcementDetails,
              };
            } catch (error) {
              console.error("Error fetching announcement details:", error);
              return request;
            }
          })
        );
        setRequests(requestsWithDetails);
      } catch (error) {
        console.error("Error fetching outgoing requests:", error);
      }
    };

    fetchRequests();
  }, [accessToken]);

  const getStatusColor = (status: number | null) => {
    switch (status) {
      case 0:
        return "#FF0000"; // Rejected
      case 1:
        return "#4CAF50"; // Accepted
      case 2:
        return "#FFA500"; // Pending
      case 4:
        return "#808080"; // Dismissed
      default:
        return "#000000";
    }
  };

  const getStatusText = (status: number | null) => {
    switch (status) {
      case 0:
        return "Rejected";
      case 1:
        return "Accepted";
      case 2:
        return "Pending";
      case 4:
        return "Dismissed";
      default:
        return "Unknown";
    }
  };

  const renderRequest = ({ item }: { item: RequestWithDetails }) => (
    <TouchableOpacity style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <Text style={styles.announcementTitle}>
          {item.announcementDetails?.caption || "Loading..."}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={20} color="#5B3400" />
          <Text style={styles.detailText}>
            Requested:{" "}
            {new Date(
              item.announcementDetails?.created_at || ""
            ).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time" size={20} color="#5B3400" />
          <Text style={styles.detailText}>
            Valid until:{" "}
            {new Date(
              item.announcementDetails?.end_date || ""
            ).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#5B3400" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Outgoing Requests</Text>
      </View>

      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No outgoing requests yet</Text>
        }
      />
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
    borderBottomColor: "#AC591A",
  },
  backButton: {
    padding: rem(8),
    borderRadius: rem(8),
  },
  headerTitle: {
    fontSize: rem(20),
    fontWeight: "bold",
    color: "#5B3400",
    marginLeft: rem(16),
  },
  listContainer: {
    padding: rem(16),
  },
  requestCard: {
    backgroundColor: "white",
    borderRadius: rem(12),
    padding: rem(16),
    marginBottom: rem(16),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: rem(12),
  },
  announcementTitle: {
    fontSize: rem(18),
    fontWeight: "600",
    color: "#5B3400",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: rem(12),
    paddingVertical: rem(6),
    borderRadius: rem(16),
    marginLeft: rem(8),
  },
  statusText: {
    color: "white",
    fontSize: rem(12),
    fontWeight: "600",
  },
  detailsContainer: {
    gap: rem(8),
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: rem(8),
  },
  detailText: {
    fontSize: rem(14),
    color: "#5B3400",
  },
  emptyText: {
    textAlign: "center",
    color: "#AC591A",
    fontSize: rem(16),
    marginTop: rem(32),
  },
});
