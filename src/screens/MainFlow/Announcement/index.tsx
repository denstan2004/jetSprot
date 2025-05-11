import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Announcement as AnnouncementType } from "@/types/Announcement";
import { Ionicons } from "@expo/vector-icons";
import { rem } from "@/theme/units";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";

interface Sport {
  id: number;
  name: string;
}

export const Announcement = () => {
  const route = useRoute<RouteProp<AuthStackParamList, "Announcement">>();
  const navigation = useNavigation();
  const { announcement } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFBE4" }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#5B3400" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.sportsContainer}>
              {announcement.sports.map((sport: Sport | string, index) => (
                <View key={index} style={styles.sportTag}>
                  <Text style={styles.sportText}>
                    {typeof sport === "object" ? sport.name : sport}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.statusContainer}>
              <Ionicons
                name={announcement.status === 1 ? "checkmark-circle" : "time"}
                size={24}
                color={announcement.status === 1 ? "#4CAF50" : "#FF763F"}
              />
              <Text style={styles.statusText}>
                {announcement.status === 1 ? "Active" : "Pending"}
              </Text>
            </View>
          </View>

          <Text style={styles.caption}>{announcement.caption}</Text>
          <Text style={styles.description}>{announcement.description}</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Ionicons name="people" size={20} color="#5B3400" />
              <Text style={styles.detailText}>
                Required: {announcement.required_amount} people
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={20} color="#5B3400" />
              <Text style={styles.detailText}>
                Valid until:{" "}
                {new Date(announcement.valid_until).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time" size={20} color="#5B3400" />
              <Text style={styles.detailText}>
                Created:{" "}
                {new Date(announcement.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBE4",
  },
  card: {
    backgroundColor: "#FFFBE4",
    margin: rem(16),
    padding: rem(20),
    borderRadius: rem(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rem(16),
    paddingVertical: rem(8),
  },
  backButton: {
    padding: rem(8),
    borderRadius: rem(8),
  },
  sportsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: rem(8),
  },
  sportTag: {
    backgroundColor: "#AC591A",
    paddingHorizontal: rem(12),
    paddingVertical: rem(6),
    borderRadius: rem(16),
  },
  sportText: {
    color: "#FFFBE4",
    fontSize: rem(14),
    fontWeight: "600",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: rem(4),
  },
  statusText: {
    color: "#5B3400",
    fontSize: rem(14),
    fontWeight: "600",
  },
  caption: {
    fontSize: rem(24),
    fontWeight: "700",
    color: "#5B3400",
    marginBottom: rem(12),
  },
  description: {
    fontSize: rem(16),
    color: "#5B3400",
    lineHeight: rem(24),
    marginBottom: rem(20),
  },
  detailsContainer: {
    gap: rem(12),
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
});
