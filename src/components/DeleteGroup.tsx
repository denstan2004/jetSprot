import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";

const PopUp = ({
  title,
  text,
  button1Text,
  button2Text,
  action1,
  action2,
  action3,
  showSecondButton = true,
  isTitleVisible = true,
  isEditRole = false,
  setSelectedUserRole,
  setSelectedUserId
}: {
  title?: string;
  text: string;
  button1Text: string;
  button2Text?: string;
  action1: () => void;
  action2?: () => void;
  action3?: () => void;
  showSecondButton?: boolean;
  isTitleVisible?: boolean;
  isEditRole?: boolean;
  setSelectedUserRole?: (role: string) => void;
  setSelectedUserId?: (id: number) => void;
}) => {
  const [checked, setChecked] = useState<string>("");
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    setRoles(["member", "admin", "owner"]);
  }, []);

  return (
    <View style={styles.container}>
      {isTitleVisible && <Text style={styles.title}>{title}</Text>}

      {isEditRole && (
        <View style={styles.roleSelectorContainer}>
          <Text style={styles.roleTitle}>Select role:</Text>
          <View style={styles.roleOptions}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role}
                style={styles.roleOption}
                onPress={() => {
                  setChecked(role);
                  setSelectedUserRole?.(role);
                }}
              >
                <RadioButton
                  value={role}
                  status={checked === role ? "checked" : "unchecked"}
                  onPress={() => {
                    setChecked(role);
                    setSelectedUserRole?.(role);
                  }}
                  color="#5B3400"
                />
                <Text style={styles.roleLabel}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <Text style={styles.confirmText}>{text}</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={action1} style={styles.buttonAction1}>
          <Text style={styles.buttonActionText1}>{button1Text}</Text>
        </TouchableOpacity>
        {showSecondButton && (
          <TouchableOpacity onPress={action2} style={styles.buttonAction2}>
            <Text style={styles.buttonActionText2}>{button2Text}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PopUp;

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
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#5B3400",
    textAlign: "center",
    marginBottom: 16,
  },
  roleSelectorContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5B3400",
    marginBottom: 12,
  },
  roleOptions: {
    flexDirection: "row",
    gap: 12,

  },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  roleLabel: {
    fontSize: 14,
    color: "#5B3400",
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5B3400",
    textAlign: "center",
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  buttonAction1: {
    flex: 1,
    backgroundColor: "#AC591A33",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonActionText1: {
    color: "#5B3400",
    fontSize: 13,
    fontWeight: "500",
  },
  buttonAction2: {
    flex: 1,
    backgroundColor: "rgb(208, 69, 69)",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonActionText2: {
    color: "#FFFBE4",
    fontSize: 13,
    fontWeight: "600",
  },
});
