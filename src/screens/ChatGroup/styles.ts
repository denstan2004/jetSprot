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

  backButton: {
    padding: 8,
    position: "absolute",
    top: 60,
    left: 10,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 16,
    color: "#5B3400",
    fontWeight: "bold",
  },
  container: {
    backgroundColor: "#FFFBE4",
    paddingHorizontal: width * 0.04,
    paddingTop: 10,
    paddingBottom: 20,
  },
  searchContainer: {
    paddingHorizontal: width * 0.04,
    paddingTop: 40,
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
//   selectedCard: {
//     borderColor: "#007AFF",
//     backgroundColor: "#E6F0FF", 
//   },
  footer: {
    paddingHorizontal: width * 0.04,
    paddingBottom: 30,
  },
  createGroupButton: {
    backgroundColor: "#AC591A", 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12, 
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  createGroupButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
