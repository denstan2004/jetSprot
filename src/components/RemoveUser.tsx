import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const RemoveUserFromGroup = ({ onClose }: { onClose: () => void }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.confirmText}>Are you sure?</Text>
      <Text style={styles.confirmText}>
        Do you really want to remove this user from the group?
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Yes, remove</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};

export default RemoveUserFromGroup;

const styles = StyleSheet.create({
    container: {
      zIndex: 1000,
      backgroundColor: "#FFFBE4",
      padding: 20,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    position: "absolute",
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5B3400",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#AC591A33",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#5B3400",
    fontSize: 13,
    fontWeight: "500",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#FF0000",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  deleteButtonText: {
      color: "#FFFBE4",
      fontSize: 13,
      fontWeight: "600",
    },
  });
  