import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#AC591A",
  },

  headerBackground: {
    paddingHorizontal: 20,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  iconGroup: {
    flexDirection: "row",
    gap: 15,
  },
  icon: {
    padding: 5,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#AC591A",
    justifyContent: "center",
    alignItems: "center", 
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingHorizontal: 40,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  profileBody: {
    flex: 1,
    backgroundColor: "#fdf6ec",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
    paddingTop: 30,
    alignItems: "center",
  },
  username: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  role: {
    fontSize: 14,
    color: "#444",
    marginTop: 5,
  },
  bottomNavigation: {
    position: "absolute",
    bottom: 0,
    width: width,
    backgroundColor: "#AC591A",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
  },
  navText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
});
