import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import createRequest from "@/API/MODERATION/userVerification/createRequest";
import { MaterialIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
import makeAccountPrivate from "@/API/user/makeAccountPrivate";
import makeAccountOpen from "@/API/user/makeAccountOpen";
import { setUserType, logout } from "@/store/redux/slices/userSlice";
import { useDispatch } from "react-redux";

const UserSettings = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.user);
  const userType = useSelector(
    (state: RootState) => state.user.userData?.account_type
  );

  const handleNavigateToEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const handleNavigateToSityCountryAndSports = () => {
    navigation.navigate("FoundCountry");
  };

  const handleGetVerification = async () => {
    const response = await createRequest(accessToken);
    console.log(response);
  };

  const navigateToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "SignIn" }],
    });
  };

  const handleMakeAccountPrivate = async () => {
    const response = await makeAccountPrivate(accessToken);
    console.log(response);
  };

  const handleMakeAccountOpen = async () => {
    const response = await makeAccountOpen(accessToken);
    console.log(response);
  };

  const handleToggleAccountPrivacy = async () => {
    if (userType === "private") {
      await handleMakeAccountOpen();
      dispatch(setUserType("open"));
    } else {
      await handleMakeAccountPrivate();
      dispatch(setUserType("private"));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigateToLogin();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerText}>User Settings</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ flex: 1 }}>
        <View style={styles.body}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleGetVerification}
          >
            <MaterialIcons
              name="verified"
              size={24}
              color="#AC591A"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Get verification</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleNavigateToEditProfile}
          >
            <MaterialIcons
              name="edit"
              size={24}
              color="#AC591A"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Edit profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleNavigateToSityCountryAndSports}
          >
            <MaterialIcons
              name="travel-explore" //sports-basketball
              size={24}
              color="#AC591A"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Select Sity, Country and sports</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleToggleAccountPrivacy}
          >
            <MaterialIcons
              name={userType === "private" ? "lock" : "lock-open"}
              size={24}
              color="#AC591A"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>
              {userType === "private"
                ? "Make account public"
                : "Make account private"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons
              name="logout"
              size={24}
              color="#fff"
              style={styles.menuIcon}
            />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: "row",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  body: {
    padding: 16,
    gap: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    // marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    marginRight: 14,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  logoutContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 32,
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#AC591A",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 14,
  },
});
