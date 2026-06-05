import { Text, TouchableOpacity, View } from "react-native";

export default function UserCard({ user, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(user)}>
      <View
        style={{
          backgroundColor: "#F4EFEB",
          padding: 18,
          marginBottom: 15,
          borderRadius: 20,

          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#2F4157",
          }}
        >
          {user.nom}
        </Text>

        <Text style={{ marginTop: 8 }}>Secteur : {user.secteur}</Text>

        <Text>Ville : {user.localisation?.ville}</Text>

        <Text>Besoin : {user.besoin}</Text>
      </View>
    </TouchableOpacity>
  );
}
