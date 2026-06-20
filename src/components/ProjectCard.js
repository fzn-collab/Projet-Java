import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProjectCard({ project, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(project)} style={styles.card}>
      <View style={styles.imageBox}>
        <Text style={styles.imageIcon}>📁</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{project.titre}</Text>
        <Text style={styles.sub}>{project.secteur}</Text>
        <Text style={styles.info}>Besoin : {project.besoin}</Text>

        <View style={styles.badges}>
          {project.tags?.slice(0, 3).map((tag, i) => (
            <Text key={i} style={styles.badge}>
              {tag}
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
    padding: 12,
    marginBottom: 14,
    flexDirection: "row",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  imageBox: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  imageIcon: { fontSize: 30 },
  title: { fontSize: 17, fontWeight: "bold", color: "#0D47A1" },
  sub: { color: "#607D8B", fontSize: 12 },
  info: { color: "#455A64", fontSize: 12, marginTop: 5 },
  badges: { flexDirection: "row", gap: 6, marginTop: 7 },
  badge: {
    backgroundColor: "#E3F2FD",
    color: "#0D47A1",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 11,
  },
});
