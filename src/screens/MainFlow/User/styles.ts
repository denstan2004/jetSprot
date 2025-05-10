import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#803511",
  },

  headerBackground: {
    paddingHorizontal: 10,
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

  avatarSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#FFFBE4",
    justifyContent: "center",
    alignItems: "center",
  },
  leftSide: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  rightSide: {
    flex: 1,
    marginLeft: 20,
  },

  avatarContainer: {
    position: "relative",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  addIconContainer: {
    position: "absolute",
    bottom: 5,
    right: 2,
    borderRadius: 12,
    padding: 2,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: "transparent",
  },

  addIcon: {
    fontSize: 18,
    color: "#FFFBE4",
    fontWeight: "bold",
  },

  username: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFBE4",
    marginBottom: 4,
  },

  name: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },

  role: {
    fontSize: 14,
    color: "#FFF",
    textAlign: "center",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },

  statsItem: {
    alignItems: "center",
  },

  statsNumber: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },

  statsLabel: {
    color: "white",
    fontSize: 14,
  },

  profileBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#FFFBE4",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  warningContainer: {
    backgroundColor: "#FFFBE4",
    padding: 10,
    borderRadius: 12,
    borderColor: "#AC591A",
    opacity: 0.5,
    marginBottom: 10,
  },
  warningText: {
    color: "#AC591A",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
  },

  additionalInfo: {
    backgroundColor: "#803511",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },

  statusText: {
    flex:1,
    color: "#FFFBE4",
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
    marginBottom: 15,
  },

  followButton: {
    backgroundColor: "#FFFBE4",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    flex: 1,
    alignItems: "center",
  },

  messageButton: {
    backgroundColor: "#FFFBE4",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    flex: 1,
    alignItems: "center",
  },

  buttonText: {
    color: "#803511",
    fontSize: 16,
    fontWeight: "600",
  },

  profileBodyBackground: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#FFFBE4",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
