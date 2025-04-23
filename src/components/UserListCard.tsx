import { View, Text, Image, StyleSheet } from "react-native";

interface UserCardProps {
  username: string;
  first_name: string;
  last_name: string;
  rating: number;
  pfpUrl: string;
  userId:string;
}

const UserCard = ({ username, first_name, last_name, rating, pfpUrl,userId }: UserCardProps) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: pfpUrl }} style={styles.profileImage} />
      <View style={styles.textContainer}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.name}>
          {first_name} {last_name}
        </Text>
        <Text style={styles.rating}>Rating: {rating}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFBE4',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3, // Adds shadow for Android
    shadowColor: '#000', // Shadow for iOS
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
    justifyContent: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5B3400',
  },
  name: {
    fontSize: 14,
    color: '#AC591A',
  },
  rating: {
    fontSize: 12,
    color: '#FF0000',
  },
});

export default UserCard;
