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
} from "react-native";
import { useDispatch } from "react-redux";
//TODO make validation for firstname lastname
export const SignUp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const handleSignUp = async () => {
    //TODO make error show
    console.log("handleSignUp");
    const res = await signUpData(
      name,
      password,
      email,
      firstName,
      lastName,
      dispatch
    );
    console.log("res", res);
    if (res) {
      navigation.navigate("Home");
    } else {
      console.log("error");
    }
  };
  //TODO investigate why not navigating
  return (
    <SafeAreaView style={styles.container}>
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
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleSignUp();
          }}
        >
          <Text style={styles.buttonText}>Sign up</Text>
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
    backgroundColor: "red",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: rem(35),
    marginTop: rem(100),
  },
});
