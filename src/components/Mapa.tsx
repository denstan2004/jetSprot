import { TouchableOpacity, View, Text } from "react-native";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const Mapa = ({
  latitude,
  longitude,
  onBack,
}: {
  latitude: number;
  longitude: number;
  onBack: () => void;
}) => {

  return (
    <View style={styles.map}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={{ latitude, longitude }} title={"Marker"} />
      </MapView>
    </View>
  );
};

export default Mapa;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    borderRadius: 10,
    zIndex: 1000,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
});
