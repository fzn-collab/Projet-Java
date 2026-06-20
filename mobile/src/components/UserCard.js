import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UserCard({ user, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(user)} style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user.nom?.charAt(0) || "U"}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{user.nom}</Text>
        <Text style={styles.sub}>{user.secteur}</Text>

        <View style={styles.badges}>
          {user.competences?.slice(0, 3).map((c, i) => (
            <Text key={i} style={styles.badge}>
              {c}
            </Text>
          ))}
        </View>

        <Text style={styles.info}>Besoin : {user.besoin}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#0D47A1", fontWeight: "bold", fontSize: 20 },
  name: { fontSize: 17, fontWeight: "bold", color: "#0D47A1" },
  sub: { color: "#607D8B", fontSize: 12 },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 7 },
  badge: {
    backgroundColor: "#E3F2FD",
    color: "#0D47A1",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 11,
  },
  info: { marginTop: 7, color: "#455A64", fontSize: 12 },
});
