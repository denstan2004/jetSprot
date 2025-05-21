import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import createRequest from "@/API/MODERATION/userVerification/createRequest";

const UserSettings = () => {
  const token = useSelector((state: RootState) => state.user.accessToken);

  const handleGetVerification = async () => {
    const response = await createRequest(token);
    console.log(response);
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={styles.headerText}>User Settings</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.bodyText}>
          Get your verification and get more features
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleGetVerification}>
          <Text style={styles.buttonText}>Get verification</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UserSettings;

const styles = StyleSheet.create({
  header: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  body: {
    padding: 16,
  },
  bodyText: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
  button: {
    backgroundColor: "rgba(32, 0, 112, 0.56)",
    padding: 10,
    borderRadius: 10,
    marginTop: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
