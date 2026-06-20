import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MatchCard({ match, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(match)} style={styles.card}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(match.name || match.nom || "?").charAt(0)}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{match.name || match.nom}</Text>
          <Text style={styles.sub}>Match score</Text>

          <View style={styles.badgeRow}>
            <Text style={styles.badge}>{match.score}% match</Text>
          </View>

          {match.reasons?.slice(0, 2).map((reason, index) => (
            <Text key={index} style={styles.reason}>
              ✓ {reason}
            </Text>
          ))}
        </View>
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
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  row: { flexDirection: "row", gap: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#0D47A1", fontSize: 22, fontWeight: "bold" },
  name: { fontSize: 17, fontWeight: "bold", color: "#0D47A1" },
  sub: { color: "#607D8B", fontSize: 12, marginTop: 2 },
  badgeRow: { flexDirection: "row", marginTop: 6 },
  badge: {
    backgroundColor: "#E3F2FD",
    color: "#0D47A1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
  },
  reason: { marginTop: 5, fontSize: 12, color: "#455A64" },
});
