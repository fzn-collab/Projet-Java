import { Platform } from "react-native";

/** Adresse du backend Spring Boot — modifier selon votre environnement. */
const LAN_IP = "10.130.182.153";
const PORT = 8080;

function resolveApiUrl() {
  if (Platform.OS === "android") {
    return `http://10.0.2.2:${PORT}`;
  }
  if (Platform.OS === "web") {
    return `http://localhost:${PORT}`;
  }
  return `http://${LAN_IP}:${PORT}`;
}

export const API_URL = resolveApiUrl();
