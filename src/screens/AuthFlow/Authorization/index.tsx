import { AuthStackParamList } from "@/navigations/Stacks/Auth";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStyles } from "./styles";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";

export const Authorization = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const sel = useSelector((state: RootState) => state.user);

  const styles = useStyles();
  const handleSignInPress = () => {
    navigation.navigate("SignIn");
  };
  const handleSignUpPress = () => {
    navigation.navigate("SignUp");
  };
  const handleTest = () => {
    navigation.navigate("Home");
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={[styles.mainTextWrapper1]}>
        <Text
          style={[styles.mainText1, { fontFamily: "Suravaram_400Regular" }]}
        >
          Jet
        </Text>
      </View>

      <View style={[styles.mainTextWrapper2]}>
        <Text
          style={[styles.mainText2, { fontFamily: "Suravaram_400Regular" }]}
        >
          Sport
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSignInPress}>
          <View style={styles.signInButton}>
            <Text style={styles.buttonText}>Sign In</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignUpPress}>
          <View style={styles.signUpButton}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleTest}>
          <View style={styles.signUpButton}>
            <Text style={styles.buttonText}>Home</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.icon}>
        {/* <Image
            source={require("./../../../assets/Basketball.png")} //
          /> */}
      </View>
    </SafeAreaView>
  );
};
