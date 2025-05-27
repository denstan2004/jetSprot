import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  createGroupText: {
    fontSize: 18,
    color: "#AC591A",
    fontWeight: "bold",
  },
  backButton: {
    padding: 5,
    
  },
  backButtonText: {
    fontSize: 20,
    color: "#AC591A",
    fontWeight: "bold",

  },
  container: {
    padding: 10,
  },
  searchContainer: {
    padding: 10,
  },
  searchInput: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    color: "#AC591A",
  },
  filterButton: {
    padding: 10,
    borderRadius: 8,
  },
  filterButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  filterMenu: {
    backgroundColor: "rgb(104, 46, 1)",

    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "rgb(177, 119, 48)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterInputContainer: {
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    color: "#FFF",
    
    marginBottom: 5,
  },
  filterInput: {
    backgroundColor: "#FFFBE4",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#AC591A",
    color: "#AC591A",
  },
  applyButton: {
    backgroundColor: "#AC591A",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
