import { rem } from "@/theme/units";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState, AppDispatch } from "@/store/redux/store";
import { signInData } from "@/API/user/signInUser";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";

export const SignIn = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const sel = useSelector((state: RootState) => state.user.userData);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorVisibility, setErrorVisibility] = useState(false);
  const handleSignIn = async () => {
    const res = await signInData(email, password, dispatch);
    console.log("res", res);
    if (res) {
      navigation.navigate("Home");
    } else {
      setErrorVisibility(true);
    }
  };
  useEffect(() => {
    if (errorVisibility === true)
      setTimeout(() => {
        setErrorVisibility(false);
      }, 3000);
  }, [errorVisibility]);

  return (
    <SafeAreaView style={styles.container}>
      {errorVisibility && (
        <Text style={{ position: "absolute", color: "red" }}>error</Text>
      )}
      <Text style={styles.header}>Sign in</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => {
            handleSignIn();
          }}
        >
          <Text style={styles.buttonText}>pass</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    width: rem(300),
    height: rem(50),
    borderRadius: rem(25),
    backgroundColor: "#FFFBE4",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    display: "flex",

    backgroundColor: "#AC591A",
  },
  header: {
    fontSize: 64,
    fontFamily: "Inter_700Bold",
    marginTop: rem(203),
    color: "#FFFBE4",
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
    height: "100%",
    textAlignVertical: "center",
    marginLeft: rem(10),
  },
  button: {
    backgroundColor: "#FFFBE4",
    width: rem(120),
    height: rem(50),
    borderRadius: rem(25),
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#5B3400",
    fontSize: 16,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: rem(35),
    marginTop: rem(100),
  },
  forgotPassword: {
    color: "#FFFBE4",
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
