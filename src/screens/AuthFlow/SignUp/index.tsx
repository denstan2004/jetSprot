import { signUpData } from "@/API/user/signUpUser";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
import { AppDispatch } from "@/store/redux/store";
import { rem } from "@/theme/units";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";

export const SignUp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [validNameError, setValidNameError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [repeatPassword, setRepeatPassword] = useState("");

  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const isValidateName = (name: string) => {
    return /^[A-Za-z]+$/.test(name);
  };

  const handleSignUp = async () => {
    setValidNameError(null);
    setPasswordError(null);

    if (!isValidateName(firstName) || !isValidateName(lastName)) {
      setValidNameError("Name can only contain letters");
      return;
    }

    if (password !== repeatPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    console.log("handleSignUp");
    const res = await signUpData(
      name,
      password,
      email,
      firstName,
      lastName,
      dispatch
    );
    if (res) {
      navigation.navigate("Home");
    } else {
      console.log("error");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.header}>Sign up</Text>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholderTextColor={"white"}
              placeholder="Name"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholderTextColor={"white"}
              placeholder="First Name"
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholderTextColor={"white"}
              placeholder="Last Name"
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
          {validNameError && (
            <Text style={styles.validNameError}>{validNameError}</Text>
          )}

          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Email"
              placeholderTextColor={"white"}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholderTextColor={"white"}
              placeholder="Password"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholderTextColor={"white"}
              placeholder="Repeat Password"
              secureTextEntry
              style={styles.input}
              value={repeatPassword}
              onChangeText={setRepeatPassword}
            />
          </View>
          {passwordError && (
            <Text style={styles.validNameError}>{passwordError}</Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button]}
            onPress={handleSignUp}
          >
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    width: rem(300),
    height: rem(50),
    borderRadius: rem(25),
    backgroundColor: "#AC591A",
    color: "white",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    display: "flex",
    backgroundColor: "#FFFBE4",
  },
  keyboardAvoidingContainer: {
    flex: 1,
    justifyContent: "center", // Центруємо вміст
  },
  header: {
    fontSize: 64,
    fontFamily: "Inter_700Bold",
    marginTop: rem(103),
    color: "#5B3400",
    textAlign: "center",
    width: "100%",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: rem(10),
    marginTop: rem(50),
  },
  input: {
    color: "#fff",
    height: "100%",
    textAlignVertical: "center",
    marginLeft: rem(10),
  },
  button: {
    backgroundColor: "#AC591A",
    width: rem(120),
    height: rem(50),
    borderRadius: rem(25),
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: rem(35),
    marginTop: rem(100), // Місце, де була кнопка pass у SignIn
  },
  validNameError: {
    color: "red",
    fontSize: 14,
    marginTop: rem(10),
    textAlign: "center",
  },
});
