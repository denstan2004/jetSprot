import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: width * 0.04,
  },
  createGroupText: {
    fontSize: 16,
    color: "#5B3400",
    fontWeight: "bold",
  },
  backButton: {
    padding: 8,
    // position: "absolute",
    // top: 60,
    // left: 10,
    // zIndex: 1,
  },
  backButtonText: {
    fontSize: 16,
    color: "#5B3400",
    fontWeight: "bold",
  },
  container: {
    backgroundColor: "#FFFBE4",
    paddingHorizontal: width * 0.04,
    paddingTop: 20,
    paddingBottom: 20,
  },
  searchContainer: {
    paddingHorizontal: width * 0.04,
    paddingTop: 20,
    paddingBottom: 5,
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: width * 0.025,
    fontSize: 16,
    color: "#5B3400",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});
