import { Marker } from "react-native-maps";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

export const Map = () => {
  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 49.78651425694,
          longitude: 24.0222400079,
          latitudeDelta: 1.5,
          longitudeDelta: 1.5,
        }}
      >
        <Marker
          coordinate={{ latitude: 49.78651425694, longitude: 24.0222400079 }}
        />
        <Marker coordinate={{ latitude: 48.606, longitude: 22.267 }} />
      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
