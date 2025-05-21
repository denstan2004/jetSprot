import { RootState } from "@/store/redux/store";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { Report } from "@/types/Report";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import { Ionicons } from "@expo/vector-icons";
import getAllReports from "@/API/MODERATION/reports/getAllReports";
import rejectReport from "@/API/MODERATION/reports/rejectReport";
import approveReport from "@/API/MODERATION/reports/approveReport";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
const Reports = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const handleNavigateToUser = (userId: string) => {
    navigation.navigate("User", { userId });
  };
  const access = useSelector((state: RootState) => state.user.accessToken);
  const [reports, setReports] = useState<Report[]>([]);
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const currentUser = useSelector((state: RootState) => state.user.userData);

  useEffect(() => {
    const fetchPfpUrl = async () => {
      if (currentUser?.pfp_url) {
        try {
          const storageRef = ref(storage, currentUser.pfp_url);
          const url = await getDownloadURL(storageRef);
          setMediaUrl(url);
        } catch (error) {
          console.error("Failed to fetch avatar:", error);
        }
      }
    };

    fetchPfpUrl();
  }, [currentUser]);

  const getReports = async () => {
    const response = await getAllReports(access);
    setReports(Array.isArray(response) ? response : []);
  };

  useEffect(() => {
    getReports();
  }, []);

  const handleRejectReport = async (reportId: string) => {
    const response = await rejectReport(access, reportId);
    console.log(response);
    setReports(response);
    getReports();
  };

  const handleAcceptReport = async (reportId: string) => {
    const response = await approveReport(access, reportId);
    console.log(response);
    setReports(Array.isArray(response) ? response : []);
    getReports();
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.modalBody}>
        {Array.isArray(reports) && reports.length === 0 ? (
          <Text style={styles.noReviews}>No reports yet...</Text>
        ) : (
          reports
            .filter((report) => report.status === "pending")
            .map((report, index) => (
              <View key={index} style={styles.reviewCard}>
                <View style={styles.reviewContent}>
                  <TouchableOpacity
                    onPress={() =>
                      handleNavigateToUser(report.reported_user.toString())
                    }
                  >
                    <Image
                      source={{ uri: mediaUrl || "" }}
                      style={styles.reviewAvatar}
                    />
                  </TouchableOpacity>

                  <View style={styles.reviewTextContainer}>
                    <Text style={styles.reviewUsername}>
                      Reported user: {report.reported_user}
                    </Text>
                    <Text style={styles.reviewText}>
                      Description: {report.description || "No description"}
                    </Text>
                    <Text style={styles.reviewText}>
                      Category: {report.category}
                    </Text>
                    <Text style={styles.reviewText}>
                      Reported by User: {report.reporter}
                    </Text>

                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        onPress={() => handleAcceptReport(report.id.toString())}
                        style={styles.iconButton}
                      >
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={24}
                          color="green"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleRejectReport(report.id.toString())}
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
                </View>
              </View>
            ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Reports;

const styles = StyleSheet.create({
  modalBody: {
    padding: 20,
  },
  reviewCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  reviewContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  reviewAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  reviewTextContainer: {
    flex: 1,
    gap: 10,
  },
  reviewUsername: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 4,
  },
  reviewText: {
    fontSize: 14,
    color: "#333",
  },
  noReviews: {
    fontSize: 16,
    textAlign: "center",
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
