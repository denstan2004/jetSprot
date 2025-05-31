import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { rem } from "@/theme/units";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
import { getAllRequests, RequestType } from "@/API/announcement/getAllRequests";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import getUserById from "@/API/user/getUserById";
import { storage } from "@/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import acceptRequest from "@/API/announcement/acceptRequest";
import rejectRequest from "@/API/announcement/rejectRequest";
import { getAnnouncementById } from "@/API/announcement/getAnnouncementById";
import { Announcement as AnnouncementType } from "@/types/Announcement";

interface UserInfo {
  id: number;
  username: string;
  pfp_url: string | null;
  rating: number;
}

interface RequestWithUser extends RequestType {
  userInfo?: UserInfo;
  userPfpUrl?: string;
  announcementDetails?: AnnouncementType;
}

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const Requests = () => {
  const navigation = useNavigation<NavigationProp>();
  const sel = useSelector((state: RootState) => state.user);
  const [requests, setRequests] = useState<RequestWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const requestsData = await getAllRequests(sel.accessToken);
      const requestsWithUserInfo = await Promise.all(
        requestsData.map(async (request: RequestType) => {
          try {
            const [userInfo, announcementDetails] = await Promise.all([
              getUserById(request.user.toString()),
              getAnnouncementById(
                request.announcement,
                sel.accessToken
              ),
            ]);

            let userPfpUrl = null;
            if (userInfo.pfp_url) {
              const storageRef = ref(storage, userInfo.pfp_url);
              userPfpUrl = await getDownloadURL(storageRef);
            }
            return {
              ...request,
              userInfo,
              userPfpUrl,
              announcementDetails,
            };
          } catch (error) {
            console.error("Error fetching request details:", error);
            return request;
          }
        })
      );
      setRequests(requestsWithUserInfo);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (requestId: number) => {
    try {
      await acceptRequest(requestId, sel.accessToken);
      Alert.alert("Success", "Request accepted successfully");
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error("Error accepting request:", error);
      Alert.alert("Error", "Failed to accept request");
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      await rejectRequest(requestId, sel.accessToken);
      Alert.alert("Success", "Request rejected successfully");
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting request:", error);
      Alert.alert("Error", "Failed to reject request");
    }
  };

  const getStatusColor = (status: number | null) => {
    switch (status) {
      case 0:
        return "#FF3B30"; // Rejected
      case 1:
        return "rgb(39, 156, 69)"; // Accepted
      case 2:
        return "#FF9500"; // Pending
      case 4:
        return "#8E8E93"; // Dismissed
      default:
        return "#8E8E93";
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

  const renderRequestCard = ({ item }: { item: RequestWithUser }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.userInfo}
        onPress={() => {
          if (item.userInfo) {
            navigation.navigate("User", {
              userId: item.userInfo.id.toString(),
            });
          }
        }}
      >
        {item.userPfpUrl ? (
          <Image source={{ uri: item.userPfpUrl }} style={styles.userPfp} />
        ) : (
          <View style={styles.userPfpPlaceholder}>
            <Ionicons name="person" size={24} color="#5B3400" />
          </View>
        )}
        <View style={styles.userDetails}>
          <Text style={styles.username}>
            {item.userInfo?.username || "Unknown User"}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{item.userInfo?.rating || 0}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.announcementInfo}>
        <Text style={styles.announcementTitle}>
          {item.announcementDetails?.caption || "Loading..."}
        </Text>
        <Text style={styles.announcementDescription} numberOfLines={2}>
          {item.announcementDetails?.description || "Loading..."}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>

        {item.status === 2 && ( // Only show buttons for pending requests
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleAccept(item.id)}
            >
              <Text style={styles.actionButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleReject(item.id)}
            >
              <Text style={styles.actionButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
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
        <Text style={styles.title}>Requests</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading requests...</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequestCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No requests found</Text>
            </View>
          }
        />
      )}
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
    borderBottomColor: "#E5E5E5",
    backgroundColor: "#FFFBE4",
  },
  backButton: {
    marginRight: rem(16),
  },
  title: {
    fontSize: rem(20),
    fontWeight: "bold",
    color: "#5B3400",
  },
  listContainer: {
    padding: rem(16),
  },
  card: {
    backgroundColor: "#FFFBE4",
    borderRadius: rem(12),
    padding: rem(16),
    marginBottom: rem(12),
    borderWidth: 1,
    borderColor: "#AC591A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userPfp: {
    width: rem(50),
    height: rem(50),
    borderRadius: rem(25),
    marginRight: rem(12),
    borderWidth: 1,
    borderColor: "#AC591A",
  },
  userPfpPlaceholder: {
    width: rem(50),
    height: rem(50),
    borderRadius: rem(25),
    backgroundColor: "#FFFBE4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: rem(12),
    borderWidth: 1,
    borderColor: "#AC591A",
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: rem(16),
    fontWeight: "600",
    color: "#5B3400",
    marginBottom: rem(4),
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: rem(4),
  },
  rating: {
    fontSize: rem(14),
    color: "#5B3400",
  },
  announcementInfo: {
    marginTop: rem(12),
    paddingTop: rem(12),
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  announcementTitle: {
    fontSize: rem(16),
    fontWeight: "600",
    color: "#5B3400",
    marginBottom: rem(4),
  },
  announcementDescription: {
    fontSize: rem(14),
    color: "#5B3400",
    opacity: 0.8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: rem(12),
    paddingTop: rem(12),
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  statusBadge: {
    paddingHorizontal: rem(12),
    paddingVertical: rem(6),
    borderRadius: rem(16),
  },
  statusText: {
    color: "white",
    fontSize: rem(14),
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: rem(8),
  },
  actionButton: {
    width: rem(70),
    height: rem(36),
    borderRadius: rem(18),
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: rem(14),
    fontWeight: "500",
  },
  acceptButton: {
    backgroundColor: "#AC591A",
  },
  rejectButton: {
    backgroundColor: "#AC591A",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: rem(16),
    color: "#5B3400",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: rem(32),
  },
  emptyText: {
    fontSize: rem(16),
    color: "#5B3400",
  },
});
