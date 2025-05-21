import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    color: "#5B3400",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderColor: "#AC591A",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#AC591A",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  saveButtonText: {
    color: "#FFFBE4",
    fontWeight: "700",
    fontSize: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
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
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#FFFBE4",
    justifyContent: "center",
    alignItems: "center",
  },
});
