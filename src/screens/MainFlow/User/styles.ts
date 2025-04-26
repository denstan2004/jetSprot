import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#AC591A",
  },

  headerBackground: {
    paddingHorizontal: 20,
    marginTop: 40,
  },

  headerTopRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: -40,
  },

  iconGroup: {
    flexDirection: "row",
    gap: 15,
  },

  icon: {
    padding: 5,
  },

  avatarSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 10,
  },

  leftSide: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: -20,
  },
  rightSide: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 10,
    maxWidth: 100,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#AC591A",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 6,
  },

  username: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 5,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },

  role: {
    fontSize: 14,
    color: "#FFF",
    marginBottom: 8,
    maxWidth: 100,
  },

  statsRow: {
    flexDirection: "row",
    gap: 20,
  },

  statsItem: {
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
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#FFFBE4",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
