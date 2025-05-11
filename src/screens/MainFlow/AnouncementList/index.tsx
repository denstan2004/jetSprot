import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useEffect, useState } from "react";
import { getAllAnouncements } from "@/API/announcement/getAllAnouncements";
import { Announcement } from "@/types/Announcement";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
import { Ionicons } from "@expo/vector-icons";
import { rem } from "@/theme/units";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

interface Sport {
  id: number;
  name: string;
}

export const AnouncementList = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAllAnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  const renderAnnouncementItem = ({ item }: { item: Announcement }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("Announcement", { announcement: item })
      }
    >
      <View style={styles.header}>
        <View style={styles.sportsContainer}>
          {item.sports.map((sport: Sport | string, index) => (
            <View key={index} style={styles.sportTag}>
              <Text style={styles.sportText}>
                {typeof sport === "object" ? sport.name : sport}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.statusContainer}>
          <Ionicons
            name={item.status === 1 ? "checkmark-circle" : "time"}
            size={24}
            color={item.status === 1 ? "#4CAF50" : "#FF763F"}
          />
          <Text style={styles.statusText}>
            {item.status === 1 ? "Active" : "Pending"}
          </Text>
        </View>
      </View>

      <Text style={styles.caption}>{item.caption}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Ionicons name="people" size={20} color="#5B3400" />
          <Text style={styles.detailText}>
            Required: {item.required_amount} people
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={20} color="#5B3400" />
          <Text style={styles.detailText}>
            Valid until: {new Date(item.valid_until).toLocaleDateString()}
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
        <Text style={styles.title}>Announcements</Text>
      </View>

      <FlatList
        data={announcements}
        renderItem={renderAnnouncementItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
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
    paddingHorizontal: rem(16),
    paddingVertical: rem(8),
  },
  backButton: {
    padding: rem(8),
    borderRadius: rem(8),
  },
  title: {
    fontSize: rem(24),
    fontWeight: "700",
    color: "#5B3400",
    marginLeft: rem(16),
  },
  listContainer: {
    padding: rem(16),
  },
  card: {
    backgroundColor: "#FFFBE4",
    marginBottom: rem(16),
    padding: rem(20),
    borderRadius: rem(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: rem(20),
    fontWeight: "700",
    color: "#5B3400",
    marginTop: rem(12),
    marginBottom: rem(8),
  },
  description: {
    fontSize: rem(16),
    color: "#5B3400",
    lineHeight: rem(24),
    marginBottom: rem(16),
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
});
