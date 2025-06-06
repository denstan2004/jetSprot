import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/navigations/Stacks/Auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
interface UserCardProps {
  username: string;
  first_name: string;
  last_name: string;
  rating: number;
  pfpUrl: string;
  userId: string;
  onCardPress?: () => void;    
  onAvatarPress?: () => void;
  isSelected: boolean;
  isVerified: boolean;
}

const UserCard = ({
  username,
  first_name,
  last_name,
  rating,
  pfpUrl,
  userId,
  onCardPress,
  onAvatarPress,
  isSelected,
  isVerified,
}: UserCardProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (

    <TouchableOpacity style={styles.card} onPress={onCardPress}>
      <TouchableOpacity onPress={() => navigation.navigate("User", { userId })}>
        <Image source={{ uri: pfpUrl }} style={styles.profileImage} />
        {isVerified && (
          <MaterialCommunityIcons
            style={styles.verificationIcon}
            name="check-decagram"
          />
        )}
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.name}>
          {first_name} {last_name}
        </Text>
        <Text style={styles.rating}>Rating: {rating}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFBE4",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    justifyContent: "center",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5B3400",
  },
  name: {
    fontSize: 14,
    color: "#AC591A",
  },
  rating: {
    fontSize: 12,
    color: "#FF0000",
  },
  verificationIcon: {
    position: "absolute",
    bottom: 2,
    right: 15,
    fontSize: 20,
    color: "rgb(177, 212, 255)",
  },
});

export default UserCard;
