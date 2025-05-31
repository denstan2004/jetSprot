import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { EventType } from "@/API/announcement/createAnnouncement";
import { SportInterface } from "@/API/sport/getSports";
import { styles } from "./styles";
interface FilterState {
  event_type: number | undefined;
  status: number | undefined;
  min_required_amount: number | undefined;
  country: string | undefined;
  city: number | undefined;
  start_date: string | undefined;
  end_date: string | undefined;
  creator_username: string | undefined;
}

interface FilterControlsProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onClearFilters: () => void;
  onApplyFilters: () => void;
  sports: SportInterface[];
  selectedSports: number[];
  onSportSelect: (sportId: number) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  setFilters,
  onClearFilters,
  onApplyFilters,
  sports,
  selectedSports,
  onSportSelect,
}) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.filterControls}>
        <Text style={styles.filterTitle}>Sports</Text>
        <View style={styles.sportsContainer}>
          {sports.map((sport) => (
            <TouchableOpacity
              key={sport.id}
              style={[
                styles.sportButton,
                selectedSports.includes(sport.id) && styles.selectedSport,
              ]}
              onPress={() => onSportSelect(sport.id)}
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
      </View>

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
          <TouchableOpacity style={styles.clearButton} onPress={onClearFilters}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.applyButton} onPress={onApplyFilters}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
