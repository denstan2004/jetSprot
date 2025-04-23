import { Marker } from "react-native-maps";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Modal, StyleSheet } from "react-native";
import { useState } from "react";

// interface marker => backend => markers => list.map ()=> <marker1 /> <marker2 /> => onPress() => setSelectedMarker(markerId)+
export const Map = () => {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>();

  const handleMarkerPress = (markerId: string) => {
    //backend => res= getEventInfo(markerId) => setModalVisible(true) => setEventInfo(res)
  };
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
          onPress={() => {
            handleMarkerPress("123");
          }}
          coordinate={{ latitude: 49.78651425694, longitude: 24.0222400079 }}
        />
        <Marker coordinate={{ latitude: 48.606, longitude: 22.267 }} />
      </MapView>
      {/* <Modal
         visible={modalVisible}
         onRequestClose={() => setModalVisible(false)}
         transparent={true} /> */}
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
