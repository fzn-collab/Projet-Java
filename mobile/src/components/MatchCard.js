import { Text, TouchableOpacity, View } from "react-native";

export default function MatchCard({ match, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(match)}>
      <View
        style={{
          backgroundColor: "#F4EFEB",
          borderRadius: 20,
          padding: 18,
          marginBottom: 15,

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
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
          {match.nom}
        </Text>

        <Text
          style={{
            marginTop: 5,
            fontSize: 16,
          }}
        >
          Score : {match.score}%
        </Text>

        {match.reasons?.map((reason, index) => (
          <Text
            key={index}
            style={{
              marginTop: 4,
            }}
          >
            ✓ {reason}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );
}
