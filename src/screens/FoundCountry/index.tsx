import React, { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Button,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useState } from "react";
import getCountries from "@/API/countries/getCountries";
import getCity from "@/API/city/getCity";
import patchCounty from "@/API/user/patchCounty";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import { getSports, SportInterface } from "@/API/sport/getSports";
import addSport from "@/API/sport/addSport";
import { useNavigation } from "@react-navigation/native";
// юзер натиснув на інпут, зробили перший запит з пустим префіксом, закинули країни в стейт, відорбазили (слухати он фокус)
// коли вводиться щось в інпут, зробити другий запит з префіксом, яке ввів юзер і закинути в стейт і відобразити відповідно (он чендж)
// юзер вийшов з інпута бачить ліст країна або міст при натисканні на яке міняєм знчення селектед сіті або кантрі і чистимо ліст
const FoundCountry = () => {
  const userId = useSelector((state: RootState) => state.user.userData?.id);
  const token = useSelector((state: RootState) => state.user.accessToken);
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchType, setSearchType] = useState<"country" | "city">("country");
  const [sports, setSports] = useState<SportInterface[]>([]);
  const [selectedSports, setSelectedSports] = useState<number[]>([]);
  const navigation = useNavigation();

  const fetchCountries = async (text: string) => {
    try {
      const response = await getCountries(text);
      setCountries(response);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCities = async (text: string) => {
    try {
      const response = await getCity(selectedCountry, text);
      setCities(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePatchCounty = async (cityName: string) => {
    try {
      if (!userId) {
        console.error("User ID is not available");
        return;
      }
      const response = await patchCounty(userId, token, {
        city: cityName,
        country: selectedCountry,
      });
      setModalVisible(false);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await getSports();
        setSports(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSports();
  }, []);

  const handleSportSelect = async (sportId: number) => {
    try {
      if (!userId) {
        console.error("User ID is not available");
        return;
      }
      const response = await addSport(userId.toString(), sportId, token);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.title}>Found Country and City</Text>
        <Button title="Search" onPress={() => setModalVisible(true)} />
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>You are in: </Text>
          <Text style={styles.locationText}>{selectedCountry}</Text>
          <Text style={styles.locationText}>{selectedCity}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Selected Sports:</Text>
          <View style={styles.sportsContainer}>
            {sports.map((sport) => (
              <TouchableOpacity
                key={sport.id}
                style={[
                  styles.sportButton,
                  selectedSports.includes(sport.id) && styles.selectedSport,
                ]}
                onPress={() => {
                  setSelectedSports((prev) =>
                    prev.includes(sport.id)
                      ? prev.filter((id) => id !== sport.id)
                      : [...prev, sport.id]
                  );
                }}
              >
                <Text
                  style={[
                    styles.sportText,
                    selectedSports.includes(sport.id) && { color: "white" },
                  ]}
                >
                  {sport.name}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.sportButton, styles.approveButton]}
              onPress={() => {
                selectedSports.forEach((sportId) => {
                  handleSportSelect(sportId);
                });
              }}
            >
              <Text style={styles.sportTextApprove}>Approve Selected Sports</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchTabs}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  searchType === "country" && styles.activeTab,
                ]}
                onPress={() => setSearchType("country")}
              >
                <Text
                  style={[
                    styles.tabText,
                    searchType === "country" && styles.activeTabText,
                  ]}
                >
                  Country
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, searchType === "city" && styles.activeTab]}
                onPress={() => setSearchType("city")}
              >
                <Text
                  style={[
                    styles.tabText,
                    searchType === "city" && styles.activeTabText,
                  ]}
                >
                  City
                </Text>
              </TouchableOpacity>
            </View>

            {searchType === "country" ? (
              <>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search country..."
                  value={selectedCountry}
                  onFocus={() => fetchCountries("")}
                  onChangeText={(text) => {
                    setSelectedCountry(text);
                    fetchCountries(text);
                  }}
                />
                {selectedCountry.length === 0 ? (
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: 20,
                      color: "#888",
                    }}
                  >
                    No countries found
                  </Text>
                ) : (
                  <FlatList
                    data={countries}
                    keyExtractor={(item) => item.code}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedCountry(item.code);
                          setCountries([]);
                        }}
                      >
                        <Text style={{ padding: 10 }}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </>
            ) : (
              <>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search city..."
                  value={selectedCity}
                  onFocus={() => fetchCities("")}
                  onChangeText={(text) => {
                    setSelectedCity(text);
                    fetchCities(text);
                  }}
                />
                {selectedCity.length === 0 ? (
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: 20,
                      color: "#888",
                    }}
                  >
                    No cities found
                  </Text>
                ) : (
                  <FlatList
                    data={cities}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedCity(item.name);
                          setCities([]);
                        }}
                      >
                        <Text style={{ padding: 10 }}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                )}
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => handlePatchCounty(selectedCity)}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBE4",
    padding: 15,
  },
  backButton: {
    padding: 8,
    position: "absolute",
    top: 50,
    left: 10,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 16,
    color: "#5B3400",
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 60,
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20,
    flexWrap: "wrap",
    paddingHorizontal: 5,
  },
  locationLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  locationText: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  inputContainer: {
    marginBottom: 16,
    marginTop: "10%",
    flex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5B3400",
    marginBottom: 8,
    paddingHorizontal: 5,
  },
  sportsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  sportButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#AC591A",
    margin: 4,
    minWidth: 100,
  },
  selectedSport: {
    backgroundColor: "#AC591A",
  },
  sportText: {
    color: "#AC591A",
    textAlign: "center",
  },
  selectedSportText: {
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "80%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 28,
    color: "#666",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    width: "100%",
  },
  searchTabs: {
    flexDirection: "row",
    marginBottom: 15,
    justifyContent: "space-around",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "#ddd",
  },
  activeTab: {
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  approveButton: {
    width: "70%",
    marginTop: 20,
    alignSelf: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#AC591A",
  },
  sportTextApprove: {
    color: "white",
    textAlign: "center",
  },
});

export default FoundCountry;
