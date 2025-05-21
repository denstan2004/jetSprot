import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { rem } from "@/theme/units";

type RatingPopupProps = {
  onSubmit: (report: string, selectedReason: string) => void;
  onCancel: () => void;
  text: string;
  title: string;
};

const ReportPopup = ({ onSubmit, onCancel, text, title }: RatingPopupProps) => {
  const [report, setReport] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [reasons, setReasons] = useState<string[]>([]);

  useEffect(() => {
    setReasons([
      "spam",
      "bot",
      "inappropriate_behavior",
      "inappropriate_account",
      "inappropriate_announcement",
      "inappropriate_publication",
    ]);
  }, []);

  const handleSubmit = () => {
    onSubmit(report, selectedReason);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingWrapper}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{text}</Text>
        <Text style={styles.subtitle}>{title}</Text>

        <View style={styles.reasonSelectorContainer}>
          <Text style={styles.reasonTitle}>Select reason:</Text>
          <View style={styles.reasonOptions}>
            {reasons.map((reason) => {
              const isSelected = selectedReason === reason;

              return (
                <TouchableOpacity
                  key={reason}
                  style={[
                    styles.reasonOption,
                    isSelected && styles.selectedReason,
                  ]}
                  onPress={() =>
                    setSelectedReason((prev) => (prev === reason ? "" : reason))
                  }
                >
                  <Text
                    style={[
                      styles.reasonLabel,
                      isSelected && styles.reasonLabelSelected,
                    ]}
                  >
                    {reason}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TextInput
          placeholder="Report description"
          value={report}
          onChangeText={setReport}
          style={styles.reviewInput}
        />

        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={onCancel} style={styles.buttonCancel}>
            <Text style={styles.buttonTextCancel}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit} style={styles.buttonSubmit}>
            <Text style={styles.buttonTextSubmit}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ReportPopup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFBE4",
    padding: rem(40),
    borderRadius: rem(12),
    alignItems: "center",
    width: "80%",
  },
  title: {
    fontSize: rem(18),
    fontWeight: "700",
    color: "#5B3400",
    paddingBottom: rem(12),
    textAlign: "center",
  },
  subtitle: {
    fontSize: rem(15),
    fontWeight: "500",
    color: "#AC591A",
    paddingBottom: rem(10),
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: rem(15),
    paddingTop: rem(15),
  },
  buttonSubmit: {
    flex: 1,
    backgroundColor: "#AC591A33",
    paddingVertical: rem(10),
    borderRadius: rem(10),
    alignItems: "center",
  },
  buttonTextSubmit: {
    color: "#5B3400",
    fontSize: rem(12),
    fontWeight: "600",
  },
  buttonCancel: {
    flex: 1,
    backgroundColor: "#D04545",
    paddingVertical: rem(10),
    borderRadius: rem(10),
    alignItems: "center",
  },
  buttonTextCancel: {
    color: "#FFFBE4",
    fontSize: rem(12),
    fontWeight: "600",
  },
  reviewInput: {
    width: "100%",
    height: rem(40),
    borderWidth: 1,
    borderColor: "#AC591A",
    borderRadius: rem(10),
    // marginTop: rem(10),
    padding: rem(10),
  },
  reasonSelectorContainer: {
    width: "100%",
    paddingBottom: rem(10),
  },
  reasonTitle: {
    fontSize: rem(12),
    fontWeight: "600",
    color: "#5B3400",
    paddingBottom: rem(10),
  },
  reasonOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: rem(8),
    rowGap: rem(8),
  },
  reasonOption: {
    padding: rem(10),
    borderRadius: rem(10),
    backgroundColor: "#AC591A33",
    paddingHorizontal: rem(12),
  },
  reasonLabel: {
    fontSize: rem(12),
    fontWeight: "600",
    color: "#5B3400",
  },
  selectedReason: {
    backgroundColor: "#AC591A",
  },
  reasonLabelSelected: {
    color: "#FFFBE4",
  },
  keyboardAvoidingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});
