import { View, Text, TouchableOpacity, StyleSheet } from "react-native";


// const deleteGroup = () => {
//   try {
//     const response = await api.delete(`/chat/${chatId}/`);
//     console.log(response);
//   } catch (error) {
//     console.log(error);
//   }
// };


const DeleteGroup = ({ onClose }: { onClose: () => void }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.confirmText}>
        Are you sure you want to delete group?
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeleteGroup;


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
